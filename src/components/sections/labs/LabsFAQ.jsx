import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const container = staggerContainer(0.1, 0.1);

const FAQS = [
  {
    question: 'Do I need to be an Academy student to join Labs?',
    answer:
      'No. Labs is open to anyone ready to build — Academy graduates, current students, and newcomers with the right foundational skills or a strong idea.',
  },
  {
    question: "What if I don't have a team or an idea yet?",
    answer:
      'That\'s fine — join Innovation Projects or Tech Workshops and you\'ll be matched into a team or a sourced challenge. Startup Incubation is the track for people who already have an idea they want to build.',
  },
  {
    question: 'Is there a cost to join a Lab track?',
    answer:
      'Track fees and intake timing vary — reach out through the Contact page and our team will walk you through current options.',
  },
  {
    question: 'Can organizations or communities submit a real challenge?',
    answer:
      'Yes — that\'s how most Innovation Projects challenges are sourced. Use the Contact form and select "Submit a Lab Challenge."',
  },
];

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
        isOpen ? 'border-gold-300/60' : 'border-navy-100'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
      >
        <span className="font-display text-base font-semibold text-navy-900">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
            isOpen ? 'bg-gold-gradient text-navy-900' : 'bg-navy-50 text-navy-700'
          }`}
        >
          <Plus size={18} aria-hidden="true" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 font-body text-sm leading-relaxed text-navy-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LabsFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />

          <motion.div variants={fadeUpItem} className="mx-auto mt-12 max-w-3xl space-y-4">
            {FAQS.map((item, i) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}