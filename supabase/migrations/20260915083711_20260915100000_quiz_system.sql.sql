-- ============================================================
-- Quiz & Knowledge Check System
-- Connects to: lessons, modules, courses, enrollments, users
-- Tables: quizzes, quiz_questions, quiz_question_options,
--         quiz_attempts, quiz_answers
-- ============================================================

-- Quizzes are attached to LESSONS (not modules) so they appear
-- inline in the Learning Player when a student opens a lesson.
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  instructions text,
  status text NOT NULL DEFAULT 'draft', -- draft | published
  passing_score_percent integer NOT NULL DEFAULT 70,
  max_attempts integer NOT NULL DEFAULT 3,
  time_limit_minutes integer,
  require_pass_to_complete boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_quizzes_lesson_id ON quizzes(lesson_id);

-- Questions belong to a quiz
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_type text NOT NULL, -- multiple_choice | true_false | short_answer
  question_text text NOT NULL,
  marks integer NOT NULL DEFAULT 1,
  explanation text,
  correct_short_answer text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);

-- Options for multiple_choice and true_false questions
CREATE TABLE IF NOT EXISTS quiz_question_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_text text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0
);

CREATE INDEX idx_quiz_options_question_id ON quiz_question_options(question_id);

-- Attempts track each time a student takes a quiz
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id uuid REFERENCES lms_enrollments(id) ON DELETE SET NULL,
  attempt_number integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'in_progress', -- in_progress | submitted
  score numeric NOT NULL DEFAULT 0,
  max_score numeric NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  started_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz
);

CREATE INDEX idx_quiz_attempts_quiz_student ON quiz_attempts(quiz_id, student_id);
CREATE UNIQUE INDEX idx_quiz_attempts_attempt_number ON quiz_attempts(quiz_id, student_id, attempt_number);

-- Answers store individual question responses within an attempt
CREATE TABLE IF NOT EXISTS quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  selected_option_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  text_answer text,
  is_correct boolean,
  awarded_marks numeric NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_quiz_answers_attempt_question ON quiz_answers(attempt_id, question_id);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is an instructor of the course that owns this lesson
CREATE OR REPLACE FUNCTION is_lesson_instructor(target_lesson_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM course_instructors ci
    JOIN modules m ON m.course_id = ci.course_id
    JOIN lessons l ON l.module_id = m.id
    WHERE l.id = target_lesson_id AND ci.instructor_id = auth.uid()
  );
$$;

-- Helper: check if current user is an admin
CREATE OR REPLACE FUNCTION is_lms_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'lms_admin')
  );
$$;

-- Helper: check if current user is enrolled in the course that owns this lesson
CREATE OR REPLACE FUNCTION is_lesson_enrolled(target_lesson_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM lms_enrollments e
    JOIN modules m ON m.course_id = e.course_id
    JOIN lessons l ON l.module_id = m.id
    WHERE l.id = target_lesson_id
      AND e.student_id = auth.uid()
      AND e.status = 'active'
  );
$$;

-- ── quizzes ──
-- Instructors can CRUD quizzes on their own course's lessons
CREATE POLICY "select_quizzes_instructor_or_enrolled" ON quizzes
  FOR SELECT TO authenticated
  USING (is_lesson_instructor(lesson_id) OR is_lesson_enrolled(lesson_id) OR is_lms_admin());

CREATE POLICY "insert_quizzes_instructor" ON quizzes
  FOR INSERT TO authenticated
  WITH CHECK (is_lesson_instructor(lesson_id));

CREATE POLICY "update_quizzes_instructor" ON quizzes
  FOR UPDATE TO authenticated
  USING (is_lesson_instructor(lesson_id))
  WITH CHECK (is_lesson_instructor(lesson_id));

CREATE POLICY "delete_quizzes_instructor" ON quizzes
  FOR DELETE TO authenticated
  USING (is_lesson_instructor(lesson_id));

-- ── quiz_questions ──
CREATE POLICY "select_questions_instructor_or_enrolled" ON quiz_questions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      WHERE q.id = quiz_id
      AND (is_lesson_instructor(q.lesson_id) OR is_lesson_enrolled(q.lesson_id) OR is_lms_admin())
    )
  );

CREATE POLICY "insert_questions_instructor" ON quiz_questions
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes q WHERE q.id = quiz_id AND is_lesson_instructor(q.lesson_id)
    )
  );

CREATE POLICY "update_questions_instructor" ON quiz_questions
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes q WHERE q.id = quiz_id AND is_lesson_instructor(q.lesson_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes q WHERE q.id = quiz_id AND is_lesson_instructor(q.lesson_id)
    )
  );

CREATE POLICY "delete_questions_instructor" ON quiz_questions
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes q WHERE q.id = quiz_id AND is_lesson_instructor(q.lesson_id)
    )
  );

-- ── quiz_question_options ──
-- Students should NOT see is_correct column — enforced via a view below
CREATE POLICY "select_options_instructor_or_enrolled" ON quiz_question_options
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quiz_questions qq
      JOIN quizzes q ON q.id = qq.quiz_id
      WHERE qq.id = question_id
      AND (is_lesson_instructor(q.lesson_id) OR is_lesson_enrolled(q.lesson_id) OR is_lms_admin())
    )
  );

CREATE POLICY "insert_options_instructor" ON quiz_question_options
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quiz_questions qq
      JOIN quizzes q ON q.id = qq.quiz_id
      WHERE qq.id = question_id AND is_lesson_instructor(q.lesson_id)
    )
  );

CREATE POLICY "update_options_instructor" ON quiz_question_options
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quiz_questions qq
      JOIN quizzes q ON q.id = qq.quiz_id
      WHERE qq.id = question_id AND is_lesson_instructor(q.lesson_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quiz_questions qq
      JOIN quizzes q ON q.id = qq.quiz_id
      WHERE qq.id = question_id AND is_lesson_instructor(q.lesson_id)
    )
  );

CREATE POLICY "delete_options_instructor" ON quiz_question_options
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quiz_questions qq
      JOIN quizzes q ON q.id = qq.quiz_id
      WHERE qq.id = question_id AND is_lesson_instructor(q.lesson_id)
    )
  );

-- ── quiz_attempts ──
CREATE POLICY "select_own_attempts" ON quiz_attempts
  FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR is_lms_admin());

CREATE POLICY "insert_own_attempts" ON quiz_attempts
  FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "update_own_attempts" ON quiz_attempts
  FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- ── quiz_answers ──
CREATE POLICY "select_own_answers" ON quiz_answers
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts a WHERE a.id = attempt_id AND a.student_id = auth.uid()
    ) OR is_lms_admin()
  );

CREATE POLICY "insert_own_answers" ON quiz_answers
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quiz_attempts a WHERE a.id = attempt_id AND a.student_id = auth.uid()
    )
  );

CREATE POLICY "update_own_answers" ON quiz_answers
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts a WHERE a.id = attempt_id AND a.student_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quiz_attempts a WHERE a.id = attempt_id AND a.student_id = auth.uid()
    )
  );

-- ============================================================
-- Student-safe quiz view (hides is_correct, correct_short_answer)
-- ============================================================
CREATE OR REPLACE VIEW student_quiz_questions AS
SELECT
  qq.id, qq.quiz_id, qq.question_type, qq.question_text, qq.marks, qq.position, qq.explanation
FROM quiz_questions qq;

CREATE OR REPLACE VIEW student_quiz_options AS
SELECT
  o.id, o.question_id, o.option_text, o.position
FROM quiz_question_options o;

-- ============================================================
-- submit_quiz_attempt RPC — auto-grades and returns results
-- ============================================================
CREATE OR REPLACE FUNCTION submit_quiz_attempt(target_attempt_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_attempt quiz_attempts%ROWTYPE;
  v_quiz quizzes%ROWTYPE;
  v_total_marks numeric := 0;
  v_earned_marks numeric := 0;
  v_pass boolean := false;
  v_pct numeric;
  v_question record;
  v_answer record;
  v_correct_option_ids uuid[];
  v_selected_ids uuid[];
  v_all_correct boolean;
  v_opt record;
BEGIN
  SELECT * INTO v_attempt FROM quiz_attempts WHERE id = target_attempt_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Attempt not found';
  END IF;
  IF v_attempt.status = 'submitted' THEN
    RAISE EXCEPTION 'Attempt already submitted';
  END IF;

  SELECT * INTO v_quiz FROM quizzes WHERE id = v_attempt.quiz_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quiz not found';
  END IF;

  -- Grade each question
  FOR v_question IN
    SELECT * FROM quiz_questions WHERE quiz_id = v_quiz.id ORDER BY position
  LOOP
    v_total_marks := v_total_marks + v_question.marks;

    SELECT * INTO v_answer FROM quiz_answers WHERE attempt_id = v_attempt.id AND question_id = v_question.id;

    IF v_question.question_type IN ('multiple_choice', 'true_false') THEN
      -- Get correct option ids
      SELECT array_agg(id ORDER BY position) INTO v_correct_option_ids
      FROM quiz_question_options WHERE question_id = v_question.id AND is_correct = true;

      v_selected_ids := COALESCE(v_answer.selected_option_ids::uuid[], ARRAY[]::uuid[]);

      -- All correct options selected AND no incorrect ones
      IF array_length(v_selected_ids, 1) = array_length(v_correct_option_ids, 1)
         AND v_selected_ids = v_correct_option_ids THEN
        v_earned_marks := v_earned_marks + v_question.marks;
        UPDATE quiz_answers SET is_correct = true, awarded_marks = v_question.marks
        WHERE attempt_id = v_attempt.id AND question_id = v_question.id;
      ELSE
        UPDATE quiz_answers SET is_correct = false, awarded_marks = 0
        WHERE attempt_id = v_attempt.id AND question_id = v_question.id;
      END IF;

    ELSIF v_question.question_type = 'short_answer' THEN
      -- Case-insensitive trimmed comparison
      IF v_answer.text_answer IS NOT NULL
         AND LOWER(TRIM(v_answer.text_answer)) = LOWER(TRIM(COALESCE(v_question.correct_short_answer, ''))) THEN
        v_earned_marks := v_earned_marks + v_question.marks;
        UPDATE quiz_answers SET is_correct = true, awarded_marks = v_question.marks
        WHERE attempt_id = v_attempt.id AND question_id = v_question.id;
      ELSE
        UPDATE quiz_answers SET is_correct = false, awarded_marks = 0
        WHERE attempt_id = v_attempt.id AND question_id = v_question.id;
      END IF;
    END IF;
  END LOOP;

  v_pct := CASE WHEN v_total_marks > 0 THEN ROUND((v_earned_marks / v_total_marks) * 100) ELSE 0 END;
  v_pass := v_pct >= v_quiz.passing_score_percent;

  UPDATE quiz_attempts
  SET status = 'submitted',
      score = v_earned_marks,
      max_score = v_total_marks,
      passed = v_pass,
      submitted_at = now()
  WHERE id = v_attempt.id;

  RETURN jsonb_build_object(
    'attempt_id', v_attempt.id,
    'score', v_earned_marks,
    'max_score', v_total_marks,
    'percent', v_pct,
    'passed', v_pass
  );
END;
$$;

GRANT EXECUTE ON FUNCTION submit_quiz_attempt(uuid) TO authenticated;
GRANT SELECT ON student_quiz_questions TO authenticated;
GRANT SELECT ON student_quiz_options TO authenticated;
