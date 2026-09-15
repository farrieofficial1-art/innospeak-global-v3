/*
# Student Academic Progress & Performance Dashboard

1. Purpose
   This migration adds three SECURITY DEFINER RPC functions that aggregate a
   student's academic record across all enrolled courses.  These functions
   reuse the existing lms_enrollments, lesson_progress, quiz_attempts,
   quiz_answers, assignments and submissions tables — no new tables are
   created.  The functions are the single source of truth for progress
   calculations so that the Student Portal, Learning Player and future
   features (certificates, analytics) all read from the same layer.

2. New functions (all SECURITY DEFINER, owned by postgres, EXECUTE granted to authenticated)
   - get_student_academic_summary(p_student_id uuid)
       Returns a single JSON object with overall learning stats:
       courses_enrolled, courses_in_progress, courses_completed,
       overall_progress_percent, lessons_completed, lessons_total,
       quizzes_completed, assignments_submitted, assignments_graded.

   - get_student_course_performance(p_student_id uuid)
       Returns one row per enrolled course with:
       course_id, course_title, progress_percent, lessons_completed,
       lessons_total, quiz_average, assignment_average, performance_percent,
       completion_status, last_activity_at.

   - get_student_recent_activity(p_student_id uuid, p_limit int default 20)
       Returns the most recent learning events (lesson completed, quiz
       submitted, assignment submitted, assignment graded, resubmission
       requested) as a unified list ordered by created_at desc.

   - get_student_course_detail(p_student_id uuid, p_course_id uuid)
       Returns a detailed JSON object for a single course:
       module-level progress, lesson completion, quiz scores, assignment
       scores, overall percentage, remaining activities.

3. Security
   All functions are SECURITY DEFINER with a fixed search_path of public.
   Each function verifies that p_student_id = auth.uid() so students can
   only query their own data.  EXECUTE is granted to authenticated only.

4. Important notes
   - No new tables, no new columns, no data migration.
   - Existing RLS on all source tables is respected — the functions run as
     the postgres role but only return rows belonging to p_student_id.
   - The functions are idempotent and safe to re-run.
*/

-- ============================================================
-- 1. get_student_academic_summary
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_student_academic_summary(p_student_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  IF auth.uid() IS DISTINCT FROM p_student_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT json_build_object(
    'courses_enrolled',    count(DISTINCT e.course_id),
    'courses_in_progress', count(DISTINCT e.course_id) FILTER (WHERE e.status = 'active'),
    'courses_completed',   count(DISTINCT e.course_id) FILTER (WHERE e.status = 'completed'),
    'lessons_completed',   count(DISTINCT lp.lesson_id) FILTER (WHERE lp.status = 'completed'),
    'lessons_total',       count(DISTINCT l.id),
    'quizzes_completed',   count(DISTINCT qa.id) FILTER (WHERE qa.status = 'graded'),
    'assignments_submitted', count(DISTINCT sub.id),
    'assignments_graded',  count(DISTINCT sub.id) FILTER (WHERE sub.status = 'graded'),
    'overall_progress_percent', COALESCE(
      round(
        count(DISTINCT lp.lesson_id) FILTER (WHERE lp.status = 'completed')::numeric
        / NULLIF(count(DISTINCT l.id), 0) * 100, 1
      ), 0
    )
  )
  INTO result
  FROM lms_enrollments e
  LEFT JOIN modules m ON m.course_id = e.course_id
  LEFT JOIN lessons l ON l.module_id = m.id
  LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = e.student_id
  LEFT JOIN quiz_attempts qa ON qa.student_id = e.student_id
  LEFT JOIN submissions sub ON sub.student_id = e.student_id
  WHERE e.student_id = p_student_id;

  RETURN result;
END;
$$;

-- ============================================================
-- 2. get_student_course_performance
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_student_course_performance(p_student_id uuid)
RETURNS TABLE (
  course_id uuid,
  course_title text,
  progress_percent numeric,
  lessons_completed int,
  lessons_total int,
  quiz_average numeric,
  assignment_average numeric,
  performance_percent numeric,
  completion_status text,
  last_activity_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS DISTINCT FROM p_student_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT
    c.id AS course_id,
    c.title AS course_title,
    COALESCE(round(
      count(DISTINCT lp.lesson_id) FILTER (WHERE lp.status = 'completed')::numeric
      / NULLIF(count(DISTINCT l.id), 0) * 100, 1
    ), 0) AS progress_percent,
    count(DISTINCT lp.lesson_id) FILTER (WHERE lp.status = 'completed')::int AS lessons_completed,
    count(DISTINCT l.id)::int AS lessons_total,
    COALESCE(round(avg(qa.score_percent) FILTER (WHERE qa.status = 'graded'), 1), 0) AS quiz_average,
    COALESCE(round(avg(sub.score) FILTER (WHERE sub.status = 'graded') / NULLIF(avg(a.max_score) FILTER (WHERE sub.status = 'graded'), 0) * 100, 1), 0) AS assignment_average,
    COALESCE(round(
      (COALESCE(round(avg(qa.score_percent) FILTER (WHERE qa.status = 'graded'), 1), 0)
       + COALESCE(round(avg(sub.score) FILTER (WHERE sub.status = 'graded') / NULLIF(avg(a.max_score) FILTER (WHERE sub.status = 'graded'), 0) * 100, 1), 0)) / 2, 1
    ), 0) AS performance_percent,
    CASE
      WHEN count(DISTINCT lp.lesson_id) FILTER (WHERE lp.status = 'completed') = count(DISTINCT l.id) AND count(DISTINCT l.id) > 0 THEN 'completed'
      WHEN count(DISTINCT lp.lesson_id) FILTER (WHERE lp.status = 'completed') > 0 THEN 'in_progress'
      ELSE 'not_started'
    END AS completion_status,
    max(COALESCE(lp.updated_at, qa.submitted_at, sub.submitted_at, e.enrolled_at)) AS last_activity_at
  FROM lms_enrollments e
  JOIN lms_courses c ON c.id = e.course_id
  LEFT JOIN modules m ON m.course_id = c.id
  LEFT JOIN lessons l ON l.module_id = m.id
  LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = e.student_id
  LEFT JOIN quiz_attempts qa ON qa.student_id = e.student_id
    AND qa.quiz_id IN (SELECT q.id FROM quizzes q WHERE q.lesson_id = l.id)
  LEFT JOIN assignments a ON a.course_id = c.id
  LEFT JOIN submissions sub ON sub.assignment_id = a.id AND sub.student_id = e.student_id
  WHERE e.student_id = p_student_id
  GROUP BY c.id, c.title;
END;
$$;

-- ============================================================
-- 3. get_student_recent_activity
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_student_recent_activity(
  p_student_id uuid,
  p_limit int DEFAULT 20
)
RETURNS TABLE (
  activity_type text,
  activity_id uuid,
  course_id uuid,
  course_title text,
  description text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS DISTINCT FROM p_student_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  -- Lesson completed
  SELECT
    'lesson_completed'::text,
    lp.id,
    m.course_id,
    c.title,
    l.title,
    lp.completed_at
  FROM lesson_progress lp
  JOIN lessons l ON l.id = lp.lesson_id
  JOIN modules m ON m.id = l.module_id
  JOIN lms_courses c ON c.id = m.course_id
  WHERE lp.student_id = p_student_id AND lp.status = 'completed' AND lp.completed_at IS NOT NULL

  UNION ALL

  -- Quiz submitted
  SELECT
    'quiz_submitted'::text,
    qa.id,
    m.course_id,
    c.title,
    q.title,
    qa.submitted_at
  FROM quiz_attempts qa
  JOIN quizzes q ON q.id = qa.quiz_id
  JOIN lessons l ON l.id = q.lesson_id
  JOIN modules m ON m.id = l.module_id
  JOIN lms_courses c ON c.id = m.course_id
  WHERE qa.student_id = p_student_id AND qa.status = 'graded'

  UNION ALL

  -- Assignment submitted
  SELECT
    'assignment_submitted'::text,
    sub.id,
    a.course_id,
    c.title,
    a.title,
    sub.submitted_at
  FROM submissions sub
  JOIN assignments a ON a.id = sub.assignment_id
  JOIN lms_courses c ON c.id = a.course_id
  WHERE sub.student_id = p_student_id

  UNION ALL

  -- Assignment graded
  SELECT
    'assignment_graded'::text,
    sub.id,
    a.course_id,
    c.title,
    a.title,
    sub.graded_at
  FROM submissions sub
  JOIN assignments a ON a.id = sub.assignment_id
  JOIN lms_courses c ON c.id = a.course_id
  WHERE sub.student_id = p_student_id AND sub.status = 'graded'

  UNION ALL

  -- Resubmission requested
  SELECT
    'resubmission_requested'::text,
    sub.id,
    a.course_id,
    c.title,
    a.title,
    sub.graded_at
  FROM submissions sub
  JOIN assignments a ON a.id = sub.assignment_id
  JOIN lms_courses c ON c.id = a.course_id
  WHERE sub.student_id = p_student_id AND sub.status = 'resubmission_required'

  ORDER BY created_at DESC
  LIMIT p_limit;
END;
$$;

-- ============================================================
-- 4. get_student_course_detail
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_student_course_detail(
  p_student_id uuid,
  p_course_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
  v_enrolled boolean;
BEGIN
  IF auth.uid() IS DISTINCT FROM p_student_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM lms_enrollments
    WHERE student_id = p_student_id AND course_id = p_course_id
  ) INTO v_enrolled;

  IF NOT v_enrolled THEN
    RAISE EXCEPTION 'Not enrolled in this course';
  END IF;

  SELECT json_build_object(
    'course_id', c.id,
    'course_title', c.title,
    'overall_percent', COALESCE(round(
      count(DISTINCT lp.lesson_id) FILTER (WHERE lp.status = 'completed')::numeric
      / NULLIF(count(DISTINCT l.id), 0) * 100, 1
    ), 0),
    'lessons_completed', count(DISTINCT lp.lesson_id) FILTER (WHERE lp.status = 'completed'),
    'lessons_total', count(DISTINCT l.id),
    'remaining_lessons', count(DISTINCT l.id) - count(DISTINCT lp.lesson_id) FILTER (WHERE lp.status = 'completed'),
    'quiz_average', COALESCE(round(avg(qa.score_percent) FILTER (WHERE qa.status = 'graded'), 1), 0),
    'assignment_average', COALESCE(round(
      avg(sub.score) FILTER (WHERE sub.status = 'graded')
      / NULLIF(avg(a.max_score) FILTER (WHERE sub.status = 'graded'), 0) * 100, 1
    ), 0),
    'modules', COALESCE(json_agg(
      json_build_object(
        'module_id', m.id,
        'module_title', m.title,
        'lessons_completed', count(DISTINCT lp.lesson_id) FILTER (WHERE lp.status = 'completed'),
        'lessons_total', count(DISTINCT l.id),
        'progress_percent', COALESCE(round(
          count(DISTINCT lp.lesson_id) FILTER (WHERE lp.status = 'completed')::numeric
          / NULLIF(count(DISTINCT l.id), 0) * 100, 1
        ), 0),
        'lessons', COALESCE(json_agg(
          json_build_object(
            'lesson_id', l.id,
            'lesson_title', l.title,
            'status', COALESCE(lp.status, 'not_started'),
            'quiz_score', (
              SELECT qa.score_percent FROM quiz_attempts qa
              JOIN quizzes q ON q.id = qa.quiz_id
              WHERE q.lesson_id = l.id AND qa.student_id = p_student_id AND qa.status = 'graded'
              ORDER BY qa.attempt_number DESC LIMIT 1
            ),
            'assignment_score', (
              SELECT json_build_object(
                'score', sub.score,
                'max_score', a.max_score,
                'status', sub.status,
                'feedback', sub.feedback
              )
              FROM submissions sub
              JOIN assignments a ON a.id = sub.assignment_id
              WHERE a.lesson_id = l.id AND sub.student_id = p_student_id
              ORDER BY sub.submitted_at DESC LIMIT 1
            )
          ) ORDER BY l.position
        ) FILTER (WHERE l.id IS NOT NULL), '[]'::json)
      ) ORDER BY m.position
    ) FILTER (WHERE m.id IS NOT NULL), '[]'::json)
  )
  INTO result
  FROM lms_courses c
  LEFT JOIN modules m ON m.course_id = c.id
  LEFT JOIN lessons l ON l.module_id = m.id
  LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = p_student_id
  LEFT JOIN quiz_attempts qa ON qa.student_id = p_student_id
    AND qa.quiz_id IN (SELECT q.id FROM quizzes q WHERE q.lesson_id = l.id)
  LEFT JOIN assignments a ON a.course_id = c.id
  LEFT JOIN submissions sub ON sub.assignment_id = a.id AND sub.student_id = p_student_id
  WHERE c.id = p_course_id
  GROUP BY c.id;

  RETURN result;
END;
$$;

-- ============================================================
-- 5. get_student_assessment_performance
--    Unified quiz + assignment assessment list for the student
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_student_assessment_performance(p_student_id uuid)
RETURNS TABLE (
  assessment_type text,
  assessment_id uuid,
  assessment_title text,
  course_id uuid,
  course_title text,
  score numeric,
  max_score numeric,
  passing_status text,
  attempts int,
  grading_status text,
  feedback text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS DISTINCT FROM p_student_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  -- Quizzes
  SELECT
    'quiz'::text AS assessment_type,
    q.id AS assessment_id,
    q.title AS assessment_title,
    c.id AS course_id,
    c.title AS course_title,
    max(qa.score_percent) AS score,
    100::numeric AS max_score,
    CASE
      WHEN max(qa.score_percent) >= q.passing_score_percent THEN 'passed'
      WHEN max(qa.score_percent) IS NOT NULL THEN 'failed'
      ELSE NULL
    END AS passing_status,
    count(qa.id)::int AS attempts,
    CASE
      WHEN max(qa.status) = 'graded' THEN 'graded'
      WHEN max(qa.status) = 'in_progress' THEN 'in_progress'
      ELSE 'not_attempted'
    END AS grading_status,
    NULL::text AS feedback
  FROM quizzes q
  JOIN lessons l ON l.id = q.lesson_id
  JOIN modules m ON m.id = l.module_id
  JOIN lms_courses c ON c.id = m.course_id
  JOIN lms_enrollments e ON e.course_id = c.id AND e.student_id = p_student_id
  LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.id AND qa.student_id = p_student_id
  GROUP BY q.id, q.title, q.passing_score_percent, c.id, c.title

  UNION ALL

  -- Assignments
  SELECT
    'assignment'::text AS assessment_type,
    a.id AS assessment_id,
    a.title AS assessment_title,
    c.id AS course_id,
    c.title AS course_title,
    max(sub.score) AS score,
    max(a.max_score) AS max_score,
    NULL::text AS passing_status,
    0::int AS attempts,
    CASE
      WHEN max(sub.status) = 'graded' THEN 'graded'
      WHEN max(sub.status) = 'submitted' THEN 'submitted'
      WHEN max(sub.status) = 'resubmission_required' THEN 'resubmission_required'
      ELSE 'not_submitted'
    END AS grading_status,
    max(sub.feedback) AS feedback
  FROM assignments a
  JOIN lms_courses c ON c.id = a.course_id
  JOIN lms_enrollments e ON e.course_id = c.id AND e.student_id = p_student_id
  LEFT JOIN submissions sub ON sub.assignment_id = a.id AND sub.student_id = p_student_id
  GROUP BY a.id, a.title, a.max_score, c.id, c.title

  ORDER BY assessment_type, assessment_title;
END;
$$;

-- ============================================================
-- Grants
-- ============================================================
GRANT EXECUTE ON FUNCTION public.get_student_academic_summary(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_student_course_performance(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_student_recent_activity(uuid, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_student_course_detail(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_student_assessment_performance(uuid) TO authenticated;
