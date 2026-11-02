// src/lib/data/programmeData.js
//
// Legacy programme/admissions data layer. Bridges the Academy catalogue
// (academy.js) into the shape expected by the admissions form, portal
// checkout, tutor context and career profile builders.
//
// Do not edit individual course entries here — the source of truth is
// academy.js. This file only adapts that data to the legacy contracts.

import {
  ACADEMY_COURSES,
  TRACKS as ACADEMY_TRACKS,
  TRACK_BY_ID,
  KES_RATE,
} from './academy.js';

export const ACADEMY = 'InnoSpeak Academy';

// Study modes offered across Academy + Labs admissions.
export const STUDY_MODES = [
  { value: 'Online', label: 'Online' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'In-Person', label: 'In-Person' },
  { value: 'Self-Paced', label: 'Self-Paced' },
];

export const INTAKES = ['January', 'March', 'May', 'September', 'December'];

// Pathways are the Academy tracks, re-shaped to { id, title } for the
// admissions form. The CBE pathway id matches gradeBundles.js.
export const PATHWAYS = ACADEMY_TRACKS.map((t) => ({
  id: t.id,
  title: t.name,
  slug: t.slug,
  description: t.description,
}));

// Labs tracks (Technology & Cybersecurity subset) exposed separately for
// the Labs division selector. The admissions form uses TRACKS when the
// Labs division is selected.
export const TRACKS = ACADEMY_TRACKS.filter(
  (t) => t.id === 'tech' || t.id === 'ai' || t.id === 'data' || t.id === 'engineering'
).map((t) => ({ id: t.id, title: t.name }));

// COURSES: Academy courses adapted to the legacy shape used by the
// admissions form (code, name, pathwayId, duration, studyMode, fees,
// feesUSD, isFree, category). ReviewSubmission also reads this list.
function adaptCourse(c) {
  const track = TRACK_BY_ID[c.track_id];
  const feesUSD = c.price_usd || 0;
  const isFree = feesUSD === 0;
  return {
    code: c.code,
    name: c.title,
    pathwayId: c.track_id,
    pathway: track?.name || null,
    category: track?.name || null,
    level: c.level || null,
    slug: c.slug || null,
    duration: '8 Weeks',
    studyMode: 'Self-Paced',
    feesUSD,
    fees: isFree ? 'Free' : `$${feesUSD}`,
    isFree,
  };
}

export const COURSES = ACADEMY_COURSES.map(adaptCourse);

const COURSES_BY_CODE = Object.fromEntries(COURSES.map((c) => [c.code, c]));

export function getProgrammeByCode(code) {
  if (!code) return null;
  return COURSES_BY_CODE[code] || null;
}

export function getCoursesByPathway(pathwayId) {
  if (!pathwayId) return [];
  return COURSES.filter((c) => c.pathwayId === pathwayId);
}

export function getAcademyCourses() {
  return COURSES;
}

export function getLabsCourses() {
  return COURSES.filter((c) =>
    ['tech', 'ai', 'data', 'engineering'].includes(c.pathwayId)
  );
}

// parseFee — extract a numeric amount from a fee string such as
// "$49", "KES 6370", "Free", or a number. Returns 0 for free/missing.
export function parseFee(fees) {
  if (fees == null) return 0;
  if (typeof fees === 'number') return fees;
  const s = String(fees).trim();
  if (!s || /^free$/i.test(s)) return 0;
  // Strip currency labels and commas, keep the first number found.
  const match = s.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

// getGrouping — returns the pathway/track grouping for a course code,
// used by admissions to bucket courses. Returns null if not found.
export function getGrouping(code) {
  const course = getProgrammeByCode(code);
  if (!course) return null;
  return {
    pathwayId: course.pathwayId,
    pathway: course.pathway,
    category: course.category,
  };
}

export { KES_RATE };
