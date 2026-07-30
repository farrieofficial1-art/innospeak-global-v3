import { motion } from 'framer-motion';
import {
  Globe2,
  UserCheck,
  CalendarClock,
  Briefcase,
  Award,
  LifeBuoy,
} from 'lucide-react';
import { Container } from '../../ui';
import SectionHeader from './SectionHeader';

/**
 * WhyChoose — "More Than Learning. A Complete Growth Ecosystem."
 *
 * Six premium feature cards, each with a Lucide icon, that lift on hover
 * and reveal a soft gold glow. Staggered entrance via Framer Motion.
 */

const REASONS = [
  {
    icon: Globe2,
    title: 'Global Learning',
    description: 'Internationally benchmarked curricula that open doors across the world.',
  },
  {
    icon: UserCheck,
    title: 'Expert Instructors',
    description: 'Learn from experienced educators, practitioners and industry leaders.',
  },
  {
    icon: CalendarClock,
    title: 'Flexible Learning',
    description: 'Online, physical and hybrid modes that fit your schedule and goals.',
  },
  {
    icon: Briefcase,
    title: 'Industry Relevant Skills',
    description: 'Practical, career-ready skills aligned with what employers need today.',
  },
  {
    icon: Award,
    title: 'Professional Certification',
    description: 'Earn recognised credentials that validate your expertise and growth.',
  },
  {
    icon: LifeBuoy,
    title: 'Career Support',
    description: 'Mentorship, guidance and opportunities that extend beyond the classroom.',
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

function ReasonCard({ icon: Icon, title, description, index }) {
  return (
    <motion.article
      variants={item}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative h-full overflow-hidden rounded-3xl border border-navy/10 bg-white p-8 shadow-navy transition-shadow duration-500 hover:shadow-navy-lg"
    >
      {/* Soft gold glow on hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 shadow-gold-glow transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* Floating icon */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
        className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10"
      >
        <Icon size={26} className="text-gold" aria-hidden="true" />
      </motion.div>

      <h3 className="relative text-lg font-bold text-navy">{title}</h3>
      <p className="relative mt-3 text-sm leading-relaxed text-muted">{description}</p>

      {/* Decorative number */}
      <span
        className="pointer-events-none absolute right-6 top-6 font-serif text-5xl font-bold text-navy/5"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
    </motion.article>
  );
}

export default function WhyChoose() {
  return (
    <section aria-label="Why choose InnoSpeak Global" className="bg-light-gray py-20 md:py-28">
      <Container>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionHeader
            label="Why Choose Us"
            title="More Than Learning. A Complete Growth Ecosystem."
            description="InnoSpeak Global goes beyond the classroom — we build confident, capable, future-ready learners through a connected ecosystem of education, innovation and opportunity."
          />

          <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {REASONS.map((reason, i) => (
              <ReasonCard key={reason.title} index={i} {...reason} />
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
