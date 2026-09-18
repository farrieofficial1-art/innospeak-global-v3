/*
# Payment System — M-PESA + PayPal

## Purpose
Adds a payments table for paid course enrollment via M-PESA and PayPal.
Also adds pricing columns to course tables if they exist.

## New Tables
- `payments` — id, student_id, course_id, course_code, provider,
  provider_transaction_id, phone, amount, currency, status,
  created_at, updated_at, paid_at.
  Statuses: pending, paid, failed, cancelled, refunded.

## Security
- RLS on payments: students read/update/insert their own.
- Admin read policy uses profiles.role if profiles table exists.
- confirm_payment_and_enroll RPC is SECURITY DEFINER, idempotent.
*/

-- ============================================================
-- Course pricing columns (conditional)
-- ============================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'lms_courses'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'lms_courses' AND column_name = 'price'
    ) THEN
      ALTER TABLE lms_courses ADD COLUMN price numeric(12,2) NOT NULL DEFAULT 0;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'lms_courses' AND column_name = 'currency'
    ) THEN
      ALTER TABLE lms_courses ADD COLUMN currency text NOT NULL DEFAULT 'KES';
    END IF;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'courses'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'price'
    ) THEN
      ALTER TABLE courses ADD COLUMN price numeric(12,2) NOT NULL DEFAULT 0;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'currency'
    ) THEN
      ALTER TABLE courses ADD COLUMN currency text NOT NULL DEFAULT 'KES';
    END IF;
  END IF;
END $$;

-- ============================================================
-- Payments table
-- ============================================================

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  course_id uuid,
  course_code text,
  provider text NOT NULL CHECK (provider IN ('mpesa', 'paypal')),
  provider_transaction_id text,
  phone text,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'KES' CHECK (currency IN ('KES', 'USD')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_course ON payments(course_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_provider ON payments(provider);
CREATE INDEX IF NOT EXISTS idx_payments_provider_txid ON payments(provider_transaction_id);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_payment
  ON payments(student_id, course_id, provider)
  WHERE status IN ('pending', 'paid');

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_payments" ON payments;
CREATE POLICY "select_own_payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "insert_own_payments" ON payments;
CREATE POLICY "insert_own_payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "update_own_payments" ON payments;
CREATE POLICY "update_own_payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Admin read policy (conditional on profiles table existence)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    DROP POLICY IF EXISTS "admin_select_all_payments" ON payments;
    EXECUTE 'CREATE POLICY "admin_select_all_payments"
      ON payments FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = ''admin''
        )
      )';
  END IF;
END $$;

-- ============================================================
-- confirm_payment_and_enroll RPC — SECURITY DEFINER, idempotent
-- ============================================================

CREATE OR REPLACE FUNCTION confirm_payment_and_enroll(
  p_payment_id uuid,
  p_provider_transaction_id text,
  p_course_id uuid DEFAULT NULL,
  p_course_code text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payment RECORD;
  v_enrollment_exists boolean;
  v_course_uuid uuid;
BEGIN
  SELECT * INTO v_payment
  FROM payments
  WHERE id = p_payment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment not found');
  END IF;

  IF v_payment.status = 'paid' THEN
    RETURN jsonb_build_object('success', true, 'message', 'Already confirmed', 'payment_id', p_payment_id);
  END IF;

  IF v_payment.status NOT IN ('pending') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment is ' || v_payment.status || ', cannot confirm');
  END IF;

  v_course_uuid := COALESCE(p_course_id, v_payment.course_id);

  UPDATE payments
  SET status = 'paid',
      provider_transaction_id = p_provider_transaction_id,
      paid_at = now(),
      updated_at = now()
  WHERE id = p_payment_id;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'lms_enrollments'
  ) THEN
    SELECT EXISTS(
      SELECT 1 FROM lms_enrollments
      WHERE student_id = v_payment.student_id
        AND course_id = v_course_uuid
    ) INTO v_enrollment_exists;

    IF v_enrollment_exists THEN
      UPDATE lms_enrollments
      SET status = 'active'
      WHERE student_id = v_payment.student_id
        AND course_id = v_course_uuid;
    ELSE
      INSERT INTO lms_enrollments (student_id, course_id, status)
      VALUES (v_payment.student_id, v_course_uuid, 'active')
      ON CONFLICT (course_id, student_id) DO UPDATE SET status = 'active';
    END IF;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'enrollments'
  ) THEN
    INSERT INTO enrollments (student_id, course_id, status, progress_percent)
    VALUES (v_payment.student_id, v_course_uuid, 'active', 0)
    ON CONFLICT (student_id, course_id) DO UPDATE SET status = 'active';
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Payment confirmed and enrollment activated',
    'payment_id', p_payment_id,
    'course_id', v_course_uuid
  );
END;
$$;

GRANT EXECUTE ON FUNCTION confirm_payment_and_enroll TO authenticated;

-- ============================================================
-- fail_payment RPC
-- ============================================================

CREATE OR REPLACE FUNCTION fail_payment(
  p_payment_id uuid,
  p_status text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payment RECORD;
BEGIN
  SELECT * INTO v_payment
  FROM payments
  WHERE id = p_payment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment not found');
  END IF;

  IF v_payment.status != 'pending' THEN
    RETURN jsonb_build_object('success', true, 'message', 'Already ' || v_payment.status);
  END IF;

  UPDATE payments
  SET status = p_status,
      updated_at = now()
  WHERE id = p_payment_id;

  RETURN jsonb_build_object('success', true, 'message', 'Payment marked as ' || p_status);
END;
$$;

GRANT EXECUTE ON FUNCTION fail_payment TO authenticated;