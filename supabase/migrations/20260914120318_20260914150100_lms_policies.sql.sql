/*
  # LMS RLS Policies, Helper Functions, Triggers, Storage

  Adds row-level security to all LMS tables created in the previous
  migration. Also creates SECURITY DEFINER helper functions used by
  RLS policies and the course review workflow, updated_at triggers,
  and storage buckets for course thumbnails and lesson resources.

  Security model:
  - profiles: users read/update their own profile; admins can read/update all
  - lms_courses: instructors see their own courses; admins see all;
    published courses visible to enrolled students
  - course_instructors: instructors see their own; admins see all
  - modules/lessons/lesson_resources: visible to course instructors and admins
  - lesson_progress: students manage their own; instructors read for their courses
  - lms_enrollments: students see their own; instructors see for their courses
*/

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_enrollments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper functions (SECURITY DEFINER — safe for RLS to call)
-- ============================================================
CREATE OR REPLACE FUNCTION can_manage_course(target_course_id uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM lms_courses c
    WHERE c.id = target_course_id
    AND (
      c.created_by = auth.uid()
      OR EXISTS (SELECT 1 FROM course_instructors WHERE course_id = target_course_id AND instructor_id = auth.uid())
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );
$$;
GRANT EXECUTE ON FUNCTION can_manage_course(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION course_id_for_lesson(target_lesson_id uuid)
RETURNS uuid
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS $$
  SELECT m.course_id FROM lessons l JOIN modules m ON m.id = l.module_id WHERE l.id = target_lesson_id;
$$;
GRANT EXECUTE ON FUNCTION course_id_for_lesson(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION can_manage_lesson(target_lesson_id uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS $$
  SELECT can_manage_course(course_id_for_lesson(target_lesson_id));
$$;
GRANT EXECUTE ON FUNCTION can_manage_lesson(uuid) TO authenticated;

-- ============================================================
-- profiles policies
-- ============================================================
DROP POLICY IF EXISTS "read_own_profile" ON profiles;
CREATE POLICY "read_own_profile" ON profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'lms_admin')));

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "admin_update_profiles" ON profiles;
CREATE POLICY "admin_update_profiles" ON profiles
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'lms_admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'lms_admin')));

DROP POLICY IF EXISTS "admin_insert_profiles" ON profiles;
CREATE POLICY "admin_insert_profiles" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'lms_admin')));

-- ============================================================
-- lms_courses policies
-- ============================================================
DROP POLICY IF EXISTS "select_own_courses" ON lms_courses;
CREATE POLICY "select_own_courses" ON lms_courses
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM course_instructors WHERE course_id = lms_courses.id AND instructor_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR status = 'published'
  );

DROP POLICY IF EXISTS "insert_courses" ON lms_courses;
CREATE POLICY "insert_courses" ON lms_courses
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "update_own_courses" ON lms_courses;
CREATE POLICY "update_own_courses" ON lms_courses
  FOR UPDATE TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM course_instructors WHERE course_id = lms_courses.id AND instructor_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM course_instructors WHERE course_id = lms_courses.id AND instructor_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "delete_own_courses" ON lms_courses;
CREATE POLICY "delete_own_courses" ON lms_courses
  FOR DELETE TO authenticated
  USING (created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- course_instructors policies
-- ============================================================
DROP POLICY IF EXISTS "select_course_instructors" ON course_instructors;
CREATE POLICY "select_course_instructors" ON course_instructors
  FOR SELECT TO authenticated
  USING (instructor_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "insert_course_instructors" ON course_instructors;
CREATE POLICY "insert_course_instructors" ON course_instructors
  FOR INSERT TO authenticated
  WITH CHECK (instructor_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "delete_course_instructors" ON course_instructors;
CREATE POLICY "delete_course_instructors" ON course_instructors
  FOR DELETE TO authenticated
  USING (instructor_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- modules policies
-- ============================================================
DROP POLICY IF EXISTS "select_modules" ON modules;
CREATE POLICY "select_modules" ON modules
  FOR SELECT TO authenticated
  USING (can_manage_course(course_id));

DROP POLICY IF EXISTS "insert_modules" ON modules;
CREATE POLICY "insert_modules" ON modules
  FOR INSERT TO authenticated
  WITH CHECK (can_manage_course(course_id));

DROP POLICY IF EXISTS "update_modules" ON modules;
CREATE POLICY "update_modules" ON modules
  FOR UPDATE TO authenticated
  USING (can_manage_course(course_id)) WITH CHECK (can_manage_course(course_id));

DROP POLICY IF EXISTS "delete_modules" ON modules;
CREATE POLICY "delete_modules" ON modules
  FOR DELETE TO authenticated
  USING (can_manage_course(course_id));

-- ============================================================
-- lessons policies
-- ============================================================
DROP POLICY IF EXISTS "select_lessons" ON lessons;
CREATE POLICY "select_lessons" ON lessons
  FOR SELECT TO authenticated
  USING (can_manage_lesson(id));

DROP POLICY IF EXISTS "insert_lessons" ON lessons;
CREATE POLICY "insert_lessons" ON lessons
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM modules WHERE id = module_id AND can_manage_course(course_id)));

DROP POLICY IF EXISTS "update_lessons" ON lessons;
CREATE POLICY "update_lessons" ON lessons
  FOR UPDATE TO authenticated
  USING (can_manage_lesson(id)) WITH CHECK (can_manage_lesson(id));

DROP POLICY IF EXISTS "delete_lessons" ON lessons;
CREATE POLICY "delete_lessons" ON lessons
  FOR DELETE TO authenticated
  USING (can_manage_lesson(id));

-- ============================================================
-- lesson_resources policies
-- ============================================================
DROP POLICY IF EXISTS "select_lesson_resources" ON lesson_resources;
CREATE POLICY "select_lesson_resources" ON lesson_resources
  FOR SELECT TO authenticated
  USING (can_manage_lesson(lesson_id));

DROP POLICY IF EXISTS "insert_lesson_resources" ON lesson_resources;
CREATE POLICY "insert_lesson_resources" ON lesson_resources
  FOR INSERT TO authenticated
  WITH CHECK (can_manage_lesson(lesson_id));

DROP POLICY IF EXISTS "update_lesson_resources" ON lesson_resources;
CREATE POLICY "update_lesson_resources" ON lesson_resources
  FOR UPDATE TO authenticated
  USING (can_manage_lesson(lesson_id)) WITH CHECK (can_manage_lesson(lesson_id));

DROP POLICY IF EXISTS "delete_lesson_resources" ON lesson_resources;
CREATE POLICY "delete_lesson_resources" ON lesson_resources
  FOR DELETE TO authenticated
  USING (can_manage_lesson(lesson_id));

-- ============================================================
-- lesson_progress policies
-- ============================================================
DROP POLICY IF EXISTS "student_manage_own_progress" ON lesson_progress;
CREATE POLICY "student_manage_own_progress" ON lesson_progress
  FOR ALL TO authenticated
  USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "instructor_read_student_progress" ON lesson_progress;
CREATE POLICY "instructor_read_student_progress" ON lesson_progress
  FOR SELECT TO authenticated
  USING (can_manage_lesson(lesson_id));

-- ============================================================
-- lms_enrollments policies
-- ============================================================
DROP POLICY IF EXISTS "student_read_own_enrollments" ON lms_enrollments;
CREATE POLICY "student_read_own_enrollments" ON lms_enrollments
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());

DROP POLICY IF EXISTS "instructor_read_enrollments" ON lms_enrollments;
CREATE POLICY "instructor_read_enrollments" ON lms_enrollments
  FOR SELECT TO authenticated
  USING (can_manage_course(course_id));

DROP POLICY IF EXISTS "student_self_enroll" ON lms_enrollments;
CREATE POLICY "student_self_enroll" ON lms_enrollments
  FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid() AND EXISTS (SELECT 1 FROM lms_courses WHERE id = course_id AND status = 'published'));

-- ============================================================
-- updated_at triggers
-- ============================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_lms_courses_updated ON lms_courses;
CREATE TRIGGER trg_lms_courses_updated BEFORE UPDATE ON lms_courses
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_modules_updated ON modules;
CREATE TRIGGER trg_modules_updated BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_lessons_updated ON lessons;
CREATE TRIGGER trg_lessons_updated BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_profiles_updated ON profiles;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- Storage buckets
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-thumbnails', 'course-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('lesson-resources', 'lesson-resources', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "upload_course_thumbnail" ON storage.objects;
CREATE POLICY "upload_course_thumbnail" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'course-thumbnails');

DROP POLICY IF EXISTS "read_course_thumbnail" ON storage.objects;
CREATE POLICY "read_course_thumbnail" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-thumbnails');

DROP POLICY IF EXISTS "update_course_thumbnail" ON storage.objects;
CREATE POLICY "update_course_thumbnail" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'course-thumbnails');

DROP POLICY IF EXISTS "upload_lesson_resources" ON storage.objects;
CREATE POLICY "upload_lesson_resources" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'lesson-resources' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'lms_admin', 'instructor')));

DROP POLICY IF EXISTS "read_lesson_resources" ON storage.objects;
CREATE POLICY "read_lesson_resources" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'lesson-resources');

-- ============================================================
-- SECURITY DEFINER functions for course review + reordering
-- ============================================================
CREATE OR REPLACE FUNCTION submit_course_for_review(p_course_id uuid)
RETURNS void AS $$
BEGIN
  IF NOT can_manage_course(p_course_id) THEN
    RAISE EXCEPTION 'You can only submit your own courses for review.';
  END IF;
  UPDATE lms_courses SET status = 'submitted', reviewer_notes = '', reviewer_id = NULL, reviewed_at = NULL
  WHERE id = p_course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION set_course_under_review(p_course_id uuid)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only staff can review courses.';
  END IF;
  UPDATE lms_courses SET status = 'under_review' WHERE id = p_course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION approve_course(p_course_id uuid)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only staff can approve courses.';
  END IF;
  UPDATE lms_courses SET status = 'approved', reviewer_id = auth.uid(), reviewed_at = now()
  WHERE id = p_course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION publish_course(p_course_id uuid)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only staff can publish courses.';
  END IF;
  UPDATE lms_courses SET status = 'published' WHERE id = p_course_id AND status = 'approved';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reject_course(p_course_id uuid, p_notes text)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only staff can reject courses.';
  END IF;
  UPDATE lms_courses SET status = 'rejected', reviewer_id = auth.uid(), reviewer_notes = p_notes, reviewed_at = now()
  WHERE id = p_course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION request_course_changes(p_course_id uuid, p_notes text)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only staff can request changes.';
  END IF;
  UPDATE lms_courses SET status = 'changes_requested', reviewer_id = auth.uid(), reviewer_notes = p_notes, reviewed_at = now()
  WHERE id = p_course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reorder_modules(p_course_id uuid, p_module_ids uuid[])
RETURNS void AS $$
DECLARE i integer;
BEGIN
  FOR i IN 1..array_length(p_module_ids, 1) LOOP
    UPDATE modules SET position = i - 1 WHERE id = p_module_ids[i] AND course_id = p_course_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reorder_lessons(p_module_id uuid, p_lesson_ids uuid[])
RETURNS void AS $$
DECLARE i integer;
BEGIN
  FOR i IN 1..array_length(p_lesson_ids, 1) LOOP
    UPDATE lessons SET position = i - 1 WHERE id = p_lesson_ids[i] AND module_id = p_module_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
