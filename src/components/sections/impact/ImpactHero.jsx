import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { staggerContainer, fadeUpItem } from '../../../lib/motion/presets';

const container = staggerContainer(0.12, 0.1);

export default function ImpactHero() {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-20 pt-32 md:pt-40">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-950" />

      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold-500/15 blur-[140px]" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-navy-700/30 blur-[120px]" aria-hidden="true" />

      <div className="container-premium relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span
            variants={fadeUpItem}
            className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-gold-300 backdrop-blur-sm"
          >
            <TrendingUp size={14} aria-hidden="true" />
            Our Impact &amp; Success
          </motion.span>

          <motion.h1
            variants={fadeUpItem}
            className="mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
          >
            Measurable Impact, Real Results
          </motion.h1>

          <motion.p
            variants={fadeUpItem}
            className="mx-auto mt-8 max-w-2xl font-body text-lg leading-relaxed text-navy-200"
          >
            Our numbers tell a story of growth, transformation and a growing global community of
            confident learners.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}