import { motion } from 'framer-motion';
import { Cpu, Presentation, BadgeCheck } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const OUTCOMES = [
  {
    icon: Cpu,
    title: 'A Working Prototype',
    description: 'Something you actually built — code, hardware, or a functioning product, not just a plan.',
  },
  {
    icon: Presentation,
    title: 'A Mentor-Reviewed Pitch',
    description: 'A tested, feedback-sharpened pitch or project brief, ready to present with confidence.',
  },
  {
    icon: BadgeCheck,
    title: 'A Public Showcase Credit',
    description: 'Recognition at a demo day, plus a portfolio piece you can point to in interviews and applications.',
  },
];

const container = staggerContainer(0.12, 0.1);

export default function LabOutcomes() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="What You Walk Away With"
            title="Proof, Not Just a Certificate"
            subtitle="Every track ends with something real in hand — not a completion badge."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {OUTCOMES.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={fadeUpItem}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-7 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-navy-900">{title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-navy-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}