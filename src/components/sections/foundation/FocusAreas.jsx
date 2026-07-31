import { motion } from 'framer-motion';
import { GraduationCap, Users, HandHeart } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const AREAS = [
  {
    icon: GraduationCap,
    title: 'Scholarships',
    description:
      'We provide scholarship support to promising learners who would otherwise be unable to access quality education — covering tuition and essential learning resources so financial hardship never stands in the way of potential.',
  },
  {
    icon: Users,
    title: 'Youth Empowerment',
    description:
      'Through mentorship, skills training and leadership development, we equip young people with the confidence, character and capabilities to shape their own futures and give back to their communities.',
  },
  {
    icon: HandHeart,
    title: 'Community Outreach',
    description:
      'We partner with schools, local leaders and grassroots organisations to extend learning opportunities, resources and support directly into the communities that need them most.',
  },
];

const container = staggerContainer(0.12, 0.1);

export default function FocusAreas() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="Our Focus Areas"
            title="Where Your Support Makes a Difference"
            subtitle="Every contribution is directed toward one of three interconnected programmes designed to open doors that would otherwise stay closed."
          />

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {AREAS.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={fadeUpItem}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-8 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
                  <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <h3 className="mt-6 font-display text-lg font-bold text-navy-900">{title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-navy-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}