/*
# Admin fee monitoring

1. Summary
- Adds the profiles table the app uses to decide who is an admin. Each user can read only their own profile, and nobody can change a role from the browser.
- Adds two admin-only functions: one lists every enrolment's fee balance, the other lists every verified fee payment.

2. New tables
- profiles: one row per auth user with full name and role (student, instructor, employer, sponsor or admin). Roles are assigned by an administrator directly in the database.

3. Functions
- admin_fee_balances(): all enrolments with tuition, paid, balance and overdue flag. Raises an error for non-admins.
- admin_fee_payments(): all verified fee payments with receipt numbers. Raises an error for non-admins.

4. Security
- RLS enabled on profiles. Users can select their own row only.
- Browser roles have no insert, update or delete on profiles.
- Both admin functions check the caller's role on the server and are executable only by authenticated users.

5. Notes
- No admin account is created by this migration. An administrator must set one profile's role to admin in the database.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'employer', 'sponsor', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION assert_admin()
RETURNS void
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Administrator access is required.' USING ERRCODE = '42501';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION admin_fee_balances()
RETURNS TABLE (
  enrollment_id uuid,
  student_id uuid,
  student_name text,
  course_code text,
  course_title text,
  term_name text,
  fee_deadline date,
  tuition_usd numeric,
  paid_usd numeric,
  balance_usd numeric,
  is_overdue boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM assert_admin();
  RETURN QUERY
  SELECT
    e.id,
    e.student_id,
    COALESCE(pr.full_name, ''),
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
  LEFT JOIN profiles pr ON pr.id = e.student_id
  LEFT JOIN fee_payments p ON p.enrollment_id = e.id
  GROUP BY e.id, e.student_id, pr.full_name, c.code, c.title, t.name, t.fee_deadline, e.tuition_usd
  ORDER BY t.fee_deadline, c.code;
END;
$$;

CREATE OR REPLACE FUNCTION admin_fee_payments()
RETURNS TABLE (
  id uuid,
  receipt_number text,
  student_id uuid,
  student_name text,
  course_code text,
  amount_usd numeric,
  provider text,
  paid_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM assert_admin();
  RETURN QUERY
  SELECT
    p.id,
    p.receipt_number,
    p.student_id,
    COALESCE(pr.full_name, ''),
    c.code,
    p.amount_usd,
    p.provider,
    p.paid_at
  FROM fee_payments p
  JOIN lms_enrollments e ON e.id = p.enrollment_id
  JOIN lms_courses c ON c.id = e.course_id
  LEFT JOIN profiles pr ON pr.id = p.student_id
  ORDER BY p.paid_at DESC;
END;
$$;

REVOKE EXECUTE ON FUNCTION assert_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION admin_fee_balances() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION admin_fee_balances() TO authenticated;
REVOKE EXECUTE ON FUNCTION admin_fee_payments() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION admin_fee_payments() TO authenticated;
