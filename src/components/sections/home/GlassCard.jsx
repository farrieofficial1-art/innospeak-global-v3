import { motion } from 'framer-motion';

/**
 * GlassCard — premium glassmorphism card with float + lift + glow.
 *
 * Rounded 24px, white/glass surface, thin border, soft shadow. On hover
 * it lifts and reveals a soft gold glow. A gentle continuous float is
 * applied via a slow y-loop. Designed to sit inside a stagger container;
 * pass `floatDelay` to offset the float phase between cards.
 */
export default function GlassCard({
  icon: Icon,
  emoji,
  title,
  description,
  action,
  floatDelay = 0,
  className = '',
}) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`group relative overflow-hidden rounded-3xl border border-navy/10 bg-white/70 p-8 shadow-navy backdrop-blur-xl transition-shadow duration-500 hover:shadow-navy-lg ${className}`}
    >
      {/* Soft gold glow on hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 shadow-gold-glow transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
      {/* Gentle floating icon */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
        className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-2xl"
      >
        {Icon ? <Icon size={26} className="text-gold" /> : <span aria-hidden="true">{emoji}</span>}
      </motion.div>

      <h3 className="relative text-xl font-bold text-navy">{title}</h3>
      <p className="relative mt-3 text-sm leading-relaxed text-muted">{description}</p>

      {action && <div className="relative mt-6">{action}</div>}
    </motion.article>
  );
}
