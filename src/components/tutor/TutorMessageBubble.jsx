import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn.js';

/**
 * TutorMessageBubble — single chat turn in the AI Tutor conversation.
 * Assistant messages sit left with a small gold-badge avatar; user
 * messages sit right in a solid navy bubble.
 */
export default function TutorMessageBubble({ role, content }) {
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
          'max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 font-body text-sm leading-relaxed',
          isUser
            ? 'rounded-br-md bg-navy-900 text-white shadow-premium'
            : 'rounded-bl-md border border-navy-100 bg-white text-navy-800 shadow-premium'
        )}
      >
        {content}
      </div>
    </motion.div>
  );
}