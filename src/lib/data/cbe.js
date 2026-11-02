// src/lib/data/cbe.js
//
// Kenya CBE Programme bundles.
//
// Groups the 97 CBE courses from academy.js into logical learning bundles
// by grade level and elective pathway. Course data is NOT duplicated here —
// each bundle references course codes, and the full course objects are
// resolved at runtime from ACADEMY_BY_CODE in academy.js.
//
// Bundle coverage (must total 97, no duplicates):
//   Grade 3  (8)   Grade 9   (9)   Primary Languages Electives     (5)
//   Grade 4  (8)   Grade 10  (4)   Junior School Electives         (5)
//   Grade 5  (8)   Grade 11  (4)   Senior School Pathway Electives(16)
//   Grade 6  (8)   Grade 12  (4)
//   Grade 7  (9)
//   Grade 8  (9)
// 8+8+8+8+9+9+9+4+4+4+5+5+16 = 97

import { ACADEMY_BY_CODE } from './academy.js';

// ──────────────────────────────────────────────────────────────
// Learning stages
// ──────────────────────────────────────────────────────────────

export const CBE_STAGES = [
  { id: 'lower-primary', name: 'Lower Primary', grades: 'Grades 3–6' },
  { id: 'junior-school', name: 'Junior School', grades: 'Grades 7–9' },
  { id: 'senior-school', name: 'Senior School', grades: 'Grades 10–12' },
  { id: 'electives', name: 'Electives & Pathways', grades: 'All grades' },
];

// ──────────────────────────────────────────────────────────────
// Shared subject lists per grade band
// ──────────────────────────────────────────────────────────────

const LOWER_PRIMARY_SUBJECTS = [
  'English',
  'Kiswahili / KSL',
  'Mathematics',
  'Religious Education',
  'Agriculture and Nutrition',
  'Social Studies',
  'Creative Arts',
  'Science and Technology',
];

const JUNIOR_SCHOOL_SUBJECTS = [
  'English',
  'Kiswahili / KSL',
  'Mathematics',
  'Integrated Science',
  'Social Studies',
  'Business Studies',
  'Agriculture',
  'Pre-Technical and Pre-Career Studies',
  'Religious Education',
];

const SENIOR_SCHOOL_SUBJECTS = [
  'English',
  'Kiswahili / KSL',
  'Core Mathematics',
  'Community Service Learning',
];

const LOWER_PRIMARY_OUTCOMES = [
  'Read and write simple English and Kiswahili texts with confidence.',
  'Apply basic numeracy and mathematical thinking to everyday problems.',
  'Explore the natural world through introductory science and technology.',
  'Develop creativity, social awareness and healthy habits.',
];

const JUNIOR_SCHOOL_OUTCOMES = [
  'Communicate effectively in English and Kiswahili across academic and social contexts.',
  'Apply integrated scientific inquiry to real-world situations.',
  'Build foundational business, agricultural and pre-technical competencies.',
  'Develop civic awareness through social studies and religious education.',
];

const SENIOR_SCHOOL_OUTCOMES = [
  'Master the four core learning areas required across all Senior School pathways.',
  'Communicate fluently in English and Kiswahili at an advanced level.',
  'Apply core mathematics to quantitative reasoning and problem-solving.',
  'Engage meaningfully with community service learning projects.',
];

// ──────────────────────────────────────────────────────────────
// Grade bundles
// ──────────────────────────────────────────────────────────────

function gradeBundle(grade, codes, stageId) {
  return {
    id: `grade-${grade}`,
    slug: `grade-${grade}`,
    title: `Grade ${grade}`,
    stage: stageId,
    gradeLevel: `Grade ${grade}`,
    description: `All core learning areas for Kenya CBC Grade ${grade}, bundled into one structured programme.`,
    subjects: grade <= 6 ? LOWER_PRIMARY_SUBJECTS : grade <= 9 ? JUNIOR_SCHOOL_SUBJECTS : SENIOR_SCHOOL_SUBJECTS,
    outcomes: grade <= 6 ? LOWER_PRIMARY_OUTCOMES : grade <= 9 ? JUNIOR_SCHOOL_OUTCOMES : SENIOR_SCHOOL_OUTCOMES,
    courseCodes: codes,
  };
}

const GRADE_3 = gradeBundle(3, ['CBE101','CBE102','CBE103','CBE104','CBE105','CBE106','CBE107','CBE108'], 'lower-primary');
const GRADE_4 = gradeBundle(4, ['CBE109','CBE110','CBE111','CBE112','CBE113','CBE114','CBE115','CBE116'], 'lower-primary');
const GRADE_5 = gradeBundle(5, ['CBE117','CBE118','CBE119','CBE120','CBE121','CBE122','CBE123','CBE124'], 'lower-primary');
const GRADE_6 = gradeBundle(6, ['CBE125','CBE126','CBE127','CBE128','CBE129','CBE130','CBE131','CBE132'], 'lower-primary');
const GRADE_7 = gradeBundle(7, ['CBE133','CBE134','CBE135','CBE136','CBE137','CBE138','CBE139','CBE140','CBE141'], 'junior-school');
const GRADE_8 = gradeBundle(8, ['CBE142','CBE143','CBE144','CBE145','CBE146','CBE147','CBE148','CBE149','CBE150'], 'junior-school');
const GRADE_9 = gradeBundle(9, ['CBE151','CBE152','CBE153','CBE154','CBE155','CBE156','CBE157','CBE158','CBE159'], 'junior-school');
const GRADE_10 = gradeBundle(10, ['CBE160','CBE161','CBE162','CBE163'], 'senior-school');
const GRADE_11 = gradeBundle(11, ['CBE164','CBE165','CBE166','CBE167'], 'senior-school');
const GRADE_12 = gradeBundle(12, ['CBE168','CBE169','CBE170','CBE171'], 'senior-school');

// ──────────────────────────────────────────────────────────────
// Elective bundles
// ──────────────────────────────────────────────────────────────

const PRIMARY_LANGUAGES_ELECTIVES = {
  id: 'primary-languages',
  slug: 'primary-languages-electives',
  title: 'Primary Language Electives',
  stage: 'electives',
  gradeLevel: 'Primary (Grades 4–6)',
  description: 'Foreign and indigenous language electives available to Primary learners alongside the core subjects.',
  subjects: ['French', 'German', 'Mandarin', 'Arabic', 'Indigenous Language Studies'],
  outcomes: [
    'Develop introductory speaking, listening, reading and writing skills in a new language.',
    'Build cultural awareness and appreciation for diverse communities.',
    'Lay foundations for further language study in Junior School and beyond.',
  ],
  courseCodes: ['CBE172','CBE173','CBE174','CBE175','CBE176'],
};

const JUNIOR_SCHOOL_ELECTIVES = {
  id: 'junior-electives',
  slug: 'junior-school-electives',
  title: 'Junior School Electives',
  stage: 'electives',
  gradeLevel: 'Junior School (Grades 7–9)',
  description: 'Elective learning areas Junior School learners choose alongside their core subjects to explore interests and talents.',
  subjects: ['Visual Arts', 'Performing Arts', 'Home Science', 'Computer Science', 'Foreign and Indigenous Languages'],
  outcomes: [
    'Explore creative and practical talents through arts, performance and home science.',
    'Build digital literacy through introductory computer science.',
    'Deepen language skills with foreign and indigenous language options.',
  ],
  courseCodes: ['CBE177','CBE178','CBE179','CBE180','CBE181'],
};

const SENIOR_SCHOOL_ELECTIVES = {
  id: 'senior-electives',
  slug: 'senior-school-pathway-electives',
  title: 'Senior School Pathway Electives',
  stage: 'electives',
  gradeLevel: 'Senior School (Grades 10–12)',
  description: 'The three Senior School pathways — Arts & Sports Science, Social Sciences, and STEM — each with its own elective subjects learners choose in addition to the four core areas.',
  subjects: [
    'Arts & Sports Science: Music, Dance, Fine Art, Sports Science, Theatre',
    'Social Sciences: History & Citizenship, Geography, Business Studies, Literature in English',
    'STEM: Physics, Chemistry, Biology, Computer Science, Electrical Technology, Building Construction, Aviation Technology',
  ],
  outcomes: [
    'Specialise in one of three Senior School pathways aligned to your interests and career goals.',
    'Develop advanced subject knowledge in your chosen pathway electives.',
    'Build the competencies required for progression to higher education, training or work.',
  ],
  courseCodes: ['CBE182','CBE183','CBE184','CBE185','CBE186','CBE187','CBE188','CBE189','CBE190','CBE191','CBE192','CBE193','CBE194','CBE195','CBE196','CBE197'],
};

// ──────────────────────────────────────────────────────────────
// Bundle registry
// ──────────────────────────────────────────────────────────────

export const CBE_BUNDLES = [
  GRADE_3, GRADE_4, GRADE_5, GRADE_6,
  GRADE_7, GRADE_8, GRADE_9,
  GRADE_10, GRADE_11, GRADE_12,
  PRIMARY_LANGUAGES_ELECTIVES, JUNIOR_SCHOOL_ELECTIVES, SENIOR_SCHOOL_ELECTIVES,
];

export const CBE_BUNDLE_BY_SLUG = Object.fromEntries(
  CBE_BUNDLES.map((b) => [b.slug, b]),
);

export const CBE_BUNDLE_BY_ID = Object.fromEntries(
  CBE_BUNDLES.map((b) => [b.id, b]),
);

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

// Resolve the full course objects for a bundle from the academy catalogue.
export function getBundleCourses(bundle) {
  if (!bundle?.courseCodes) return [];
  return bundle.courseCodes
    .map((code) => ACADEMY_BY_CODE[code])
    .filter(Boolean);
}

// Total course count across all bundles (should equal 97).
export function getCbeBundleCourseCount() {
  const seen = new Set();
  for (const bundle of CBE_BUNDLES) {
    for (const code of bundle.courseCodes) seen.add(code);
  }
  return seen.size;
}

export function getBundlesByStage(stageId) {
  if (!stageId || stageId === 'all') return CBE_BUNDLES;
  return CBE_BUNDLES.filter((b) => b.stage === stageId);
}

export function getBundleBySlug(slug) {
  return CBE_BUNDLE_BY_SLUG[slug] || null;
}
