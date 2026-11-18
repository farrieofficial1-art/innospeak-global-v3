import { ACADEMY_COURSES, TRACKS as ACADEMY_TRACKS } from '../lib/data/academy.js';
import { LAB_COURSES } from '../lib/data/labs.js';
import { TRACKS as LAB_TRACKS } from '../lib/data/registry.js';

export const CATALOGUE_STATS = {
  academyCourses: ACADEMY_COURSES.length,
  labCourses: LAB_COURSES.length,
  totalCourses: ACADEMY_COURSES.length + LAB_COURSES.length,
  academyTracks: ACADEMY_TRACKS.length,
  labTracks: LAB_TRACKS.length,
  ecosystemPillars: 3,
};
