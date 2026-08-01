import { motion } from 'framer-motion';
import { Compass, Users, Hammer, Trophy } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const STEPS = [
  { icon: Compass, title: 'Discover or Propose', description: 'Pick up a real sourced challenge, or bring your own idea to the table.' },
  { icon: Users, title: 'Team & Mentor Match', description: 'Get paired with collaborators and a mentor suited to your track.' },
  { icon: Hammer, title: 'Build & Iterate', description: 'Work through structured check-ins, feedback and revisions.' },
  { icon: Trophy, title: 'Showcase & Launch', description: 'Present your outcome at a demo day, pitch panel or public showcase.' },
];

const container = staggerContainer(0.12, 0.1);

export default function InnovationProcess() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="How It Works"
            title="The Same Process, Every Track"
            subtitle="Whichever track you choose, the journey follows the same rhythm."
          />

          <div className="relative mt-14">
            <div
              className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-gold-300 via-navy-200 to-gold-300 md:block"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <motion.div key={step.title} variants={fadeUpItem} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 shadow-premium">
                    <step.icon size={26} strokeWidth={1.8} aria-hidden="true" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-gradient font-display text-xs font-bold text-navy-900">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-sm font-bold text-navy-900">{step.title}</h3>
                  <p className="mt-2 font-body text-xs leading-relaxed text-navy-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}