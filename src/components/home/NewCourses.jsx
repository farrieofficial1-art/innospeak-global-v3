import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import { ACADEMY_COURSES } from '../../lib/data/academy.js';
import { LAB_COURSES } from '../../lib/data/labs.js';
import { TRACK_BY_ID } from '../../lib/data/registry.js';

const LEVEL_STYLES = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-amber-100 text-amber-700',
  Expert: 'bg-rose-100 text-rose-700',
};

export default function NewCourses() {
  const academyCourses = ACADEMY_COURSES.slice(-4).reverse();
  const labCourses = LAB_COURSES.slice(-4).reverse();

  return (
    <section className="bg-navy-radial py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Fresh off the press"
          title="Newly Added Courses"
          subtitle="The latest additions to our Academy and Labs catalogues. Expand your skill set with something new."
          light
        />

        {/* Academy courses */}
        <div className="mt-10">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-gold-500/20 px-3 py-1 font-body text-xs font-bold uppercase tracking-wider text-gold-300">
              Academy
            </span>
            <Link
              to="/academy"
              className="font-body text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300"
            >
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {academyCourses.map((course, i) => (
              <motion.article
                key={course.code}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3 py-1 font-body text-xs font-bold text-gold-300">
                    New
                  </span>
                  <span className="font-display text-xs font-bold text-white/70">
                    {course.code}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-bold leading-snug text-white">
                  {course.title}
                </h3>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-white/10 px-2.5 py-1 font-body text-xs font-medium text-white/80">
                    ${course.price_usd}
                  </span>
                  <span className="rounded-md bg-white/10 px-2.5 py-1 font-body text-xs font-medium text-white/80">
                    {course.level}
                  </span>
                </div>
                <Link
                  to={`/academy/${course.slug}`}
                  className="mt-auto inline-flex items-center gap-1.5 pt-5 font-body text-sm font-semibold text-gold-400 transition-colors group-hover:text-gold-300"
                >
                  View Course
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Labs courses */}
        <div className="mt-10">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-body text-xs font-bold uppercase tracking-wider text-emerald-300">
              Labs
            </span>
            <Link
              to="/labs"
              className="font-body text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300"
            >
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {labCourses.map((course, i) => {
              const track = TRACK_BY_ID[course.track_id] || {};
              const levelClass = LEVEL_STYLES[course.level] || 'bg-white/10 text-white/80';
              return (
                <motion.article
                  key={course.code}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white/60">
                      {track.code || 'LAB'}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 font-body text-xs font-semibold ${levelClass}`}>
                      {course.level}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold leading-snug text-white">
                    {course.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 font-body text-xs leading-relaxed text-white/60">
                    {course.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-white/10 px-2.5 py-1 font-body text-xs font-medium text-white/80">
                      ${course.price_usd}
                    </span>
                    <span className="rounded-md bg-white/10 px-2.5 py-1 font-body text-xs font-medium text-white/80">
                      {course.duration_weeks} weeks
                    </span>
                  </div>
                  <Link
                    to={`/labs/${course.slug}`}
                    className="mt-auto inline-flex items-center gap-1.5 pt-5 font-body text-sm font-semibold text-gold-400 transition-colors group-hover:text-gold-300"
                  >
                    View Course
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
