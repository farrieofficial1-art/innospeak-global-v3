import { supabase } from './client';

/**
 * portal — enrollment data layer for the public course pages.
 *
 * Bridges the public catalogue (static data in lib/data/programmeData.js
 * and labsCourses.js, keyed by a course CODE like "DA5-101") to the LMS
 * database (lms_courses / lms_enrollments, keyed by UUID).
 *
 * A catalogue course only becomes enrollable once a matching PUBLISHED
 * row exists in lms_courses with the same `code`. Until then there is
 * nothing to enroll into and no lessons to deliver, so the UI says so
 * rather than creating an enrollment that leads nowhere.
 */

function assertConfigured() {
  if (!supabase) {
    throw new Error('Enrollment is unavailable because Supabase has not been configured.');
  }
}

/**
 * Resolve a catalogue course code to its published LMS course row.
 * @returns {Object|null} { id, title, code } or null if not published yet.
 */
export async function getLmsCourseByCode(code) {
  if (!supabase || !code) return null;
  const { data, error } = await supabase
    .from('lms_courses')
    .select('id, title, code, status, is_free')
    .eq('code', String(code).trim().toUpperCase())
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Get the current user's enrollment for a catalogue course code.
 * @returns {Object|null} the lms_enrollments row, or null.
 */
export async function getEnrollmentByCode(code) {
  if (!supabase) return null;
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  const uid = authData?.user?.id;
  if (!uid) return null;

  const course = await getLmsCourseByCode(code);
  if (!course) return null;

  const { data, error } = await supabase
    .from('lms_enrollments')
    .select('id, status, enrolled_at, course_id')
    .eq('course_id', course.id)
    .eq('student_id', uid)
    .maybeSingle();
  if (error) throw error;

  return data ? { ...data, courseId: course.id } : null;
}

/**
 * Enrol the current user into a catalogue course by its code.
 * @returns {Object} the created enrollment row (with courseId).
 */
export async function enrollInCourse({ code }) {
  assertConfigured();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authData?.user?.id) throw new Error('You must be logged in to enroll.');

  const { data, error } = await supabase.rpc('enroll_in_course', {
    p_course_code: String(code).trim().toUpperCase(),
  });
  if (error) throw new Error(error.message || 'Could not enrol you in this course.');
  if (!data?.id || !data?.course_id) {
    throw new Error('Enrolment did not return a confirmed record. Please refresh and try again.');
  }
  return { ...data, courseId: data.course_id };
}

/**
 * Term fee statement for the current student: tuition, paid, balance per enrolment.
 */
export async function getMyFeeStatement() {
  assertConfigured();
  const { data, error } = await supabase.rpc('get_my_fee_statement');
  if (error) throw error;
  return (data || []).map((row) => ({
    enrollmentId: row.enrollment_id,
    courseCode: row.course_code,
    courseTitle: row.course_title,
    termName: row.term_name,
    feeDeadline: row.fee_deadline,
    tuitionUsd: Number(row.tuition_usd),
    paidUsd: Number(row.paid_usd),
    balanceUsd: Number(row.balance_usd),
    isOverdue: row.is_overdue === true,
  }));
}

/**
 * Verified fee receipts for the current student.
 */
export async function listMyFeePayments() {
  assertConfigured();
  const { data, error } = await supabase
    .from('fee_payments')
    .select('id, enrollment_id, amount_usd, provider, receipt_number, paid_at')
    .order('paid_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

/**
 * The current user's enrollments, for the portal dashboard.
 */
export async function getMyEnrollments() {
  assertConfigured();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  const uid = authData?.user?.id;
  if (!uid) throw new Error('Please sign in to view your courses.');
  const { data, error } = await supabase
    .from('lms_enrollments')
    .select('id, status, enrolled_at, completed_at, course_id, lms_courses ( id, code, title )')
    .eq('student_id', uid)
    .order('enrolled_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
