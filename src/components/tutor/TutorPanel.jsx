import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Paperclip,
  Mic,
  X,
  Square,
  Sparkles,
  Globe2,
  Brain,
} from 'lucide-react';

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

export default function TutorPanel({
  personaId,
  messages,
  isSending,
  error,
  onSend,
  onRegenerate,
  onStop,
  webSearch,
  deepThink,
  variant = 'compact',
}) {
  const [draft, setDraft] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [attachError, setAttachError] = useState(null);

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  const persona = getPersonaById(personaId);

  const {
    isSupported: micSupported,
    isListening,
    start: startListening,
    stop: stopListening,
  } = useSpeechRecognition({
    onResult: (t) =>
      setDraft((p) => (p ? `${p} ${t}` : t)),
  });

  const {
    isSupported: speechSupported,
    speakingId,
    speak,
  } = useSpeechSynthesis();

  /*
   * Scroll only the conversation container.
   *
   * The composer is no longer sitting on top of
   * the scroll area, so the last message cannot
   * disappear underneath it.
   */
  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    });
  }, [messages, isSending]);

  async function submit(e) {
    e.preventDefault();

    if (
      (!draft.trim() &&
        !pendingAttachments.length) ||
      isSending
    ) {
      return;
    }

    await onSend(
      draft,
      pendingAttachments
    );

    setDraft('');
    setPendingAttachments([]);
  }

  async function chooseFiles(e) {
    const files = Array.from(
      e.target.files || []
    );

    e.target.value = '';

    if (!files.length) return;

    setAttachError(null);

    const room =
      MAX_ATTACHMENTS -
      pendingAttachments.length;

    const results =
      await Promise.allSettled(
        files
          .slice(0, room)
          .map(fileToAttachment)
      );

    const good = results
      .filter(
        (r) =>
          r.status === 'fulfilled'
      )
      .map((r) => r.value);

    const bad = results.find(
      (r) =>
        r.status === 'rejected'
    );

    if (good.length) {
      setPendingAttachments(
        (p) => [...p, ...good]
      );
    }

    if (bad) {
      setAttachError(
        bad.reason?.message ||
          'Attachment could not be loaded.'
      );
    }
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* =====================================================
          CONVERSATION AREA
          ===================================================== */}

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth"
      >
        <div className="mx-auto w-full max-w-4xl px-4 pb-8 pt-4 sm:px-8 sm:pb-10 sm:pt-8">
          {/* Empty state */}

          {messages.length === 0 && (
            <div className="flex min-h-[55vh] flex-col items-center justify-center py-12 text-center">
              <motion.div
                initial={{
                  scale: 0.8,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                className="flex h-16 w-16 items-center justify-center rounded-3xl bg-navy-950 text-gold-300 shadow-xl"
              >
                <Sparkles size={28} />
              </motion.div>

              <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
                How can I help you learn?
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-navy-500">
                {persona.tagline}. Ask a question,
                upload material, or start with one
                of these.
              </p>

              <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
                {persona.starterPrompts.map(
                  (prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() =>
                        onSend(
                          prompt,
                          []
                        )
                      }
                      className="rounded-2xl border border-navy-100 bg-white p-4 text-left text-xs font-medium leading-5 text-navy-700 shadow-sm transition hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-md"
                    >
                      {prompt}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Messages */}

          {messages.map((m, i) => (
            <TutorMessageBubble
              key={m.id}
              {...m}
              isSpeaking={
                speechSupported &&
                speakingId === m.id
              }
              onToggleSpeak={
                speechSupported
                  ? speak
                  : undefined
              }
              onRegenerate={
                m.role === 'assistant' &&
                i ===
                  messages.length - 1
                  ? onRegenerate
                  : undefined
              }
            />
          ))}

          {/* Loading */}

          {isSending && (
            <TutorTypingIndicator
              deepThink={deepThink}
            />
          )}

          {/* Error */}

          {error && (
            <div className="my-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Small bottom breathing room */}

          <div className="h-2 sm:h-4" />
        </div>
      </div>

      {/* =====================================================
          FIXED COMPOSER
          ===================================================== */}

      <div className="shrink-0 border-t border-navy-100/70 bg-white/90 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/90">
        <div className="mx-auto w-full max-w-4xl px-3 py-3 sm:px-6 sm:py-4">
          <div className="rounded-3xl border border-navy-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            {/* Attachments */}

            {pendingAttachments.length > 0 && (
              <div className="flex gap-2 overflow-x-auto px-2 pt-2">
                {pendingAttachments.map(
                  (a) => (
                    <div
                      key={a.id}
                      className="relative h-14 w-14 shrink-0 overflow-visible"
                    >
                      <img
                        src={a.previewUrl}
                        alt={a.name}
                        className="h-14 w-14 rounded-xl object-cover ring-1 ring-navy-200"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setPendingAttachments(
                            (p) =>
                              p.filter(
                                (x) =>
                                  x.id !==
                                  a.id
                              )
                          )
                        }
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-950 text-white shadow-md transition hover:scale-110"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Attachment error */}

            {attachError && (
              <div className="px-3 pt-2 text-[11px] text-red-600">
                {attachError}
              </div>
            )}

            {/* Main input */}

            <form
              onSubmit={submit}
              className="flex items-end gap-1"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={chooseFiles}
                className="hidden"
              />

              {/* Attachment */}

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                title={`Attach files · max ${formatFileSize(
                  MAX_FILE_SIZE_BYTES
                )}`}
                className="m-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-navy-400 transition hover:bg-navy-50 hover:text-navy-800"
              >
                <Paperclip size={18} />
              </button>

              {/* Microphone */}

              {micSupported && (
                <button
                  type="button"
                  onClick={
                    isListening
                      ? stopListening
                      : startListening
                  }
                  className={cn(
                    'm-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition',
                    isListening
                      ? 'bg-gold-100 text-gold-700'
                      : 'text-navy-400 hover:bg-navy-50'
                  )}
                >
                  <Mic size={18} />
                </button>
              )}

              {/* Textarea */}

              <textarea
                value={draft}
                onChange={(e) =>
                  setDraft(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    submit(e);
                  }
                }}
                rows={1}
                placeholder={
                  isListening
                    ? 'Listening…'
                    : `Ask the ${persona.label} tutor…`
                }
                disabled={isSending}
                className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm leading-5 text-navy-950 outline-none placeholder:text-navy-300 dark:text-white dark:placeholder:text-slate-500"
              />

              {/* Stop */}

              <button
                type="button"
                onClick={() =>
                  onStop?.()
                }
                disabled={!isSending}
                className={cn(
                  'm-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl',
                  isSending
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'hidden'
                )}
                title="Stop generating"
              >
                <Square
                  size={15}
                  fill="currentColor"
                />
              </button>

              {/* Send */}

              <button
                type="submit"
                disabled={
                  isSending ||
                  (!draft.trim() &&
                    !pendingAttachments.length)
                }
                className="m-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-950 text-white shadow-sm transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Send size={16} />
              </button>
            </form>

            {/* Tools */}

            <div className="flex items-center justify-between px-3 pb-1 pt-1.5">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {}}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-semibold',
                    webSearch
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-navy-400 hover:bg-navy-50'
                  )}
                >
                  <Globe2 size={12} />
                  Web research
                  {webSearch && ' on'}
                </button>

                <button
                  type="button"
                  onClick={() => {}}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-semibold',
                    deepThink
                      ? 'bg-gold-50 text-gold-700'
                      : 'text-navy-400 hover:bg-navy-50'
                  )}
                >
                  <Brain size={12} />
                  Deep thinking
                  {deepThink && ' on'}
                </button>
              </div>

              <span className="hidden text-[10px] text-navy-300 sm:block">
                InnoSpeak AI can make mistakes ·
                verify important information
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}