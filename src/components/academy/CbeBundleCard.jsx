import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { getBundleCourses } from '../../lib/data/cbe.js';

const STAGE_ACCENTS = {
  'lower-primary': { bar: 'from-emerald-500 to-green-600', badge: 'bg-emerald-100 text-emerald-700' },
  'junior-school': { bar: 'from-blue-500 to-cyan-600', badge: 'bg-blue-100 text-blue-700' },
  'senior-school': { bar: 'from-amber-500 to-orange-600', badge: 'bg-amber-100 text-amber-700' },
  electives: { bar: 'from-fuchsia-500 to-pink-600', badge: 'bg-fuchsia-100 text-fuchsia-700' },
};

export default function CbeBundleCard({ bundle }) {
  if (!bundle) return null;
  const courses = getBundleCourses(bundle);
  const count = courses.length;
  const accent = STAGE_ACCENTS[bundle.stage] || STAGE_ACCENTS.electives;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="card-premium group flex flex-col overflow-hidden p-0"
    >
      <div className={`flex items-center gap-3 bg-gradient-to-r ${accent.bar} px-6 py-4`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
          <BookOpen size={20} strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-body text-xs font-semibold uppercase tracking-wider text-white/80">
            {bundle.gradeLevel}
          </p>
          <p className="font-display text-base font-bold text-white">{bundle.title}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="font-body text-sm leading-relaxed text-navy-600">
          {bundle.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {bundle.subjects.slice(0, 5).map((s) => (
            <span
              key={s}
              className="rounded-full bg-navy-50 px-2.5 py-1 font-body text-[11px] font-semibold text-navy-600"
            >
              {s}
            </span>
          ))}
          {bundle.subjects.length > 5 && (
            <span className="rounded-full bg-navy-50 px-2.5 py-1 font-body text-[11px] font-semibold text-navy-400">
              +{bundle.subjects.length - 5} more
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-5">
          <span className={`rounded-full px-3 py-1 font-body text-xs font-bold ${accent.badge}`}>
            {count} course{count === 1 ? '' : 's'}
          </span>
          <Link
            to={`/academy/cbe/${bundle.slug}`}
            className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-gold-600 transition-colors hover:text-gold-700"
          >
            Open bundle
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
