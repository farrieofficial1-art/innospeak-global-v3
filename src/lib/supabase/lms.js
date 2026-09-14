import { supabase } from './client';

/**
 * lms — data layer for the Learning Management System.
 *
 * Every function here assumes RLS is the real enforcement boundary
 * (see the LMS migrations); this layer just shapes queries and throws
 * on error so pages can show a proper ErrorState instead of crashing.
 */

function assertConfigured() {
  if (!supabase) {
    throw new Error('The LMS is unavailable because Supabase has not been configured.');
  }
}

// ============================================================
// Courses (instructor + admin)
// ============================================================
export async function listMyCourses() {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const { data, error } = await supabase
    .from('lms_courses')
    .select('*, course_instructors!inner(instructor_id)')
    .eq('course_instructors.instructor_id', uid)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createCourse(fields) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const { data: course, error } = await supabase
    .from('lms_courses')
    .insert([{ ...fields, created_by: uid }])
    .select()
    .single();
  if (error) throw error;

  const { error: instructorError } = await supabase
    .from('course_instructors')
    .insert([{ course_id: course.id, instructor_id: uid, role: 'primary' }]);
  if (instructorError) throw instructorError;

  return course;
}

export async function updateCourse(courseId, fields) {
  assertConfigured();
  const { data, error } = await supabase.from('lms_courses').update(fields).eq('id', courseId).select().single();
  if (error) throw error;
  return data;
}

export async function getCourse(courseId) {
  assertConfigured();
  const { data, error } = await supabase.from('lms_courses').select('*').eq('id', courseId).single();
  if (error) throw error;
  return data;
}

export async function listPublishedCourses() {
  assertConfigured();
  const { data, error } = await supabase.from('lms_courses').select('*').eq('status', 'published').order('title');
  if (error) throw error;
  return data || [];
}

// Admin: list all courses for review
export async function listAllCourses() {
  assertConfigured();
  const { data, error } = await supabase
    .from('lms_courses')
    .select('*, course_instructors(instructor_id, profiles!course_instructors_instructor_id_fkey(full_name, email))')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Admin: get a single course with instructor info
export async function getCourseForAdmin(courseId) {
  assertConfigured();
  const { data, error } = await supabase
    .from('lms_courses')
    .select('*, course_instructors(instructor_id, profiles!course_instructors_instructor_id_fkey(full_name, email))')
    .eq('id', courseId)
    .single();
  if (error) throw error;
  return data;
}

// Upload course thumbnail
export async function uploadCourseThumbnail(courseId, file) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const ext = file.name.split('.').pop();
  const path = `${courseId || uid}/thumb-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('course-thumbnails').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: pub } = supabase.storage.from('course-thumbnails').getPublicUrl(path);
  return pub?.publicUrl || path;
}

// Course review workflow
export async function submitCourseForReview(courseId) {
  assertConfigured();
  const { error } = await supabase.rpc('submit_course_for_review', { p_course_id: courseId });
  if (error) throw error;
}

export async function setCourseUnderReview(courseId) {
  assertConfigured();
  const { error } = await supabase.rpc('set_course_under_review', { p_course_id: courseId });
  if (error) throw error;
}

export async function approveCourse(courseId) {
  assertConfigured();
  const { error } = await supabase.rpc('approve_course', { p_course_id: courseId });
  if (error) throw error;
}

export async function publishCourse(courseId) {
  assertConfigured();
  const { error } = await supabase.rpc('publish_course', { p_course_id: courseId });
  if (error) throw error;
}

export async function rejectCourse(courseId, notes) {
  assertConfigured();
  const { error } = await supabase.rpc('reject_course', { p_course_id: courseId, p_notes: notes });
  if (error) throw error;
}

export async function requestCourseChanges(courseId, notes) {
  assertConfigured();
  const { error } = await supabase.rpc('request_course_changes', { p_course_id: courseId, p_notes: notes });
  if (error) throw error;
}

// Reorder modules
export async function reorderModules(courseId, moduleIds) {
  assertConfigured();
  const { error } = await supabase.rpc('reorder_modules', { p_course_id: courseId, p_module_ids: moduleIds });
  if (error) throw error;
}

// Reorder lessons
export async function reorderLessons(moduleId, lessonIds) {
  assertConfigured();
  const { error } = await supabase.rpc('reorder_lessons', { p_module_id: moduleId, p_lesson_ids: lessonIds });
  if (error) throw error;
}

// ============================================================
// Course structure: modules, lessons, resources
// ============================================================
export async function listModulesWithLessons(courseId) {
  assertConfigured();
  const { data, error } = await supabase
    .from('modules')
    .select('*, lessons(*)')
    .eq('course_id', courseId)
    .order('position');
  if (error) throw error;
  return (data || []).map((m) => ({ ...m, lessons: (m.lessons || []).sort((a, b) => a.position - b.position) }));
}

export async function createModule(courseId, { title, description, position }) {
  assertConfigured();
  const { data, error } = await supabase
    .from('modules')
    .insert([{ course_id: courseId, title, description, position }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateModule(moduleId, fields) {
  assertConfigured();
  const { data, error } = await supabase.from('modules').update(fields).eq('id', moduleId).select().single();
  if (error) throw error;
  return data;
}

export async function deleteModule(moduleId) {
  assertConfigured();
  const { error } = await supabase.from('modules').delete().eq('id', moduleId);
  if (error) throw error;
}

export async function createLesson(moduleId, fields) {
  assertConfigured();
  const { data, error } = await supabase.from('lessons').insert([{ module_id: moduleId, ...fields }]).select().single();
  if (error) throw error;
  return data;
}

export async function updateLesson(lessonId, fields) {
  assertConfigured();
  const { data, error } = await supabase.from('lessons').update(fields).eq('id', lessonId).select().single();
  if (error) throw error;
  return data;
}

export async function deleteLesson(lessonId) {
  assertConfigured();
  const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
  if (error) throw error;
}

export async function getLesson(lessonId) {
  assertConfigured();
  const { data, error } = await supabase
    .from('lessons')
    .select('*, lesson_resources(*), modules(id, title, course_id)')
    .eq('id', lessonId)
    .single();
  if (error) throw error;
  return data;
}

// ============================================================
// Lesson resources (files, links, downloads)
// ============================================================
export async function createLessonResource(lessonId, fields) {
  assertConfigured();
  const { data, error } = await supabase
    .from('lesson_resources')
    .insert([{ lesson_id: lessonId, ...fields }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateLessonResource(resourceId, fields) {
  assertConfigured();
  const { data, error } = await supabase
    .from('lesson_resources')
    .update(fields)
    .eq('id', resourceId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteLessonResource(resourceId) {
  assertConfigured();
  const { error } = await supabase.from('lesson_resources').delete().eq('id', resourceId);
  if (error) throw error;
}

export async function listLessonResources(lessonId) {
  assertConfigured();
  const { data, error } = await supabase
    .from('lesson_resources')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('position');
  if (error) throw error;
  return data || [];
}

export async function uploadLessonResourceFile(lessonId, file) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const path = `${uid}/${lessonId}/${Date.now()}_${file.name}`;
  const { error } = await supabase.storage.from('lesson-resources').upload(path, file);
  if (error) throw error;
  const { data: signed } = await supabase.storage.from('lesson-resources').createSignedUrl(path, 60 * 60 * 24 * 365);
  return signed?.signedUrl || path;
}

// ============================================================
// Enrollment
// ============================================================
export async function enrollInCourse(courseId) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const { data, error } = await supabase
    .from('lms_enrollments')
    .upsert([{ course_id: courseId, student_id: uid, status: 'active' }], { onConflict: 'course_id,student_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listMyEnrollments() {
  assertConfigured();
  const { data, error } = await supabase
    .from('lms_enrollments')
    .select('*, lms_courses(*)')
    .order('enrolled_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function listCourseEnrollments(courseId) {
  assertConfigured();
  const { data, error } = await supabase
    .from('lms_enrollments')
    .select('*, profiles(id, full_name, student_number)')
    .eq('course_id', courseId);
  if (error) throw error;
  return data || [];
}

export async function getMyEnrollment(courseId) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const { data, error } = await supabase
    .from('lms_enrollments')
    .select('*')
    .eq('course_id', courseId)
    .eq('student_id', uid)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ============================================================
// Progress (single source — always call these, never compute
// completion % inline in a component)
// ============================================================
export async function getCourseProgress(courseId, studentId) {
  assertConfigured();
  const { data, error } = await supabase.rpc('get_course_progress', {
    target_course_id: courseId,
    target_student_id: studentId,
  });
  if (error) throw error;
  return data;
}

export async function getLessonProgress(lessonId) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('lesson_id', lessonId)
    .eq('student_id', uid)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAllLessonProgress(courseId) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('lesson_id, status, started_at, completed_at, updated_at')
    .in('lesson_id', (
      await supabase
        .from('modules')
        .select('lessons(id)')
        .eq('course_id', courseId)
    ).data?.flatMap((m) => m.lessons?.map((l) => l.id) || []) || [])
    .eq('student_id', uid);
  if (error) throw error;
  return data || [];
}

export async function markLessonStarted(lessonId) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const { error } = await supabase
    .from('lesson_progress')
    .upsert(
      [{ lesson_id: lessonId, student_id: uid, status: 'in_progress', started_at: new Date().toISOString() }],
      { onConflict: 'lesson_id,student_id', ignoreDuplicates: false }
    );
  if (error) throw error;
}

export async function markLessonComplete(lessonId) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const { error } = await supabase
    .from('lesson_progress')
    .upsert(
      [{ lesson_id: lessonId, student_id: uid, status: 'completed', completed_at: new Date().toISOString() }],
      { onConflict: 'lesson_id,student_id' }
    );
  if (error) throw error;
}

// ============================================================
// Assignments & submissions
// ============================================================
export async function createAssignment(moduleId, fields) {
  assertConfigured();
  const { data, error } = await supabase.from('assignments').insert([{ module_id: moduleId, ...fields }]).select().single();
  if (error) throw error;
  return data;
}

export async function listModuleAssignments(moduleId) {
  assertConfigured();
  const { data, error } = await supabase.from('assignments').select('*').eq('module_id', moduleId).order('created_at');
  if (error) throw error;
  return data || [];
}

export async function getAssignment(assignmentId) {
  assertConfigured();
  const { data, error } = await supabase.from('assignments').select('*, modules(course_id)').eq('id', assignmentId).single();
  if (error) throw error;
  return data;
}

export async function listMySubmissions(assignmentId) {
  assertConfigured();
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('assignment_id', assignmentId)
    .order('attempt_number', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function submitAssignment(assignmentId, { fileUrl, comment, attemptNumber, isLate }) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const { data, error } = await supabase
    .from('submissions')
    .insert([{
      assignment_id: assignmentId,
      student_id: uid,
      attempt_number: attemptNumber,
      file_url: fileUrl,
      comment,
      is_late: isLate,
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function uploadSubmissionFile(assignmentId, file) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const path = `${uid}/${assignmentId}/${Date.now()}_${file.name}`;
  const { error } = await supabase.storage.from('assignment-submissions').upload(path, file);
  if (error) throw error;
  const { data: signed } = await supabase.storage.from('assignment-submissions').createSignedUrl(path, 60 * 60 * 24 * 365);
  return signed?.signedUrl || path;
}

export async function listAssignmentSubmissions(assignmentId) {
  assertConfigured();
  const { data, error } = await supabase
    .from('submissions')
    .select('*, profiles(id, full_name, student_number)')
    .eq('assignment_id', assignmentId)
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function gradeSubmission(submissionId, { score, feedback }) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const { data, error } = await supabase
    .from('submissions')
    .update({ score, feedback, status: 'graded', graded_by: uid, graded_at: new Date().toISOString() })
    .eq('id', submissionId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============================================================
// Quizzes
// ============================================================
export async function createQuiz(moduleId, fields) {
  assertConfigured();
  const { data, error } = await supabase.from('quizzes').insert([{ module_id: moduleId, ...fields }]).select().single();
  if (error) throw error;
  return data;
}

export async function listModuleQuizzes(moduleId) {
  assertConfigured();
  const { data, error } = await supabase.from('quizzes').select('*').eq('module_id', moduleId).order('created_at');
  if (error) throw error;
  return data || [];
}

export async function getQuizForStudent(quizId) {
  assertConfigured();
  // Deliberately select only columns safe for a student to see —
  // never select question_options.is_correct or questions.correct_short_answer
  // here (see the RLS migration's note on column-level filtering).
  const { data, error } = await supabase
    .from('quizzes')
    .select('*, questions(id, question_text, question_type, marks, position, question_options(id, option_text, position))')
    .eq('id', quizId)
    .single();
  if (error) throw error;
  return data;
}

export async function getQuizForInstructor(quizId) {
  assertConfigured();
  const { data, error } = await supabase
    .from('quizzes')
    .select('*, questions(*, question_options(*))')
    .eq('id', quizId)
    .single();
  if (error) throw error;
  return data;
}

export async function createQuestion(quizId, fields, options = []) {
  assertConfigured();
  const { data: question, error } = await supabase
    .from('questions')
    .insert([{ quiz_id: quizId, ...fields }])
    .select()
    .single();
  if (error) throw error;

  if (options.length > 0) {
    const { error: optionsError } = await supabase
      .from('question_options')
      .insert(options.map((o, i) => ({ question_id: question.id, position: i, ...o })));
    if (optionsError) throw optionsError;
  }
  return question;
}

export async function startQuizAttempt(quizId, attemptNumber) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert([{ quiz_id: quizId, student_id: uid, attempt_number: attemptNumber }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listMyQuizAttempts(quizId) {
  assertConfigured();
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('quiz_id', quizId)
    .order('attempt_number', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function saveQuizAnswer(attemptId, questionId, { selectedOptionIds, textAnswer }) {
  assertConfigured();
  const { error } = await supabase
    .from('quiz_answers')
    .upsert(
      [{ attempt_id: attemptId, question_id: questionId, selected_option_ids: selectedOptionIds || [], text_answer: textAnswer || null, updated_at: new Date().toISOString() }],
      { onConflict: 'attempt_id,question_id' }
    );
  if (error) throw error;
}

export async function submitQuizAttempt(attemptId) {
  assertConfigured();
  const { data, error } = await supabase.rpc('submit_quiz_attempt', { target_attempt_id: attemptId });
  if (error) throw error;
  return data;
}

// ============================================================
// Grading config
// ============================================================
export async function listGradeComponents(courseId) {
  assertConfigured();
  const { data, error } = await supabase.from('grade_components').select('*').eq('course_id', courseId);
  if (error) throw error;
  return data || [];
}

export async function createGradeComponent(courseId, fields) {
  assertConfigured();
  const { data, error } = await supabase.from('grade_components').insert([{ course_id: courseId, ...fields }]).select().single();
  if (error) throw error;
  return data;
}

export async function getCourseGrade(courseId, studentId) {
  assertConfigured();
  const { data, error } = await supabase.rpc('get_course_grade', { target_course_id: courseId, target_student_id: studentId });
  if (error) throw error;
  return data;
}

// ============================================================
// Discussions
// ============================================================
export async function listDiscussions(courseId) {
  assertConfigured();
  const { data, error } = await supabase
    .from('discussions')
    .select('*, profiles(full_name)')
    .eq('course_id', courseId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createDiscussion(courseId, { title, body }) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const { data, error } = await supabase.from('discussions').insert([{ course_id: courseId, author_id: uid, title, body }]).select().single();
  if (error) throw error;
  return data;
}

export async function listReplies(discussionId) {
  assertConfigured();
  const { data, error } = await supabase
    .from('discussion_replies')
    .select('*, profiles(full_name)')
    .eq('discussion_id', discussionId)
    .order('created_at');
  if (error) throw error;
  return data || [];
}

export async function replyToDiscussion(discussionId, body, isInstructorReply) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const { data, error } = await supabase
    .from('discussion_replies')
    .insert([{ discussion_id: discussionId, author_id: uid, body, is_instructor_reply: !!isInstructorReply }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setDiscussionState(discussionId, fields) {
  assertConfigured();
  const { error } = await supabase.from('discussions').update(fields).eq('id', discussionId);
  if (error) throw error;
}

// ============================================================
// Announcements
// ============================================================
export async function listCourseAnnouncements(courseId) {
  assertConfigured();
  const { data, error } = await supabase.from('announcements').select('*').eq('course_id', courseId).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createAnnouncement(courseId, { title, body }) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const { data, error } = await supabase.from('announcements').insert([{ course_id: courseId, author_id: uid, title, body }]).select().single();
  if (error) throw error;
  return data;
}

// ============================================================
// Notifications
// ============================================================
export async function listMyNotifications(limit = 20) {
  assertConfigured();
  const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(limit);
  if (error) throw error;
  return data || [];
}

export async function markNotificationRead(notificationId) {
  assertConfigured();
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
  if (error) throw error;
}

export async function markAllNotificationsRead() {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('recipient_id', uid).eq('is_read', false);
  if (error) throw error;
}

// ============================================================
// Analytics
// ============================================================
export async function getCourseAnalytics(courseId) {
  assertConfigured();
  const { data, error } = await supabase.rpc('get_course_analytics', { target_course_id: courseId });
  if (error) throw error;
  return data;
}

export async function getLmsOverview() {
  assertConfigured();
  const { data, error } = await supabase.rpc('get_lms_overview');
  if (error) throw error;
  return data;
}
