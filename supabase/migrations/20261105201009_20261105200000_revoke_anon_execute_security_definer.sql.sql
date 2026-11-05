/*
# Revoke anon EXECUTE on all SECURITY DEFINER functions

## Why
The Supabase database advisor flagged 76 warnings: every SECURITY DEFINER
function in the public schema was callable by the `anon` role (and by
extension `authenticated`). This meant unsigned-in users could invoke
admin-only operations like `approve_course`, `grade_submission`,
`revoke_certificate`, `generate_student_number`, etc. via the REST API.

## What this migration does
1. Revokes EXECUTE from PUBLIC and anon on every SECURITY DEFINER function.
2. Re-grants EXECUTE to `authenticated` only — signed-in users can still
   call the functions the app needs, but the function bodies enforce
   their own authorization checks (is_admin, can_manage_course, etc.).

## Functions affected
- approve_course, reject_course, publish_course, set_course_under_review
- submit_course_for_review, request_course_changes
- can_manage_course, can_manage_lesson, course_id_for_lesson
- is_admin, is_lms_admin, is_course_instructor, is_lesson_instructor
- is_enrolled, is_lesson_enrolled
- check_and_record_completion
- generate_certificate_number, generate_student_number
- get_course_analytics, get_course_progress, get_lms_overview
- get_login_email
- get_student_academic_summary, get_student_assessment_performance
- get_student_assignment_status, get_student_course_detail
- get_student_course_performance, get_student_recent_activity
- grade_submission, request_resubmission
- reactivate_certificate, revoke_certificate, verify_certificate
- reorder_lessons, reorder_modules
- submit_quiz_attempt
- set_updated_at, update_timestamp (trigger helper functions — these
  are only called by triggers, not the API, so revoking public execute
  is safe)

## Security impact
- anon role can no longer call any SECURITY DEFINER function
- authenticated role retains access (functions enforce internal authz)
- No data loss, no schema changes, no policy changes
*/

REVOKE EXECUTE ON FUNCTION approve_course(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION reject_course(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION publish_course(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION set_course_under_review(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION submit_course_for_review(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION request_course_changes(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION can_manage_course(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION can_manage_lesson(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION course_id_for_lesson(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION is_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION is_lms_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION is_course_instructor(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION is_lesson_instructor(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION is_enrolled(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION is_lesson_enrolled(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION check_and_record_completion(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION generate_certificate_number() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION generate_student_number() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION get_course_analytics(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION get_course_progress(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION get_lms_overview() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION get_login_email(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION get_student_academic_summary(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION get_student_assessment_performance(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION get_student_assignment_status(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION get_student_course_detail(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION get_student_course_performance(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION get_student_recent_activity(uuid, integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION grade_submission(uuid, integer, text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION request_resubmission(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION reactivate_certificate(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION revoke_certificate(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION verify_certificate(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION reorder_lessons(uuid, uuid[]) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION reorder_modules(uuid, uuid[]) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION submit_quiz_attempt(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION set_updated_at() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION update_timestamp() FROM PUBLIC, anon;

-- Re-grant to authenticated so the signed-in frontend can call these
GRANT EXECUTE ON FUNCTION approve_course(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_course(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION publish_course(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION set_course_under_review(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION submit_course_for_review(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION request_course_changes(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION can_manage_course(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION can_manage_lesson(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION course_id_for_lesson(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_lms_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_course_instructor(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION is_lesson_instructor(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION is_enrolled(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION is_lesson_enrolled(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION check_and_record_completion(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_certificate_number() TO authenticated;
GRANT EXECUTE ON FUNCTION generate_student_number() TO authenticated;
GRANT EXECUTE ON FUNCTION get_course_analytics(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_course_progress(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_lms_overview() TO authenticated;
GRANT EXECUTE ON FUNCTION get_login_email(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_student_academic_summary(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_student_assessment_performance(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_student_assignment_status(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_student_course_detail(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_student_course_performance(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_student_recent_activity(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION grade_submission(uuid, integer, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION request_resubmission(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION reactivate_certificate(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION revoke_certificate(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_certificate(text) TO authenticated;
GRANT EXECUTE ON FUNCTION reorder_lessons(uuid, uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION reorder_modules(uuid, uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION submit_quiz_attempt(uuid) TO authenticated;