import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { TRACK_BY_ID, priceKes } from '../../lib/data/academy.js';

const LEVEL_STYLES = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-amber-100 text-amber-700',
  Expert: 'bg-rose-100 text-rose-700',
};

export default function CourseCard({ course }) {
  if (!course) return null;
  const track = TRACK_BY_ID[course.track_id] || {};
  const Icon = track.icon;
  const levelClass = LEVEL_STYLES[course.level] || 'bg-navy-100 text-navy-700';
  const kes = priceKes(course.price_usd || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="card-premium group flex flex-col p-0 overflow-hidden"
    >
      {/* Track header */}
      <div className={`flex items-center gap-3 bg-gradient-to-r ${track.gradient || 'from-navy-600 to-navy-800'} px-6 py-4`}>
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
            <Icon size={20} strokeWidth={1.8} />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-body text-xs font-semibold uppercase tracking-wider text-white/80">
            {track.name || 'Course'}
          </p>
          <p className="font-mono text-xs font-bold text-white">{course.code}</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-bold leading-snug text-navy-900">
          {course.title}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 font-body text-xs font-semibold ${levelClass}`}>
            {course.level || 'Beginner'}
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-5">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-navy-900">
              ${course.price_usd}
            </span>
            <span className="font-body text-sm text-navy-500">
              ≈ KES {kes.toLocaleString()}
            </span>
          </div>

          <Link
            to={`/academy/${course.slug}`}
            className="mt-4 inline-flex items-center gap-1.5 font-body text-sm font-bold text-gold-600 transition-colors hover:text-gold-700"
          >
            View course
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
