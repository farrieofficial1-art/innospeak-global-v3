import { motion } from 'framer-motion';
import { MessageCircle, Cpu, Crown, ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import PathwayCard from './PathwayCard.jsx';
import Button from '../ui/Button.jsx';
import { PATHWAY_BADGES, PATHWAYS } from './pathwaysData.js';

const BADGE_ICONS = {
  'message-circle': MessageCircle,
  cpu: Cpu,
  crown: Crown,
};

export default function Pathways() {
  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Learning Pathways"
          title="Programmes Designed for Every Goal"
          subtitle="Whether you are starting out or levelling up, our pathways in Communication, Technical and Leadership skills guide your journey from foundation to mastery."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {PATHWAY_BADGES.map((badge) => {
            const Icon = BADGE_ICONS[badge.icon] ?? MessageCircle;
            return (
              <div
                key={badge.id}
                className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-white px-4 py-2 shadow-sm"
              >
                <Icon size={16} className="text-gold-500" />
                <span className="font-body text-sm font-semibold text-navy-700">
                  {badge.label}
                </span>
              </div>
            );
          })}
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PATHWAYS.map((pathway, i) => (
            <PathwayCard key={pathway.id} pathway={pathway} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Button to="/academy" variant="gold" size="lg" className="group">
            View All Programmes
            <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
