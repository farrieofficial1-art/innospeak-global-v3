import { motion } from 'framer-motion';
import { GraduationCap, Cpu, Globe2, HeartHandshake } from 'lucide-react';
import { Container } from '../../ui';
import SectionLabel from './SectionLabel';

/**
 * About — "About InnoSpeak Global" two-column section.
 *
 * Left: premium gradient illustration in a rounded floating container.
 * Right: gold eyebrow, large Playfair heading, two-paragraph lede, and
 * four elegant feature cards. Staggered entrance via Framer Motion.
 */

const FEATURES = [
  {
    icon: GraduationCap,
    title: 'World-Class Learning',
    description: 'Rigorous, internationally benchmarked programmes led by expert educators.',
  },
  {
    icon: Cpu,
    title: 'Innovation & Technology',
    description: 'Hands-on mastery of the tools, platforms and ideas shaping the future.',
  },
  {
    icon: Globe2,
    title: 'Global Opportunities',
    description: 'Pathways to study, work and lead across connected global ecosystems.',
  },
  {
    icon: HeartHandshake,
    title: 'Community Impact',
    description: 'Empowering people and places through mentorship, scholarships and service.',
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-6 shadow-navy transition-shadow duration-500 hover:shadow-navy-lg"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 transition-colors duration-500 group-hover:bg-gold/20">
        <Icon size={24} className="text-gold" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-navy">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </motion.div>
  );
}

export default function About() {
  return (
    <section aria-label="About InnoSpeak Global" className="bg-white py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — premium illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-none"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-navy/10 shadow-navy-lg"
            >
              {/* Gradient backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-600 to-navy-800" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/20 via-transparent to-transparent" aria-hidden="true" />

              {/* Soft outer glow */}
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-gold/10 blur-3xl" aria-hidden="true" />

              {/* Geometric accents */}
              <div className="absolute right-10 top-10 h-28 w-28 rounded-full border border-white/15" aria-hidden="true" />
              <div className="absolute right-16 top-16 h-14 w-14 rounded-full border border-white/10" aria-hidden="true" />
              <div className="absolute bottom-12 left-10 h-20 w-20 rounded-2xl border border-gold/20 rotate-12" aria-hidden="true" />

              {/* Floating icon medallion */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-md"
                >
                  <GraduationCap size={44} className="text-gold" aria-hidden="true" />
                </motion.div>
                <p className="mt-8 font-serif text-2xl font-bold leading-tight text-white">
                  Education.<br />Innovation.<br />Global Opportunity.
                </p>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
                  A modern learning ecosystem built for the connected world.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — content */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col gap-5"
          >
            <motion.div variants={item}>
              <SectionLabel>About InnoSpeak Global</SectionLabel>
            </motion.div>

            <motion.h2
              variants={item}
              className="max-w-xl text-h2 font-serif font-bold text-navy"
            >
              Building Future-Ready Minds for a Changing World
            </motion.h2>

            <motion.p variants={item} className="max-w-xl text-base leading-relaxed text-body">
              InnoSpeak Global is a modern learning and innovation ecosystem dedicated to empowering
              students, professionals, educators and communities through communication, technology,
              innovation and leadership.
            </motion.p>
            <motion.p variants={item} className="max-w-xl text-base leading-relaxed text-body">
              We believe education should create opportunities, inspire creativity and prepare learners
              for success in an increasingly connected world.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2"
            >
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
