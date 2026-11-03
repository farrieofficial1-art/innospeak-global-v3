import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { TRACK_BY_ID as LAB_TRACK_BY_ID } from '../../lib/data/registry.js';
import { priceKes } from '../../lib/data/labs.js';

const LEVEL_STYLES = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-amber-100 text-amber-700',
  Expert: 'bg-rose-100 text-rose-700',
};

const TRACK_GRADIENTS = {
  'software-engineering': 'from-blue-600 to-cyan-600',
  'data-analytics': 'from-indigo-600 to-blue-500',
  'ai-intelligent-systems': 'from-emerald-600 to-teal-600',
  'cloud-infrastructure': 'from-sky-600 to-blue-700',
  cybersecurity: 'from-red-600 to-rose-700',
  'engineering-smart-systems': 'from-amber-600 to-orange-600',
  'creative-technology': 'from-pink-600 to-rose-600',
};

export default function LabCourseCard({ course }) {
  if (!course) return null;
  const track = LAB_TRACK_BY_ID[course.track_id] || {};
  const Icon = track.icon;
  const levelClass = LEVEL_STYLES[course.level] || 'bg-navy-100 text-navy-700';
  const gradient = TRACK_GRADIENTS[course.track_id] || 'from-navy-600 to-navy-800';
  const kes = priceKes(course.price_usd || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="card-premium group flex flex-col overflow-hidden p-0"
    >
      <div className={`flex items-center gap-3 bg-gradient-to-r ${gradient} px-6 py-4`}>
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
            <Icon size={20} strokeWidth={1.8} />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-body text-xs font-semibold uppercase tracking-wider text-white/80">
            {track.title || 'Labs'}
          </p>
          <p className="font-mono text-xs font-bold text-white">{course.code}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-bold leading-snug text-navy-900">
          {course.title}
        </h3>

        <p className="mt-2 line-clamp-2 font-body text-sm leading-relaxed text-navy-500">
          {course.summary}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 font-body text-xs font-semibold ${levelClass}`}>
            {course.level || 'Beginner'}
          </span>
          <span className="rounded-full bg-navy-50 px-3 py-1 font-body text-xs font-semibold text-navy-600">
            {course.duration_weeks} weeks
          </span>
        </div>

        {course.skills?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {course.skills.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-md bg-gold-500/10 px-2 py-0.5 font-body text-[11px] font-semibold text-gold-700"
              >
                {s}
              </span>
            ))}
          </div>
        )}

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
            to={`/labs/${course.slug}`}
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

