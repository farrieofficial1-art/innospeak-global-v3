/*
  # Reset LMS tables before rebuild (v2 — covers Step 3 expansion)

  Run this FIRST, before re-running any LMS/platform migration in this
  folder. Same reasoning as the original reset migration: `CREATE TABLE
  IF NOT EXISTS` silently no-ops against any same-named table already
  sitting in the database from an earlier attempt, which is what caused
  the `courses`/`enrollments`/`announcements` collisions (fixed by
  renaming to `lms_courses`/`lms_enrollments`/`lms_announcements`) and
  separately the `assignments` table missing `module_id`.

  This version also covers every table introduced by the two newest
  migrations (sessions/portfolio + the cohorts/careers/projects
  "platform_full_system" expansion), since any of them could just as
  easily be sitting there half-formed from a previous partial run.

  Deliberately NOT dropped: `courses`, `enrollments`, `announcements`
  (pre-existing marketing-catalog / Student Portal tables still in
  active use) and every non-LMS Student Portal / SIS table.
*/

-- Original LMS core
DROP TABLE IF EXISTS quiz_answers CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS question_options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS grade_components CASCADE;
DROP TABLE IF EXISTS discussion_replies CASCADE;
DROP TABLE IF EXISTS discussions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS lesson_resources CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS course_instructors CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;

-- Sessions / portfolio (Step 4/5 groundwork)
DROP TABLE IF EXISTS course_sessions CASCADE;
DROP TABLE IF EXISTS session_attendance CASCADE;
DROP TABLE IF EXISTS course_prerequisites CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS portfolio_items CASCADE;
DROP TABLE IF EXISTS learning_goals CASCADE;

-- Cohorts / careers / projects (platform_full_system expansion)
DROP TABLE IF EXISTS cohorts CASCADE;
DROP TABLE IF EXISTS cohort_members CASCADE;
DROP TABLE IF EXISTS grade_entries CASCADE;
DROP TABLE IF EXISTS learning_projects CASCADE;
DROP TABLE IF EXISTS project_milestones CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS project_submissions CASCADE;
DROP TABLE IF EXISTS career_opportunities CASCADE;
DROP TABLE IF EXISTS mentorship_requests CASCADE;

-- In case a previous run partially succeeded under the corrected
-- renamed names too — safe either way, IF EXISTS.
DROP TABLE IF EXISTS lms_enrollments CASCADE;
DROP TABLE IF EXISTS lms_announcements CASCADE;
DROP TABLE IF EXISTS lms_courses CASCADE;
