import { motion } from 'framer-motion';
import SectionLabel from './SectionLabel';

export default function SectionHeader({
  label,
  title,
  description,
  align = 'center',
  className = '',
}) {
  const alignment =
    align === 'left'
      ? 'items-start text-left'
      : 'items-center text-center';

  const dividerAlignment =
    align === 'left'
      ? 'justify-start'
      : 'justify-center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className={`flex flex-col gap-6 ${alignment} ${className}`}
    >
      <SectionLabel>{label}</SectionLabel>

      <div className={`flex items-center gap-3 ${dividerAlignment}`}>
        <div className="h-1 w-16 rounded-full bg-gold" />
        <div className="h-1 w-8 rounded-full bg-gold/50" />
        <div className="h-1 w-4 rounded-full bg-gold/20" />
      </div>

      <h2
        className="
          max-w-4xl
          font-serif
          text-4xl
          font-black
          leading-tight
          tracking-tight
          text-navy
          md:text-5xl
          lg:text-6xl
        "
      >
        {title}
      </h2>

      {description && (
        <p
          className="
            max-w-3xl
            text-lg
            leading-9
            text-muted
          "
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}