/*
# Enrolment before payment and fee ledger

1. Summary
- Creates the catalogue, academic term, enrolment and verified fee payment tables that the learning dashboard and admin portal read from.
- Students are enrolled immediately by a server function. No payment is required to start learning.
- Fee payments are recorded only by trusted server code (service role) after provider verification. Browsers can read their own records but cannot write them.

2. New tables
- lms_courses: published catalogue entries keyed by course code, with a price in USD and a free flag.
- academic_terms: term windows with a fee deadline. Enrolment is allowed only while a term is open.
- lms_enrollments: one row per student and course. Stores the tuition snapshot at enrolment time. Unique per student and course, so repeat enrolment is idempotent.
- fee_payments: verified instalments. Unique provider reference prevents double-recording of one transaction. Each payment gets a receipt number.

3. Functions
- enroll_in_course(course_code): enrols the signed-in student into an open course in the current term. Returns the existing enrolment if one exists.
- get_my_fee_statement(): returns each enrolment with tuition, amount paid, outstanding balance, fee deadline and overdue flag.

4. Security
- RLS enabled on all four tables.
- Catalogue and terms are readable by anon and authenticated (public information).
- Enrolments and payments are readable only by their owner.
- No browser insert, update or delete grants on enrolments or payments.
- Functions are executable only by authenticated users.

5. Notes
- Learning access is never gated on fee balance during the term. The balance only drives notices and the end-of-term clearance requirement.
- Tuition amounts are taken from the catalogue on the server, never from the browser.
*/

CREATE TABLE IF NOT EXISTS lms_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  price_usd numeric(10,2) NOT NULL DEFAULT 0 CHECK (price_usd >= 0),
  is_free boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS academic_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  starts_on date NOT NULL,
  ends_on date NOT NULL,
  fee_deadline date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_on >= starts_on),
  CHECK (fee_deadline >= ends_on)
);

CREATE TABLE IF NOT EXISTS lms_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES lms_courses(id) ON DELETE RESTRICT,
  term_id uuid NOT NULL REFERENCES academic_terms(id) ON DELETE RESTRICT,
  tuition_usd numeric(10,2) NOT NULL CHECK (tuition_usd >= 0),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (student_id, course_id)
);

CREATE INDEX IF NOT EXISTS lms_enrollments_term_idx ON lms_enrollments (term_id);

CREATE TABLE IF NOT EXISTS fee_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES lms_enrollments(id) ON DELETE RESTRICT,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_usd numeric(10,2) NOT NULL CHECK (amount_usd > 0),
  provider text NOT NULL CHECK (provider IN ('mpesa', 'paypal', 'bank_transfer', 'office_cash')),
  provider_reference text NOT NULL UNIQUE,
  receipt_number text NOT NULL UNIQUE DEFAULT 'RCP-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  paid_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS fee_payments_enrollment_idx ON fee_payments (enrollment_id);
CREATE INDEX IF NOT EXISTS fee_payments_student_idx ON fee_payments (student_id);

ALTER TABLE lms_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON lms_courses TO anon, authenticated;
GRANT SELECT ON academic_terms TO anon, authenticated;
GRANT SELECT ON lms_enrollments TO authenticated;
GRANT SELECT ON fee_payments TO authenticated;
GRANT ALL ON lms_courses, academic_terms, lms_enrollments, fee_payments TO service_role;

DROP POLICY IF EXISTS "public_read_published_courses" ON lms_courses;
CREATE POLICY "public_read_published_courses" ON lms_courses FOR SELECT
  TO anon, authenticated USING (status = 'published');

DROP POLICY IF EXISTS "public_read_terms" ON academic_terms;
CREATE POLICY "public_read_terms" ON academic_terms FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "select_own_enrollments" ON lms_enrollments;
CREATE POLICY "select_own_enrollments" ON lms_enrollments FOR SELECT
  TO authenticated USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "select_own_fee_payments" ON fee_payments;
CREATE POLICY "select_own_fee_payments" ON fee_payments FOR SELECT
  TO authenticated USING (auth.uid() = student_id);

CREATE OR REPLACE FUNCTION enroll_in_course(p_course_code text)
RETURNS lms_enrollments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_course lms_courses%ROWTYPE;
  v_term academic_terms%ROWTYPE;
  v_row lms_enrollments%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to enrol.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_course FROM lms_courses
  WHERE code = upper(trim(p_course_code)) AND status = 'published';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'This course is not open for enrolment yet.' USING ERRCODE = 'P0002';
  END IF;

  SELECT * INTO v_term FROM academic_terms
  WHERE CURRENT_DATE BETWEEN starts_on AND ends_on
  ORDER BY starts_on DESC
  LIMIT 1;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No academic term is open for enrolment right now.' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO lms_enrollments (student_id, course_id, term_id, tuition_usd)
  VALUES (v_uid, v_course.id, v_term.id, CASE WHEN v_course.is_free THEN 0 ELSE v_course.price_usd END)
  ON CONFLICT (student_id, course_id) DO NOTHING;

  UPDATE lms_enrollments SET status = 'active'
  WHERE student_id = v_uid AND course_id = v_course.id AND status = 'dropped';

  SELECT * INTO v_row FROM lms_enrollments
  WHERE student_id = v_uid AND course_id = v_course.id;
  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION get_my_fee_statement()
RETURNS TABLE (
  enrollment_id uuid,
  course_code text,
  course_title text,
  term_name text,
  fee_deadline date,
  tuition_usd numeric,
  paid_usd numeric,
  balance_usd numeric,
  is_overdue boolean
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    e.id,
    c.code,
    c.title,
    t.name,
    t.fee_deadline,
    e.tuition_usd,
    COALESCE(SUM(p.amount_usd), 0),
    e.tuition_usd - COALESCE(SUM(p.amount_usd), 0),
    (e.tuition_usd - COALESCE(SUM(p.amount_usd), 0)) > 0 AND CURRENT_DATE > t.fee_deadline
  FROM lms_enrollments e
  JOIN lms_courses c ON c.id = e.course_id
  JOIN academic_terms t ON t.id = e.term_id
  LEFT JOIN fee_payments p ON p.enrollment_id = e.id
  WHERE e.student_id = auth.uid()
  GROUP BY e.id, c.code, c.title, t.name, t.fee_deadline, e.tuition_usd
  ORDER BY t.fee_deadline, c.code;
$$;

REVOKE EXECUTE ON FUNCTION enroll_in_course(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION enroll_in_course(text) TO authenticated;
REVOKE EXECUTE ON FUNCTION get_my_fee_statement() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION get_my_fee_statement() TO authenticated;
