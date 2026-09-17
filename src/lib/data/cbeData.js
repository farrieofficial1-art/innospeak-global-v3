/**
 * cbeData — Competency Based Education (CBE / CBC) curriculum structure
 * for InnoSpeak Global Academy.
 *
 * Hierarchy: School Level → Grade → Subject → (Strands/Sub-strands)
 * → Lessons → Activities/Quizzes/Assignments → Progress
 *
 * Subjects are data-driven so administrators can add/edit subjects later
 * without rewriting frontend code. The structure connects to the existing
 * LMS course/lesson system via `lmsCourseCode` on each subject.
 *
 * Based on the KICD competency-based curriculum structure.
 */

export const CBE_INFO = {
  title: 'CBE / CBC Academy',
  description:
    'Structured learning support for learners from Grade 3 through Senior School, aligned to Kenya\u2019s competency-based education pathway.',
};

export const SCHOOL_LEVELS = [
  {
    id: 'primary',
    title: 'Primary School',
    grades: 'Grades 3\u20136',
    description:
      'Build strong foundations through literacy, numeracy, creativity, science and practical learning.',
    button: 'Explore Primary',
    gradeIds: ['g3', 'g4', 'g5', 'g6'],
  },
  {
    id: 'junior-secondary',
    title: 'Junior Secondary School',
    grades: 'Grades 7\u20139',
    description:
      'Develop deeper academic, practical, creative and technological competencies.',
    button: 'Explore Junior Secondary',
    gradeIds: ['g7', 'g8', 'g9'],
  },
  {
    id: 'senior-school',
    title: 'Senior School',
    grades: 'Grades 10\u201312',
    description:
      'Explore pathways and prepare for further education, careers and real-world opportunities.',
    button: 'Explore Senior School',
    gradeIds: ['g10', 'g11', 'g12'],
  },
];

export const GRADES = [
  { id: 'g3', label: 'Grade 3', level: 'primary', order: 3 },
  { id: 'g4', label: 'Grade 4', level: 'primary', order: 4 },
  { id: 'g5', label: 'Grade 5', level: 'primary', order: 5 },
  { id: 'g6', label: 'Grade 6', level: 'primary', order: 6 },
  { id: 'g7', label: 'Grade 7', level: 'junior-secondary', order: 7 },
  { id: 'g8', label: 'Grade 8', level: 'junior-secondary', order: 8 },
  { id: 'g9', label: 'Grade 9', level: 'junior-secondary', order: 9 },
  { id: 'g10', label: 'Grade 10', level: 'senior-school', order: 10 },
  { id: 'g11', label: 'Grade 11', level: 'senior-school', order: 11 },
  { id: 'g12', label: 'Grade 12', level: 'senior-school', order: 12 },
];

// ── Subject type flags ──────────────────────────────────────
// 'core'    — compulsory for all learners in that grade
// 'optional'— learner chooses from available options
// 'pathway' — senior school pathway-specific subject

// ── Grade 3 subjects ───────────────────────────────────────
const GRADE_3_SUBJECTS = [
  { id: 'g3-eng', name: 'English', type: 'core', description: 'Language communication, reading and writing fundamentals.' },
  { id: 'g3-kis', name: 'Kiswahili', type: 'core', description: 'Kiswahili language communication and literacy.' },
  { id: 'g3-math', name: 'Mathematics', type: 'core', description: 'Number work, operations and basic problem solving.' },
  { id: 'g3-env', name: 'Environmental Activities', type: 'core', description: 'Exploring the immediate environment and social interactions.' },
  { id: 'g3-creative', name: 'Creative Activities', type: 'core', description: 'Art, craft, music and movement activities.' },
  { id: 'g3-re', name: 'Religious Education', type: 'optional', description: 'Christian Religious Education or Islamic Religious Education.' },
  { id: 'g3-lang', name: 'Indigenous Language / KSL', type: 'optional', description: 'Optional indigenous language or Kenyan Sign Language.' },
];

// ── Grades 4–6 subjects ─────────────────────────────────────
const GRADES_4_6_SUBJECTS = [
  { id: 'g46-eng', name: 'English', type: 'core', description: 'Language skills, comprehension, grammar and creative writing.' },
  { id: 'g46-kis', name: 'Kiswahili', type: 'core', description: 'Kiswahili lugha, ufasaha na uandishi.' },
  { id: 'g46-math', name: 'Mathematics', type: 'core', description: 'Number operations, measurement, geometry and data handling.' },
  { id: 'g46-sci', name: 'Science & Technology', type: 'core', description: 'Scientific inquiry, living things, matter and technology.' },
  { id: 'g46-ss', name: 'Social Studies', type: 'core', description: 'History, geography, citizenship and economic activities.' },
  { id: 'g46-agri', name: 'Agriculture', type: 'core', description: 'Basic crop production, livestock care and environmental conservation.' },
  { id: 'g46-creative', name: 'Creative Arts', type: 'core', description: 'Visual arts, performing arts and creative expression.' },
  { id: 'g46-re', name: 'Religious Education', type: 'optional', description: 'Christian Religious Education or Islamic Religious Education.' },
  { id: 'g46-lang', name: 'Indigenous Language', type: 'optional', description: 'Optional indigenous language or additional language option.' },
];

// ── Grades 7–9 (Junior Secondary) subjects ──────────────────
const GRADES_7_9_SUBJECTS = [
  { id: 'g79-eng', name: 'English', type: 'core', description: 'Advanced language skills, literature and communication.' },
  { id: 'g79-kis', name: 'Kiswahili', type: 'core', description: 'Lugha, sarufi, fasiha na mawasiliano.' },
  { id: 'g79-math', name: 'Mathematics', type: 'core', description: 'Algebra, geometry, statistics and mathematical reasoning.' },
  { id: 'g79-sci', name: 'Integrated Science', type: 'core', description: 'Biology, chemistry, physics and earth science integrated.' },
  { id: 'g79-ss', name: 'Social Studies', type: 'core', description: 'History, geography, citizenship and economic development.' },
  { id: 'g79-agri', name: 'Agriculture', type: 'core', description: 'Crop science, animal husbandry and agribusiness basics.' },
  { id: 'g79-creative', name: 'Creative Arts', type: 'core', description: 'Visual arts, music, drama and creative performance.' },
  { id: 'g79-pretech', name: 'Pre-Technical Studies', type: 'core', description: 'Introduction to technical drawing, materials and tools.' },
  { id: 'g79-re', name: 'Religious Education', type: 'optional', description: 'Christian Religious Education or Islamic Religious Education.' },
  { id: 'g79-lang', name: 'Language Options', type: 'optional', description: 'Indigenous languages, Arabic, French, German, Mandarin or KSL.' },
];

// ── Senior School (Grades 10–12) ────────────────────────────
const SENIOR_CORE_SUBJECTS = [
  { id: 's-eng', name: 'English', type: 'core', pathway: 'core', description: 'Advanced English language and communication.' },
  { id: 's-kis', name: 'Kiswahili / KSL', type: 'core', pathway: 'core', description: 'Kiswahili or Kenyan Sign Language.' },
  { id: 's-math', name: 'Mathematics', type: 'core', pathway: 'core', description: 'Core mathematics for all senior school learners.' },
  { id: 's-csl', name: 'Community Service Learning', type: 'core', pathway: 'core', description: 'Community engagement, service learning and citizenship.' },
];

const SENIOR_STEM_SUBJECTS = [
  // Sciences
  { id: 's-bio', name: 'Biology', type: 'pathway', pathway: 'stem', group: 'Sciences', description: 'Living systems, genetics, ecology and evolution.' },
  { id: 's-chem', name: 'Chemistry', type: 'pathway', pathway: 'stem', group: 'Sciences', description: 'Matter, chemical reactions and analytical chemistry.' },
  { id: 's-phys', name: 'Physics', type: 'pathway', pathway: 'stem', group: 'Sciences', description: 'Mechanics, electricity, waves and modern physics.' },
  { id: 's-gsci', name: 'General Science', type: 'pathway', pathway: 'stem', group: 'Sciences', description: 'Integrated science for broader STEM pathways.' },
  // Applied Sciences / Technical & Technology
  { id: 's-agri', name: 'Agriculture', type: 'pathway', pathway: 'stem', group: 'Applied Sciences & Technology', description: 'Agricultural science, production and agribusiness.' },
  { id: 's-cs', name: 'Computer Studies', type: 'pathway', pathway: 'stem', group: 'Applied Sciences & Technology', description: 'Computing, programming and information systems.' },
  { id: 's-hs', name: 'Home Science', type: 'pathway', pathway: 'stem', group: 'Applied Sciences & Technology', description: 'Food, nutrition, textiles and home management.' },
  { id: 's-avi', name: 'Aviation', type: 'pathway', pathway: 'stem', group: 'Applied Sciences & Technology', description: 'Aviation science and flight fundamentals.' },
  { id: 's-bc', name: 'Building & Construction', type: 'pathway', pathway: 'stem', group: 'Applied Sciences & Technology', description: 'Construction technology, materials and practices.' },
  { id: 's-elec', name: 'Electricity', type: 'pathway', pathway: 'stem', group: 'Applied Sciences & Technology', description: 'Electrical principles, circuits and installation.' },
  { id: 's-metal', name: 'Metalwork', type: 'pathway', pathway: 'stem', group: 'Applied Sciences & Technology', description: 'Metal fabrication, machining and workshop practice.' },
  { id: 's-pm', name: 'Power Mechanics', type: 'pathway', pathway: 'stem', group: 'Applied Sciences & Technology', description: 'Engines, power systems and mechanical maintenance.' },
  { id: 's-wt', name: 'Wood Technology', type: 'pathway', pathway: 'stem', group: 'Applied Sciences & Technology', description: 'Woodwork, carpentry and timber technology.' },
  { id: 's-mt', name: 'Media Technology', type: 'pathway', pathway: 'stem', group: 'Applied Sciences & Technology', description: 'Broadcast, print and digital media technology.' },
  { id: 's-mf', name: 'Marine & Fisheries Technology', type: 'pathway', pathway: 'stem', group: 'Applied Sciences & Technology', description: 'Aquaculture, fisheries and marine technology.' },
];

const SENIOR_SOCIAL_SCIENCES_SUBJECTS = [
  // Humanities
  { id: 's-hist', name: 'History & Citizenship', type: 'pathway', pathway: 'social-sciences', group: 'Humanities', description: 'Historical analysis, governance and citizenship.' },
  { id: 's-geo', name: 'Geography', type: 'pathway', pathway: 'social-sciences', group: 'Humanities', description: 'Physical and human geography, environment and resources.' },
  { id: 's-lit', name: 'Literature in English', type: 'pathway', pathway: 'social-sciences', group: 'Humanities', description: 'Literary analysis, drama, poetry and prose.' },
  // Languages
  { id: 's-kis-f', name: 'Kiswahili / Fasihi ya Kiswahili', type: 'pathway', pathway: 'social-sciences', group: 'Languages', description: 'Advanced Kiswahili language and literature.' },
  { id: 's-ind', name: 'Indigenous Languages', type: 'pathway', pathway: 'social-sciences', group: 'Languages', description: 'Kenyan indigenous languages and linguistics.' },
  { id: 's-ara', name: 'Arabic', type: 'pathway', pathway: 'social-sciences', group: 'Languages', description: 'Arabic language and literature.' },
  { id: 's-fr', name: 'French', type: 'pathway', pathway: 'social-sciences', group: 'Languages', description: 'French language and francophone culture.' },
  { id: 's-de', name: 'German', type: 'pathway', pathway: 'social-sciences', group: 'Languages', description: 'German language and culture.' },
  { id: 's-zh', name: 'Mandarin', type: 'pathway', pathway: 'social-sciences', group: 'Languages', description: 'Mandarin Chinese language and culture.' },
  { id: 's-ksl', name: 'Sign Language', type: 'pathway', pathway: 'social-sciences', group: 'Languages', description: 'Kenyan Sign Language and deaf culture.' },
  // Business
  { id: 's-bus', name: 'Business Studies', type: 'pathway', pathway: 'social-sciences', group: 'Business', description: 'Accounting, finance, marketing and entrepreneurship.' },
  // Religious Education
  { id: 's-cre', name: 'Religious Education', type: 'pathway', pathway: 'social-sciences', group: 'Religious Education', description: 'Christian or Islamic Religious Education at senior level.' },
];

const SENIOR_ARTS_SPORTS_SUBJECTS = [
  { id: 's-mus', name: 'Music & Dance', type: 'pathway', pathway: 'arts-sports', group: 'Arts & Sports Science', description: 'Music theory, performance and dance traditions.' },
  { id: 's-fa', name: 'Fine Arts', type: 'pathway', pathway: 'arts-sports', group: 'Arts & Sports Science', description: 'Drawing, painting, sculpture and visual design.' },
  { id: 's-tf', name: 'Theatre & Film', type: 'pathway', pathway: 'arts-sports', group: 'Arts & Sports Science', description: 'Drama, theatre production and filmmaking.' },
  { id: 's-sr', name: 'Sports & Recreation', type: 'pathway', pathway: 'arts-sports', group: 'Arts & Sports Science', description: 'Sports science, physical education and recreation.' },
];

// ── Grade → Subjects mapping ────────────────────────────────
export const GRADE_SUBJECTS = {
  g3: GRADE_3_SUBJECTS,
  g4: GRADES_4_6_SUBJECTS,
  g5: GRADES_4_6_SUBJECTS,
  g6: GRADES_4_6_SUBJECTS,
  g7: GRADES_7_9_SUBJECTS,
  g8: GRADES_7_9_SUBJECTS,
  g9: GRADES_7_9_SUBJECTS,
  g10: [...SENIOR_CORE_SUBJECTS, ...SENIOR_STEM_SUBJECTS, ...SENIOR_SOCIAL_SCIENCES_SUBJECTS, ...SENIOR_ARTS_SPORTS_SUBJECTS],
  g11: [...SENIOR_CORE_SUBJECTS, ...SENIOR_STEM_SUBJECTS, ...SENIOR_SOCIAL_SCIENCES_SUBJECTS, ...SENIOR_ARTS_SPORTS_SUBJECTS],
  g12: [...SENIOR_CORE_SUBJECTS, ...SENIOR_STEM_SUBJECTS, ...SENIOR_SOCIAL_SCIENCES_SUBJECTS, ...SENIOR_ARTS_SPORTS_SUBJECTS],
};

// ── Senior School pathways ───────────────────────────────────
export const SENIOR_PATHWAYS = [
  {
    id: 'core',
    title: 'Core',
    description: 'Compulsory learning areas for all senior school learners.',
    icon: 'BookOpen',
  },
  {
    id: 'stem',
    title: 'STEM Pathway',
    description: 'Sciences and applied technical & technology subjects.',
    icon: 'FlaskConical',
  },
  {
    id: 'social-sciences',
    title: 'Social Sciences Pathway',
    description: 'Humanities, languages, business and religious education.',
    icon: 'Globe',
  },
  {
    id: 'arts-sports',
    title: 'Arts & Sports Science Pathway',
    description: 'Music, fine arts, theatre, film and sports science.',
    icon: 'Palette',
  },
];

// ── Helper functions ────────────────────────────────────────

export function getSchoolLevelById(id) {
  return SCHOOL_LEVELS.find((l) => l.id === id);
}

export function getGradeById(id) {
  return GRADES.find((g) => g.id === id);
}

export function getGradesByLevel(levelId) {
  return GRADES.filter((g) => g.level === levelId).sort((a, b) => a.order - b.order);
}

export function getSubjectsByGrade(gradeId) {
  return GRADE_SUBJECTS[gradeId] || [];
}

export function getSeniorSubjectsByPathway(pathwayId) {
  const all = GRADE_SUBJECTS.g10 || [];
  return all.filter((s) => s.pathway === pathwayId);
}

export function getSubjectGroups(subjects) {
  const groups = {};
  subjects.forEach((s) => {
    const g = s.group || (s.type === 'core' ? 'Core Subjects' : 'Subjects');
    if (!groups[g]) groups[g] = [];
    groups[g].push(s);
  });
  return Object.entries(groups);
}
