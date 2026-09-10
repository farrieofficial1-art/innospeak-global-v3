import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Upload } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import { LoadingState, ErrorState } from '../../components/portal/PortalStates.jsx';
import { getAssignment, listMySubmissions, submitAssignment, uploadSubmissionFile } from '../../lib/supabase/lms';

export default function AssignmentView() {
  const { assignmentId } = useParams();
  const [state, setState] = useState({ loading: true, error: null, assignment: null, submissions: [] });
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    Promise.all([getAssignment(assignmentId), listMySubmissions(assignmentId)])
      .then(([assignment, submissions]) => setState({ loading: false, error: null, assignment, submissions }))
      .catch((err) => setState({ loading: false, error: err.message || 'Could not load this assignment.', assignment: null, submissions: [] }));
  }, [assignmentId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      let fileUrl = null;
      if (file) fileUrl = await uploadSubmissionFile(assignmentId, file);
      const attemptNumber = state.submissions.length + 1;
      const isLate = state.assignment.due_at ? new Date() > new Date(state.assignment.due_at) : false;
      await submitAssignment(assignmentId, { fileUrl, comment, attemptNumber, isLate });
      setFile(null);
      setComment('');
      load();
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message || 'Could not submit this assignment.' }));
    } finally {
      setSubmitting(false);
    }
  }

  if (state.loading) return <LoadingState />;
  if (state.error && !state.assignment) return <ErrorState message={state.error} />;

  const { assignment, submissions } = state;
  const latest = submissions[0];
  const attemptsUsed = submissions.length;
  const canSubmit = attemptsUsed < assignment.max_attempts && (!latest || latest.status === 'returned_for_resubmission' || attemptsUsed === 0 || assignment.max_attempts > attemptsUsed);
  const isPastDue = assignment.due_at ? new Date() > new Date(assignment.due_at) : false;
  const blockedByDueDate = isPastDue && !assignment.allow_late_submission;

  return (
    <>
      <Seo title={assignment.title} description="Assignment." path={`/learn/assignments/${assignmentId}`} />

      <Link to={`/learn/courses/${assignment.modules.course_id}`} className="font-body text-sm font-semibold text-navy-500 hover:text-navy-800">
        ← Back to course
      </Link>

      <SectionCard title={assignment.title} className="mt-4">
        {assignment.instructions && <p className="font-body text-sm text-navy-700 whitespace-pre-wrap">{assignment.instructions}</p>}
        <div className="mt-3 flex flex-wrap gap-4 font-body text-xs text-navy-500">
          <span>Max marks: {assignment.max_marks}</span>
          {assignment.due_at && <span>Due: {new Date(assignment.due_at).toLocaleString()}</span>}
          <span>Attempts: {attemptsUsed} / {assignment.max_attempts}</span>
        </div>

        {state.error && <div className="mt-4"><ErrorState message={state.error} /></div>}

        {submissions.length > 0 && (
          <div className="mt-6 border-t border-navy-100 pt-4">
            <p className="font-body text-sm font-semibold text-navy-900">Your Submissions</p>
            <div className="mt-2 space-y-2">
              {submissions.map((s) => (
                <div key={s.id} className="rounded-lg bg-navy-50/60 px-3 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-navy-800">Attempt {s.attempt_number} — {new Date(s.submitted_at).toLocaleString()}</span>
                    <span className="font-body text-xs font-semibold text-gold-700">{s.status}</span>
                  </div>
                  {s.status === 'graded' && (
                    <p className="mt-1 font-body text-sm text-emerald-700">Score: {s.score} / {assignment.max_marks}</p>
                  )}
                  {s.feedback && <p className="mt-1 font-body text-sm text-navy-600">Feedback: {s.feedback}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {blockedByDueDate ? (
          <p className="mt-6 font-body text-sm text-rose-600">The due date has passed and late submissions are not allowed for this assignment.</p>
        ) : attemptsUsed >= assignment.max_attempts ? (
          <p className="mt-6 font-body text-sm text-navy-500">You have used all allowed attempts for this assignment.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t border-navy-100 pt-6">
            <div>
              <label className="font-body text-sm font-bold text-navy-900">File{assignment.allowed_file_types ? ` (${assignment.allowed_file_types})` : ''}</label>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-2 block font-body text-sm" />
            </div>
            <div>
              <label className="font-body text-sm font-bold text-navy-900">Comment (optional)</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-navy-200 px-3 py-2 font-body text-sm" />
            </div>
            <button type="submit" disabled={submitting} className="btn-gold inline-flex items-center gap-2 disabled:opacity-60">
              <Upload size={16} /> {submitting ? 'Submitting…' : 'Submit Assignment'}
            </button>
          </form>
        )}
      </SectionCard>
    </>
  );
}
