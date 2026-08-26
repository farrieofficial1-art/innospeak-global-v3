import { motion } from 'framer-motion';
import { Copy, Check, Sparkles, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import TutorMarkdown from './TutorMarkdown';
import { cn } from '../../utils/cn.js';

export default function TutorMessageBubble({
  id, role, content, attachments = [], isSpeaking = false, onToggleSpeak, onRegenerate, sources = [],
}) {
  const [copied, setCopied] = useState(false);
  const isUser = role === 'user';

  async function copy() {
    await navigator.clipboard?.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('group flex gap-3 py-5', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-gold-300 shadow-sm">
          <Sparkles size={15} />
        </div>
      )}

      <div className={cn('min-w-0', isUser ? 'max-w-[78%]' : 'max-w-3xl flex-1')}>
        <div className={cn(
          isUser
            ? 'rounded-2xl rounded-br-md bg-navy-950 px-4 py-3 text-white shadow-sm'
            : 'text-navy-800'
        )}>
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((a) => (
                <img key={a.id} src={a.previewUrl} alt={a.name} className="h-28 w-28 rounded-xl object-cover ring-1 ring-navy-200" />
              ))}
            </div>
          )}
          {isUser ? <p className="whitespace-pre-wrap text-sm leading-6">{content}</p> : <TutorMarkdown content={content} />}
        </div>

        {!isUser && (
          <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button onClick={copy} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-navy-400 hover:bg-navy-50 hover:text-navy-700">
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
            </button>
            {onToggleSpeak && (
              <button onClick={() => onToggleSpeak(id, content)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-navy-400 hover:bg-navy-50 hover:text-navy-700">
                {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />} {isSpeaking ? 'Stop' : 'Listen'}
              </button>
            )}
            {onRegenerate && (
              <button onClick={() => onRegenerate(id)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-navy-400 hover:bg-navy-50 hover:text-navy-700">
                <RefreshCw size={12} /> Regenerate
              </button>
            )}
          </div>
        )}

        {!isUser && sources?.length > 0 && (
          <div className="mt-3 rounded-xl border border-navy-100 bg-navy-50/60 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-navy-400">Sources</div>
            <div className="flex flex-wrap gap-2">
              {sources.slice(0, 6).map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer" className="max-w-full truncate rounded-lg border border-navy-100 bg-white px-3 py-1.5 text-xs font-medium text-navy-700 hover:border-gold-300">
                  {s.title || s.url}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}
