/*
# Create academy_enrollments table

1. New Tables
- `academy_enrollments` — tracks which authenticated user has enrolled in which Academy course (by course code from academy.js).
  - `id` (uuid, primary key)
  - `user_id` (uuid, NOT NULL, defaults to auth.uid(), references auth.users ON DELETE CASCADE)
  - `course_code` (text, NOT NULL — matches the code field in academy.js, e.g. AIC101)
  - `status` (text, NOT NULL, default 'active' — future values: active, completed, refunded)
  - `enrolled_at` (timestamptz, default now())

2. Security
- Enable RLS on `academy_enrollments`.
- Grant SELECT, INSERT, UPDATE, DELETE to `authenticated` only (this is a sign-in app).
- Owner-scoped CRUD: each authenticated user can only access their own enrollment rows.
- The `user_id` column defaults to `auth.uid()` so inserts that omit it still satisfy the WITH CHECK.

3. Notes
- Course catalog data lives in the frontend (academy.js), not in the database — the table only stores the course code reference.
- No payment integration in this phase; enrollment is direct (self-enroll).
*/

CREATE TABLE IF NOT EXISTS academy_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  course_code text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  enrolled_at timestamptz DEFAULT now(),
  UNIQUE (user_id, course_code)
);

ALTER TABLE academy_enrollments ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON academy_enrollments TO authenticated;

DROP POLICY IF EXISTS "select_own_enrollments" ON academy_enrollments;
CREATE POLICY "select_own_enrollments" ON academy_enrollments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_enrollments" ON academy_enrollments;
CREATE POLICY "insert_own_enrollments" ON academy_enrollments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_enrollments" ON academy_enrollments;
CREATE POLICY "update_own_enrollments" ON academy_enrollments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_enrollments" ON academy_enrollments;
CREATE POLICY "delete_own_enrollments" ON academy_enrollments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_academy_enrollments_user_id ON academy_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_enrollments_course_code ON academy_enrollments(course_code);
