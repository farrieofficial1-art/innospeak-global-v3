import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import TextField from '../../components/ui/TextField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { createCourse } from '../../lib/supabase/lms';

const emptyForm = { title: '', code: '', description: '' };

export default function CreateCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);
    setError(null);
    try {
      const course = await createCourse({
        ...form,
        code: form.code || null,
        description: form.description || null,
      });
      navigate(`/teach/courses/${course.id}`);
    } catch {
      setError('Could not create this course. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Seo title="Create Course" description="Create a new course." path="/teach/create-course" />

      <div>
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Teach</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">Create Course</h1>
        <p className="mt-2 font-body text-sm text-navy-500">Set up a new course. You can build out modules, lessons, and assignments after creating it.</p>
      </div>

      <div className="mt-6 max-w-2xl">
        <SectionCard title="Course Details">
          {error && <p className="mb-4 font-body text-sm font-semibold text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField label="Course Title" name="title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Introduction to Public Speaking" required />
            <TextField label="Course Code" name="code" optional value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} placeholder="e.g. PS-101" />
            <div>
              <label className="font-body text-sm font-bold tracking-wide text-navy-900">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={4}
                placeholder="A short summary of what students will learn..."
                className="mt-2 w-full rounded-2xl border border-navy-100 bg-white px-5 py-4 font-body text-sm text-navy-900 shadow-sm transition-all duration-300 placeholder:text-navy-400 focus:border-gold-500 focus:outline-none focus:ring-4 focus:ring-gold-500/20"
              />
            </div>
            <button type="submit" disabled={saving} className="btn-gold inline-flex w-full items-center justify-center gap-2 disabled:opacity-60">
              <Plus size={16} />
              {saving ? 'Creating…' : 'Create Course'}
            </button>
          </form>
        </SectionCard>
      </div>
    </>
  );
}
