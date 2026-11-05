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

  const course = await getLmsCourseByCode(code);
  if (!course) {
    throw new Error('This course is not open for enrollment yet. Please check back soon or contact us.');
  }
  if (course.is_free !== true) {
    throw new Error('This course requires checkout. Complete payment before enrolling.');
  }

  const { data, error } = await supabase.rpc('enroll_in_free_course', {
    p_course_id: course.id,
    p_course_code: String(code).trim().toUpperCase(),
  });
  if (error) throw error;
  const enrollment = data?.enrollment || data;
  return { ...enrollment, courseId: enrollment?.course_id || course.id };
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

/* ------------------------------------------------------------------ */
/* Fee monitoring (admin) & fee statement (student)                    */
/*                                                                      */
/* fee_transactions tracks charges and payments per student+semester.  */
/* Balances are aggregated at the student level since the schema does   */
/* not link individual transactions to specific enrollments.            */
/* ------------------------------------------------------------------ */

export async function listAdminFeeBalances() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('fee_transactions')
    .select(
      'student_id, type, amount, semester_id, profiles!inner ( id, full_name, student_number ), semesters ( name, end_date )',
    )
    .order('created_at', { ascending: false });
  if (error) throw error;

  const byStudent = {};
  for (const tx of data || []) {
    const sid = tx.student_id;
    if (!byStudent[sid]) {
      byStudent[sid] = {
        studentId: sid,
        studentName: tx.profiles?.full_name || '',
        tuitionUsd: 0,
        paidUsd: 0,
        termName: tx.semesters?.name || '',
        feeDeadline: tx.semesters?.end_date || null,
      };
    }
    const amt = Number(tx.amount || 0);
    if (tx.type === 'payment') byStudent[sid].paidUsd += amt;
    else byStudent[sid].tuitionUsd += amt;
  }

  const now = new Date();
  return Object.values(byStudent).map((s) => ({
    ...s,
    enrollmentId: s.studentId,
    courseTitle: 'All courses',
    courseCode: '',
    balanceUsd: s.tuitionUsd - s.paidUsd,
    isOverdue: s.feeDeadline ? new Date(s.feeDeadline) < now && s.tuitionUsd - s.paidUsd > 0 : false,
  }));
}

export async function listAdminFeePayments() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('fee_transactions')
    .select('id, student_id, amount, method, reference, created_at, profiles ( full_name )')
    .eq('type', 'payment')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((p) => ({
    id: p.id,
    receiptNumber: p.reference || p.id.slice(0, 8),
    studentName: p.profiles?.full_name || '-',
    courseCode: '',
    provider: (p.method || 'manual').replace('_', ' '),
    paidAt: p.created_at,
    amountUsd: Number(p.amount || 0),
  }));
}

export async function getMyFeeStatement() {
  if (!supabase) return [];
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  const uid = authData?.user?.id;
  if (!uid) return [];

  const { data, error } = await supabase
    .from('fee_transactions')
    .select('type, amount, semester_id, semesters ( name, end_date )')
    .eq('student_id', uid)
    .order('created_at', { ascending: false });
  if (error) throw error;

  let tuition = 0;
  let paid = 0;
  let termName = '';
  let feeDeadline = null;
  for (const tx of data || []) {
    const amt = Number(tx.amount || 0);
    if (tx.type === 'payment') {
      paid += amt;
    } else {
      tuition += amt;
      if (!termName && tx.semesters?.name) {
        termName = tx.semesters.name;
        feeDeadline = tx.semesters.end_date;
      }
    }
  }

  if (tuition === 0 && paid === 0) return [];
  const balance = tuition - paid;
  const now = new Date();
  return [
    {
      enrollmentId: uid,
      courseTitle: 'All courses',
      courseCode: '',
      termName,
      feeDeadline,
      tuitionUsd: tuition,
      paidUsd: paid,
      balanceUsd: balance,
      isOverdue: feeDeadline ? new Date(feeDeadline) < now && balance > 0 : false,
    },
  ];
}

export async function listMyFeePayments() {
  if (!supabase) return [];
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  const uid = authData?.user?.id;
  if (!uid) return [];

  const { data, error } = await supabase
    .from('fee_transactions')
    .select('id, amount, method, reference, created_at')
    .eq('student_id', uid)
    .eq('type', 'payment')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((p) => ({
    id: p.id,
    receipt_number: p.reference || p.id.slice(0, 8),
    enrollment_id: uid,
    paid_at: p.created_at,
    provider: p.method || 'manual',
    amount_usd: Number(p.amount || 0),
  }));
}
