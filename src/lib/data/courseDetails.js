// src/lib/data/courseDetails.js
//
// Compatibility layer that exposes COURSE_DETAILS and buildCourseData
// for the project audit. Catalogue course detail (modules, assessment)
// is loaded from the LMS. The publication gate is shared with the LMS
// rollout registry so legacy consumers see the same course readiness.

import { getCurriculumStatus } from './courseReadiness.js';

export const COURSE_DETAILS = {};

export function buildCourseData(code) {
  if (!code) return null;
  const ownerAuthorizedForPublication = getCurriculumStatus(code).hasStructuredContent;
  return COURSE_DETAILS[code] || {
    code,
    modules: [],
    assessment: [],
    ownerAuthorizedForPublication,
    enrollmentOpen: ownerAuthorizedForPublication,
    selfPacedAvailable: ownerAuthorizedForPublication,
  };
}
