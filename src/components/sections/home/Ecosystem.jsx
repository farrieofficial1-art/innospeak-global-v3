import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container, Button } from '../../ui';
import SectionHeader from './SectionHeader';
import GlassCard from './GlassCard';

/**
 * Ecosystem — "One Vision. Three Powerful Ecosystems."
 *
 * Three premium glass cards: Academy, Foundation, Labs. Each lifts on
 * hover, glows softly, and has a subtle floating icon. Staggered
 * entrance via a Framer Motion parent container.
 */

const ECOSYSTEMS = [
  {
    id: 'academy',
    emoji: '🎓',
    title: 'InnoSpeak Global Academy',
    description: 'Professional education, communication, ICT, global qualifications and language excellence.',
    cta: { label: 'Explore Academy', to: '/programs' },
  },
  {
    id: 'foundation',
    emoji: '❤️',
    title: 'InnoSpeak Global Foundation',
    description: 'Community empowerment through mentorship, scholarships, leadership and sustainable development.',
    cta: { label: 'Explore Foundation', to: '/programs' },
  },
  {
    id: 'labs',
    emoji: '💡',
    title: 'InnoSpeak Global Labs',
    description: 'Engineering, Artificial Intelligence, innovation, entrepreneurship and digital careers.',
    cta: { label: 'Explore Labs', to: '/programs' },
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function CardAction({ label, to }) {
  return (
    <Button to={to} variant="ghost" size="sm" withArrow={false} className="group/link p-0 text-gold hover:bg-transparent hover:text-gold-600">
      {label}
      <ArrowRight size={16} className="transition-transform duration-300 group-hover/link:translate-x-1" />
    </Button>
  );
}

export default function Ecosystem() {
  return (
    <section aria-label="Our ecosystem" className="bg-light-gray py-20 md:py-28">
      <Container>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionHeader
            label="Our Ecosystem"
            title="One Vision. Three Powerful Ecosystems."
            description="InnoSpeak Global unites education, community, and innovation under one mission — empowering minds across the world through three connected ecosystems."
          />

          <div className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-3">
            {ECOSYSTEMS.map((eco, i) => (
              <motion.div key={eco.id} variants={item}>
                <GlassCard
                  emoji={eco.emoji}
                  title={eco.title}
                  description={eco.description}
                  floatDelay={i * 0.6}
                  action={<CardAction label={eco.cta.label} to={eco.cta.to} />}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
