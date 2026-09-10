import { motion } from 'framer-motion';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../../utils/cn.js';

/**
 * TutorMessageBubble — single chat turn in the AI Tutor conversation.
 * Assistant messages sit left with a small gold-badge avatar; user
 * messages sit right in a solid navy bubble. Supports image/video
 * attachment thumbnails and, for assistant replies, a "Listen" control
 * that reads the message aloud via useSpeechSynthesis (passed down from
 * TutorPanel so only one message plays at a time).
 */
export default function TutorMessageBubble({
  id,
  role,
  content,
  attachments = [],
  isSpeaking = false,
  onToggleSpeak,
}) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex items-end gap-2', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <span className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 ring-1 ring-gold-500/20">
          <Sparkles size={14} />
        </span>
      )}
      <div
        className={cn(
          'group max-w-[85%] rounded-2xl px-4 py-3 font-body text-sm leading-relaxed',
          isUser
            ? 'rounded-br-md bg-navy-900 text-white shadow-premium'
            : 'rounded-bl-md border border-navy-100 bg-white text-navy-800 shadow-premium'
        )}
      >
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((a) => (
              <div
                key={a.id}
                className="h-24 w-24 overflow-hidden rounded-lg ring-1 ring-white/20"
              >
                {a.kind === 'video' ? (
                  <video src={a.previewUrl} controls className="h-full w-full object-cover" />
                ) : (
                  <img src={a.previewUrl} alt={a.name} className="h-full w-full object-cover" />
                )}
              </div>
            ))}
          </div>
        )}

        {content && <p className="whitespace-pre-wrap">{content}</p>}

        {!isUser && content && onToggleSpeak && (
          <button
            type="button"
            onClick={() => onToggleSpeak(id, content)}
            aria-label={isSpeaking ? 'Stop reading aloud' : 'Read this reply aloud'}
            className={cn(
              'mt-2 flex items-center gap-1 rounded-md font-body text-[11px] font-semibold transition-opacity duration-200',
              isSpeaking
                ? 'text-gold-600 opacity-100'
                : 'text-navy-400 opacity-0 hover:text-gold-600 group-hover:opacity-100'
            )}
          >
            {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
            {isSpeaking ? 'Stop' : 'Listen'}
          </button>
        )}
      </div>
    </motion.div>
  );
}