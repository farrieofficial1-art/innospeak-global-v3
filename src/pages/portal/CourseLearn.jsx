import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {
  CircleCheck,
  Circle,
  Clock,
  GraduationCap,
  TriangleAlert,
  PlayCircle,
  FileDown,
  Lock,
} from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import {
  getEnrollmentByCode,
  getLessonsForCourse,
  getMaterialsForLessons,
  getCompletedLessonIds,
  markLessonComplete,
  markLessonIncomplete,
  updateEnrollmentProgress,
  getContentUrl,
} from '../../lib/supabase/portal';

/**
 * CourseLearn — the real lesson-taking experience for an enrolled
 * student, at /portal/courses/:courseCode.
 *
 * Lessons, video, and downloadable materials are all authored content
 * living in the database + a private Storage bucket (course-content),
 * gated to enrolled students by RLS. A two-pane layout: lesson list on
 * the left (with completion state), the selected lesson's video/notes/
 * materials on the right.
 */
export default function CourseLearn() {
  const { courseCode } = useParams();

  const [enrollment, setEnrollment] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [completed, setCompleted] = useState(new Set());
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [isTogglingComplete, setIsTogglingComplete] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const e = await getEnrollmentByCode(courseCode);
        if (cancelled) return;
        setEnrollment(e);
        if (!e) return;

        const lessonRows = await getLessonsForCourse(courseCode);
        if (cancelled) return;
        setLessons(lessonRows);

        const [materialRows, completedIds] = await Promise.all([
          getMaterialsForLessons(lessonRows.map((l) => l.id)),
          getCompletedLessonIds(e.id),
        ]);
        if (cancelled) return;
        setMaterials(materialRows);
        setCompleted(completedIds);

        const firstIncomplete = lessonRows.find((l) => !completedIds.has(l.id));
        setSelectedLessonId((firstIncomplete || lessonRows[0])?.id ?? null);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load this course.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [courseCode]);

  const selectedLesson = useMemo(
    () => lessons.find((l) => l.id === selectedLessonId) || null,
    [lessons, selectedLessonId]
  );

  const selectedMaterials = useMemo(
    () => materials.filter((m) => m.lesson_id === selectedLessonId),
    [materials, selectedLessonId]
  );

  useEffect(() => {
    if (!selectedLesson?.video_path) {
      setVideoUrl(null);
      return;
    }
    let cancelled = false;
    setIsLoadingVideo(true);
    getContentUrl(selectedLesson.video_path)
      .then((url) => {
        if (!cancelled) setVideoUrl(url);
      })
      .catch(() => {
        if (!cancelled) setVideoUrl(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingVideo(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedLesson?.video_path]);

  async function handleDownloadMaterial(material) {
    try {
      const url = await getContentUrl(material.file_path);
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      setError('Could not open that file. Please try again.');
    }
  }

  async function toggleSelectedLessonComplete() {
    if (!enrollment || !selectedLesson || isTogglingComplete) return;
    setIsTogglingComplete(true);
    const wasComplete = completed.has(selectedLesson.id);
    const next = new Set(completed);
    wasComplete ? next.delete(selectedLesson.id) : next.add(selectedLesson.id);
    setCompleted(next);

    try {
      if (wasComplete) {
        await markLessonIncomplete(enrollment.id, selectedLesson.id);
      } else {
        await markLessonComplete(enrollment.id, selectedLesson.id);
      }
      const nextPercent = Math.round((next.size / lessons.length) * 100);
      await updateEnrollmentProgress(enrollment.id, {
        progressPercent: nextPercent,
        status: nextPercent >= 100 ? 'completed' : 'active',
      });
      setEnrollment((prev) => ({ ...prev, progress_percent: nextPercent }));
    } catch (err) {
      setCompleted(completed);
      setError(err.message || 'Could not update your progress. Please try again.');
    } finally {
      setIsTogglingComplete(false);
    }
  }

  const progressPercent =
    lessons.length > 0 ? Math.round((completed.size / lessons.length) * 100) : 0;

  return (
    <>
      <Seo
        title={enrollment ? `Learn: ${enrollment.course_title}` : 'Learn'}
        description="Your InnoSpeak Global course lessons."
        path={`/portal/courses/${courseCode}`}
      />

      <section className="bg-navy-gradient py-10 sm:py-12">
        <div className="container-premium">
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-300">
            {enrollment?.course_pathway || 'Course'}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
            {enrollment?.course_title || courseCode}
          </h1>

          {enrollment && lessons.length > 0 && (
            <div className="mt-5 max-w-md">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gold-gradient transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 font-body text-xs text-navy-100/80">
                {completed.size} of {lessons.length} lessons complete &middot; {progressPercent}%
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-cream py-10 sm:py-12">
        <div className="container-premium">
          {isLoading && (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-100 border-t-gold-500" />
            </div>
          )}

          {!isLoading && error && (
            <div className="mb-6 flex items-start gap-2 rounded-xl border border-gold-300 bg-gold-50 px-4 py-3 font-body text-sm text-navy-800">
              <TriangleAlert size={16} className="mt-0.5 shrink-0 text-gold-700" />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && !enrollment && (
            <div className="mx-auto max-w-xl rounded-2xl border border-navy-100 bg-white px-6 py-12 text-center shadow-premium">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 ring-1 ring-gold-500/20">
                <GraduationCap size={22} />
              </span>
              <p className="mt-4 font-body text-sm text-navy-600">
                You&rsquo;re not enrolled in this course yet.
              </p>
              <Link to={`/courses/${courseCode}`} className="btn-gold mt-5 inline-block">
                View Course & Enroll
              </Link>
            </div>
          )}

          {!isLoading && enrollment && lessons.length === 0 && (
            <div className="mx-auto max-w-xl rounded-2xl border border-navy-100 bg-white px-6 py-12 text-center shadow-premium">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 ring-1 ring-gold-500/20">
                <Lock size={22} />
              </span>
              <p className="mt-4 font-body text-sm text-navy-600">
                Lessons for this course haven&rsquo;t been published yet. Check back soon.
              </p>
            </div>
          )}

          {!isLoading && enrollment && lessons.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
              <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-premium lg:h-fit">
                <ul className="divide-y divide-navy-50">
                  {lessons.map((lesson, index) => {
                    const isDone = completed.has(lesson.id);
                    const isActive = lesson.id === selectedLessonId;
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedLessonId(lesson.id)}
                          className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors duration-150 ${
                            isActive ? 'bg-gold-500/10' : 'hover:bg-navy-50'
                          }`}
                        >
                          {isDone ? (
                            <CircleCheck size={18} className="mt-0.5 shrink-0 text-gold-600" />
                          ) : (
                            <Circle size={18} className="mt-0.5 shrink-0 text-navy-200" />
                          )}
                          <span className="flex-1">
                            <span
                              className={`block font-body text-sm font-medium ${
                                isActive ? 'text-navy-900' : 'text-navy-700'
                              }`}
                            >
                              {index + 1}. {lesson.title}
                            </span>
                            {lesson.duration_minutes && (
                              <span className="mt-0.5 flex items-center gap-1 font-body text-xs text-navy-400">
                                <Clock size={11} />
                                {lesson.duration_minutes} min
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {selectedLesson && (
                <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-premium">
                  {selectedLesson.video_path && (
                    <div className="flex aspect-video w-full items-center justify-center bg-navy-950">
                      {isLoadingVideo && (
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-gold-400" />
                      )}
                      {!isLoadingVideo && videoUrl && (
                        <video src={videoUrl} controls className="h-full w-full" />
                      )}
                      {!isLoadingVideo && !videoUrl && (
                        <div className="flex flex-col items-center gap-2 text-navy-300">
                          <PlayCircle size={32} />
                          <span className="font-body text-xs">Video unavailable</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6 sm:p-8">
                    <h2 className="font-display text-xl font-bold text-navy-900">
                      {selectedLesson.title}
                    </h2>
                    {selectedLesson.description && (
                      <p className="mt-2 font-body text-sm text-navy-500">
                        {selectedLesson.description}
                      </p>
                    )}
                    {selectedLesson.content && (
                      <p className="mt-5 whitespace-pre-wrap font-body text-sm leading-relaxed text-navy-700">
                        {selectedLesson.content}
                      </p>
                    )}

                    {selectedMaterials.length > 0 && (
                      <div className="mt-6 border-t border-navy-100 pt-6">
                        <h3 className="font-body text-xs font-semibold uppercase tracking-wider text-navy-400">
                          Materials
                        </h3>
                        <div className="mt-3 flex flex-col gap-2">
                          {selectedMaterials.map((material) => (
                            <button
                              key={material.id}
                              type="button"
                              onClick={() => handleDownloadMaterial(material)}
                              className="flex items-center gap-2 rounded-xl border border-navy-100 px-4 py-2.5 text-left font-body text-sm text-navy-700 transition-colors duration-150 hover:border-gold-300 hover:bg-gold-500/5"
                            >
                              <FileDown size={15} className="shrink-0 text-gold-600" />
                              {material.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={toggleSelectedLessonComplete}
                      disabled={isTogglingComplete}
                      className={`mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-body text-sm font-semibold transition-colors duration-200 disabled:opacity-60 ${
                        completed.has(selectedLesson.id)
                          ? 'border border-navy-100 text-navy-600 hover:bg-navy-50'
                          : 'btn-gold'
                      }`}
                    >
                      {completed.has(selectedLesson.id) ? (
                        <>
                          <CircleCheck size={16} />
                          Completed
                        </>
                      ) : (
                        'Mark as Complete'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}