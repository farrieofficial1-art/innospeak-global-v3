import { motion } from 'framer-motion';
import {
  GraduationCap,
  Languages,
  BookMarked,
  Mic,
  Headset,
  Laptop,
  FileText,
  PenTool,
  Megaphone,
  Code2,
  Store,
} from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

/**
 * CareerOpportunities — compact career tag cards.
 *
 * Same eleven career pathways as before, restyled on the same
 * navy-900/gold-400 -> gold-gradient icon convention used across the
 * Academy page. As with WhyStudyWithUs/CareerCard previously, the
 * cards had no motion wrapper so the imported stagger animation never
 * actually ran — wired up with fadeUpItem here. Dropped the unused
 * `Briefcase` icon import (not referenced by any entry in CAREERS).
 */

const CAREERS = [
  { icon: GraduationCap, title: 'Teacher' },
  { icon: Languages, title: 'Interpreter' },
  { icon: BookMarked, title: 'Translator' },
  { icon: Mic, title: 'Public Speaker' },
  { icon: Headset, title: 'Customer Support' },
  { icon: Laptop, title: 'Virtual Assistant' },
  { icon: FileText, title: 'Administrative Professional' },
  { icon: PenTool, title: 'Freelancer' },
  { icon: Megaphone, title: 'Content Creator' },
  { icon: Code2, title: 'Technical Writer' },
  { icon: Store, title: 'Digital Entrepreneur' },
];

const container = staggerContainer(0.08, 0.1);

function CareerCard({ icon: Icon, title }) {
  return (
    <motion.div
      variants={fadeUpItem}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-navy-100 bg-white px-6 py-8 text-center shadow-premium transition-shadow duration-300 hover:shadow-premium-lg"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
        <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <span className="font-body text-sm font-semibold text-navy-900">{title}</span>
    </motion.div>
  );
}

export default function CareerOpportunities() {
  return (
    <section aria-label="Career opportunities" className="bg-cream py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Career Opportunities"
          title="Where Will Your Learning Take You?"
          subtitle="The skills you build at InnoSpeak Global Academy open doors across education, language, technology, media and entrepreneurship."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
        >
          {CAREERS.map((career) => (
            <CareerCard key={career.title} {...career} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}