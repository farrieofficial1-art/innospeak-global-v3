import { motion } from 'framer-motion';
import { GraduationCap, Building2, Cpu, Award } from 'lucide-react';
import { Container } from '../../ui';
import SectionHeader from './SectionHeader';

/**
 * TrustedRecognised — partner credibility section.
 *
 * Displays four elegant placeholder partner categories (Universities,
 * Employers, Technology Partners, Certification Bodies) as grayscale
 * icon tiles that animate to full colour on hover. Left-aligned header
 * keeps the editorial, academic feel.
 */

const PARTNERS = [
  { label: 'Universities', icon: GraduationCap },
  { label: 'Technology Companies', icon: Cpu },
  { label: 'Industry Partners', icon: Building2 },
  { label: 'Certification Bodies', icon: Award },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function TrustedRecognised() {
  return (
    <section aria-label="Trusted and recognised" className="bg-white py-20 md:py-28">
      <Container>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionHeader
            label="Trusted & Recognised"
            title="Preparing Learners for Global Opportunities"
            description="We are building a trusted network of leading universities, technology companies, industry partners and certification bodies — opening doors for our learners across the world."
          />

          <motion.ul
            variants={item}
            className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4"
            aria-label="Partner categories"
          >
            {PARTNERS.map(({ label, icon: Icon }) => (
              <li key={label}>
                <div className="group flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-navy/10 bg-light-gray px-6 py-10 transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:bg-white hover:shadow-navy">
                  <Icon
                    size={36}
                    className="text-navy/30 transition-colors duration-500 group-hover:text-gold"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold text-muted transition-colors duration-500 group-hover:text-navy">
                    {label}
                  </span>
                </div>
                <span className="sr-only">{label} — future partner</span>
              </li>
              ))}
          </motion.ul>
        </motion.div>
      </Container>
    </section>
  );
}
