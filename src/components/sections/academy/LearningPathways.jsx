import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Award,
  Languages,
  Cpu,
  GraduationCap,
  Palette,
  Briefcase,
  Rocket,
  Cog,
  Compass,
  Globe2,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../ui';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce, easeOutExpo } from '../../../lib/motion/presets';
import { PATHWAYS, getCoursesByPathway } from '../../../lib/data/programmeData';

/**
 * LearningPathways — eleven expandable pathway cards.
 *
 * Reads from the shared PATHWAYS + COURSES data so the pathway course
 * lists stay in sync with the catalogue. Each course links to its
 * Course Details page.
 *
 * Home's own Pathways/PathwayCard don't expand/collapse, so this
 * section keeps its own accordion structure, restyled with the same
 * premium-card tokens PathwayCard uses (navy-900/gold-400 icon,
 * shadow-premium, border-gold-300/60 accent).
 */

const ICON_MAP = {
  'global-language': MessageSquare,
  'languages': Languages,
  'international-qualifications': Award,
  'national-tvet': GraduationCap,
  'technology': Cpu,
  'creative-design': Palette,
  'business': Briefcase,
  'freelancing': Rocket,
  'engineering': Cog,
  'career': Compass,
  'global-opportunities': Globe2,
};

const container = staggerContainer(0.12, 0.1);

function PathwayCard({ pathway, isOpen, onToggle, index }) {
  const Icon = ICON_MAP[pathway.id] || MessageSquare;
  const courses = getCoursesByPathway(pathway.id);

  return (
    <motion.div variants={fadeUpItem} className="h-full">
      <div
        className={`group relative h-full overflow-hidden rounded-2xl border bg-white shadow-premium transition-all duration-300 ${
          isOpen
            ? 'border-gold-300/60 shadow-premium-lg'
            : 'border-navy-100 hover:-translate-y-1 hover:border-gold-300/60 hover:shadow-premium-lg'
        }`}
      >
        {/* Header */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`pathway-detail-${pathway.id}`}
          className="relative flex w-full items-start gap-4 p-7 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
        >
          {/* Number badge */}
          <span className="font-display text-4xl font-bold text-navy-100" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Icon */}
          <div
            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl transition-colors duration-300 ${
              isOpen ? 'bg-gold-gradient text-navy-900' : 'bg-navy-900 text-gold-400 group-hover:bg-gold-gradient group-hover:text-navy-900'
            }`}
          >
            <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
          </div>

          {/* Title + description */}
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-navy-900">{pathway.title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-navy-600">{pathway.description}</p>
          </div>

          {/* Chevron */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-900"
          >
            <ChevronDown size={18} />
          </motion.div>
        </button>

        {/* Expandable detail */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={`pathway-detail-${pathway.id}`}
              key="detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
              className="overflow-hidden"
            >
              <div className="border-t border-navy-100 px-7 pb-7 pt-6">
                <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                  Courses Include ({courses.length})
                </p>
                <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {courses.map((course) => (
                    <li key={course.code}>
                      <Link
                        to={`/courses/${course.code}`}
                        className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3 transition-colors duration-200 hover:bg-gold-50"
                      >
                        <span className="font-mono text-xs font-semibold text-gold-600">
                          {course.code}
                        </span>
                        <span className="font-body text-sm font-medium text-navy-900">{course.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button to="/academy" variant="ghost" size="sm" withArrow={false} className="group">
                    Explore Programmes
                    <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function LearningPathways() {
  const [openId, setOpenId] = useState('global-language');

  return (
    <section aria-label="Our learning pathways" className="bg-white py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Our Learning Pathways"
          title="Choose the Pathway That Fits Your Future"
          subtitle="Eleven connected pathways — each opening into a detailed set of programmes designed to take you from foundation to mastery."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          className="mt-14 grid grid-cols-1 gap-7 lg:grid-cols-2 xl:grid-cols-3"
        >
          {PATHWAYS.map((pathway, i) => (
            <PathwayCard
              key={pathway.id}
              pathway={pathway}
              index={i}
              isOpen={openId === pathway.id}
              onToggle={() => setOpenId(openId === pathway.id ? null : pathway.id)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}