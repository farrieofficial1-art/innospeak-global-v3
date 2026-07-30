import { motion } from 'framer-motion';
import { Clock, BarChart3, Monitor, Globe, Award, CreditCard, Calendar } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';
import { INTAKES } from '../../../lib/data/programmeData';

const container = staggerContainer(0.08, 0.05);

export default function KeyInfoCards({ course }) {
  const items = [
    { icon: Clock, label: 'Duration', value: course.duration },
    { icon: BarChart3, label: 'Course Level', value: course.level },
    { icon: Monitor, label: 'Study Mode', value: course.studyMode },
    { icon: Globe, label: 'Language', value: course.languageOfInstruction },
    { icon: Award, label: 'Certification', value: course.certification },
    { icon: CreditCard, label: 'Course Fee', value: course.fees },
    { icon: Calendar, label: 'Intake Dates', value: INTAKES.join(', ') },
  ];

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading eyebrow="Key Information" title="Course Details at a Glance" />

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(({ icon: Icon, label, value }) => (
              <motion.div
                key={label}
                variants={fadeUpItem}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group rounded-2xl border border-navy-100 bg-white p-6 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <p className="mt-4 font-body text-xs font-medium uppercase tracking-wider text-navy-400">{label}</p>
                <p className="mt-1.5 font-body text-sm font-bold text-navy-900">{value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}