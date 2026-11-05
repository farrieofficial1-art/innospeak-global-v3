/**
 * foundationApplicationsData — config for Foundation applications.
 * Statuses, programs, timeline steps and helpers.
 */

export const FOUNDATION_PROGRAMS = [
  {
    id: 'education-access',
    label: 'Education Access Fund',
    goal: 'Support learners who face financial or social barriers to education.',
    sponsorImpact: ['$50 sponsors one learner for a term', '$500 sponsors 10 learners', '$5,000 sponsors a school-based learning support program'],
    hook: 'Sponsor a learner’s education journey.',
  },
  {
    id: 'digital-access',
    label: 'Digital Access Initiative',
    goal: 'Expand access to digital learning for learners who lack devices, internet, or digital skills.',
    sponsorImpact: ['$25 sponsors one learner’s digital access', '$250 sponsors 10 learners', '$2,500 sponsors a community digital access drive'],
    hook: 'Sponsor digital access and connect a learner to opportunity.',
  },
  {
    id: 'girls-in-stem',
    label: 'Girls in STEM',
    goal: 'Increase girls’ participation in STEM, AI, and digital careers.',
    sponsorImpact: ['$100 sponsors one girl’s STEM learning journey', '$1,000 sponsors 10 girls', '$10,000 sponsors a girls-in-STEM cohort'],
    hook: 'Sponsor a girl’s journey into STEM and tech.',
  },
  {
    id: 'community-grants',
    label: 'Community Impact Grants',
    goal: 'Support community-led projects that improve education, digital access, and local development.',
    sponsorImpact: ['$500 funds a small community project', '$2,500 funds a medium community project', '$10,000 funds a major community initiative'],
    hook: 'Fund a community-led solution and see local impact.',
  },
  {
    id: 'youth-employment',
    label: 'Youth Employment & Freelancing Fund',
    goal: 'Equip young people with digital, AI, and freelancing skills that lead to work and income.',
    sponsorImpact: ['$75 sponsors one youth’s job-readiness journey', '$750 sponsors 10 youth', '$7,500 sponsors a youth employment cohort'],
    hook: 'Sponsor a youth’s path to work and income.',
  },
  {
    id: 'teacher-training',
    label: 'Teacher Digital Capacity Initiative',
    goal: 'Equip teachers with digital skills and EdTech capacity to improve teaching and learning.',
    sponsorImpact: ['$100 sponsors one teacher’s training', '$1,000 sponsors 10 teachers', '$10,000 sponsors a school-wide teacher training program'],
    hook: 'Sponsor a teacher and multiply impact across a classroom.',
  },
  {
    id: 'inclusive-learning',
    label: 'Inclusive Learning Fund',
    goal: 'Make digital learning accessible for learners with disabilities and special learning needs.',
    sponsorImpact: ['$100 sponsors one learner’s inclusive learning support', '$1,000 sponsors 10 learners', '$10,000 funds an inclusive learning program'],
    hook: 'Sponsor inclusive learning and remove barriers to opportunity.',
  },
  {
    id: 'refugee-support',
    label: 'Refugee & Displaced Youth Fund',
    goal: 'Provide digital, language, and livelihood skills to refugee and displaced young people.',
    sponsorImpact: ['$75 sponsors one refugee youth’s learning journey', '$750 sponsors 10 refugee youth', '$7,500 sponsors a refugee youth skills cohort'],
    hook: 'Sponsor a refugee youth’s path to skills and livelihood.',
  },
  {
    id: 'rural-learning-hubs',
    label: 'Rural Learning Hubs Initiative',
    goal: 'Establish community learning hubs that expand access to digital learning and mentorship in underserved areas.',
    sponsorImpact: ['$1,000 supports one learning hub for a month', '$5,000 supports a hub for a term', '$25,000 establishes a new community learning hub'],
    hook: 'Sponsor a learning hub and connect a community to opportunity.',
  },
  {
    id: 'green-skills',
    label: 'Green & Climate Skills Fund',
    goal: 'Prepare youth for jobs in the green economy through renewable energy and climate-smart skills.',
    sponsorImpact: ['$100 sponsors one youth’s green skills training', '$1,000 sponsors 10 youth', '$10,000 funds a green skills cohort'],
    hook: 'Sponsor green skills and power a sustainable future.',
  },
  {
    id: 'msme-digital',
    label: 'MSME Digital Growth Fund',
    goal: 'Help small businesses adopt digital tools, e-commerce, and AI to grow.',
    sponsorImpact: ['$150 sponsors one MSME’s digital transformation', '$1,500 sponsors 10 MSMEs', '$15,000 funds an MSME digital growth program'],
    hook: 'Sponsor an MSME’s digital growth journey.',
  },
];


export const APPLICATION_STATUSES = [
  { id: 'draft', label: 'Draft', tone: 'neutral' },
  { id: 'submitted', label: 'Submitted', tone: 'info' },
  { id: 'under_review', label: 'Under Review', tone: 'warning' },
  { id: 'verification', label: 'Verification', tone: 'warning' },
  { id: 'approved', label: 'Approved', tone: 'success' },
  { id: 'waitlisted', label: 'Waitlisted', tone: 'warning' },
  { id: 'declined', label: 'Declined', tone: 'danger' },
  { id: 'funding_pending', label: 'Funding Pending', tone: 'warning' },
  { id: 'support_confirmed', label: 'Support Confirmed', tone: 'success' },
  { id: 'completed', label: 'Completed', tone: 'info' },
];

/**
 * The learner-facing timeline. Each status maps to a step index here.
 * Steps are shown as a vertical progress indicator on the detail page.
 */
export const TIMELINE_STEPS = [
  { id: 'submitted', label: 'Submitted', description: 'Your application was received.' },
  { id: 'under_review', label: 'Under Review', description: 'Foundation staff are reviewing your application.' },
  { id: 'verification', label: 'Verification', description: 'We are verifying the information you provided.' },
  { id: 'decision', label: 'Decision', description: 'A decision has been made on your application.' },
  { id: 'support_confirmed', label: 'Support Confirmed', description: 'Approved support is being arranged.' },
  { id: 'completed', label: 'Completed', description: 'Support was delivered successfully.' },
];

// Map status → timeline step index (which step is "current")
export const STATUS_STEP_INDEX = {
  draft: -1,
  submitted: 0,
  under_review: 1,
  verification: 2,
  approved: 3,
  waitlisted: 3,
  declined: 3,
  funding_pending: 3,
  support_confirmed: 4,
  completed: 5,
};

export function getProgramLabel(id) {
  return FOUNDATION_PROGRAMS.find((p) => p.id === id)?.label || id;
}

export function getStatusLabel(id) {
  return APPLICATION_STATUSES.find((s) => s.id === id)?.label || id;
}

export function getStatusTone(id) {
  return APPLICATION_STATUSES.find((s) => s.id === id)?.tone || 'neutral';
}

export function getCurrentStepIndex(status) {
  const idx = STATUS_STEP_INDEX[status];
  return typeof idx === 'number' ? idx : -1;
}