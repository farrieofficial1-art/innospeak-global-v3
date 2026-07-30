import { motion } from 'framer-motion';
import { Download, Info, Sparkles } from 'lucide-react';
import { Button } from '../../ui';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const container = staggerContainer(0.12, 0.1);

export default function FinalCTA({ course }) {
  const applyTo = `/apply?courseCode=${course.code}`;

  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-950" />

      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" aria-hidden="true" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,160,23,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
        aria-hidden="true"
      />

      <div className="container-premium relative">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <motion.span
            variants={fadeUpItem}
            className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-gold-300 backdrop-blur-sm"
          >
            <Sparkles size={14} aria-hidden="true" />
            Start Your Journey
          </motion.span>

          <motion.h2
            variants={fadeUpItem}
            className="mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl"
          >
            Ready to Begin Your Learning Journey?
          </motion.h2>

          <motion.p
            variants={fadeUpItem}
            className="mt-6 max-w-2xl font-body text-base leading-relaxed text-navy-200 md:text-lg"
          >
            Join learners from around the world and gain practical skills, professional certification
            and global opportunities through InnoSpeak Global Academy.
          </motion.p>

          <motion.div variants={fadeUpItem} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button to={applyTo} variant="gold" size="lg">
              Apply Now
            </Button>
            <button
              type="button"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-body text-base font-medium text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/40 hover:bg-white/10"
            >
              <Download size={18} aria-hidden="true" />
              Download Brochure
            </button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              withArrow={false}
              className="border-white/30 text-white hover:bg-white hover:text-navy-900"
            >
              <Info size={18} className="mr-1" />
              Request Information
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}