/*
  # LMS Tables — database foundation

  Creates all LMS tables in correct dependency order. No RLS policies
  or helper functions here — those come in a follow-up migration so
  table creation never fails on cross-references.

  Tables created:
  1. profiles — user profile with role column
  2. lms_courses — teachable courses with review workflow
  3. course_instructors — many-to-many tutors to courses
  4. modules — ordered sections within a course
  5. lessons — ordered lessons with rich content builder columns
  6. lesson_resources — files/links/downloads per lesson with resource_type
  7. lesson_progress — authoritative completion tracking
  8. lms_enrollments — student enrollment

  Lesson content builder columns on `lessons`:
  - description, learning_objectives (jsonb), video_url, external_url,
    status (draft/published)

  Lesson content builder columns on `lesson_resources`:
  - resource_type (video/pdf/audio/presentation/document/link/downloadable),
    external_url, description
*/

-- 1. profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  email text DEFAULT '',
  role text NOT NULL DEFAULT 'student'
    CHECK (role IN ('student', 'admin', 'instructor', 'lms_admin')),
  student_number text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. lms_courses
CREATE TABLE IF NOT EXISTS lms_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  code text,
  description text DEFAULT '',
  thumbnail_path text DEFAULT '',
  category text DEFAULT '',
  level text DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
  duration text DEFAULT '',
  language text DEFAULT 'English',
  requirements text DEFAULT '',
  learning_outcomes jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'published', 'rejected', 'changes_requested')),
  created_by uuid REFERENCES auth.users(id),
  reviewer_id uuid REFERENCES auth.users(id),
  reviewer_notes text DEFAULT '',
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. course_instructors
CREATE TABLE IF NOT EXISTS course_instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
  instructor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'primary' CHECK (role IN ('primary', 'co_instructor', 'assistant')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, instructor_id)
);

-- 4. modules
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. lessons — with lesson content builder columns
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  content_type text NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'video', 'pdf', 'audio', 'presentation', 'link')),
  content text DEFAULT '',
  learning_objectives jsonb DEFAULT '[]'::jsonb,
  video_url text,
  external_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 6. lesson_resources — with resource_type
CREATE TABLE IF NOT EXISTS lesson_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  file_url text,
  external_url text,
  resource_type text NOT NULL DEFAULT 'downloadable'
    CHECK (resource_type IN ('video', 'pdf', 'audio', 'presentation', 'document', 'link', 'downloadable')),
  file_type text,
  file_size_bytes bigint,
  description text,
  is_downloadable boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 7. lesson_progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  video_position_seconds integer DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  UNIQUE (lesson_id, student_id)
);

-- 8. lms_enrollments
CREATE TABLE IF NOT EXISTS lms_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (course_id, student_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lms_courses_status ON lms_courses(status);
CREATE INDEX IF NOT EXISTS idx_lms_courses_created_by ON lms_courses(created_by);
CREATE INDEX IF NOT EXISTS idx_course_instructors_course ON course_instructors(course_id);
CREATE INDEX IF NOT EXISTS idx_course_instructors_instructor ON course_instructors(instructor_id);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id, position);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id, position);
CREATE INDEX IF NOT EXISTS idx_lesson_resources_lesson ON lesson_resources(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student ON lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON lms_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON lms_enrollments(student_id);
