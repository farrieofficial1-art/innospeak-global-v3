import { motion } from 'framer-motion';
import { Users2, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '../../ui';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const container = staggerContainer(0.12, 0.1);

export default function SubmitChallenge() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-950" />
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" aria-hidden="true" />

      <div className="container-premium relative">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
        >
          <motion.div
            variants={fadeUpItem}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-400"
          >
            <Building2 size={26} aria-hidden="true" />
          </motion.div>

          <motion.h2 variants={fadeUpItem} className="mt-6 font-display text-3xl font-bold text-white sm:text-4xl">
            Have a Problem Worth Solving?
          </motion.h2>

          <motion.p variants={fadeUpItem} className="mt-6 font-body text-base leading-relaxed text-navy-200 md:text-lg">
            Labs runs on real challenges from real organizations and communities — not invented
            exercises. If you have a problem that could use a motivated team, mentor-guided
            support and fresh thinking, we'd like to hear from you.
          </motion.p>

          <motion.div variants={fadeUpItem} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button to="/contact" variant="gold" size="lg" className="group">
              Submit a Challenge
              <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button to="/contact" variant="outline" size="lg" withArrow={false} className="border-white/30 text-white hover:bg-white hover:text-navy-900">
              <Users2 size={18} className="mr-2" />
              Join a Track Instead
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}