import { motion } from 'framer-motion';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { getIcon } from '../../../lib/icons/iconMap';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const container = staggerContainer(0.08, 0.05);

export default function LearningOutcomes({ course }) {
  const outcomes = course.learningOutcomes || [];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="Learning Outcomes"
            title="What You Will Achieve"
            subtitle="By the end of this course, you will have developed the skills and confidence to:"
          />

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {outcomes.map(({ icon, text }, i) => {
              const Icon = getIcon(icon);
              return (
                <motion.div
                  key={i}
                  variants={fadeUpItem}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="group flex items-start gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <p className="pt-2.5 font-body text-sm font-medium leading-relaxed text-navy-900">{text}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}