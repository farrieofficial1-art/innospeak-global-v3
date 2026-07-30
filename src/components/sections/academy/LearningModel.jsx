import { motion } from 'framer-motion';
import {
  Route,
  BookOpen,
  Layers,
  ClipboardCheck,
  FolderCheck,
  Award,
  Globe2,
  ArrowRight,
} from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

/**
 * LearningModel — the InnoSpeak Learning Journey for the Academy.
 *
 * Same seven-step timeline as before, restyled on the exact medallion
 * recipe from home/JourneyStage.jsx (the live Home page's equivalent
 * "learning journey" section): rounded-2xl bg-navy-900/text-gold-400
 * icon, gold-gradient step-number badge, font-display/navy-900 title.
 * Kept as a single horizontal row on desktop (rather than Home's 3-col
 * grid) since seven sequential steps read better as one line, with the
 * same connector-line and mobile-arrow treatment as before.
 */

const STEPS = [
  { icon: Route, title: 'Choose Pathway', description: 'Select the pathway aligned to your goals.' },
  { icon: BookOpen, title: 'Choose Programme', description: 'Enrol in a programme that builds real skills.' },
  { icon: Layers, title: 'Study Modules', description: 'Progress through structured, practical modules.' },
  { icon: ClipboardCheck, title: 'Continuous Assessment', description: 'Get regular feedback to sharpen your skills.' },
  { icon: FolderCheck, title: 'Capstone Project', description: 'Apply your learning to a real-world project.' },
  { icon: Award, title: 'Professional Certification', description: 'Earn recognised credentials for your work.' },
  { icon: Globe2, title: 'Global Opportunities', description: 'Unlock study, work and leadership pathways worldwide.' },
];

const container = staggerContainer(0.12, 0.1);

export default function LearningModel() {
  return (
    <section aria-label="The InnoSpeak learning model" className="bg-cream py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Learning Model"
          title="The InnoSpeak Learning Journey"
          subtitle="A clear, guided path from your first choice to global opportunity — designed to keep you moving forward with confidence."
        />

        {/* Timeline */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          className="relative mt-14"
        >
          {/* Horizontal connector line (desktop) */}
          <div
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-gold-300 via-navy-200 to-gold-300 lg:block"
            aria-hidden="true"
          />

          <ol className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-7 lg:gap-4">
            {STEPS.map((step, i) => (
              <motion.li
                key={step.title}
                variants={fadeUpItem}
                className="relative flex flex-col items-center text-center"
              >
                {/* Icon medallion */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 shadow-premium transition-transform duration-300 hover:scale-105">
                  <step.icon size={26} strokeWidth={1.8} aria-hidden="true" />
                  {/* Step number badge */}
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-gradient font-display text-xs font-bold text-navy-900">
                    {i + 1}
                  </span>
                </div>

                {/* Step content */}
                <h3 className="mt-5 font-display text-sm font-bold text-navy-900">{step.title}</h3>
                <p className="mt-2 font-body text-xs leading-relaxed text-navy-600">{step.description}</p>

                {/* Mobile arrow connector */}
                {i < STEPS.length - 1 && (
                  <ArrowRight
                    size={20}
                    className="mt-4 rotate-90 text-gold-300 lg:hidden"
                    aria-hidden="true"
                  />
                )}
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}