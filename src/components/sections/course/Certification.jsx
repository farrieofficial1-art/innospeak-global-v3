import { motion } from 'framer-motion';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { getIcon } from '../../../lib/icons/iconMap';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const container = staggerContainer(0.1, 0.05);

export default function Certification({ course }) {
  const items = course.certificationItems || [];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="Certification"
            title="What You Will Receive"
            subtitle="Upon successful completion, learners receive a comprehensive certification package:"
          />

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ icon, label, description }, i) => {
              const Icon = getIcon(icon);
              return (
                <motion.div
                  key={i}
                  variants={fadeUpItem}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="group flex items-start gap-4 rounded-2xl border border-navy-100 bg-cream p-6 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-navy-900">{label}</h3>
                    <p className="mt-1 font-body text-xs leading-relaxed text-navy-600">{description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}