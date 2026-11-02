import { ACADEMY_COURSES } from '../../lib/data/academy.js';

export const PATHWAY_BADGES = [
  { id: 'communication', label: 'Communication', icon: 'message-circle' },
  { id: 'tech', label: 'Technology', icon: 'cpu' },
  { id: 'business', label: 'Business', icon: 'briefcase' },
  { id: 'creative', label: 'Creative', icon: 'palette' },
  { id: 'languages', label: 'Languages', icon: 'book-open' },
  { id: 'engineering', label: 'Engineering', icon: 'cog' },
];

const ICON_MAP = {
  ai: 'cpu',
  data: 'cpu',
  digital: 'laptop',
  freelance: 'briefcase',
  business: 'briefcase',
  leadership: 'users',
  marketing: 'briefcase',
  finance: 'briefcase',
  tech: 'cpu',
  creative: 'palette',
  languages: 'book-open',
  exams: 'award',
  education: 'book-open',
  personal: 'sparkles',
  health: 'heart',
  engineering: 'cog',
  cbe: 'book-open',
};

export function getInDemandCourses(count = 8) {
  const featured = [
    'AIC103', 'DAT102', 'MKT101', 'TEC105',
    'CRE102', 'LNG101', 'BUS101', 'FIN101',
  ];
  const byCode = Object.fromEntries(ACADEMY_COURSES.map((c) => [c.code, c]));
  const list = featured
    .map((code) => byCode[code])
    .filter(Boolean)
    .slice(0, count)
    .map((c) => ({
      code: c.code,
      title: c.title,
      icon: ICON_MAP[c.track_id] || 'message-circle',
      level: c.level,
      duration: 'Self-paced',
      isFree: c.price_usd <= 19,
      href: `/academy/${c.slug}`,
    }));
  return list;
}
