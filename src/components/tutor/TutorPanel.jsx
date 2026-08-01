import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, TriangleAlert, Paperclip, Mic, X } from 'lucide-react';
import TutorMessageBubble from './TutorMessageBubble';
import TutorTypingIndicator from './TutorTypingIndicator';
import { getPersonaById } from './tutorPersonas';
import { cn } from '../../utils/cn.js';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../../hooks/useSpeechSynthesis';
import {
  fileToAttachment,
  MAX_ATTACHMENTS,
  formatFileSize,
  MAX_FILE_SIZE_BYTES,
} from '../../lib/tutor/attachments';

/**
 * TutorPanel — the chat body shared by TutorWidget (compact) and the
 * /tutor page (full). Presentation-only for conversation state (all of
 * that comes from useTutorChat via props); owns its own local state for
 * the composer: draft text, pending attachments, mic listening, and which
 * reply (if any) is currently being read aloud.
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
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [attachError, setAttachError] = useState(null);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const persona = getPersonaById(personaId);

  const { isSupported: micSupported, isListening, start: startListening, stop: stopListening } =
    useSpeechRecognition({
      onResult: (transcript) => {
        setDraft((prev) => (prev ? `${prev} ${transcript}` : transcript));
      },
    });

  const { isSupported: speechSupported, speakingId, speak } = useSpeechSynthesis();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  function handleSubmit(e) {
    e.preventDefault();
    if ((!draft.trim() && pendingAttachments.length === 0) || isSending) return;
    onSend(draft, pendingAttachments);
    setDraft('');
    setPendingAttachments([]);
  }

  function handleStarterClick(prompt) {
    if (isSending) return;
    onSend(prompt, []);
  }

  async function handleFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // allow re-selecting the same file later
    if (files.length === 0) return;

    setAttachError(null);
    const room = MAX_ATTACHMENTS - pendingAttachments.length;
    if (room <= 0) {
      setAttachError(`You can attach up to ${MAX_ATTACHMENTS} files at a time.`);
      return;
    }

    const toProcess = files.slice(0, room);
    const results = await Promise.allSettled(toProcess.map(fileToAttachment));

    const successes = [];
    let firstError = null;
    for (const r of results) {
      if (r.status === 'fulfilled') successes.push(r.value);
      else firstError = firstError || r.reason?.message;
    }

    if (successes.length > 0) {
      setPendingAttachments((prev) => [...prev, ...successes]);
    }
    if (firstError) setAttachError(firstError);
  }

  function removeAttachment(id) {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  function toggleMic() {
    if (isListening) stopListening();
    else startListening();
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
          <TutorMessageBubble
            key={m.id}
            id={m.id}
            role={m.role}
            content={m.content}
            attachments={m.attachments}
            isSpeaking={speechSupported && speakingId === m.id}
            onToggleSpeak={speechSupported ? speak : undefined}
          />
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
      <div className="border-t border-navy-100 bg-white/80 backdrop-blur-md">
        {pendingAttachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pt-3">
            {pendingAttachments.map((a) => (
              <div key={a.id} className="group relative h-14 w-14 shrink-0">
                <div className="h-full w-full overflow-hidden rounded-lg border border-navy-100 shadow-premium">
                  {a.kind === 'video' ? (
                    <video src={a.previewUrl} className="h-full w-full object-cover" />
                  ) : (
                    <img src={a.previewUrl} alt={a.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(a.id)}
                  aria-label={`Remove ${a.name}`}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-900 text-white shadow-premium transition-transform duration-150 hover:scale-110"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        )}

        {attachError && (
          <p className="px-3 pt-2 font-body text-[11px] text-gold-700">{attachError}</p>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending || pendingAttachments.length >= MAX_ATTACHMENTS}
            aria-label="Attach an image or video"
            title={`Attach an image or video (max ${formatFileSize(MAX_FILE_SIZE_BYTES)} each)`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-navy-400 transition-colors duration-200 hover:bg-navy-50 hover:text-navy-700 disabled:opacity-40"
          >
            <Paperclip size={17} />
          </button>

          {micSupported && (
            <button
              type="button"
              onClick={toggleMic}
              disabled={isSending}
              aria-label={isListening ? 'Stop voice input' : 'Speak your question'}
              className={cn(
                'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 disabled:opacity-40',
                isListening
                  ? 'bg-gold-500/10 text-gold-600 ring-1 ring-gold-400/40'
                  : 'text-navy-400 hover:bg-navy-50 hover:text-navy-700'
              )}
            >
              {isListening && (
                <motion.span
                  className="absolute inset-0 rounded-xl bg-gold-400/30"
                  animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.25, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <Mic size={17} className="relative" />
            </button>
          )}

          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              isListening ? "Listening\u2026" : `Ask the ${persona.label} tutor\u2026`
            }
            disabled={isSending}
            className="flex-1 rounded-xl border border-navy-100 bg-white px-4 py-2.5 font-body text-sm text-navy-900 placeholder:text-navy-300 transition-colors duration-200 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 disabled:opacity-60"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSending || (!draft.trim() && pendingAttachments.length === 0)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-gradient text-navy-900 shadow-gold transition-opacity duration-200 disabled:opacity-40"
            aria-label="Send message"
          >
            <Send size={16} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}