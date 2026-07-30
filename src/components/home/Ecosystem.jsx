import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading.jsx';
import EcosystemCard from './EcosystemCard.jsx';
import { ECOSYSTEM_CARDS, ECOSYSTEM_STATEMENT } from './ecosystemData.js';

export default function Ecosystem() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Our Ecosystem"
          title="Three Pillars of Excellence"
          subtitle="InnoSpeak Global brings together an Academy, a Foundation and an Innovation Lab — each working in harmony to create a complete learning ecosystem."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ECOSYSTEM_CARDS.map((card, i) => (
            <EcosystemCard key={card.id} card={card} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-12 max-w-2xl text-center font-display text-lg font-medium italic text-navy-600"
        >
          {ECOSYSTEM_STATEMENT}
        </motion.p>
      </div>
    </section>
  );
}
