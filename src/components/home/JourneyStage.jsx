import { motion } from 'framer-motion';
import {
  Compass, FileText, BookOpen, Wrench, Award, Rocket,
} from 'lucide-react';

const ICONS = {
  compass: Compass,
  'file-text': FileText,
  'book-open': BookOpen,
  tool: Wrench,
  award: Award,
  rocket: Rocket,
};

export default function JourneyStage({ step, index }) {
  const Icon = ICONS[step.icon] ?? Compass;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center text-center"
    >
      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 shadow-premium transition-transform duration-300 hover:scale-105">
        <Icon size={26} strokeWidth={1.8} />
        <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-gradient font-display text-xs font-bold text-navy-900">
          {step.number}
        </span>
      </div>

      <h3 className="mt-5 font-display text-lg font-bold text-navy-900">
        {step.title}
      </h3>
      <p className="mt-2 max-w-xs font-body text-sm leading-relaxed text-navy-600">
        {step.description}
      </p>
    </motion.div>
  );
}
