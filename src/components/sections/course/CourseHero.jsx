import { motion } from 'framer-motion';
import {
  Clock,
  BarChart3,
  Monitor,
  Award,
  BadgeCheck,
  Info,
  GraduationCap,
} from 'lucide-react';
import { Button } from '../../ui';
import { staggerContainer, fadeUpItem, easeOutExpo } from '../../../lib/motion/presets';

/**
 * CourseHero — premium hero section for the Course Details template.
 *
 * Rebuilt on the verified navy-900/gold-500 tokens: container-premium
 * instead of the broken Container/container-px, a local eyebrow pill
 * instead of the orphaned sections/home/SectionLabel, font-display
 * headline, and Button variant="gold"/"outline" (the previous
 * variant="primary"/"secondary" aren't real Button variants — both
 * were silently falling back to the same gold style).
 */
const container = staggerContainer(0.1, 0.05);

const INFO_PILLS = [
  { icon: BarChart3, label: 'Level', key: 'level' },
  { icon: Monitor, label: 'Study Mode', key: 'studyMode' },
  { icon: Clock, label: 'Duration', key: 'duration' },
  { icon: Award, label: 'Certification', key: 'certification' },
];

export default function CourseHero({ course }) {
  const applyTo = `/apply?courseCode=${course.code}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream via-white to-cream pb-20 pt-32 md:pt-40">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-navy-900/5 blur-3xl" aria-hidden="true" />

      <div className="container-premium relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — content */}
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.div variants={fadeUpItem} className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-navy-900 px-4 py-1.5 font-mono text-xs font-bold text-gold-400">
                {course.code}
              </span>
              <span className="inline-flex items-center rounded-full bg-gold-500/10 px-4 py-1.5 font-body text-xs font-bold uppercase tracking-wider text-gold-600">
                {course.pathway}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUpItem}
              className="mt-6 font-display text-4xl font-bold leading-[1.1] text-navy-900 sm:text-5xl lg:text-6xl"
            >
              {course.name}
            </motion.h1>

            <motion.p variants={fadeUpItem} className="mt-3 font-body text-sm font-medium text-navy-500">
              {course.academy}
            </motion.p>

            {/* Info pills */}
            <motion.div variants={fadeUpItem} className="mt-6 flex flex-wrap gap-3">
              {INFO_PILLS.map(({ icon: Icon, label, key }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 rounded-xl border border-navy-100 bg-white/70 px-4 py-2.5 font-body text-sm font-medium text-navy-900 shadow-premium backdrop-blur-sm"
                >
                  <Icon size={16} className="text-gold-600" aria-hidden="true" />
                  {label}: <span className="font-bold">{course[key]}</span>
                </div>
              ))}
            </motion.div>

            {/* Fees + status */}
            <motion.div variants={fadeUpItem} className="mt-6 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-baseline gap-2">
                <span className="font-body text-xs font-semibold uppercase tracking-wider text-navy-400">Fees</span>
                <span className="font-display text-2xl font-bold text-navy-900">{course.fees}</span>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 font-body text-sm font-semibold text-green-700">
                <BadgeCheck size={16} aria-hidden="true" />
                {course.status}
              </span>
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={fadeUpItem} className="mt-8 flex flex-wrap items-center gap-4">
              <Button to={applyTo} variant="gold" size="lg">
                Apply Now
              </Button>
              <Button to="/contact" variant="outline" size="lg" withArrow={false}>
                <Info size={18} className="mr-1" />
                Request Information
              </Button>
            </motion.div>
          </motion.div>

          {/* Right — illustration card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy-900 to-navy-700 p-10 shadow-premium-lg">
              {/* Decorative grid */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(212,160,23,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.3) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
                aria-hidden="true"
              />

              {/* Floating gold ring */}
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative mx-auto flex h-48 w-48 items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full border-2 border-gold-500/30" aria-hidden="true" />
                <div className="absolute -inset-4 rounded-full border border-gold-500/15" aria-hidden="true" />
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gold-500/10 backdrop-blur-sm">
                  <GraduationCap size={64} className="text-gold-400" aria-hidden="true" />
                </div>
              </motion.div>

              {/* Course meta card */}
              <div className="relative mt-10 space-y-3">
                {[
                  { label: 'Pathway', value: course.pathway },
                  { label: 'Duration', value: course.duration },
                  { label: 'Mode', value: course.studyMode },
                  { label: 'Certification', value: course.certification },
                  { label: 'Instructor', value: course.instructor?.name || 'TBA' },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                  >
                    <span className="font-body text-xs font-medium uppercase tracking-wider text-white/50">
                      {label}
                    </span>
                    <span className="font-body text-sm font-bold text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}