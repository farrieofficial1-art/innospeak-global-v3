import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, X } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import TextField from '../../components/ui/TextField.jsx';
import SelectField from '../../components/ui/SelectField.jsx';
import { createCourse, uploadCourseThumbnail } from '../../lib/supabase/lms';

const CATEGORY_OPTIONS = [
  'Business', 'Technology', 'Communication', 'Leadership', 'Soft Skills',
  'Languages', 'Science', 'Mathematics', 'Arts', 'Health', 'Other',
];

const LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'all_levels', label: 'All Levels' },
];

const LANGUAGE_OPTIONS = [
  'English', 'Swahili', 'French', 'Arabic', 'Spanish', 'German', 'Chinese', 'Portuguese',
];

const emptyForm = {
  title: '', code: '', description: '', category: '', level: 'beginner',
  duration: '', language: 'English', requirements: '',
};

export default function CreateCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [outcomes, setOutcomes] = useState(['']);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function updateOutcome(idx, value) {
    setOutcomes((prev) => prev.map((o, i) => (i === idx ? value : o)));
  }

  function addOutcome() {
    setOutcomes((prev) => [...prev, '']);
  }

  function removeOutcome(idx) {
    setOutcomes((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleThumbnail(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailUploading(true);
    try {
      const url = await uploadCourseThumbnail(null, file);
      setThumbnailUrl(url);
    } catch {
      setError('Could not upload thumbnail. Please try again.');
    } finally {
      setThumbnailUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);
    setError(null);
    try {
      const cleanOutcomes = outcomes.map((o) => o.trim()).filter(Boolean);
      const course = await createCourse({
        title: form.title,
        code: form.code || null,
        description: form.description || null,
        category: form.category || null,
        level: form.level,
        duration: form.duration || null,
        language: form.language,
        requirements: form.requirements || null,
        learning_outcomes: cleanOutcomes,
        thumbnail_path: thumbnailUrl || null,
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
        <p className="mt-2 font-body text-sm text-navy-500">Set up a new course with all the details. You can build out modules and lessons after creating it.</p>
      </div>

      <div className="mt-6 max-w-3xl">
        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 font-body text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thumbnail */}
          <SectionCard title="Course Thumbnail">
            <div className="flex items-center gap-4">
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt="Thumbnail" className="h-24 w-40 rounded-xl object-cover border border-navy-100" />
              ) : (
                <div className="flex h-24 w-40 items-center justify-center rounded-xl border-2 border-dashed border-navy-100 bg-cream">
                  <Upload size={20} className="text-navy-300" />
                </div>
              )}
              <div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-navy-200 px-4 py-2 font-body text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-50">
                  <Upload size={15} />
                  {thumbnailUploading ? 'Uploading…' : 'Upload Thumbnail'}
                  <input type="file" accept="image/*" className="sr-only" onChange={handleThumbnail} disabled={thumbnailUploading} />
                </label>
                <p className="mt-1 font-body text-xs text-navy-400">Recommended: 1280×720px, JPG or PNG</p>
              </div>
            </div>
          </SectionCard>

          {/* Basic Info */}
          <SectionCard title="Course Details">
            <div className="space-y-4">
              <TextField label="Course Title" name="title" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Introduction to Public Speaking" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Course Code" name="code" optional value={form.code} onChange={(e) => update('code', e.target.value)} placeholder="e.g. PS-101" />
                <SelectField label="Category" name="category" value={form.category} onChange={(e) => update('category', e.target.value)} options={CATEGORY_OPTIONS} />
              </div>
              <div>
                <label className="font-body text-sm font-bold tracking-wide text-navy-900">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={4}
                  placeholder="A comprehensive summary of what students will learn in this course..."
                  className="mt-2 w-full rounded-2xl border border-navy-100 bg-white px-5 py-4 font-body text-sm text-navy-900 shadow-sm transition-all duration-300 placeholder:text-navy-400 focus:border-gold-500 focus:outline-none focus:ring-4 focus:ring-gold-500/20"
                />
              </div>
            </div>
          </SectionCard>

          {/* Course Meta */}
          <SectionCard title="Course Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Level" name="level" value={form.level} onChange={(e) => update('level', e.target.value)} options={LEVEL_OPTIONS} />
              <SelectField label="Language" name="language" value={form.language} onChange={(e) => update('language', e.target.value)} options={LANGUAGE_OPTIONS} />
              <TextField label="Duration" name="duration" optional value={form.duration} onChange={(e) => update('duration', e.target.value)} placeholder="e.g. 6 weeks, 20 hours" />
              <TextField label="Course Code" name="code_dup" optional value={form.code} onChange={() => {}} placeholder="" className="hidden" />
            </div>
          </SectionCard>

          {/* Requirements */}
          <SectionCard title="Entry Requirements">
            <div>
              <label className="font-body text-sm font-bold tracking-wide text-navy-900">Prerequisites & Requirements</label>
              <p className="mt-0.5 font-body text-xs text-navy-400">What should students know or have before starting this course?</p>
              <textarea
                value={form.requirements}
                onChange={(e) => update('requirements', e.target.value)}
                rows={3}
                placeholder="e.g. Basic English proficiency, access to a computer with internet..."
                className="mt-2 w-full rounded-2xl border border-navy-100 bg-white px-5 py-4 font-body text-sm text-navy-900 shadow-sm transition-all duration-300 placeholder:text-navy-400 focus:border-gold-500 focus:outline-none focus:ring-4 focus:ring-gold-500/20"
              />
            </div>
          </SectionCard>

          {/* Learning Outcomes */}
          <SectionCard title="Learning Outcomes" description="What will students be able to do after completing this course?">
            <div className="space-y-3">
              {outcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gold-500/10 font-body text-xs font-bold text-gold-700">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => updateOutcome(idx, e.target.value)}
                    placeholder="e.g. Deliver a confident 10-minute presentation to an audience"
                    className="flex-1 rounded-xl border border-navy-100 bg-white px-4 py-2.5 font-body text-sm text-navy-900 shadow-sm transition-all duration-300 placeholder:text-navy-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                  />
                  {outcomes.length > 1 && (
                    <button type="button" onClick={() => removeOutcome(idx)} className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-navy-400 hover:bg-rose-50 hover:text-rose-500">
                      <X size={15} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addOutcome} className="inline-flex items-center gap-2 rounded-xl border border-dashed border-navy-200 px-4 py-2 font-body text-sm font-semibold text-navy-600 transition-colors hover:border-gold-300 hover:bg-gold-50">
                <Plus size={15} />
                Add Outcome
              </button>
            </div>
          </SectionCard>

          {/* Submit */}
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-gold inline-flex items-center justify-center gap-2 disabled:opacity-60">
              <Plus size={16} />
              {saving ? 'Creating…' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
