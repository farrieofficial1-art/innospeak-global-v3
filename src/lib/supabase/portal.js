import { supabase } from './client';

/**
 * portal — data layer for the student portal.
 *
 * Courses themselves are static data (src/lib/data/programmeData.js),
 * not stored in the database — enrollments reference a course by its
 * existing `code` (e.g. "ENG101"), denormalizing the title/pathway at
 * enrollment time so reads never need a join. Lessons, video, and
 * materials ARE real database/storage content, gated to enrolled
 * students via RLS.
 */

export async function getMyEnrollments() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('enrollments')
    .select('id, course_code, course_title, course_pathway, status, progress_percent, enrolled_at')
    .order('enrolled_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getEnrollmentByCode(courseCode) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('enrollments')
    .select('id, status, progress_percent, course_code, course_title, course_pathway')
    .eq('course_code', courseCode)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function enrollInCourse({ code, title, pathway }) {
  if (!supabase) {
    throw new Error('Enrollment is unavailable because Supabase has not been configured.');
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('You need to be logged in to enroll.');
  }

  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      student_id: user.id,
      course_code: code,
      course_title: title,
      course_pathway: pathway,
    })
    .select('id, status, progress_percent')
    .single();

  if (error) {
    if (error.code === '23505') {
      return getEnrollmentByCode(code);
    }
    throw error;
  }
  return data;
}

/**
 * Lessons for a course, in order. RLS only returns rows if the current
 * student is enrolled in that course_code — an empty array back means
 * either "not enrolled" or "no lessons published yet", the UI handles
 * both as the same friendly empty state.
 */
export async function getLessonsForCourse(courseCode) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, description, content, video_path, duration_minutes, position')
    .eq('course_code', courseCode)
    .order('position', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getMaterialsForLessons(lessonIds) {
  if (!supabase || lessonIds.length === 0) return [];
  const { data, error } = await supabase
    .from('lesson_materials')
    .select('id, lesson_id, title, file_path, file_type')
    .in('lesson_id', lessonIds);
  if (error) throw error;
  return data || [];
}

export async function getCompletedLessonIds(enrollmentId) {
  if (!supabase) return new Set();
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('enrollment_id', enrollmentId);
  if (error) throw error;
  return new Set((data || []).map((row) => row.lesson_id));
}

export async function markLessonComplete(enrollmentId, lessonId) {
  if (!supabase) return;
  const { error } = await supabase
    .from('lesson_progress')
    .insert({ enrollment_id: enrollmentId, lesson_id: lessonId });
  if (error && error.code !== '23505') throw error;
}

export async function markLessonIncomplete(enrollmentId, lessonId) {
  if (!supabase) return;
  const { error } = await supabase
    .from('lesson_progress')
    .delete()
    .eq('enrollment_id', enrollmentId)
    .eq('lesson_id', lessonId);
  if (error) throw error;
}

/**
 * Generates a temporary (1 hour) signed URL for a private file in the
 * course-content bucket. RLS on storage.objects only allows this to
 * succeed for students enrolled in that file's course.
 */
export async function getContentUrl(path) {
  if (!supabase || !path) return null;
  const { data, error } = await supabase.storage
    .from('course-content')
    .createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function updateEnrollmentProgress(enrollmentId, { progressPercent, status }) {
  if (!supabase) return;
  const { error } = await supabase
    .from('enrollments')
    .update({ progress_percent: progressPercent, status })
    .eq('id', enrollmentId);
  if (error) throw error;
}