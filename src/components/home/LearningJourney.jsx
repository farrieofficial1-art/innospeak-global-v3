import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import JourneyStage from './JourneyStage.jsx';
import ProgressStrip from './ProgressStrip.jsx';
import Button from '../ui/Button.jsx';
import { JOURNEY_STEPS } from './journeyData.js';

export default function LearningJourney() {
  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Your Learning Journey"
          title="From Discovery to Leadership"
          subtitle="Every learner follows a clear, guided path — six stages designed to take you from your first curiosity to confident leadership."
        />

        <div className="relative mt-14">
          <div className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-gold-300 via-navy-200 to-gold-300 lg:block" />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {JOURNEY_STEPS.map((step, i) => (
              <JourneyStage key={step.id} step={step} index={i} />
            ))}
          </div>
        </div>

        <div className="mt-14">
          <ProgressStrip />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Button to="/apply" variant="gold" size="lg" className="group">
            Start Your Journey
            <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
