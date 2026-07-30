import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, BookOpen } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce, easeOutExpo } from '../../../lib/motion/presets';

const container = staggerContainer(0.1, 0.05);

export default function CourseModules({ course }) {
  const [openIndex, setOpenIndex] = useState(0);
  const modules = course.modules || [];

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="Course Modules"
            title="What You Will Learn"
            subtitle="The course is structured into focused modules, each building on the last."
          />

          <motion.div
            variants={fadeUpItem}
            className="mx-auto mt-12 max-w-3xl divide-y divide-navy-100 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-premium"
          >
            {modules.map((module, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-inset"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-navy-900 font-mono text-sm font-bold text-gold-400">
                        {i + 1}
                      </span>
                      <span className="font-body text-base font-semibold text-navy-900">{module.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden items-center gap-1.5 font-body text-xs font-medium text-navy-500 sm:flex">
                        <Clock size={14} aria-hidden="true" />
                        {module.hours}h
                      </span>
                      <span className={`text-gold-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} />
                      </span>
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: easeOutExpo }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pl-[4.5rem]">
                          <p className="font-body text-sm leading-relaxed text-navy-600">{module.description}</p>
                          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gold-500/10 px-3 py-1.5 font-body text-xs font-medium text-gold-600">
                            <BookOpen size={14} aria-hidden="true" />
                            Estimated learning time: {module.hours} hours
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>

          <motion.p variants={fadeUpItem} className="mt-6 text-center font-body text-sm font-medium text-navy-600">
            Total estimated learning time:{' '}
            <span className="font-bold text-navy-900">
              {modules.reduce((sum, m) => sum + (m.hours || 0), 0)} hours
            </span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}