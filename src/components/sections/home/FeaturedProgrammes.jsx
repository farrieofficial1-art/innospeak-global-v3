import { motion } from 'framer-motion';
import { Clock, Monitor, Wallet } from 'lucide-react';
import { Container, Button } from '../../ui';
import SectionHeader from './SectionHeader';

/**
 * FeaturedProgrammes — programme pathway cards.
 *
 * Six premium cards, each with a course code, rounded category badge,
 * programme name, short description, duration, mode, price, and dual
 * Learn More / Apply buttons. Cards lift and gain a stronger shadow on
 * hover. A large centred "Explore All Programmes" CTA sits below the grid.
 */

const PROGRAMMES = [
  {
    code: 'ENG101',
    name: 'English Speaking',
    description: 'Build confident, fluent spoken English for everyday and professional contexts.',
    duration: '8 Weeks',
    mode: 'Hybrid',
    price: 'KES 12,500',
    category: 'Language',
  },
  {
    code: 'IEL101',
    name: 'IELTS Academic Preparation',
    description: 'Targeted preparation to achieve top IELTS Academic band scores for global study.',
    duration: '10 Weeks',
    mode: 'Online',
    price: 'KES 18,000',
    category: 'Qualifications',
  },
  {
    code: 'ICT101',
    name: 'ICT Essentials',
    description: 'Core digital literacy and productivity tools for the modern workplace.',
    duration: '8 Weeks',
    mode: 'Hybrid',
    price: 'KES 15,000',
    category: 'Digital Skills',
  },
  {
    code: 'AI101',
    name: 'AI Productivity Tools',
    description: 'Master AI tools to boost productivity, creativity, and professional efficiency.',
    duration: '6 Weeks',
    mode: 'Online',
    price: 'KES 16,000',
    category: 'Digital Skills',
  },
  {
    code: 'PUB101',
    name: 'Public Speaking',
    description: 'Master the art of persuasive, structured public speaking and presentation.',
    duration: '6 Weeks',
    mode: 'Weekend',
    price: 'KES 10,000',
    category: 'Communication',
  },
  {
    code: 'ARB101',
    name: 'Arabic Language',
    description: 'Develop practical Arabic language skills for communication and career growth.',
    duration: '8 Weeks',
    mode: 'Online',
    price: 'KES 14,000',
    category: 'Language',
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

const CATEGORY_STYLES = {
  Language: 'bg-gold/10 text-gold-700',
  Technology: 'bg-navy/10 text-navy',
  Communication: 'bg-gold/10 text-gold-700',
};

function ProgrammeCard({ programme }) {
  return (
    <motion.article
      variants={item}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group flex h-full flex-col rounded-3xl border border-navy/10 bg-white p-7 shadow-navy transition-shadow duration-500 hover:shadow-navy-lg"
    >
      {/* Top row: code + category badge */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {programme.code}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_STYLES[programme.category]}`}
        >
          {programme.category}
        </span>
      </div>

      {/* Name + description */}
      <h3 className="mt-5 text-xl font-bold text-navy">{programme.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{programme.description}</p>

      {/* Meta row */}
      <dl className="mt-6 flex flex-col gap-3 border-t border-navy/10 pt-5 text-sm">
        <div className="flex items-center gap-3">
          <Clock size={16} className="text-muted" aria-hidden="true" />
          <dt className="sr-only">Duration</dt>
          <dd className="font-medium text-body">{programme.duration}</dd>
        </div>
        <div className="flex items-center gap-3">
          <Monitor size={16} className="text-muted" aria-hidden="true" />
          <dt className="sr-only">Mode</dt>
          <dd className="font-medium text-body">{programme.mode}</dd>
        </div>
        <div className="flex items-center gap-3">
          <Wallet size={16} className="text-muted" aria-hidden="true" />
          <dt className="sr-only">Price</dt>
          <dd className="font-semibold text-navy">{programme.price}</dd>
        </div>
      </dl>

      {/* Actions */}
      <div className="mt-auto flex items-center gap-3 pt-7">
        <Button to={`/courses/${programme.code}`} variant="secondary" size="sm" withArrow={false} className="flex-1">
          Learn More
        </Button>
        <Button to={`/apply?courseCode=${programme.code}`} variant="primary" size="sm" className="flex-1">
          Apply
        </Button>
      </div>
    </motion.article>
  );
}

export default function FeaturedProgrammes() {
  return (
    <section aria-label="Featured programmes" className="bg-white py-20 md:py-28">
      <Container>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionHeader
            label="Featured Programmes"
            title="Choose Your Learning Pathway"
            description="Explore some of our most popular programmes designed for future-ready learners."
          />

          <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {PROGRAMMES.map((programme) => (
              <ProgrammeCard key={programme.code} programme={programme} />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div variants={item} className="mt-14 flex justify-center">
            <Button to="/programs" variant="primary" size="lg">
              Explore All Programmes
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
