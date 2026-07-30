import { Link } from 'react-router-dom';
import { Heart, Clock, BarChart3, Award, ArrowRight } from 'lucide-react';
import { getPathwayById } from '../../../lib/data/programmeData';

/**
 * CourseCard — premium course card for the programme catalogue.
 *
 * Same data contract and props as before (course, isFavourite,
 * onToggleFavourite, index). Restyled on the verified live-Home
 * "premium card" recipe (home/EcosystemCard.jsx, home/WhyChooseCard.jsx):
 * solid white surface, shadow-premium -> shadow-premium-lg on hover, and
 * the navy-900 <-> gold-gradient inversion used for badges/icons across
 * the site.
 */
export default function CourseCard({ course, isFavourite, onToggleFavourite, index = 0 }) {
  const courseCode = course.code || course.courseCode || course.id || 'COURSE';
  const courseName = course.name || course.title || course.programmeName || course.programme || 'Untitled programme';
  const pathway = getPathwayById(course.pathwayId || course.pathway_id || course.pathway || course.pathwaySlug);
  const applyTo = `/apply?courseCode=${encodeURIComponent(courseCode)}`;
  const detailsTo = `/courses/${encodeURIComponent(courseCode)}`;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg">
      {/* Header: code + favourite */}
      <div className="flex items-start justify-between">
        <span className="inline-flex items-center rounded-full bg-navy-900 px-3 py-1 font-mono text-xs font-bold text-gold-400">
          {courseCode}
        </span>
        <button
          type="button"
          onClick={() => onToggleFavourite(courseCode)}
          aria-label={isFavourite ? `Remove ${courseCode} from favourites` : `Add ${courseCode} to favourites`}
          aria-pressed={isFavourite}
          className="flex h-9 w-9 items-center justify-center rounded-full text-navy-400 transition-colors duration-200 hover:bg-gold-500/10 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
        >
          <Heart
            size={20}
            className={isFavourite ? 'fill-gold-500 text-gold-500' : ''}
          />
        </button>
      </div>

      {/* Title + pathway */}
      <h3 className="mt-4 font-display text-base font-bold leading-snug text-navy-900">{courseName}</h3>
      <p className="mt-1 font-body text-xs font-semibold text-gold-600">
        {pathway?.title || course.category || course.pathway || 'Programme'}
      </p>

      {/* Description */}
      <p className="mt-3 flex-1 font-body text-xs leading-relaxed text-navy-600 line-clamp-2">
        {course.shortDescription || course.description || course.summary || course.overview || 'More details coming soon.'}
      </p>

      {/* Meta */}
      <div className="mt-4 flex flex-wrap items-center gap-3 font-body text-xs text-navy-500">
        <span className="inline-flex items-center gap-1">
          <Clock size={13} aria-hidden="true" />
          {course.duration || course.length || course.durationText || 'Flexible'}
        </span>
        <span className="inline-flex items-center gap-1">
          <BarChart3 size={13} aria-hidden="true" />
          {course.level || course.levelLabel || course.difficulty || 'Flexible'}
        </span>
        <span className="inline-flex items-center gap-1">
          <Award size={13} aria-hidden="true" />
          {course.studyMode || course.mode || course.deliveryMode || 'Flexible'}
        </span>
      </div>

      {/* Certification + fees */}
      <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-4">
        <div>
          <p className="font-body text-xs font-medium uppercase tracking-wider text-navy-400">Fees</p>
          <p className="font-body text-sm font-bold text-navy-900">{course.fees ?? course.price ?? course.fee ?? 'Contact us'}</p>
        </div>
        <div className="text-right">
          <p className="font-body text-xs font-medium uppercase tracking-wider text-navy-400">Certification</p>
          <p className="max-w-[10rem] truncate font-body text-sm font-bold text-navy-900">
            {course.certification || course.certificate || course.outcome || 'Certificate available'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center gap-3">
        <Link
          to={applyTo}
          className="flex-1 rounded-full bg-navy-900 px-5 py-2.5 text-center font-body text-sm font-semibold text-white transition-colors duration-300 hover:bg-gold-gradient hover:text-navy-900"
        >
          Apply
        </Link>
        <Link
          to={detailsTo}
          className="group/btn inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-navy-100 bg-white px-5 py-2.5 font-body text-sm font-medium text-navy-900 shadow-premium transition-all duration-300 hover:-translate-y-0.5 hover:border-navy-900 hover:bg-navy-900 hover:text-white"
        >
          View Details
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}