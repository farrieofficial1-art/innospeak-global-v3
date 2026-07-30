import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Route,
  BookOpen,
  Layers,
  FolderCheck,
  Award,
  Globe2,
  ArrowRight,
} from 'lucide-react';
import { Container } from '../../ui';
import SectionHeader from './SectionHeader';

/**
 * LearningJourney — "Every Journey Begins With One Step."
 *
 * Horizontal seven-step timeline. Each step animates into view while
 * scrolling, connected by a gradient progress line. On mobile the
 * timeline collapses into a vertical flow with connector arrows.
 */

const STEPS = [
  { icon: LayoutGrid, title: 'Choose Ecosystem', description: 'Select the ecosystem that fits your vision.' },
  { icon: Route, title: 'Choose Pathway', description: 'Pick a learning pathway aligned to your goals.' },
  { icon: BookOpen, title: 'Choose Programme', description: 'Enrol in a programme that builds real skills.' },
  { icon: Layers, title: 'Learn Through Modules', description: 'Progress through structured, practical modules.' },
  { icon: FolderCheck, title: 'Complete Projects', description: 'Apply your learning to real-world projects.' },
  { icon: Award, title: 'Earn Certification', description: 'Receive recognised credentials for your work.' },
  { icon: Globe2, title: 'Access Global Opportunities', description: 'Unlock study, work and leadership pathways worldwide.' },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function LearningJourney() {
  return (
    <section aria-label="The InnoSpeak learning journey" className="bg-white py-20 md:py-28">
      <Container>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <SectionHeader
            label="Your Learning Journey"
            title="Every Journey Begins With One Step."
            description="A clear, guided path from your first choice to global opportunity — designed to keep you moving forward with confidence."
          />

          {/* Timeline */}
          <div className="relative mt-16">
            {/* Horizontal connector line (desktop) */}
            <div
              className="absolute left-0 right-0 top-9 hidden h-0.5 bg-gradient-to-r from-gold/10 via-gold/40 to-gold/10 lg:block"
              aria-hidden="true"
            />

            <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-7 lg:gap-4">
              {STEPS.map((step, i) => (
                <motion.li
                  key={step.title}
                  variants={item}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Icon medallion */}
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-white p-4 shadow-navy transition-all duration-500 hover:border-gold hover:shadow-gold-glow">
                    <step.icon size={28} className="text-gold" aria-hidden="true" />
                    {/* Step number badge */}
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                      {i + 1}
                    </span>
                  </div>

                  {/* Step content */}
                  <h3 className="mt-5 text-sm font-bold text-navy">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{step.description}</p>

                  {/* Mobile arrow connector */}
                  {i < STEPS.length - 1 && (
                    <ArrowRight
                      size={20}
                      className="mt-4 rotate-90 text-gold/50 lg:hidden"
                      aria-hidden="true"
                    />
                  )}
                </motion.li>
              ))}
            </ol>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
