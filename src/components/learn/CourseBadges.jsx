import { Award, BookOpen } from 'lucide-react';
import { TRACK_BY_ID } from '../../lib/data/academy.js';

export default function CourseBadges({ course, size = 'sm' }) {
  if (!course) return null;
  const track = TRACK_BY_ID[course.track_id] || null;
  const iconSize = size === 'sm' ? 14 : 18;
  const padding = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {track && (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-navy-50 ${padding} font-body font-medium text-navy-700`}>
          <BookOpen size={iconSize} className="text-gold-500" />
          {track.name}
        </span>
      )}
      {course.level && (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-gold-50 ${padding} font-body font-medium text-gold-700`}>
          <Award size={iconSize} />
          {course.level}
        </span>
      )}
    </div>
  );
}
