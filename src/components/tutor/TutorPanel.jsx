import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, TriangleAlert } from 'lucide-react';
import TutorMessageBubble from './TutorMessageBubble';
import TutorTypingIndicator from './TutorTypingIndicator';
import { getPersonaById } from './tutorPersonas';
import { cn } from '../../utils/cn.js';

/**
 * TutorPanel — the chat body shared by TutorWidget (compact) and the
 * /tutor page (full). Presentation-only: all state comes from
 * useTutorChat via props.
 */
export default function TutorPanel({
  personaId,
  messages,
  isSending,
  error,
  onSend,
  variant = 'compact',
}) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);
  const persona = getPersonaById(personaId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!draft.trim() || isSending) return;
    onSend(draft);
    setDraft('');
  }

  function handleStarterClick(prompt) {
    if (isSending) return;
    onSend(prompt);
  }

  const listPadding = variant === 'full' ? 'px-2 py-6 sm:px-4' : 'px-4 py-4';

  return (
    <div className="flex h-full flex-col">
      {/* Message list */}
      <div ref={scrollRef} className={cn('flex-1 space-y-4 overflow-y-auto', listPadding)}>
        {messages.length === 0 && (
          <div className={cn('text-center', variant === 'full' ? 'py-10' : 'py-6')}>
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 ring-1 ring-gold-500/20">
              <Sparkles size={20} />
            </span>
            <p className="mt-3 font-body text-sm text-navy-600">
              Ask the {persona.label.toLowerCase()} tutor anything, or try:
            </p>
            <div className="mx-auto mt-4 flex max-w-md flex-col gap-2">
              {persona.starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleStarterClick(prompt)}
                  className="rounded-xl border border-navy-100 bg-white px-4 py-2.5 text-left font-body text-sm text-navy-700 shadow-premium transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-premium-lg"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <TutorMessageBubble key={m.id} role={m.role} content={m.content} />
        ))}

        {isSending && <TutorTypingIndicator />}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 rounded-xl border border-gold-300 bg-gold-50 px-4 py-3 font-body text-sm text-navy-800"
          >
            <TriangleAlert size={16} className="mt-0.5 shrink-0 text-gold-700" />
            <span>{error}</span>
          </motion.div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-navy-100 bg-white/80 p-3 backdrop-blur-md"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Ask the ${persona.label} tutor\u2026`}
          disabled={isSending}
          className="flex-1 rounded-xl border border-navy-100 bg-white px-4 py-2.5 font-body text-sm text-navy-900 placeholder:text-navy-300 transition-colors duration-200 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 disabled:opacity-60"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSending || !draft.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-gradient text-navy-900 shadow-gold transition-opacity duration-200 disabled:opacity-40"
          aria-label="Send message"
        >
          <Send size={16} />
        </motion.button>
      </form>
    </div>
  );
}