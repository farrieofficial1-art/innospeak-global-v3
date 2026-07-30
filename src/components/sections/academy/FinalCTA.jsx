import { motion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import Button from '../../ui/Button.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

/**
 * FinalCTA — large premium closing call-to-action.
 *
 * Same content as before (headline, supporting paragraph, Apply Now /
 * Contact Admissions), restyled on the verified live-Home
 * home/ClosingCTA.jsx recipe: bg-navy-950 base with a navy gradient
 * overlay, soft gold radial glow, container-premium, font-display
 * headline, and the real ui/Button "gold"/"outline" variants (the
 * original used variant="primary", which isn't one of Button's
 * variants and was silently falling back to gold).
 */

const container = staggerContainer(0.12, 0.1);

export default function FinalCTA() {
  return (
    <section aria-label="Start your learning journey" className="bg-white py-20 sm:py-24">
      <div className="container-premium">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          className="relative overflow-hidden rounded-[32px] bg-navy-950 px-8 py-16 text-center shadow-premium-lg md:px-16 md:py-20"
        >
          {/* Navy gradient base */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-950" />

          {/* Ambient gold glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold-500/15 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" aria-hidden="true" />

          {/* Geometric accents */}
          <div className="pointer-events-none absolute right-10 top-10 h-24 w-24 rounded-full border border-white/10" aria-hidden="true" />
          <div className="pointer-events-none absolute left-10 bottom-10 h-16 w-16 rounded-full border border-white/10" aria-hidden="true" />

          <motion.h2
            variants={fadeUpItem}
            className="relative mx-auto max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
          >
            Start Your Learning Journey Today
          </motion.h2>

          <motion.p
            variants={fadeUpItem}
            className="relative mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-navy-200 md:text-lg"
          >
            Join thousands of future-ready learners developing communication, language and digital
            skills for success.
          </motion.p>

          <motion.div
            variants={fadeUpItem}
            className="relative mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button to="/apply" variant="gold" size="lg" className="group">
              Apply Now
              <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white hover:text-navy-900"
            >
              <Compass size={18} className="mr-2" />
              Contact Admissions
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}