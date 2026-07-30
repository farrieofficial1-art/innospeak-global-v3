import { motion } from 'framer-motion';
import { Container, Button } from '../../ui';
import SectionHeader from './SectionHeader';
import StatCounter from './StatCounter';

/**
 * OurImpact — "Creating Meaningful Change Through Education."
 *
 * Premium statistics section with animated counters in elegant rounded
 * cards over a subtle gradient background. Ends with a centred dual CTA.
 */

const STATS = [
  { value: '100+', label: 'Students Empowered' },
  { value: '20+', label: 'Professional Programmes' },
  { value: '4', label: 'Language Categories' },
  { value: '3', label: 'Global Ecosystems' },
  { value: '95%', label: 'Learner Satisfaction' },
  { value: '10+', label: 'Innovation Areas' },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function OurImpact() {
  return (
    <section aria-label="Our impact" className="relative overflow-hidden bg-light-gray py-20 md:py-28">
      {/* Subtle gradient background */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-light-gray to-gold/5"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-navy/5 blur-3xl" aria-hidden="true" />

      <Container className="relative">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionHeader
            label="Our Impact"
            title="Creating Meaningful Change Through Education"
            description="Measurable progress across learners, programmes and ecosystems — a growing community built on opportunity and outcomes."
          />

          {/* Statistics grid */}
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={item}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group relative overflow-hidden rounded-3xl border border-navy/10 bg-white p-8 text-center shadow-navy transition-shadow duration-500 hover:shadow-navy-lg"
              >
                {/* Soft gradient sheen */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <StatCounter
                  value={stat.value}
                  label={stat.label}
                  className="relative items-center"
                />
              </motion.div>
            ))}
          </div>

          {/* Centred CTA */}
          <motion.div
            variants={item}
            className="mt-16 flex flex-col items-center gap-6 text-center"
          >
            <h3 className="max-w-xl text-h3 font-serif font-bold text-navy">
              Ready to Begin Your Journey?
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button to="/apply" variant="primary" size="lg">
                Apply Today
              </Button>
              <Button to="/contact" variant="outline" size="lg" withArrow={false}>
                Contact Us
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
