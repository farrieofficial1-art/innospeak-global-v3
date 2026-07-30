import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const container = staggerContainer(0.1, 0.05);

export default function EntryRequirements({ course }) {
  const requirements = course.entryRequirements || [];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="Entry Requirements"
            title="Who Can Apply"
            subtitle="Check that you meet the requirements below before applying."
          />

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {requirements.map((req, i) => (
              <motion.div
                key={i}
                variants={fadeUpItem}
                className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-cream p-5 shadow-premium"
              >
                <CheckCircle2 size={22} className="mt-0.5 flex-shrink-0 text-gold-600" aria-hidden="true" />
                <p className="font-body text-sm font-medium leading-relaxed text-navy-900">{req}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}