import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const container = staggerContainer(0.06, 0.04);

export default function CareerOpportunities({ course }) {
  const careers = course.careers || [];

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="Career Opportunities"
            title="Where This Can Take You"
            subtitle="Graduates of this course pursue careers in a range of fields:"
          />

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {careers.map((career, i) => (
              <motion.div
                key={i}
                variants={fadeUpItem}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group flex items-center gap-3 rounded-2xl border border-navy-100 bg-white p-5 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
                  <Briefcase size={18} aria-hidden="true" />
                </div>
                <span className="font-body text-sm font-medium text-navy-900">{career}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}