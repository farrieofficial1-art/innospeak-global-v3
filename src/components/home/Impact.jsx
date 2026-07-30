import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import StatCard from './StatCard.jsx';
import HighlightCards from './HighlightCards.jsx';
import QuoteCard from './QuoteCard.jsx';
import Button from '../ui/Button.jsx';
import { IMPACT_STATS } from './impactData.js';

export default function Impact() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Our Impact & Success"
          title="Measurable Impact, Real Results"
          subtitle="Our numbers tell a story of growth, transformation and a growing global community of confident learners."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {IMPACT_STATS.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} />
          ))}
        </div>

        <div className="mt-12">
          <HighlightCards />
        </div>

        <div className="mt-12">
          <QuoteCard />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Button to="/impact" variant="outline" size="lg" className="group">
            See Our Full Impact
            <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
