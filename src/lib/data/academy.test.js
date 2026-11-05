import assert from 'node:assert/strict';
import test from 'node:test';
import { getCourseByCode, getCourseBySlug, TRACK_BY_ID } from './academy.js';
import { getCurriculumStatus } from './courseReadiness.js';
import { resolveLmsCourse } from './lmsCourse.js';
import { getProgrammeByCode } from './programmeData.js';

test('Swahili is available as a Global Languages Academy course', () => {
  const course = getCourseByCode('SWA101');

  assert.ok(course);
  assert.equal(course.title, 'Swahili Language');
  assert.equal(course.slug, 'swa101-swahili-language');
  assert.equal(course.track_id, 'languages');
  assert.equal(getCourseBySlug(course.slug)?.code, course.code);
  assert.equal(TRACK_BY_ID[course.track_id].name, 'Global Languages');
});

test('Swahili is wired to the published LMS and programme catalogue', () => {
  const course = getProgrammeByCode('SWA101');
  const resolved = resolveLmsCourse({ code: 'SWA101' });

  assert.equal(getCurriculumStatus('SWA101').hasStructuredContent, true);
  assert.equal(course?.ownerAuthorizedForPublication, true);
  assert.equal(course?.enrollmentOpen, true);
  assert.equal(course?.pathwayId, 'world-languages');
  assert.equal(course?.feesUSD, 115.38);
  assert.equal(resolved.title, 'Swahili Language');
  assert.equal(resolved.level, 'Beginner');
});
