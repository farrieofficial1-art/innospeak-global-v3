import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

/**
 * FAQ — frequently asked questions accordion.
 *
 * The shared ui/Accordion.jsx (broken navy/gold/muted tokens) is also
 * used by course/CourseFAQ.jsx on the Course Details page, so it's out
 * of scope to edit here. Home solved the same problem by building its
 * own local home/FaqAccordion.jsx instead of using ui/Accordion — this
 * mirrors that exact pattern for the Academy page, on the same
 * border-navy-100/gold-gradient card recipe.
 */

const FAQS = [
  {
    question: 'Who can apply?',
    answer:
      'Anyone aged 16 and above — students, professionals, graduates, job seekers and lifelong learners — is welcome to apply. Our programmes span beginner to advanced levels, so there is a starting point for everyone.',
  },
  {
    question: 'Are classes online?',
    answer:
      'Yes. Most programmes are offered online, with select programmes available in physical or hybrid mode. You can choose the study mode that best fits your schedule and location.',
  },
  {
    question: 'Do I receive a certificate?',
    answer:
      'Yes. On successful completion of your programme you receive a verified digital certificate, a professional transcript and a career portfolio documenting your projects and achievements.',
  },
  {
    question: 'How long are programmes?',
    answer:
      'Programme durations vary — most run between 6 and 16 weeks, depending on the pathway and level. Each programme page lists its exact duration and study mode.',
  },
  {
    question: 'What are the payment options?',
    answer:
      'We offer affordable fees with flexible payment options, including instalment plans for selected programmes. Contact our admissions team to discuss the option that works best for you.',
  },
];

const container = staggerContainer(0.1, 0.1);

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <motion.div
      variants={fadeUpItem}
      className={`overflow-hidden rounded-2xl border bg-white shadow-premium transition-all duration-300 ${
        isOpen ? 'border-gold-300/60 shadow-premium-lg' : 'border-navy-100'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
      >
        <span className="font-display text-base font-semibold text-navy-900 sm:text-lg">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
            isOpen ? 'bg-gold-gradient text-navy-900' : 'bg-navy-50 text-navy-700'
          }`}
        >
          <Plus size={20} strokeWidth={2} aria-hidden="true" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 font-body text-sm leading-relaxed text-navy-600 sm:text-base">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section aria-label="Frequently asked questions" className="bg-white py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Everything You Need to Know"
          subtitle="Answers to the questions we hear most often. Can't find what you're looking for? Our admissions team is happy to help."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          className="mx-auto mt-12 max-w-3xl space-y-4"
        >
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
      </div>
    </section>
  );
}