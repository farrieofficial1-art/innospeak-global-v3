import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Plus } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import TextField from '../../components/ui/TextField.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/portal/PortalStates.jsx';
import { listMyCourses, createCourse } from '../../lib/supabase/lms';

const emptyForm = { title: '', code: '', description: '' };

export default function TeachDashboard() {
  const [state, setState] = useState({ loading: true, error: null, courses: [] });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function load() {
    listMyCourses()
      .then((courses) => setState({ loading: false, error: null, courses }))
      .catch((err) => setState({ loading: false, error: err.message || 'Could not load your courses.', courses: [] }));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);
    try {
      // code is UNIQUE in the database and optional in this form — an
      // empty string is a real value to Postgres's uniqueness check
      // ('' = ''), so the second course anyone creates with a blank
      // code would fail. Send null instead when left blank.
      await createCourse({
        ...form,
        code: form.code || null,
        description: form.description || null,
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message || 'Could not create this course.' }));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Seo title="My Courses" description="Build and manage your courses." path="/teach" />

      <div>
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Teach</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">My Courses</h1>
        <p className="mt-2 font-body text-sm text-navy-500">Create a course, then build it out with modules, lessons, assignments and quizzes.</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SectionCard title="New Course" className="lg:col-span-1">
          <form onSubmit={handleCreate} className="space-y-4">
            <TextField label="Title" name="title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Introduction to Electrical Safety" required />
            <TextField label="Course Code" name="code" optional value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} placeholder="e.g. EE-101" />
            <TextField label="Description" name="description" optional value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Short course summary" />
            <button type="submit" disabled={saving} className="btn-gold inline-flex w-full items-center justify-center gap-2 disabled:opacity-60">
              <Plus size={16} />
              {saving ? 'Creating…' : 'Create Course'}
            </button>
          </form>
        </SectionCard>

        <SectionCard title="All Courses" className="lg:col-span-2">
          {state.loading && <LoadingState />}
          {!state.loading && state.error && <ErrorState message={state.error} />}
          {!state.loading && !state.error && state.courses.length === 0 && (
            <EmptyState icon={GraduationCap} title="No courses yet" message="Create your first course using the form on the left." />
          )}
          {!state.loading && !state.error && state.courses.length > 0 && (
            <div className="space-y-3">
              {state.courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/teach/courses/${course.id}`}
                  className="flex items-center justify-between rounded-xl border border-navy-100 px-4 py-3 transition-colors hover:bg-navy-50/60"
                >
                  <div>
                    <p className="font-body text-sm font-semibold text-navy-900">{course.title}</p>
                    <p className="mt-0.5 font-body text-xs text-navy-500">{course.code || 'No code'} · {course.status}</p>
                  </div>
                  <span className="font-body text-xs font-semibold text-gold-700">Open →</span>
                </Link>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </>
  );
}
