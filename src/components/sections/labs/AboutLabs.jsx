import { motion } from 'framer-motion';
import { GraduationCap, FlaskConical, ArrowRight } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const container = staggerContainer(0.12, 0.1);

export default function AboutLabs() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="More Than a Course"
            title="Where Skills Meet Real Problems"
            subtitle="Labs isn't a second curriculum — it's what comes after the learning. Seven innovation pathways, one mission: build something real."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <motion.div
              variants={fadeUpItem}
              className="rounded-2xl border border-navy-100 bg-cream p-8 shadow-premium"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <GraduationCap size={22} aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-navy-900">Academy</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-navy-600">
                Structured programmes, modules and certification. You learn a skill —
                communication, engineering, technology, business — from the ground up.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUpItem}
              className="rounded-2xl border border-gold-300/60 bg-navy-900 p-8 shadow-premium-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient text-navy-900">
                <FlaskConical size={22} aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-white">Labs</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-navy-200">
                No lessons, no quizzes. You join a team or bring your own idea, work against a
                real challenge with a mentor and a deadline, and walk away with something you
                actually built.
              </p>
            </motion.div>
          </div>

          <motion.div variants={fadeUpItem} className="mt-8 flex items-center justify-center gap-2 font-body text-sm font-medium text-navy-500">
            Most learners move from Academy into Labs once they're ready to apply what they've learned
            <ArrowRight size={16} aria-hidden="true" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}