-- ============================================================
-- Course Completion + Certificates + Public Verification
-- ============================================================

-- 1. Course-level completion configuration columns
ALTER TABLE lms_courses
  ADD COLUMN IF NOT EXISTS awards_certificate boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS requires_lesson_completion boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS requires_quiz_pass boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS requires_assignment_completion boolean DEFAULT false;

-- 2. Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_number text UNIQUE NOT NULL,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES lms_enrollments(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  course_title text NOT NULL,
  instructor_name text,
  issue_date timestamptz NOT NULL DEFAULT now(),
  completion_date timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  revoke_reason text,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast public verification by certificate_number
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates (certificate_number);
CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates (student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course ON certificates (course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_enrollment ON certificates (enrollment_id);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates (status);

-- 3. Course completions table (deduplicated completion records)
CREATE TABLE IF NOT EXISTS course_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES lms_enrollments(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  lessons_total integer NOT NULL DEFAULT 0,
  lessons_completed integer NOT NULL DEFAULT 0,
  quizzes_total integer NOT NULL DEFAULT 0,
  quizzes_passed integer NOT NULL DEFAULT 0,
  assignments_total integer NOT NULL DEFAULT 0,
  assignments_completed integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (enrollment_id)
);

CREATE INDEX IF NOT EXISTS idx_completions_student ON course_completions (student_id);
CREATE INDEX IF NOT EXISTS idx_completions_course ON course_completions (course_id);

-- 4. Helper: generate unique certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  candidate text;
  attempt integer := 0;
BEGIN
  LOOP
    candidate := 'ISG-' || to_char(now(), 'YYYY') || '-' || upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 8));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM certificates WHERE certificate_number = candidate);
    attempt := attempt + 1;
    IF attempt > 10 THEN
      candidate := 'ISG-' || to_char(now(), 'YYYY') || '-' || upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 12));
      EXIT;
    END IF;
  END LOOP;
  RETURN candidate;
END;
$$;

-- 5. Check course completion and issue certificate
CREATE OR REPLACE FUNCTION check_and_record_completion(
  p_enrollment_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_enrollment lms_enrollments%ROWTYPE;
  v_course lms_courses%ROWTYPE;
  v_student profiles%ROWTYPE;
  v_total_lessons integer;
  v_completed_lessons integer;
  v_total_quizzes integer;
  v_passed_quizzes integer;
  v_total_assignments integer;
  v_completed_assignments integer;
  v_instructor_name text;
  v_lessons_ok boolean;
  v_quizzes_ok boolean;
  v_assignments_ok boolean;
  v_completion_id uuid;
  v_certificate_id uuid;
  v_certificate_number text;
  v_existing_completion uuid;
  v_existing_cert uuid;
BEGIN
  SELECT * INTO v_enrollment FROM lms_enrollments WHERE id = p_enrollment_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Enrollment not found');
  END IF;

  SELECT * INTO v_course FROM lms_courses WHERE id = v_enrollment.course_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Course not found');
  END IF;

  SELECT * INTO v_student FROM profiles WHERE id = v_enrollment.student_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Student not found');
  END IF;

  -- Check if already completed
  SELECT id INTO v_existing_completion FROM course_completions WHERE enrollment_id = p_enrollment_id;
  IF v_existing_completion IS NOT NULL THEN
    -- Already completed — check if certificate exists
    SELECT id INTO v_existing_cert FROM certificates WHERE enrollment_id = p_enrollment_id AND status = 'active';
    RETURN jsonb_build_object(
      'success', true,
      'already_completed', true,
      'certificate_id', v_existing_cert,
      'completion_id', v_existing_completion
    );
  END IF;

  -- Count lessons
  SELECT count(*) INTO v_total_lessons
  FROM lessons l
  JOIN modules m ON m.id = l.module_id
  WHERE m.course_id = v_enrollment.course_id;

  SELECT count(*) INTO v_completed_lessons
  FROM lesson_progress p
  JOIN lessons l ON l.id = p.lesson_id
  JOIN modules m ON m.id = l.module_id
  WHERE m.course_id = v_enrollment.course_id
    AND p.student_id = v_enrollment.student_id
    AND p.status = 'completed';

  -- Count quizzes and passed quizzes
  SELECT count(*) INTO v_total_quizzes
  FROM quizzes q
  JOIN lessons l ON l.id = q.lesson_id
  JOIN modules m ON m.id = l.module_id
  WHERE m.course_id = v_enrollment.course_id
    AND q.status = 'published';

  SELECT count(DISTINCT qa.quiz_id) INTO v_passed_quizzes
  FROM quiz_attempts qa
  JOIN quizzes q ON q.id = qa.quiz_id
  JOIN lessons l ON l.id = q.lesson_id
  JOIN modules m ON m.id = l.module_id
  WHERE m.course_id = v_enrollment.course_id
    AND qa.student_id = v_enrollment.student_id
    AND qa.status = 'graded'
    AND qa.passed = true;

  -- Count assignments (assignments table may not exist yet)
  v_total_assignments := 0;
  v_completed_assignments := 0;

  -- Evaluate completion requirements
  v_lessons_ok := NOT v_course.requires_lesson_completion OR v_completed_lessons >= v_total_lessons;
  v_quizzes_ok := NOT v_course.requires_quiz_pass OR (v_total_quizzes = 0 OR v_passed_quizzes >= v_total_quizzes);
  v_assignments_ok := NOT v_course.requires_assignment_completion OR v_completed_assignments >= v_total_assignments;

  IF NOT (v_lessons_ok AND v_quizzes_ok AND v_assignments_ok) THEN
    RETURN jsonb_build_object(
      'success', false,
      'reason', 'Requirements not met',
      'lessons_completed', v_completed_lessons,
      'lessons_total', v_total_lessons,
      'quizzes_passed', v_passed_quizzes,
      'quizzes_total', v_total_quizzes,
      'assignments_completed', v_completed_assignments,
      'assignments_total', v_total_assignments
    );
  END IF;

  -- Get instructor name
  SELECT p.full_name INTO v_instructor_name
  FROM course_instructors ci
  JOIN profiles p ON p.id = ci.instructor_id
  WHERE ci.course_id = v_enrollment.course_id
    AND ci.role = 'primary'
  LIMIT 1;

  -- Record completion
  INSERT INTO course_completions (student_id, course_id, enrollment_id, lessons_total, lessons_completed, quizzes_total, quizzes_passed, assignments_total, assignments_completed)
  VALUES (v_enrollment.student_id, v_enrollment.course_id, p_enrollment_id, v_total_lessons, v_completed_lessons, v_total_quizzes, v_passed_quizzes, v_total_assignments, v_completed_assignments)
  RETURNING id INTO v_completion_id;

  -- Update enrollment status
  UPDATE lms_enrollments
  SET status = 'completed', completed_at = now()
  WHERE id = p_enrollment_id;

  -- Issue certificate if course awards one
  IF v_course.awards_certificate THEN
    -- Check no existing active certificate
    SELECT id INTO v_existing_cert FROM certificates WHERE enrollment_id = p_enrollment_id AND status = 'active';
    IF v_existing_cert IS NULL THEN
      v_certificate_number := generate_certificate_number();
      INSERT INTO certificates (
        certificate_number, student_id, enrollment_id, course_id,
        student_name, course_title, instructor_name,
        issue_date, completion_date, status
      )
      VALUES (
        v_certificate_number, v_enrollment.student_id, p_enrollment_id, v_enrollment.course_id,
        v_student.full_name, v_course.title, v_instructor_name,
        now(), COALESCE(v_enrollment.completed_at, now()), 'active'
      )
      RETURNING id INTO v_certificate_id;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'completed', true,
    'completion_id', v_completion_id,
    'certificate_id', v_certificate_id,
    'certificate_number', v_certificate_number
  );
END;
$$;

-- 6. Public verification function (no auth required)
CREATE OR REPLACE FUNCTION verify_certificate(input_number text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_cert certificates%ROWTYPE;
BEGIN
  SELECT * INTO v_cert FROM certificates WHERE certificate_number = input_number LIMIT 1;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'found', false);
  END IF;

  RETURN jsonb_build_object(
    'valid', (v_cert.status = 'active'),
    'found', true,
    'certificate_number', v_cert.certificate_number,
    'student_name', v_cert.student_name,
    'course_title', v_cert.course_title,
    'issuing_organization', 'InnoSpeak Global',
    'issue_date', v_cert.issue_date,
    'completion_date', v_cert.completion_date,
    'status', v_cert.status,
    'instructor_name', v_cert.instructor_name
  );
END;
$$;

-- 7. Admin: revoke certificate
CREATE OR REPLACE FUNCTION revoke_certificate(
  p_certificate_id uuid,
  p_reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE certificates
  SET status = 'revoked', revoke_reason = p_reason, revoked_at = now(), updated_at = now()
  WHERE id = p_certificate_id;
END;
$$;

-- 8. Admin: reactivate certificate
CREATE OR REPLACE FUNCTION reactivate_certificate(
  p_certificate_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE certificates
  SET status = 'active', revoke_reason = null, revoked_at = null, updated_at = now()
  WHERE id = p_certificate_id;
END;
$$;

-- ============================================================
-- RLS Policies
-- ============================================================

-- Certificates: students see only their own
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_certificates" ON certificates
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "admin_select_all_certificates" ON certificates
  FOR SELECT TO authenticated
  USING (is_lms_admin());

CREATE POLICY "admin_update_certificates" ON certificates
  FOR UPDATE TO authenticated
  USING (is_lms_admin())
  WITH CHECK (is_lms_admin());

-- Course completions: students see their own, admins see all
ALTER TABLE course_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_completions" ON course_completions
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "admin_select_all_completions" ON course_completions
  FOR SELECT TO authenticated
  USING (is_lms_admin());

-- Allow students to trigger completion check (insert is via RPC only, no direct insert needed)
-- The SECURITY DEFINER functions handle this safely

-- Grant execute on public functions
GRANT EXECUTE ON FUNCTION verify_certificate(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION check_and_record_completion(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION revoke_certificate(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION reactivate_certificate(uuid) TO authenticated;
