import { COURSES } from './programmeData.js';

/**
 * Catalogue governance helpers. Course codes are permanent internal identifiers;
 * curriculum content is versioned/reviewed independently so the catalogue can
 * evolve without breaking historical enrolments.
 */
export const CATALOG_STATUS = Object.freeze({
  ACTIVE: 'Active',
  PLANNED: 'Planned',
  DEVELOPMENT: 'Under Development',
  ARCHIVED: 'Archived',
});

export const CURRICULUM_POLICY = Object.freeze({
  currentYear: 2026,
  reviewCycleYears: 1,
  idPolicy: 'Course codes are permanent internal identifiers and must not encode intake years.',
  technologyPolicy: 'Technology-specific content is reviewed annually while the underlying course identity remains stable.',
  regulatedPolicy: 'Regulated qualifications must be re-verified against the relevant awarding or regulatory body before each new offering.',
});

const DUPLICATE_CODES = new Set(
  COURSES.reduce((acc, course) => {
    acc.set(course.code, (acc.get(course.code) || 0) + 1);
    return acc;
  }, new Map())
    .entries()
    .filter(([, count]) => count > 1)
    .map(([code]) => code)
);

export function getCourseGovernance(course) {
  const technologyHeavy = /AI|Cloud|Kubernetes|Docker|Terraform|React|TypeScript|Rust|LangChain|LangGraph|CrewAI|AutoGen|MCP|AWS|Azure|GCP|Firefly|Runway|Unity|Unreal|TensorFlow|PyTorch/i.test(`${course.name} ${course.category}`);
  const examSensitive = /IELTS|TOEFL|PTE|DET|SAT|GRE|GMAT|Cambridge|IGCSE|Edexcel|IB|KCSE|KCPE|KNEC|TVET/i.test(course.name);

  return {
    status: course.status || CATALOG_STATUS.ACTIVE,
    version: course.version || '1.0',
    lastReviewed: course.lastReviewed || '2026-09-01',
    nextReview: course.nextReview || (technologyHeavy || examSensitive ? '2027-09-01' : '2028-09-01'),
    reviewRequired: technologyHeavy || examSensitive,
    regulatedReview: /TVET|KNEC|KCSE|KCPE|qualification/i.test(`${course.name} ${course.category}`),
    duplicateCode: DUPLICATE_CODES.has(course.code),
    permanentId: true,
  };
}

export function validateCatalogue(courses = COURSES) {
  const seen = new Map();
  const duplicates = [];
  const missing = [];
  for (const course of courses) {
    if (!course.code || !course.name || !course.pathwayId) missing.push(course.code || '(missing code)');
    if (seen.has(course.code)) duplicates.push(course.code);
    seen.set(course.code, true);
  }
  return {
    total: courses.length,
    uniqueCodes: seen.size,
    duplicates: [...new Set(duplicates)],
    missingRequiredFields: [...new Set(missing)],
    futureProof: duplicates.length === 0 && missing.length === 0,
  };
}
