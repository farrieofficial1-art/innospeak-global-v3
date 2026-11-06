// src/lib/data/courseReadiness.js
//
// Course curriculum readiness registry. Tracks which catalogue courses
// have owner-authorised structured curriculum content (modules, lessons,
// assessments) published and ready for self-paced enrolment.

export const STRUCTURED_CURRICULUM_CODES = new Set([
  'SWA101',
]);

export function getCurriculumStatus(courseOrCode) {
  const code = typeof courseOrCode === 'string' ? courseOrCode : courseOrCode?.code;
  return { hasStructuredContent: STRUCTURED_CURRICULUM_CODES.has(code) };
}
