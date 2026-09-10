import { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  FileDown,
  UploadCloud,
  X,
  ChevronDown,
  ChevronUp,
  TriangleAlert,
} from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/portal/PortalStates.jsx';
import { COURSES } from '../../lib/data/programmeData';
import {
  listLessonsForCourseAdmin,
  createLesson,
  updateLesson,
  deleteLesson,
  listMaterialsForLessonAdmin,
  createMaterial,
  deleteMaterial,
  uploadCourseFile,
} from '../../lib/supabase/admin';

const EMPTY_FORM = { title: '', description: '', content: '', duration_minutes: '', position: '' };

export default function AdminCourseContent() {
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formMode, setFormMode] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [videoFile, setVideoFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const [materialsByLesson, setMaterialsByLesson] = useState({});
  const [materialForm, setMaterialForm] = useState({ title: '', file: null });
  const [isSavingMaterial, setIsSavingMaterial] = useState(false);

  const matches = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return COURSES.filter((c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [search]);

  async function selectCourse(course) {
    setSelectedCourse(course);
    setSearch('');
    setFormMode(null);
    setExpandedLessonId(null);
    setIsLoading(true);
    setError(null);
    try {
      const rows = await listLessonsForCourseAdmin(course.code);
      setLessons(rows);
    } catch (err) {
      setError(err.message || 'Could not load lessons for this course.');
    } finally {
      setIsLoading(false);
    }
  }

  function startCreate() {
    setForm({ ...EMPTY_FORM, position: String(lessons.length + 1) });
    setVideoFile(null);
    setFormMode('create');
  }

  function startEdit(lesson) {
    setForm({
      title: lesson.title || '',
      description: lesson.description || '',
      content: lesson.content || '',
      duration_minutes: lesson.duration_minutes ?? '',
      position: lesson.position ?? '',
    });
    setVideoFile(null);
    setFormMode(lesson.id);
  }

  function cancelForm() {
    setFormMode(null);
    setForm(EMPTY_FORM);
    setVideoFile(null);
  }

  async function handleSaveLesson(e) {
    e.preventDefault();
    if (!selectedCourse || !form.title.trim()) return;
    setIsSaving(true);
    setError(null);

    try {
      let videoPath;
      if (videoFile) {
        videoPath = await uploadCourseFile(selectedCourse.code, videoFile);
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        content: form.content.trim() || null,
        duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
        position: form.position ? Number(form.position) : lessons.length + 1,
      };
      if (videoPath) payload.video_path = videoPath;

      if (formMode === 'create') {
        const created = await createLesson({ ...payload, course_code: selectedCourse.code });
        setLessons((prev) => [...prev, created].sort((a, b) => a.position - b.position));
      } else {
        await updateLesson(formMode, payload);
        setLessons((prev) =>
          prev
            .map((l) => (l.id === formMode ? { ...l, ...payload } : l))
            .sort((a, b) => a.position - b.position)
        );
      }
      cancelForm();
    } catch (err) {
      setError(err.message || 'Could not save this lesson.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteLesson(lessonId) {
    if (!window.confirm('Delete this lesson? This also removes its materials list (uploaded files stay in storage).')) return;
    try {
      await deleteLesson(lessonId);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (err) {
      setError(err.message || 'Could not delete this lesson.');
    }
  }

  async function toggleMaterials(lessonId) {
    if (expandedLessonId === lessonId) {
      setExpandedLessonId(null);
      return;
    }
    setExpandedLessonId(lessonId);
    setMaterialForm({ title: '', file: null });
    if (!materialsByLesson[lessonId]) {
      try {
        const rows = await listMaterialsForLessonAdmin(lessonId);
        setMaterialsByLesson((prev) => ({ ...prev, [lessonId]: rows }));
      } catch (err) {
        setError(err.message || 'Could not load materials.');
      }
    }
  }

  async function handleAddMaterial(e, lessonId) {
    e.preventDefault();
    if (!materialForm.title.trim() || !materialForm.file || !selectedCourse) return;
    setIsSavingMaterial(true);
    setError(null);
    try {
      const path = await uploadCourseFile(selectedCourse.code, materialForm.file);
      const created = await createMaterial({
        lesson_id: lessonId,
        title: materialForm.title.trim(),
        file_path: path,
        file_type: materialForm.file.type || null,
      });
      setMaterialsByLesson((prev) => ({
        ...prev,
        [lessonId]: [...(prev[lessonId] || []), created],
      }));
      setMaterialForm({ title: '', file: null });
    } catch (err) {
      setError(err.message || 'Could not upload that material.');
    } finally {
      setIsSavingMaterial(false);
    }
  }

  async function handleDeleteMaterial(lessonId, materialId) {
    try {
      await deleteMaterial(materialId);
      setMaterialsByLesson((prev) => ({
        ...prev,
        [lessonId]: (prev[lessonId] || []).filter((m) => m.id !== materialId),
      }));
    } catch (err) {
      setError(err.message || 'Could not delete that material.');
    }
  }

  return (
    <>
      <Seo title="Course Content" description="Manage lessons, video, and materials." path="/admin/content" />

      <div>
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Staff Panel</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">Course Content</h1>
        <p className="mt-2 font-body text-sm text-navy-500">
          Search any Academy or Labs course, then add lessons with video and downloadable materials.
        </p>
      </div>

      <div className="relative mt-6 max-w-lg">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
        <input
          type="text"
          value={selectedCourse ? `${selectedCourse.code} — ${selectedCourse.name}` : search}
          onChange={(e) => {
            setSelectedCourse(null);
            setSearch(e.target.value);
          }}
          placeholder="Search by course code or name…"
          className="w-full rounded-xl border border-navy-100 bg-white py-2.5 pl-10 pr-4 font-body text-sm text-navy-900 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
        />
        {matches.length > 0 && (
          <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-navy-100 bg-white shadow-premium-lg">
            {matches.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => selectCourse(c)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left font-body text-sm hover:bg-gold-500/5"
              >
                <span className="text-navy-800">{c.name}</span>
                <span className="text-xs text-navy-400">{c.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedCourse && (
        <div className="mt-6">
          <SectionCard
            title={`Lessons — ${selectedCourse.name}`}
            description={selectedCourse.code}
            action={
              <button type="button" onClick={startCreate} className="btn-gold inline-flex items-center gap-1.5">
                <Plus size={15} />
                Add Lesson
              </button>
            }
          >
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-gold-300 bg-gold-50 px-4 py-3 font-body text-sm text-navy-800">
                <TriangleAlert size={16} className="mt-0.5 shrink-0 text-gold-700" />
                <span>{error}</span>
              </div>
            )}

            {formMode && (
              <form
                onSubmit={handleSaveLesson}
                className="mb-5 space-y-3 rounded-xl border border-gold-300/60 bg-gold-50/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-body text-sm font-semibold text-navy-900">
                    {formMode === 'create' ? 'New Lesson' : 'Edit Lesson'}
                  </h3>
                  <button type="button" onClick={cancelForm} className="text-navy-400 hover:text-navy-700">
                    <X size={16} />
                  </button>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Lesson title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-lg border border-navy-100 bg-white px-3 py-2 font-body text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
                />
                <input
                  type="text"
                  placeholder="Short description (optional)"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-lg border border-navy-100 bg-white px-3 py-2 font-body text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
                />
                <textarea
                  placeholder="Lesson notes / text content (optional)"
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-navy-100 bg-white px-3 py-2 font-body text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    placeholder="Duration (min)"
                    value={form.duration_minutes}
                    onChange={(e) => setForm((f) => ({ ...f, duration_minutes: e.target.value }))}
                    className="w-full rounded-lg border border-navy-100 bg-white px-3 py-2 font-body text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Order (position)"
                    value={form.position}
                    onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                    className="w-full rounded-lg border border-navy-100 bg-white px-3 py-2 font-body text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-navy-200 px-3 py-2.5 font-body text-sm text-navy-500 hover:border-gold-300">
                  <UploadCloud size={16} className="shrink-0" />
                  {videoFile ? videoFile.name : 'Upload a video (optional, replaces existing if set)'}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>

                <button type="submit" disabled={isSaving} className="btn-gold w-full disabled:opacity-60">
                  {isSaving ? 'Saving…' : 'Save Lesson'}
                </button>
              </form>
            )}

            {isLoading && <LoadingState />}

            {!isLoading && lessons.length === 0 && !formMode && (
              <EmptyState title="No lessons yet" message="Click 'Add Lesson' to create the first one." />
            )}

            {!isLoading && lessons.length > 0 && (
              <ul className="divide-y divide-navy-50 rounded-xl border border-navy-100">
                {lessons.map((lesson) => (
                  <li key={lesson.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-body text-sm font-semibold text-navy-900">
                          {lesson.position}. {lesson.title}
                        </p>
                        {lesson.description && (
                          <p className="mt-0.5 font-body text-xs text-navy-500">{lesson.description}</p>
                        )}
                        <div className="mt-1 flex items-center gap-3 font-body text-xs text-navy-400">
                          {lesson.duration_minutes && <span>{lesson.duration_minutes} min</span>}
                          <span>{lesson.video_path ? 'Video attached' : 'No video'}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(lesson)}
                          aria-label="Edit lesson"
                          className="rounded-lg p-2 text-navy-400 hover:bg-navy-50 hover:text-navy-700"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLesson(lesson.id)}
                          aria-label="Delete lesson"
                          className="rounded-lg p-2 text-navy-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleMaterials(lesson.id)}
                          className="ml-1 flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-body text-xs font-semibold text-navy-600 hover:bg-navy-50"
                        >
                          Materials
                          {expandedLessonId === lesson.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      </div>
                    </div>

                    {expandedLessonId === lesson.id && (
                      <div className="mt-4 rounded-lg border border-navy-100 bg-navy-50/40 p-3">
                        {(materialsByLesson[lesson.id] || []).map((m) => (
                          <div key={m.id} className="flex items-center justify-between gap-2 py-1.5">
                            <span className="flex items-center gap-1.5 font-body text-xs text-navy-700">
                              <FileDown size={13} className="text-gold-600" />
                              {m.title}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteMaterial(lesson.id, m.id)}
                              className="text-navy-400 hover:text-rose-600"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                        {(materialsByLesson[lesson.id] || []).length === 0 && (
                          <p className="py-1 font-body text-xs text-navy-400">No materials yet.</p>
                        )}

                        <form
                          onSubmit={(e) => handleAddMaterial(e, lesson.id)}
                          className="mt-2 flex flex-col gap-2 border-t border-navy-100 pt-3 sm:flex-row sm:items-center"
                        >
                          <input
                            type="text"
                            placeholder="Material title"
                            value={materialForm.title}
                            onChange={(e) => setMaterialForm((f) => ({ ...f, title: e.target.value }))}
                            className="flex-1 rounded-lg border border-navy-100 bg-white px-3 py-1.5 font-body text-xs focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
                          />
                          <input
                            type="file"
                            onChange={(e) => setMaterialForm((f) => ({ ...f, file: e.target.files?.[0] || null }))}
                            className="font-body text-xs"
                          />
                          <button
                            type="submit"
                            disabled={isSavingMaterial}
                            className="btn-outline shrink-0 !px-3 !py-1.5 !text-xs disabled:opacity-60"
                          >
                            {isSavingMaterial ? 'Uploading…' : 'Add'}
                          </button>
                        </form>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      )}
    </>
  );
}