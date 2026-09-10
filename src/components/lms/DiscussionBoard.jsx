import { useEffect, useState, useCallback } from 'react';
import { MessageSquare, Pin, Lock, Plus } from 'lucide-react';
import SectionCard from '../portal/SectionCard.jsx';
import { LoadingState, EmptyState } from '../portal/PortalStates.jsx';
import { listDiscussions, createDiscussion, listReplies, replyToDiscussion, setDiscussionState } from '../../lib/supabase/lms';

function Thread({ discussion, isInstructor, onChanged }) {
  const [replies, setReplies] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [replyText, setReplyText] = useState('');

  const load = useCallback(() => {
    listReplies(discussion.id).then((r) => {
      setReplies(r);
      setLoaded(true);
    });
  }, [discussion.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleReply(e) {
    e.preventDefault();
    if (!replyText) return;
    await replyToDiscussion(discussion.id, replyText, isInstructor);
    setReplyText('');
    load();
  }

  return (
    <div className="rounded-xl border border-navy-100 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="flex items-center gap-2 font-body text-sm font-semibold text-navy-900">
            {discussion.is_pinned && <Pin size={13} className="text-gold-600" />}
            {discussion.is_closed && <Lock size={13} className="text-navy-400" />}
            {discussion.title}
          </p>
          <p className="mt-1 font-body text-xs text-navy-400">{discussion.profiles?.full_name || 'Student'} · {new Date(discussion.created_at).toLocaleDateString()}</p>
          {discussion.body && <p className="mt-2 font-body text-sm text-navy-700">{discussion.body}</p>}
        </div>
        {isInstructor && (
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => setDiscussionState(discussion.id, { is_pinned: !discussion.is_pinned }).then(onChanged)} className="font-body text-xs text-navy-400 hover:text-gold-700">
              {discussion.is_pinned ? 'Unpin' : 'Pin'}
            </button>
            <button type="button" onClick={() => setDiscussionState(discussion.id, { is_closed: !discussion.is_closed }).then(onChanged)} className="font-body text-xs text-navy-400 hover:text-gold-700">
              {discussion.is_closed ? 'Reopen' : 'Close'}
            </button>
          </div>
        )}
      </div>

      {loaded && replies.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-navy-50 pt-3">
          {replies.map((r) => (
            <div key={r.id} className={`rounded-lg px-3 py-2 ${r.is_instructor_reply ? 'bg-gold-500/5' : 'bg-navy-50/60'}`}>
              <p className="font-body text-xs font-semibold text-navy-700">
                {r.profiles?.full_name || 'User'} {r.is_instructor_reply && <span className="text-gold-700">(Instructor)</span>}
              </p>
              <p className="mt-0.5 font-body text-sm text-navy-800">{r.body}</p>
            </div>
          ))}
        </div>
      )}

      {!discussion.is_closed && (
        <form onSubmit={handleReply} className="mt-3 flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply…"
            className="flex-1 rounded-lg border border-navy-200 px-3 py-2 font-body text-sm"
          />
          <button type="submit" className="btn-outline text-xs">Reply</button>
        </form>
      )}
    </div>
  );
}

export default function DiscussionBoard({ courseId, isInstructor }) {
  const [state, setState] = useState({ loading: true, discussions: [] });
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });

  const load = useCallback(() => {
    listDiscussions(courseId).then((discussions) => setState({ loading: false, discussions }));
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title) return;
    await createDiscussion(courseId, form);
    setForm({ title: '', body: '' });
    setShowNew(false);
    load();
  }

  if (state.loading) return <LoadingState />;

  return (
    <SectionCard title="Discussions" className="mt-6">
      <button type="button" onClick={() => setShowNew((v) => !v)} className="btn-outline mb-4 inline-flex items-center gap-2 text-xs">
        <Plus size={13} /> New Discussion
      </button>

      {showNew && (
        <form onSubmit={handleCreate} className="mb-4 space-y-3 rounded-xl border border-navy-100 p-4">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Discussion title"
            className="w-full rounded-lg border border-navy-200 px-3 py-2 font-body text-sm"
            required
          />
          <textarea
            value={form.body}
            onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
            placeholder="What's your question?"
            rows={3}
            className="w-full rounded-lg border border-navy-200 px-3 py-2 font-body text-sm"
          />
          <button type="submit" className="btn-gold text-sm">Post</button>
        </form>
      )}

      {state.discussions.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No discussions yet" message="Be the first to ask a question." />
      ) : (
        <div className="space-y-3">
          {state.discussions.map((d) => (
            <Thread key={d.id} discussion={d} isInstructor={isInstructor} onChanged={load} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
