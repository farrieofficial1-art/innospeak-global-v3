import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { CircleCheck, Circle, Clock, GraduationCap, TriangleAlert } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import { buildCourseData } from '../../lib/data/courseDetails';
import {
  getEnrollmentByCode,
  getCompletedLessonIndexes,
  markLessonComplete,
  markLessonIncomplete,
  updateEnrollmentProgress,
} from '../../lib/supabase/portal';

/**
 * CourseLearn — the actual lesson-taking experience for an enrolled
 * student, at /portal/courses/:courseCode.
 *
 * Lessons are auto-derived from the course's existing `modules` array
 * (src/lib/data/courseDetails.js) rather than a separate authored
 * lesson table — each module becomes a checkable lesson. A module can
 * optionally carry richer content later (e.g. a `videoUrl`) without
 * any change to this page or the schema.
 */
export default function CourseLearn() {
  const { courseCode } = useParams();
  const course = buildCourseData(courseCode?.toUpperCase());
  const modules = course?.modules || [];

  const [enrollment, setEnrollment] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingIndex, setPendingIndex] = useState(null);

  useEffect(() => {
    if (!course) return;
    let cancelled = false;

    async function load() {
      try {
        const e = await getEnrollmentByCode(course.code);
        if (cancelled) return;
        setEnrollment(e);
        if (e) {
          const indexes = await getCompletedLessonIndexes(e.id);
          if (!cancelled) setCompleted(indexes);
        }
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
  }, [course?.code]);

  const progressPercent = useMemo(() => {
    if (modules.length === 0) return 0;
    return Math.round((completed.size / modules.length) * 100);
  }, [completed, modules.length]);

  async function toggleLesson(index) {
    if (!enrollment || pendingIndex !== null) return;
    setPendingIndex(index);
    const wasComplete = completed.has(index);
    const nextCompleted = new Set(completed);
    wasComplete ? nextCompleted.delete(index) : nextCompleted.add(index);
    setCompleted(nextCompleted);

    try {
      if (wasComplete) {
        await markLessonIncomplete(enrollment.id, index);
      } else {
        await markLessonComplete(enrollment.id, index);
      }
      const nextPercent = Math.round((nextCompleted.size / modules.length) * 100);
      await updateEnrollmentProgress(enrollment.id, {
        progressPercent: nextPercent,
        status: nextPercent >= 100 ? 'completed' : 'active',
      });
      setEnrollment((prev) => ({ ...prev, progress_percent: nextPercent }));
    } catch (err) {
      setCompleted(completed);
      setError(err.message || 'Could not update your progress. Please try again.');
    } finally {
      setPendingIndex(null);
    }
  }

  if (!course) return <Navigate to="/academy" replace />;

  return (
    <>
      <Seo title={`Learn: ${course.name}`} description={course.shortDescription} path={`/portal/courses/${course.code}`} />

      <section className="bg-navy-gradient py-14 sm:py-16">
        <div className="container-premium">
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-300">
            {course.pathway}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
            {course.name}
          </h1>

          {enrollment && (
            <div className="mt-5 max-w-md">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gold-gradient transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 font-body text-xs text-navy-100/80">
                {completed.size} of {modules.length} lessons complete &middot; {progressPercent}%
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-cream py-14 sm:py-16">
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
                You&rsquo;re not enrolled in <strong>{course.name}</strong> yet.
              </p>
              <Link to={`/courses/${course.code}`} className="btn-gold mt-5 inline-block">
                View Course & Enroll
              </Link>
            </div>
          )}

          {!isLoading && enrollment && (
            <div className="mx-auto max-w-3xl divide-y divide-navy-100 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-premium">
              {modules.map((module, index) => {
                const isDone = completed.has(index);
                const isPending = pendingIndex === index;
                return (
                  <div key={index} className="flex items-start gap-4 px-6 py-5">
                    <button
                      type="button"
                      onClick={() => toggleLesson(index)}
                      disabled={isPending}
                      aria-label={isDone ? 'Mark lesson incomplete' : 'Mark lesson complete'}
                      className="mt-0.5 shrink-0 text-gold-600 transition-transform duration-150 hover:scale-110 disabled:opacity-50"
                    >
                      {isDone ? <CircleCheck size={24} /> : <Circle size={24} className="text-navy-200" />}
                    </button>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="font-body text-base font-semibold text-navy-900">
                          {index + 1}. {module.title}
                        </h3>
                        {module.hours && (
                          <span className="inline-flex items-center gap-1 font-body text-xs font-medium text-navy-400">
                            <Clock size={12} />
                            {module.hours}h
                          </span>
                        )}
                      </div>
                      {module.description && (
                        <p className="mt-1.5 font-body text-sm leading-relaxed text-navy-600">
                          {module.description}
                        </p>
                      )}
                      {module.videoUrl && (
                        <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-navy-100">
                          <iframe
                            src={module.videoUrl}
                            title={module.title}
                            className="h-full w-full"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}