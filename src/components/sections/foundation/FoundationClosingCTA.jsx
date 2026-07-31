import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '../../ui';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const container = staggerContainer(0.12, 0.1);

export default function FoundationClosingCTA() {
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
          <motion.div variants={fadeUpItem}>
            <Sparkles size={36} className="text-gold-400" aria-hidden="true" />
          </motion.div>

          <motion.h2
            variants={fadeUpItem}
            className="mt-6 font-display text-3xl font-bold leading-snug text-white sm:text-4xl"
          >
            Every gift moves someone closer to their future.
          </motion.h2>

          <motion.p variants={fadeUpItem} className="mt-4 font-body text-base leading-8 text-navy-200">
            Whether you give, partner, or simply share our mission — you're helping make quality
            education accessible to those who need it most.
          </motion.p>

          <motion.div variants={fadeUpItem} className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="#ways-to-give" variant="gold" size="lg">
              Give Now
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white hover:text-navy-900"
            >
              Become a Partner
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}