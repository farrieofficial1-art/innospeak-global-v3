import { motion } from 'framer-motion';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { getIcon } from '../../../lib/icons/iconMap';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const container = staggerContainer(0.1, 0.05);

export default function Assessment({ course }) {
  const methods = course.assessment || [];

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="Assessment"
            title="How You Will Be Assessed"
            subtitle="Your progress is measured through a variety of practical assessments."
          />

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {methods.map(({ icon, label, description }, i) => {
              const Icon = getIcon(icon);
              return (
                <motion.div
                  key={i}
                  variants={fadeUpItem}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="group rounded-2xl border border-navy-100 bg-white p-6 text-center shadow-premium transition-shadow duration-300 hover:shadow-premium-lg"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
                    <Icon size={26} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-display text-base font-bold text-navy-900">{label}</h3>
                  <p className="mt-2 font-body text-xs leading-relaxed text-navy-600">{description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}