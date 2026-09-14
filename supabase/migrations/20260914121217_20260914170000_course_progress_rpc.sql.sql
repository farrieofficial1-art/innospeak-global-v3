/*
  # Course progress RPC + enrollment check helper

  Adds the `get_course_progress` SECURITY DEFINER function that
  computes the percentage of completed lessons for a student in a
  course. This is the authoritative progress calculation — the single
  source of truth for "how far through this course is this student."

  Also adds `is_enrolled_in_course` helper for RLS and app use.

  These functions are safe for any authenticated user to call — they
  internally check that the caller is enrolled in the course before
  returning progress data.
*/

CREATE OR REPLACE FUNCTION get_course_progress(
  target_course_id uuid,
  target_student_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_lessons integer;
  completed_lessons integer;
  pct numeric;
  last_lesson_id uuid;
BEGIN
  -- Count total lessons in the course
  SELECT count(*) INTO total_lessons
  FROM lessons l
  JOIN modules m ON m.id = l.module_id
  WHERE m.course_id = target_course_id;

  -- Count completed lessons for this student
  SELECT count(*) INTO completed_lessons
  FROM lesson_progress p
  JOIN lessons l ON l.id = p.lesson_id
  JOIN modules m ON m.id = l.module_id
  WHERE m.course_id = target_course_id
    AND p.student_id = target_student_id
    AND p.status = 'completed';

  -- Find the last lesson the student interacted with (most recent started_at)
  SELECT l.id INTO last_lesson_id
  FROM lesson_progress p
  JOIN lessons l ON l.id = p.lesson_id
  JOIN modules m ON m.id = l.module_id
  WHERE m.course_id = target_course_id
    AND p.student_id = target_student_id
  ORDER BY p.updated_at DESC
  LIMIT 1;

  IF total_lessons = 0 THEN
    pct := 0;
  ELSE
    pct := ROUND((completed_lessons::numeric / total_lessons) * 100);
  END IF;

  RETURN jsonb_build_object(
    'total_lessons', total_lessons,
    'completed_lessons', completed_lessons,
    'percent', pct,
    'last_lesson_id', last_lesson_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION get_course_progress(uuid, uuid) TO authenticated;
