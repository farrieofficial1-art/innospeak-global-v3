import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, CheckCircle2 } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import TextField from '../../components/ui/TextField.jsx';
import SelectField from '../../components/ui/SelectField.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/portal/PortalStates.jsx';
import { getQuizForInstructor, createQuestion } from '../../lib/supabase/lms';
import { supabase } from '../../lib/supabase/client';

const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice (one answer)' },
  { value: 'multiple_response', label: 'Multiple Response (several answers)' },
  { value: 'true_false', label: 'True / False' },
  { value: 'short_answer', label: 'Short Answer' },
];

const emptyQuestionForm = { question_text: '', question_type: 'multiple_choice', marks: 1, correct_short_answer: '' };

export default function QuizEditor() {
  const { quizId } = useParams();
  const [state, setState] = useState({ loading: true, error: null, quiz: null });
  const [form, setForm] = useState(emptyQuestionForm);
  const [options, setOptions] = useState([{ option_text: '', is_correct: false }, { option_text: '', is_correct: false }]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    getQuizForInstructor(quizId)
      .then((quiz) => setState({ loading: false, error: null, quiz }))
      .catch((err) => setState({ loading: false, error: err.message || 'Could not load this quiz.', quiz: null }));
  }, [quizId]);

  useEffect(() => {
    load();
  }, [load]);

  function updateOption(i, fields) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? { ...o, ...fields } : o)));
  }

  async function handleAddQuestion(e) {
    e.preventDefault();
    if (!form.question_text) return;
    setSaving(true);
    try {
      const needsOptions = form.question_type === 'multiple_choice' || form.question_type === 'multiple_response' || form.question_type === 'true_false';
      let questionOptions = [];
      if (form.question_type === 'true_false') {
        questionOptions = [{ option_text: 'True', is_correct: form.true_false_answer === 'true' }, { option_text: 'False', is_correct: form.true_false_answer !== 'true' }];
      } else if (needsOptions) {
        questionOptions = options.filter((o) => o.option_text);
      }
      await createQuestion(
        quizId,
        {
          question_text: form.question_text,
          question_type: form.question_type,
          marks: Number(form.marks),
          position: (state.quiz.questions || []).length,
          correct_short_answer: form.question_type === 'short_answer' ? form.correct_short_answer || null : null,
        },
        questionOptions
      );
      setForm(emptyQuestionForm);
      setOptions([{ option_text: '', is_correct: false }, { option_text: '', is_correct: false }]);
      load();
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message || 'Could not add this question.' }));
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    await supabase.from('quizzes').update({ status: 'published' }).eq('id', quizId);
    load();
  }

  if (state.loading) return <LoadingState />;
  if (state.error) return <ErrorState message={state.error} />;

  const questions = (state.quiz.questions || []).sort((a, b) => a.position - b.position);

  return (
    <>
      <Seo title={state.quiz.title} description="Quiz question editor." path={`/teach/quizzes/${quizId}`} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Teach</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">{state.quiz.title}</h1>
          <p className="mt-1 font-body text-sm text-navy-500">{questions.length} question{questions.length === 1 ? '' : 's'} · {state.quiz.status}</p>
        </div>
        {state.quiz.status === 'draft' && questions.length > 0 && (
          <button type="button" onClick={handlePublish} className="btn-gold inline-flex items-center gap-2">
            <CheckCircle2 size={16} /> Publish Quiz
          </button>
        )}
      </div>

      <SectionCard title="Questions" className="mt-6">
        {questions.length === 0 && <EmptyState title="No questions yet" message="Add your first question below." />}
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q.id} className="rounded-xl border border-navy-100 p-4">
              <p className="font-body text-sm font-semibold text-navy-900">{i + 1}. {q.question_text} <span className="font-normal text-navy-400">({q.marks} marks)</span></p>
              {q.question_options?.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {q.question_options.sort((a, b) => a.position - b.position).map((o) => (
                    <li key={o.id} className={`font-body text-sm ${o.is_correct ? 'font-semibold text-emerald-700' : 'text-navy-600'}`}>
                      {o.is_correct && <CheckCircle2 size={12} className="mr-1 inline" />}
                      {o.option_text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Add Question" className="mt-6">
        <form onSubmit={handleAddQuestion} className="space-y-4">
          <TextField label="Question" name="question_text" value={form.question_text} onChange={(e) => setForm((p) => ({ ...p, question_text: e.target.value }))} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Type" name="question_type" value={form.question_type} options={QUESTION_TYPES} onChange={(e) => setForm((p) => ({ ...p, question_type: e.target.value }))} />
            <TextField label="Marks" name="marks" type="number" value={form.marks} onChange={(e) => setForm((p) => ({ ...p, marks: e.target.value }))} />
          </div>

          {form.question_type === 'true_false' && (
            <SelectField
              label="Correct Answer"
              name="true_false_answer"
              value={form.true_false_answer || ''}
              options={[{ value: 'true', label: 'True' }, { value: 'false', label: 'False' }]}
              onChange={(e) => setForm((p) => ({ ...p, true_false_answer: e.target.value }))}
            />
          )}

          {(form.question_type === 'multiple_choice' || form.question_type === 'multiple_response') && (
            <div className="space-y-2">
              <p className="font-body text-sm font-bold text-navy-900">Options</p>
              {options.map((o, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={o.is_correct}
                    onChange={(e) => updateOption(i, { is_correct: e.target.checked })}
                    className="h-4 w-4 rounded border-navy-300"
                  />
                  <input
                    type="text"
                    value={o.option_text}
                    onChange={(e) => updateOption(i, { option_text: e.target.value })}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 rounded-lg border border-navy-200 px-3 py-2 font-body text-sm"
                  />
                </div>
              ))}
              <button type="button" onClick={() => setOptions((prev) => [...prev, { option_text: '', is_correct: false }])} className="font-body text-xs font-semibold text-gold-700">
                <Plus size={13} className="mr-1 inline" /> Add option
              </button>
            </div>
          )}

          {form.question_type === 'short_answer' && (
            <TextField label="Reference Answer (for auto-grading, exact match)" name="correct_short_answer" optional value={form.correct_short_answer} onChange={(e) => setForm((p) => ({ ...p, correct_short_answer: e.target.value }))} />
          )}

          <button type="submit" disabled={saving} className="btn-gold inline-flex items-center gap-2 disabled:opacity-60">
            <Plus size={16} /> {saving ? 'Adding…' : 'Add Question'}
          </button>
        </form>
      </SectionCard>
    </>
  );
}
