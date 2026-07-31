import { motion } from 'framer-motion';
import { HeartHandshake } from 'lucide-react';
import { Button } from '../../ui';
import FoundationHeroSlider from './FoundationHeroSlider.jsx';
import { staggerContainer, fadeUpItem } from '../../../lib/motion/presets';

const container = staggerContainer(0.12, 0.1);

const FOCUS_TAGS = ['Scholarships', 'Youth Empowerment', 'Community Outreach', 'Impact Driven'];

export default function FoundationHero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-navy-950">
      <FoundationHeroSlider />

      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold-500/15 blur-[140px]" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-navy-500/20 blur-[120px]" aria-hidden="true" />

      <div className="container-premium relative z-10 py-20">
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
            <HeartHandshake size={14} aria-hidden="true" />
            Empower. Support. Transform.
          </motion.span>

          <motion.h1
            variants={fadeUpItem}
            className="mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
          >
            InnoSpeak Global
            <span className="block text-gradient-gold">Foundation</span>
          </motion.h1>

          <motion.p
            variants={fadeUpItem}
            className="mx-auto mt-8 max-w-2xl font-body text-lg leading-relaxed text-navy-200"
          >
            A dedicated initiative providing scholarships, community outreach and youth
            empowerment programmes to make quality education accessible to all.
          </motion.p>

          <motion.div variants={fadeUpItem} className="mt-10 flex flex-wrap justify-center gap-3">
            {FOCUS_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 font-body text-sm font-medium text-white backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUpItem} className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="#ways-to-give" variant="gold" size="lg">
              Support Our Mission
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white hover:text-navy-900"
            >
              Partner With Us
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}