import { motion } from 'framer-motion';
import { Container, Button } from '../../ui';
import StatCounter from './StatCounter';
import StorySlider from './StorySlider';

/**
 * Hero — homepage hero section.
 *
 * Two-column layout: left holds a gold badge, large Playfair headline,
 * supporting paragraph, two pill CTAs, and four animated statistics;
 * right holds the premium StorySlider. Animations use Framer Motion
 * stagger children for a refined entrance.
 */

const STATS = [
  { value: '100+', label: 'Students Empowered' },
  { value: '03', label: 'Global Ecosystems' },
  { value: '20+', label: 'Professional Programmes' },
  { value: 'Future Ready', label: 'Skills for Tomorrow' },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  return (
    <section aria-label="Introduction" className="relative overflow-hidden bg-gradient-to-b from-light-gray via-white to-light-gray pb-20 pt-32 md:pb-28 md:pt-40">
      {/* Soft ambient glows */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-navy/5 blur-3xl" aria-hidden="true" />

      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column */}
          <motion.div variants={container} initial="hidden" animate="visible">
            {/* Gold badge */}
            <motion.span
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold"
            >
              <span aria-hidden="true">🌍</span>
              Empowering Technical Minds Globally
            </motion.span>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="mt-6 max-w-xl text-h1 font-serif font-bold leading-[1.1] text-navy"
            >
              Empowering Minds Through Communication, Innovation &amp; Technical Excellence
            </motion.h1>

            {/* Supporting paragraph */}
            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base leading-relaxed text-body md:text-lg"
            >
              InnoSpeak Global equips students, educators, engineers, innovators and future
              leaders with world-class communication, technical, entrepreneurial and digital
              skills for global opportunities.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
              <Button to="/programs" variant="primary" size="md">
                Explore Pathways
              </Button>
              <Button to="/apply" variant="secondary" size="md" withArrow={false}>
                Apply Now
              </Button>
            </motion.div>

            {/* Animated statistics */}
            <motion.dl
              variants={item}
              className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-navy/10 pt-8 sm:grid-cols-4"
            >
              {STATS.map((stat) => (
                <StatCounter key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </motion.dl>
          </motion.div>

          {/* Right column — Story Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <StorySlider />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
