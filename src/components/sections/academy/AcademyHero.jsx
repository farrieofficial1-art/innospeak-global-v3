import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../ui';
import AcademyHeroSlider from './AcademyHeroSlider.jsx';
import AcademyHeroStats from './AcademyHeroStats.jsx';
import {
  ACADEMY_HERO_BADGE,
  ACADEMY_HERO_HEADLINE,
  ACADEMY_HERO_DESCRIPTION,
} from './academyHeroData.js';

/**
 * AcademyHero — mirrors the homepage Hero exactly (same slider pattern,
 * same badge/headline/description/stats rhythm), with Academy-specific
 * content and its own image set.
 */
export default function AcademyHero() {
  return (
    <section className="relative flex min-h-[100vh] items-center overflow-hidden bg-navy-900">
      <AcademyHeroSlider />

      <div className="container-premium relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 backdrop-blur-sm"
          >
            <Sparkles size={16} className="text-gold-400" />
            <span className="font-body text-xs font-semibold uppercase tracking-wider text-gold-300">
              {ACADEMY_HERO_BADGE}
            </span>
          </motion.div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {ACADEMY_HERO_HEADLINE.map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                className={line.highlight ? 'block text-gradient-gold' : 'block'}
              >
                {line.text}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 max-w-xl font-body text-base leading-relaxed text-white/80 sm:text-lg"
          >
            {ACADEMY_HERO_DESCRIPTION}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <Button to="/apply" variant="gold" size="lg" className="group">
              Apply Now
              <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              href="#programme-catalogue"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white hover:text-navy-900"
            >
              Explore Programmes
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12 border-t border-white/10 pt-8"
          >
            <AcademyHeroStats />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}