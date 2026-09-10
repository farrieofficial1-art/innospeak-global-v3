import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import { LoadingState, ErrorState } from '../../components/portal/PortalStates.jsx';
import { getLesson, listModulesWithLessons, markLessonStarted, markLessonComplete, getLessonProgress } from '../../lib/supabase/lms';

export default function LessonView() {
  const { lessonId } = useParams();
  const [state, setState] = useState({ loading: true, error: null, lesson: null, progress: null, prevLesson: null, nextLesson: null });
  const [completing, setCompleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const lesson = await getLesson(lessonId);
      const courseId = lesson.modules.course_id;
      const [progress] = await Promise.all([getLessonProgress(lessonId), markLessonStarted(lessonId)]);
      const modules = await listModulesWithLessons(courseId);
      const flatLessons = modules.flatMap((m) => m.lessons);
      const idx = flatLessons.findIndex((l) => l.id === lessonId);
      setState({
        loading: false,
        error: null,
        lesson,
        progress,
        prevLesson: idx > 0 ? flatLessons[idx - 1] : null,
        nextLesson: idx >= 0 && idx < flatLessons.length - 1 ? flatLessons[idx + 1] : null,
      });
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false, error: err.message || 'Could not load this lesson.' }));
    }
  }, [lessonId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleComplete() {
    setCompleting(true);
    try {
      await markLessonComplete(lessonId);
      const progress = await getLessonProgress(lessonId);
      setState((prev) => ({ ...prev, progress }));
    } finally {
      setCompleting(false);
    }
  }

  if (state.loading) return <LoadingState />;
  if (state.error) return <ErrorState message={state.error} />;

  const { lesson } = state;
  const isComplete = state.progress?.status === 'completed';

  return (
    <>
      <Seo title={lesson.title} description="Lesson." path={`/learn/lessons/${lessonId}`} />

      <div className="flex items-center justify-between">
        <Link to={`/learn/courses/${lesson.modules.course_id}`} className="font-body text-sm font-semibold text-navy-500 hover:text-navy-800">
          ← Back to course
        </Link>
      </div>

      <SectionCard title={lesson.title} className="mt-4">
        {lesson.content_type === 'video' && lesson.video_url && (
          <video controls className="mb-4 w-full rounded-xl" src={lesson.video_url} />
        )}
        {lesson.content_type === 'link' && lesson.external_url && (
          <a href={lesson.external_url} target="_blank" rel="noreferrer" className="mb-4 inline-block font-body text-sm font-semibold text-gold-700 hover:underline">
            Open external resource →
          </a>
        )}
        {lesson.content && <div className="prose prose-sm max-w-none font-body text-navy-800 whitespace-pre-wrap">{lesson.content}</div>}

        {lesson.lesson_resources?.length > 0 && (
          <div className="mt-6 border-t border-navy-100 pt-4">
            <p className="font-body text-sm font-semibold text-navy-900">Resources</p>
            <ul className="mt-2 space-y-1">
              {lesson.lesson_resources.map((r) => (
                <li key={r.id}>
                  <a href={r.file_url} target="_blank" rel="noreferrer" className="font-body text-sm text-gold-700 hover:underline">
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-navy-100 pt-6">
          <div>
            {state.prevLesson ? (
              <Link to={`/learn/lessons/${state.prevLesson.id}`} className="btn-outline inline-flex items-center gap-2 text-sm">
                <ArrowLeft size={15} /> Previous
              </Link>
            ) : (
              <span />
            )}
          </div>

          {isComplete ? (
            <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 font-body text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={16} /> Completed
            </span>
          ) : (
            <button type="button" onClick={handleComplete} disabled={completing} className="btn-gold inline-flex items-center gap-2 disabled:opacity-60">
              <CheckCircle2 size={16} /> {completing ? 'Saving…' : 'Mark Complete'}
            </button>
          )}

          <div>
            {state.nextLesson && (
              <Link to={`/learn/lessons/${state.nextLesson.id}`} className="btn-outline inline-flex items-center gap-2 text-sm">
                Next <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>
      </SectionCard>
    </>
  );
}
