import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Target, Download, ExternalLink,
  Video, FileText, Headphones, Presentation, File, Link as LinkIcon, BookOpen,
} from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import { LoadingState, ErrorState } from '../../components/portal/PortalStates.jsx';
import { getLesson, listModulesWithLessons, markLessonStarted, markLessonComplete, getLessonProgress } from '../../lib/supabase/lms';

const RESOURCE_ICONS = {
  video: Video,
  pdf: FileText,
  audio: Headphones,
  presentation: Presentation,
  document: File,
  link: LinkIcon,
  downloadable: Download,
};

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
  const resources = (lesson.lesson_resources || []).sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <>
      <Seo title={lesson.title} description="Lesson." path={`/learn/lessons/${lessonId}`} />

      <div className="flex items-center justify-between">
        <Link to={`/learn/courses/${lesson.modules.course_id}`} className="font-body text-sm font-semibold text-navy-500 hover:text-navy-800">
          ← Back to course
        </Link>
      </div>

      <SectionCard title={lesson.title} className="mt-4">
        {lesson.description && (
          <p className="mb-4 font-body text-sm text-navy-600">{lesson.description}</p>
        )}

        {lesson.learning_objectives?.length > 0 && (
          <div className="mb-4 rounded-xl bg-gold-500/5 p-4">
            <p className="flex items-center gap-2 font-body text-sm font-bold text-navy-900">
              <Target size={15} className="text-gold-600" /> Learning Objectives
            </p>
            <ul className="mt-2 space-y-1">
              {lesson.learning_objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-sm text-navy-700">
                  <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-gold-600" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        )}

        {lesson.content_type === 'video' && lesson.video_url && (
          <div className="mb-4">
            {lesson.video_url.includes('youtube.com') || lesson.video_url.includes('youtu.be') ? (
              <iframe
                src={lesson.video_url.replace('watch?v=', 'embed/')}
                className="aspect-video w-full rounded-xl"
                allowFullScreen
              />
            ) : (
              <video controls className="w-full rounded-xl" src={lesson.video_url} />
            )}
          </div>
        )}

        {lesson.content_type === 'link' && lesson.external_url && (
          <a href={lesson.external_url} target="_blank" rel="noreferrer" className="mb-4 inline-flex items-center gap-2 font-body text-sm font-semibold text-gold-700 hover:underline">
            <ExternalLink size={15} /> Open external resource →
          </a>
        )}

        {lesson.content && (
          <div className="prose prose-sm max-w-none font-body text-navy-800" dangerouslySetInnerHTML={{ __html: lesson.content }} />
        )}

        {resources.length > 0 && (
          <div className="mt-6 border-t border-navy-100 pt-4">
            <p className="font-body text-sm font-semibold text-navy-900">Lesson Resources</p>
            <div className="mt-2 space-y-2">
              {resources.map((r) => {
                const Icon = RESOURCE_ICONS[r.resource_type] || BookOpen;
                const href = r.external_url || r.file_url;
                return (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl bg-navy-50/60 px-4 py-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gold-500/10 text-gold-700">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-sm font-semibold text-navy-800">{r.title}</p>
                      {r.description && <p className="font-body text-xs text-navy-500">{r.description}</p>}
                    </div>
                    {r.is_downloadable && href && (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-gold-500/10 px-3 py-1.5 font-body text-xs font-semibold text-gold-700 hover:bg-gold-500/20"
                      >
                        <Download size={13} /> Download
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
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
