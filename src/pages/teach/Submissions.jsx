import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FileCheck2, Users, Megaphone, Plus, BarChart3 } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/portal/PortalStates.jsx';
import DiscussionBoard from '../../components/lms/DiscussionBoard.jsx';
import {
  getCourse,
  listModulesWithLessons,
  listModuleAssignments,
  listAssignmentSubmissions,
  gradeSubmission,
  listCourseEnrollments,
  listCourseAnnouncements,
  createAnnouncement,
  getCourseAnalytics,
} from '../../lib/supabase/lms';

function GradeRow({ submission, maxMarks, onGraded }) {
  const [score, setScore] = useState(submission.score ?? '');
  const [feedback, setFeedback] = useState(submission.feedback ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await gradeSubmission(submission.id, { score: Number(score), feedback });
      onGraded();
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="border-t border-navy-50">
      <td className="px-4 py-3 font-body text-sm text-navy-800">{submission.profiles?.full_name || submission.student_id}</td>
      <td className="px-4 py-3 font-body text-sm text-navy-500">{new Date(submission.submitted_at).toLocaleString()}</td>
      <td className="px-4 py-3">
        {submission.file_url ? (
          <a href={submission.file_url} target="_blank" rel="noreferrer" className="font-body text-xs font-semibold text-gold-700 hover:underline">
            View file
          </a>
        ) : (
          <span className="font-body text-xs text-navy-400">No file</span>
        )}
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={score}
          max={maxMarks}
          onChange={(e) => setScore(e.target.value)}
          className="w-20 rounded-lg border border-navy-200 px-2 py-1 font-body text-sm"
        />
        <span className="ml-1 font-body text-xs text-navy-400">/ {maxMarks}</span>
      </td>
      <td className="px-4 py-3">
        <input
          type="text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Feedback…"
          className="w-full min-w-[10rem] rounded-lg border border-navy-200 px-2 py-1 font-body text-sm"
        />
      </td>
      <td className="px-4 py-3">
        <button type="button" onClick={handleSave} disabled={saving || score === ''} className="btn-gold text-xs disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Grade'}
        </button>
      </td>
    </tr>
  );
}

function AssignmentGrading({ assignment }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    listAssignmentSubmissions(assignment.id)
      .then(setSubmissions)
      .finally(() => setLoading(false));
  }, [assignment.id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingState />;

  return (
    <SectionCard title={assignment.title} description={`${submissions.length} submission(s)`} className="mt-4">
      {submissions.length === 0 ? (
        <EmptyState icon={FileCheck2} title="No submissions yet" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-navy-100">
          <table className="min-w-full divide-y divide-navy-100 font-body text-sm">
            <thead className="bg-navy-50/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-navy-500">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-navy-500">Submitted</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-navy-500">File</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-navy-500">Score</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-navy-500">Feedback</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <GradeRow key={s.id} submission={s} maxMarks={assignment.max_marks} onGraded={load} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

export default function Submissions() {
  const { courseId } = useParams();
  const [state, setState] = useState({ loading: true, error: null, course: null, assignments: [], enrollments: [] });
  const [announcements, setAnnouncements] = useState([]);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', body: '' });
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  const loadAnnouncements = useCallback(() => {
    listCourseAnnouncements(courseId).then(setAnnouncements).catch(() => {});
  }, [courseId]);

  useEffect(() => {
    Promise.all([getCourse(courseId), listModulesWithLessons(courseId), listCourseEnrollments(courseId)])
      .then(async ([course, modules, enrollments]) => {
        const perModule = await Promise.all(modules.map((m) => listModuleAssignments(m.id)));
        setState({ loading: false, error: null, course, assignments: perModule.flat(), enrollments });
      })
      .catch((err) => setState({ loading: false, error: err.message || 'Could not load submissions.', course: null, assignments: [], enrollments: [] }));
    loadAnnouncements();
    getCourseAnalytics(courseId).then(setAnalytics).catch(() => {});
  }, [courseId, loadAnnouncements]);

  async function handlePostAnnouncement(e) {
    e.preventDefault();
    if (!announcementForm.title) return;
    await createAnnouncement(courseId, announcementForm);
    setAnnouncementForm({ title: '', body: '' });
    setShowAnnouncementForm(false);
    loadAnnouncements();
  }

  if (state.loading) return <LoadingState />;
  if (state.error) return <ErrorState message={state.error} />;

  return (
    <>
      <Seo title={`${state.course.title} — Grading`} description="Grade student submissions." path={`/teach/courses/${courseId}/submissions`} />

      <div>
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Teach</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">{state.course.title}</h1>
      </div>

      {analytics && (
        <SectionCard title="Course Analytics" className="mt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="font-display text-2xl font-bold text-navy-900">{analytics.enrolled}</p>
              <p className="font-body text-xs text-navy-500">Enrolled</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-navy-900">{analytics.completion_rate_percent}%</p>
              <p className="font-body text-xs text-navy-500">Completion Rate</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-navy-900">{analytics.avg_progress_percent}%</p>
              <p className="font-body text-xs text-navy-500">Avg Progress</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-navy-900">{analytics.avg_quiz_score_percent}%</p>
              <p className="font-body text-xs text-navy-500">Avg Quiz Score</p>
            </div>
          </div>
          {analytics.students_needing_attention?.length > 0 && (
            <div className="mt-4 rounded-xl bg-rose-50 p-3">
              <p className="font-body text-xs font-semibold text-rose-800">
                <BarChart3 size={13} className="mr-1 inline" />
                {analytics.students_needing_attention.length} student(s) may need attention (enrolled 14+ days, under 20% progress)
              </p>
            </div>
          )}
        </SectionCard>
      )}

      <SectionCard title="Announcements" className="mt-6">
        <button type="button" onClick={() => setShowAnnouncementForm((v) => !v)} className="btn-outline mb-4 inline-flex items-center gap-2 text-xs">
          <Plus size={13} /> Post Announcement
        </button>
        {showAnnouncementForm && (
          <form onSubmit={handlePostAnnouncement} className="mb-4 space-y-3 rounded-xl border border-navy-100 p-4">
            <input
              type="text"
              value={announcementForm.title}
              onChange={(e) => setAnnouncementForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Announcement title"
              className="w-full rounded-lg border border-navy-200 px-3 py-2 font-body text-sm"
              required
            />
            <textarea
              value={announcementForm.body}
              onChange={(e) => setAnnouncementForm((p) => ({ ...p, body: e.target.value }))}
              placeholder="Message to enrolled students…"
              rows={3}
              className="w-full rounded-lg border border-navy-200 px-3 py-2 font-body text-sm"
            />
            <button type="submit" className="btn-gold text-sm">Post to Class</button>
          </form>
        )}
        {announcements.length === 0 ? (
          <EmptyState icon={Megaphone} title="No announcements yet" />
        ) : (
          <div className="space-y-2">
            {announcements.map((a) => (
              <div key={a.id} className="rounded-lg bg-gold-500/5 px-3 py-3">
                <p className="font-body text-sm font-semibold text-navy-900">{a.title}</p>
                <p className="mt-1 font-body text-sm text-navy-700">{a.body}</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Enrolled Students" className="mt-6">
        {state.enrollments.length === 0 ? (
          <EmptyState icon={Users} title="No students enrolled yet" />
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {state.enrollments.map((e) => (
              <li key={e.id} className="rounded-lg bg-navy-50/60 px-3 py-2 font-body text-sm text-navy-800">
                {e.profiles?.full_name || e.student_id} <span className="text-xs text-navy-400">— {e.status}</span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <div className="mt-6">
        <h2 className="font-display text-lg font-bold text-navy-900">Assignment Submissions</h2>
        {state.assignments.length === 0 && <p className="mt-2 font-body text-sm text-navy-500">No assignments in this course yet.</p>}
        {state.assignments.map((a) => (
          <AssignmentGrading key={a.id} assignment={a} />
        ))}
      </div>

      <DiscussionBoard courseId={courseId} isInstructor />
    </>
  );
}
