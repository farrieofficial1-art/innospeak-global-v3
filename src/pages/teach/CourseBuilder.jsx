import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trash2, BookOpen, FileCheck2, ListChecks, Users } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import TextField from '../../components/ui/TextField.jsx';
import SelectField from '../../components/ui/SelectField.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/portal/PortalStates.jsx';
import {
  getCourse,
  updateCourse,
  listModulesWithLessons,
  createModule,
  deleteModule,
  createLesson,
  deleteLesson,
  listModuleAssignments,
  createAssignment,
  listModuleQuizzes,
  createQuiz,
} from '../../lib/supabase/lms';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const LESSON_TYPES = [
  { value: 'text', label: 'Text / Reading' },
  { value: 'video', label: 'Video' },
  { value: 'pdf', label: 'PDF' },
  { value: 'audio', label: 'Audio' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'link', label: 'External Link' },
];

function ModuleCard({ module, onChanged }) {
  const [lessonForm, setLessonForm] = useState({ title: '', content_type: 'text', content: '' });
  const [assignmentForm, setAssignmentForm] = useState({ title: '', max_marks: 100, due_at: '' });
  const [quizForm, setQuizForm] = useState({ title: '', time_limit_minutes: '', passing_score_percent: 50 });
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [showAdd, setShowAdd] = useState(null); // 'lesson' | 'assignment' | 'quiz' | null

  const loadExtras = useCallback(() => {
    listModuleAssignments(module.id).then(setAssignments).catch(() => {});
    listModuleQuizzes(module.id).then(setQuizzes).catch(() => {});
  }, [module.id]);

  useEffect(() => {
    loadExtras();
  }, [loadExtras]);

  async function handleAddLesson(e) {
    e.preventDefault();
    if (!lessonForm.title) return;
    await createLesson(module.id, { ...lessonForm, position: module.lessons.length });
    setLessonForm({ title: '', content_type: 'text', content: '' });
    setShowAdd(null);
    onChanged();
  }

  async function handleAddAssignment(e) {
    e.preventDefault();
    if (!assignmentForm.title) return;
    await createAssignment(module.id, { ...assignmentForm, due_at: assignmentForm.due_at || null, status: 'published' });
    setAssignmentForm({ title: '', max_marks: 100, due_at: '' });
    setShowAdd(null);
    loadExtras();
  }

  async function handleAddQuiz(e) {
    e.preventDefault();
    if (!quizForm.title) return;
    await createQuiz(module.id, {
      ...quizForm,
      time_limit_minutes: quizForm.time_limit_minutes ? Number(quizForm.time_limit_minutes) : null,
      status: 'draft',
    });
    setQuizForm({ title: '', time_limit_minutes: '', passing_score_percent: 50 });
    setShowAdd(null);
    loadExtras();
  }

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-navy-900">{module.title}</h3>
        <button
          type="button"
          onClick={async () => {
            if (confirm('Delete this module and everything in it?')) {
              await deleteModule(module.id);
              onChanged();
            }
          }}
          className="text-navy-400 hover:text-rose-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
      {module.description && <p className="mt-1 font-body text-sm text-navy-500">{module.description}</p>}

      {/* Lessons */}
      <div className="mt-4 space-y-2">
        {module.lessons.map((lesson) => (
          <div key={lesson.id} className="flex items-center justify-between rounded-lg bg-navy-50/60 px-3 py-2">
            <span className="font-body text-sm text-navy-800">
              <BookOpen size={13} className="mr-2 inline text-navy-400" />
              {lesson.title} <span className="text-xs text-navy-400">({lesson.content_type})</span>
            </span>
            <button
              type="button"
              onClick={async () => {
                await deleteLesson(lesson.id);
                onChanged();
              }}
              className="text-navy-400 hover:text-rose-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {/* Assignments */}
        {assignments.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-lg bg-gold-500/5 px-3 py-2">
            <span className="font-body text-sm text-navy-800">
              <FileCheck2 size={13} className="mr-2 inline text-gold-600" />
              {a.title} <span className="text-xs text-navy-400">({a.max_marks} marks)</span>
            </span>
          </div>
        ))}

        {/* Quizzes */}
        {quizzes.map((q) => (
          <Link key={q.id} to={`/teach/quizzes/${q.id}`} className="flex items-center justify-between rounded-lg bg-navy-500/5 px-3 py-2 hover:bg-navy-500/10">
            <span className="font-body text-sm text-navy-800">
              <ListChecks size={13} className="mr-2 inline text-navy-600" />
              {q.title} <span className="text-xs text-navy-400">({q.status})</span>
            </span>
            <span className="font-body text-xs font-semibold text-gold-700">Edit questions →</span>
          </Link>
        ))}
      </div>

      {/* Add buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setShowAdd(showAdd === 'lesson' ? null : 'lesson')} className="btn-outline text-xs">
          <Plus size={13} className="mr-1 inline" /> Lesson
        </button>
        <button type="button" onClick={() => setShowAdd(showAdd === 'assignment' ? null : 'assignment')} className="btn-outline text-xs">
          <Plus size={13} className="mr-1 inline" /> Assignment
        </button>
        <button type="button" onClick={() => setShowAdd(showAdd === 'quiz' ? null : 'quiz')} className="btn-outline text-xs">
          <Plus size={13} className="mr-1 inline" /> Quiz
        </button>
      </div>

      {showAdd === 'lesson' && (
        <form onSubmit={handleAddLesson} className="mt-4 space-y-3 rounded-xl border border-navy-100 p-4">
          <TextField label="Lesson Title" name="lesson_title" value={lessonForm.title} onChange={(e) => setLessonForm((p) => ({ ...p, title: e.target.value }))} required />
          <SelectField label="Type" name="content_type" value={lessonForm.content_type} options={LESSON_TYPES} onChange={(e) => setLessonForm((p) => ({ ...p, content_type: e.target.value }))} />
          <TextField label="Content / URL" name="content" optional value={lessonForm.content} onChange={(e) => setLessonForm((p) => ({ ...p, content: e.target.value }))} placeholder="Lesson body text, or a video/file URL" />
          <button type="submit" className="btn-gold text-sm">Add Lesson</button>
        </form>
      )}
      {showAdd === 'assignment' && (
        <form onSubmit={handleAddAssignment} className="mt-4 space-y-3 rounded-xl border border-navy-100 p-4">
          <TextField label="Assignment Title" name="assignment_title" value={assignmentForm.title} onChange={(e) => setAssignmentForm((p) => ({ ...p, title: e.target.value }))} required />
          <TextField label="Max Marks" name="max_marks" type="number" value={assignmentForm.max_marks} onChange={(e) => setAssignmentForm((p) => ({ ...p, max_marks: Number(e.target.value) }))} />
          <TextField label="Due Date" name="due_at" type="datetime-local" optional value={assignmentForm.due_at} onChange={(e) => setAssignmentForm((p) => ({ ...p, due_at: e.target.value }))} />
          <button type="submit" className="btn-gold text-sm">Add Assignment</button>
        </form>
      )}
      {showAdd === 'quiz' && (
        <form onSubmit={handleAddQuiz} className="mt-4 space-y-3 rounded-xl border border-navy-100 p-4">
          <TextField label="Quiz Title" name="quiz_title" value={quizForm.title} onChange={(e) => setQuizForm((p) => ({ ...p, title: e.target.value }))} required />
          <TextField label="Time Limit (minutes)" name="time_limit_minutes" type="number" optional value={quizForm.time_limit_minutes} onChange={(e) => setQuizForm((p) => ({ ...p, time_limit_minutes: e.target.value }))} />
          <TextField label="Passing Score (%)" name="passing_score_percent" type="number" value={quizForm.passing_score_percent} onChange={(e) => setQuizForm((p) => ({ ...p, passing_score_percent: Number(e.target.value) }))} />
          <button type="submit" className="btn-gold text-sm">Add Quiz</button>
          <p className="font-body text-xs text-navy-400">Quiz starts as Draft — add questions, then publish from the quiz editor.</p>
        </form>
      )}
    </div>
  );
}

export default function CourseBuilder() {
  const { courseId } = useParams();
  const [state, setState] = useState({ loading: true, error: null, course: null, modules: [] });
  const [moduleTitle, setModuleTitle] = useState('');

  const load = useCallback(() => {
    Promise.all([getCourse(courseId), listModulesWithLessons(courseId)])
      .then(([course, modules]) => setState({ loading: false, error: null, course, modules }))
      .catch((err) => setState({ loading: false, error: err.message || 'Could not load this course.', course: null, modules: [] }));
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(status) {
    await updateCourse(courseId, { status });
    load();
  }

  async function handleAddModule(e) {
    e.preventDefault();
    if (!moduleTitle) return;
    await createModule(courseId, { title: moduleTitle, position: state.modules.length });
    setModuleTitle('');
    load();
  }

  if (state.loading) return <LoadingState />;
  if (state.error) return <ErrorState message={state.error} />;

  return (
    <>
      <Seo title={state.course.title} description="Course builder." path={`/teach/courses/${courseId}`} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Teach</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">{state.course.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to={`/teach/courses/${courseId}/submissions`} className="btn-outline inline-flex items-center gap-2 text-sm">
            <Users size={15} /> Students &amp; Grading
          </Link>
          <SelectField
            label=""
            name="status"
            value={state.course.status}
            options={STATUS_OPTIONS}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-44"
          />
        </div>
      </div>

      <SectionCard title="Add Module" className="mt-6">
        <form onSubmit={handleAddModule} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <TextField label="Module Title" name="module_title" value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} placeholder="e.g. Module 1: Electrical Safety" className="flex-1" />
          <button type="submit" className="btn-gold inline-flex items-center gap-2">
            <Plus size={16} /> Add Module
          </button>
        </form>
      </SectionCard>

      <div className="mt-6 space-y-4">
        {state.modules.length === 0 && (
          <EmptyState icon={BookOpen} title="No modules yet" message="Add your first module above to start building this course." />
        )}
        {state.modules.map((module) => (
          <ModuleCard key={module.id} module={module} onChanged={load} />
        ))}
      </div>
    </>
  );
}
