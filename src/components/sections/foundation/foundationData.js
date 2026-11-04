/**
 * foundationData — content for the InnoSpeak Global Foundation.
 * Eleven sponsor-ready programmes with defined goals, sponsor impact
 * tiers and sponsor hooks. Aligned with the published program catalogue.
 */

export const FOUNDATION_HERO = {
  eyebrow: 'InnoSpeak Global Foundation',
  title: 'Fund a defined intervention.',
  highlight: 'See the evidence of change.',
  description:
    'We design targeted education-access, digital opportunity, girls-in-STEM, community impact, youth employment, teacher capacity, inclusive learning, refugee support, rural learning hubs, green skills and MSME digital growth programmes. Each programme has clear eligibility, a costed delivery plan and measurable outcomes.',
  primaryCta: { label: 'Explore Our Programs', to: '#foundation-programs' },
  secondaryCta: { label: 'Apply for Support', to: '/apply?division=foundation' },
  tertiaryCta: { label: 'Support a Program', to: '#ways-to-give' },
};

export const FOUNDATION_STATS = [
  {
    id: 'learners',
    value: null,
    suffix: '',
    label: 'Learners Supported',
    description: 'Verified totals will be published after programme reporting is established.',
  },
  {
    id: 'communities',
    value: null,
    suffix: '',
    label: 'Communities Reached',
    description: 'Reported when delivery records have been verified.',
  },
  {
    id: 'digital',
    value: null,
    suffix: '',
    label: 'Digital Access Provided',
    description: 'Devices and access will be counted from verified distribution records.',
  },
  {
    id: 'projects',
    value: null,
    suffix: '',
    label: 'Projects Supported',
    description: 'Published after grant decisions and delivery are documented.',
  },
];

/**
 * FOCUS AREAS — the eleven Foundation programs.
 * Each program carries sponsor impact tiers and a sponsor hook
 * for use on the program cards and the ways-to-give section.
 */
export const FOCUS_AREAS = [
  {
    id: 'education-access',
    name: 'Education Access Fund',
    short: 'Support for learners facing financial or social barriers.',
    goal: 'Support learners who face financial or social barriers to education.',
    sponsorImpact: [
      { amount: 50, label: 'Sponsor one learner for a term' },
      { amount: 500, label: 'Sponsor 10 learners' },
      { amount: 5000, label: 'Sponsor a school-based learning support program' },
    ],
    sponsorHook: 'Sponsor a learner\u2019s education journey.',
    description:
      'A bursary and essential-cost programme for learners whose education is at risk because of financial or social barriers. Support decisions are based on published criteria, verified need and available funds.',
    targetGroup: 'Learners facing documented financial or social barriers to education.',
    intendedOutcomes: ['Improved access to learning', 'Course continuation and completion', 'Progression into further training or work'],
    sponsorFunding: 'Tuition, approved training materials, safety equipment and essential participation costs.',
    measurement: 'Applications assessed, awards made, funds disbursed, course continuation and verified completion.',
    icon: 'award',
    supports: [
      'Tuition and school fees',
      'Examination fees',
      'Learning materials',
      'Accommodation and transport',
      'Technical and TVET costs',
    ],
    canApply: true,
    applyTo: '/apply?division=foundation&program=education-access',
  },
  {
    id: 'digital-access',
    name: 'Digital Access Initiative',
    short: 'Reducing digital inequality.',
    goal: 'Expand access to digital learning for learners who lack devices, internet, or digital skills.',
    sponsorImpact: [
      { amount: 25, label: 'Sponsor one learner\u2019s digital access' },
      { amount: 250, label: 'Sponsor 10 learners' },
      { amount: 2500, label: 'Sponsor a community digital access drive' },
    ],
    sponsorHook: 'Sponsor digital access and connect a learner to opportunity.',
    description:
      'A device, connectivity and digital-skills programme designed to turn access to technology into sustained learning capability.',
    targetGroup: 'Learners and community learning groups with a documented device, connectivity or digital-skills gap.',
    intendedOutcomes: ['Reliable access to learning tools', 'Improved digital competency', 'Continued use of devices and learning resources'],
    sponsorFunding: 'Devices, connectivity, maintenance, digital-skills instruction and accessible learning resources.',
    measurement: 'Devices delivered and functioning, training completion, competency checks and follow-up access.',
    icon: 'laptop',
    supports: [
      'Laptops and tablets',
      'Internet and data support',
      'Digital learning resources',
      'Digital literacy training',
      'Community digital access',
    ],
    canApply: true,
    applyTo: '/apply?division=foundation&program=digital-access',
  },
  {
    id: 'girls-in-stem',
    name: 'Girls in STEM',
    short: 'Supporting girls and young women in STEM, AI and digital careers.',
    goal: 'Increase girls\u2019 participation in STEM, AI, and digital careers.',
    sponsorImpact: [
      { amount: 100, label: 'Sponsor one girl\u2019s STEM learning journey' },
      { amount: 1000, label: 'Sponsor 10 girls' },
      { amount: 10000, label: 'Sponsor a girls-in-STEM cohort' },
    ],
    sponsorHook: 'Sponsor a girl\u2019s journey into STEM and tech.',
    description:
      'A practical STEM pathway combining supervised making, mentorship and technical career exposure for girls and young women.',
    targetGroup: 'Girls and young women selected through transparent eligibility and safeguarding criteria.',
    intendedOutcomes: ['Increased participation in practical STEM', 'Projects completed and competencies demonstrated', 'Progression into further STEM learning'],
    sponsorFunding: 'Workshop kits, safe equipment, mentor time, learning support and project materials.',
    measurement: 'Participation and completion, project evidence, competency assessments and learner progression.',
    icon: 'sparkles',
    supports: [
      'STEM learning materials',
      'Technical equipment',
      'Mentorship and workshops',
      'AI and digital skills exposure',
      'Innovation projects and career pathways',
    ],
    canApply: true,
    applyTo: '/apply?division=foundation&program=girls-in-stem',
  },
  {
    id: 'community-grants',
    name: 'Community Impact Grants',
    short: 'Supporting community-led initiatives.',
    goal: 'Support community-led projects that improve education, digital access, and local development.',
    sponsorImpact: [
      { amount: 500, label: 'Fund a small community project' },
      { amount: 2500, label: 'Fund a medium community project' },
      { amount: 10000, label: 'Fund a major community initiative' },
    ],
    sponsorHook: 'Fund a community-led solution and see local impact.',
    description:
      'A small-grant pathway for feasible, community-led education, digital-access and local development ideas with clear beneficiaries and testable outcomes.',
    targetGroup: 'Eligible community groups and project teams with a defined problem, feasible plan and accountable lead.',
    intendedOutcomes: ['Tested solutions to defined local problems', 'Community participation in delivery', 'Evidence to guide continuation or scale-up'],
    sponsorFunding: 'Approved prototype materials, testing, technical mentorship and milestone-based pilot costs.',
    measurement: 'Milestones completed, tests passed, pilots delivered, beneficiaries reached and lessons documented.',
    icon: 'heart',
    supports: [
      'Community digital learning centres',
      'School science and technical equipment',
      'Youth skills workshops',
      'Community learning programs',
      'Technology and local innovation initiatives',
    ],
    canApply: true,
    applyTo: '/apply?division=foundation&program=community-grants',
  },
  {
    id: 'youth-employment',
    name: 'Youth Employment & Freelancing Fund',
    short: 'Equipping young people with digital, AI and freelancing skills.',
    goal: 'Equip young people with digital, AI, and freelancing skills that lead to work and income.',
    sponsorImpact: [
      { amount: 75, label: 'Sponsor one youth\u2019s job-readiness journey' },
      { amount: 750, label: 'Sponsor 10 youth' },
      { amount: 7500, label: 'Sponsor a youth employment cohort' },
    ],
    sponsorHook: 'Sponsor a youth\u2019s path to work and income.',
    description:
      'A job-readiness programme combining digital, AI and freelancing skills with guided practice so young people can move from training into work and income.',
    targetGroup: 'Young people seeking digital, AI and freelancing skills that lead to employment or self-employment.',
    intendedOutcomes: ['Job-ready digital and AI skills', 'First freelance or employment income', 'Sustained work or self-employment'],
    sponsorFunding: 'Training, coaching, equipment access, portfolio building and freelancing onboarding.',
    measurement: 'Training completion, portfolios built, placements or first income secured and sustained work.',
    icon: 'briefcase',
    supports: [
      'Digital and AI skills training',
      'Freelancing onboarding',
      'Job-readiness coaching',
      'Portfolio and profile building',
      'Placement and income support',
    ],
    canApply: true,
    applyTo: '/apply?division=foundation&program=youth-employment',
  },
  {
    id: 'teacher-training',
    name: 'Teacher Digital Capacity Initiative',
    short: 'Building teachers\u2019 digital and EdTech capacity.',
    goal: 'Equip teachers with digital skills and EdTech capacity to improve teaching and learning.',
    sponsorImpact: [
      { amount: 100, label: 'Sponsor one teacher\u2019s training' },
      { amount: 1000, label: 'Sponsor 10 teachers' },
      { amount: 10000, label: 'Sponsor a school-wide teacher training program' },
    ],
    sponsorHook: 'Sponsor a teacher and multiply impact across a classroom.',
    description:
      'A professional development programme that equips teachers with practical digital skills and EdTech capacity so they can improve teaching and learning in their classrooms.',
    targetGroup: 'Teachers and schools seeking to build digital and EdTech capacity.',
    intendedOutcomes: ['Improved digital competency among teachers', 'Adoption of EdTech in classrooms', 'Better learning outcomes for students'],
    sponsorFunding: 'Training, coaching, teaching tools, equipment access and classroom support.',
    measurement: 'Training completion, classroom adoption, competency checks and student learning outcomes.',
    icon: 'users',
    supports: [
      'Digital skills training for teachers',
      'EdTech tools and classroom resources',
      'Coaching and peer learning',
      'School-wide capacity building',
      'Ongoing classroom support',
    ],
    canApply: true,
    applyTo: '/apply?division=foundation&program=teacher-training',
  },
  {
    id: 'inclusive-learning',
    name: 'Inclusive Learning Fund',
    short: 'Making digital learning accessible for learners with disabilities.',
    goal: 'Make digital learning accessible for learners with disabilities and special learning needs.',
    sponsorImpact: [
      { amount: 100, label: 'Sponsor one learner\u2019s inclusive learning support' },
      { amount: 1000, label: 'Sponsor 10 learners' },
      { amount: 10000, label: 'Fund an inclusive learning program' },
    ],
    sponsorHook: 'Sponsor inclusive learning and remove barriers to opportunity.',
    description:
      'An accessibility programme that adapts digital learning, assistive tools and learning support so learners with disabilities and special learning needs can participate fully.',
    targetGroup: 'Learners with disabilities and special learning needs.',
    intendedOutcomes: ['Improved access to digital learning', 'Greater participation and completion', 'Reduced barriers to opportunity'],
    sponsorFunding: 'Assistive devices, accessible materials, specialist support and adapted learning tools.',
    measurement: 'Access enabled, participation and completion, learner feedback and outcomes.',
    icon: 'accessibility',
    supports: [
      'Assistive devices and tools',
      'Accessible learning materials',
      'Specialist learning support',
      'Adapted assessments',
      'Inclusive classroom resources',
    ],
    canApply: true,
    applyTo: '/apply?division=foundation&program=inclusive-learning',
  },
  {
    id: 'refugee-support',
    name: 'Refugee & Displaced Youth Fund',
    short: 'Digital, language and livelihood skills for refugee youth.',
    goal: 'Provide digital, language, and livelihood skills to refugee and displaced young people.',
    sponsorImpact: [
      { amount: 75, label: 'Sponsor one refugee youth\u2019s learning journey' },
      { amount: 750, label: 'Sponsor 10 refugee youth' },
      { amount: 7500, label: 'Sponsor a refugee youth skills cohort' },
    ],
    sponsorHook: 'Sponsor a refugee youth\u2019s path to skills and livelihood.',
    description:
      'A skills programme providing digital, language and livelihood training to refugee and displaced young people so they can rebuild and progress.',
    targetGroup: 'Refugee and displaced young people seeking skills and livelihood.',
    intendedOutcomes: ['Acquired digital and language skills', 'Livelihood and income pathways', 'Greater stability and progression'],
    sponsorFunding: 'Training, learning materials, equipment access, language support and livelihood coaching.',
    measurement: 'Training completion, skills demonstrated, livelihood pathways accessed and progression.',
    icon: 'globe',
    supports: [
      'Digital and language skills training',
      'Livelihood coaching',
      'Equipment and learning access',
      'Community and mentor support',
      'Progression into work or further learning',
    ],
    canApply: true,
    applyTo: '/apply?division=foundation&program=refugee-support',
  },
  {
    id: 'rural-learning-hubs',
    name: 'Rural Learning Hubs Initiative',
    short: 'Community learning hubs in underserved areas.',
    goal: 'Establish community learning hubs that expand access to digital learning and mentorship in underserved areas.',
    sponsorImpact: [
      { amount: 1000, label: 'Support one learning hub for a month' },
      { amount: 5000, label: 'Support a hub for a term' },
      { amount: 25000, label: 'Establish a new community learning hub' },
    ],
    sponsorHook: 'Sponsor a learning hub and connect a community to opportunity.',
    description:
      'A place-based programme that establishes community learning hubs to expand access to digital learning, mentorship and skills in underserved areas.',
    targetGroup: 'Communities in underserved rural areas with limited access to learning and mentorship.',
    intendedOutcomes: ['A functioning community learning hub', 'Sustained access to digital learning', 'Mentorship and skills development'],
    sponsorFunding: 'Hub setup, devices, connectivity, facilitator support and learning resources.',
    measurement: 'Hubs established and operational, learners reached, learning outcomes and sustained use.',
    icon: 'building',
    supports: [
      'Hub setup and equipment',
      'Connectivity and digital access',
      'Facilitator and mentor support',
      'Learning resources and programs',
      'Community engagement',
    ],
    canApply: true,
    applyTo: '/apply?division=foundation&program=rural-learning-hubs',
  },
  {
    id: 'green-skills',
    name: 'Green & Climate Skills Fund',
    short: 'Preparing youth for jobs in the green economy.',
    goal: 'Prepare youth for jobs in the green economy through renewable energy and climate-smart skills.',
    sponsorImpact: [
      { amount: 100, label: 'Sponsor one youth\u2019s green skills training' },
      { amount: 1000, label: 'Sponsor 10 youth' },
      { amount: 10000, label: 'Fund a green skills cohort' },
    ],
    sponsorHook: 'Sponsor green skills and power a sustainable future.',
    description:
      'A skills programme that prepares young people for work in the green economy through renewable energy and climate-smart training.',
    targetGroup: 'Young people seeking green economy and climate-smart skills.',
    intendedOutcomes: ['Green and climate-smart skills acquired', 'Entry into green economy jobs', 'Sustainable livelihoods'],
    sponsorFunding: 'Training, equipment, practical projects and placement support.',
    measurement: 'Training completion, skills demonstrated, placements or income in green sectors.',
    icon: 'leaf',
    supports: [
      'Renewable energy skills',
      'Climate-smart practices',
      'Practical green projects',
      'Job placement support',
      'Sustainable livelihood pathways',
    ],
    canApply: true,
    applyTo: '/apply?division=foundation&program=green-skills',
  },
  {
    id: 'msme-digital',
    name: 'MSME Digital Growth Fund',
    short: 'Helping small businesses adopt digital tools and AI.',
    goal: 'Help small businesses adopt digital tools, e-commerce, and AI to grow.',
    sponsorImpact: [
      { amount: 150, label: 'Sponsor one MSME\u2019s digital transformation' },
      { amount: 1500, label: 'Sponsor 10 MSMEs' },
      { amount: 15000, label: 'Fund an MSME digital growth program' },
    ],
    sponsorHook: 'Sponsor an MSME\u2019s digital growth journey.',
    description:
      'A growth programme that helps micro, small and medium enterprises adopt digital tools, e-commerce and AI so they can grow and create jobs.',
    targetGroup: 'Micro, small and medium enterprises seeking digital transformation.',
    intendedOutcomes: ['Digital tools adopted', 'E-commerce and AI capability', 'Business growth and job creation'],
    sponsorFunding: 'Training, tooling, coaching, e-commerce setup and AI adoption support.',
    measurement: 'Tools adopted, revenue or efficiency gains, jobs created and sustained growth.',
    icon: 'store',
    supports: [
      'Digital tools and e-commerce setup',
      'AI adoption support',
      'Business coaching',
      'Marketing and growth support',
      'Job creation and sustainability',
    ],
    canApply: true,
    applyTo: '/apply?division=foundation&program=msme-digital',
  },
];

/**
 * INITIATIVES — proposed programme concepts for sponsor discussion.
 * Do not mark these as open or funded until approval and live records exist.
 */
export const FOUNDATION_INITIATIVES = [
  {
    id: 'girls-in-stem-cohort',
    title: 'Girls in STEM Cohort',
    category: 'Girls in STEM',
    description:
      'A proposed cohort-based programme combining supervised STEM workshops, mentorship and a practical project showcase. Cohort size and delivery dates will be confirmed after partner and budget approval.',
    raised: null,
    goal: null,
    currency: 'USD',
    beneficiaries: null,
    status: 'proposed',
    fundingBrief: 'Workshop kits, mentor hours, safe equipment, project materials and learner support.',
    measures: 'Participation, completion, projects demonstrated and progression into further STEM learning.',
  },
  {
    id: 'digital-access-cohort',
    title: 'Digital Access Cohort',
    category: 'Digital Access Initiative',
    description:
      'A proposed digital-access cohort for learners or community groups that need devices, connectivity and guided digital-skills training. Locations and scale require local needs assessment.',
    raised: null,
    goal: null,
    currency: 'USD',
    beneficiaries: null,
    status: 'proposed',
    fundingBrief: 'Devices, connectivity, maintenance, accessible learning materials and instructor time.',
    measures: 'Devices kept functional, course completion, competency checks and sustained access.',
  },
  {
    id: 'education-access-cohort',
    title: 'Education Access Cohort',
    category: 'Education Access Fund',
    description:
      'A proposed needs-based support fund for eligible learners facing verified financial or social barriers to education.',
    raised: null,
    goal: null,
    currency: 'USD',
    beneficiaries: null,
    status: 'proposed',
    fundingBrief: 'Approved tuition, essential learning materials, safety equipment and participation costs.',
    measures: 'Awards made, funds disbursed, course continuation and verified completion.',
  },
  {
    id: 'community-grants-pilot',
    title: 'Community Impact Pilot Grants',
    category: 'Community Impact Grants',
    description:
      'A proposed milestone-based grant round for feasible community projects that address a defined education, digital access or local development challenge.',
    raised: null,
    goal: null,
    currency: 'USD',
    beneficiaries: null,
    status: 'proposed',
    fundingBrief: 'Prototype materials, testing, technical review and approved pilot costs.',
    measures: 'Milestones achieved, prototypes tested, pilots completed and documented outcomes.',
  },
  {
    id: 'youth-employment-cohort',
    title: 'Youth Employment & Freelancing Cohort',
    category: 'Youth Employment & Freelancing Fund',
    description:
      'A proposed cohort combining digital, AI and freelancing skills with job-readiness coaching to move young people into work or self-employment.',
    raised: null,
    goal: null,
    currency: 'USD',
    beneficiaries: null,
    status: 'proposed',
    fundingBrief: 'Training, coaching, equipment access, portfolio building and freelancing onboarding.',
    measures: 'Training completion, portfolios built, placements or first income secured and sustained work.',
  },
  {
    id: 'teacher-training-cohort',
    title: 'Teacher Digital Capacity Cohort',
    category: 'Teacher Digital Capacity Initiative',
    description:
      'A proposed professional development cohort equipping teachers with digital skills and EdTech tools for classroom adoption.',
    raised: null,
    goal: null,
    currency: 'USD',
    beneficiaries: null,
    status: 'proposed',
    fundingBrief: 'Training, coaching, teaching tools, equipment access and classroom support.',
    measures: 'Training completion, classroom adoption, competency checks and student learning outcomes.',
  },
  {
    id: 'inclusive-learning-cohort',
    title: 'Inclusive Learning Cohort',
    category: 'Inclusive Learning Fund',
    description:
      'A proposed cohort providing assistive tools, accessible materials and specialist support for learners with disabilities and special learning needs.',
    raised: null,
    goal: null,
    currency: 'USD',
    beneficiaries: null,
    status: 'proposed',
    fundingBrief: 'Assistive devices, accessible materials, specialist support and adapted learning tools.',
    measures: 'Access enabled, participation and completion, learner feedback and outcomes.',
  },
  {
    id: 'refugee-support-cohort',
    title: 'Refugee Youth Skills Cohort',
    category: 'Refugee & Displaced Youth Fund',
    description:
      'A proposed skills cohort providing digital, language and livelihood training to refugee and displaced young people.',
    raised: null,
    goal: null,
    currency: 'USD',
    beneficiaries: null,
    status: 'proposed',
    fundingBrief: 'Training, learning materials, equipment access, language support and livelihood coaching.',
    measures: 'Training completion, skills demonstrated, livelihood pathways accessed and progression.',
  },
  {
    id: 'rural-hubs-pilot',
    title: 'Rural Learning Hub Pilot',
    category: 'Rural Learning Hubs Initiative',
    description:
      'A proposed pilot to establish a community learning hub in an underserved rural area with devices, connectivity and facilitator support.',
    raised: null,
    goal: null,
    currency: 'USD',
    beneficiaries: null,
    status: 'proposed',
    fundingBrief: 'Hub setup, devices, connectivity, facilitator support and learning resources.',
    measures: 'Hub operational, learners reached, learning outcomes and sustained use.',
  },
  {
    id: 'green-skills-cohort',
    title: 'Green & Climate Skills Cohort',
    category: 'Green & Climate Skills Fund',
    description:
      'A proposed cohort preparing young people for green economy jobs through renewable energy and climate-smart skills training.',
    raised: null,
    goal: null,
    currency: 'USD',
    beneficiaries: null,
    status: 'proposed',
    fundingBrief: 'Training, equipment, practical projects and placement support.',
    measures: 'Training completion, skills demonstrated, placements or income in green sectors.',
  },
  {
    id: 'msme-digital-cohort',
    title: 'MSME Digital Growth Cohort',
    category: 'MSME Digital Growth Fund',
    description:
      'A proposed cohort helping small businesses adopt digital tools, e-commerce and AI to grow and create jobs.',
    raised: null,
    goal: null,
    currency: 'USD',
    beneficiaries: null,
    status: 'proposed',
    fundingBrief: 'Training, tooling, coaching, e-commerce setup and AI adoption support.',
    measures: 'Tools adopted, revenue or efficiency gains, jobs created and sustained growth.',
  },
];

/**
 * SPONSORSHIP PACKAGES — global summary of giving tiers.
 */
export const SPONSORSHIP_PACKAGES = [
  { label: 'Sponsor 1 Learner', range: '$25\u2013$150', note: 'Depending on program' },
  { label: 'Sponsor 10 Learners', range: '$250\u2013$1,500', note: 'Depending on program' },
  { label: 'Sponsor a Cohort', range: '$2,500\u2013$15,000', note: 'Cohort size varies' },
  { label: 'Sponsor a Hub or School Program', range: '$5,000\u2013$25,000', note: 'Place-based' },
  { label: 'Sponsor a Community Grant', range: '$500\u2013$10,000', note: 'Project-based' },
];

/**
 * SPONSOR BENEFITS — recognition and reporting offered to supporters.
 */
export const SPONSOR_BENEFITS = [
  'Named recognition on program pages',
  'Impact reports with learner outcomes',
  'Photos and stories from the field',
  'Invitation to program milestones',
  'Logo placement on sponsored programs',
  'Annual impact summary',
];

/**
 * HOW IT WORKS — six transparent steps.
 */
export const SUPPORT_STEPS = [
  {
    number: '01',
    title: 'Apply or Express Interest',
    description:
      'Complete a short application through your InnoSpeak account, telling us what support you need and why.',
  },
  {
    number: '02',
    title: 'Verification',
    description:
      'Our Foundation team verifies the information you provide and the documents you upload.',
  },
  {
    number: '03',
    title: 'Assessment',
    description:
      'Each application is assessed against the criteria of the relevant Foundation program.',
  },
  {
    number: '04',
    title: 'Selection',
    description:
      'Approved applicants are selected based on need, program fit and available funding.',
  },
  {
    number: '05',
    title: 'Support',
    description:
      'Approved support is allocated to tuition, materials, digital access or project funding.',
  },
  {
    number: '06',
    title: 'Follow-up & Impact',
    description:
      'We follow up on progress and, with consent, share impact with our supporters.',
  },
];

/**
 * WAYS TO GIVE — sponsor a Program, not an individual.
 * Built from the eleven programs so sponsor impact tiers stay in sync.
 */
const PROGRAM_SUPPORT_LINKS = {
  'education-access': 'foundation-donate-education-access',
  'digital-access': 'foundation-donate-digital-access',
  'girls-in-stem': 'foundation-donate-girls-in-stem',
  'community-grants': 'foundation-donate-community-grants',
  'youth-employment': 'foundation-donate-youth-employment',
  'teacher-training': 'foundation-donate-teacher-training',
  'inclusive-learning': 'foundation-donate-inclusive-learning',
  'refugee-support': 'foundation-donate-refugee-support',
  'rural-learning-hubs': 'foundation-donate-rural-learning-hubs',
  'green-skills': 'foundation-donate-green-skills',
  'msme-digital': 'foundation-donate-msme-digital',
};

export const WAYS_TO_GIVE = FOCUS_AREAS.map((program) => ({
  id: program.id,
  title: program.name,
  description: program.sponsorHook,
  sponsorImpact: program.sponsorImpact,
  sponsorHook: program.sponsorHook,
  icon: program.icon,
  cta: 'Support This Program',
  to: `/contact?interest=${PROGRAM_SUPPORT_LINKS[program.id] || 'foundation-donate'}`,
}));

export const TRANSPARENCY = {
  summary: 'Funding should be traceable from commitment to verified delivery.',
  items: [],
  commitment:
    'We will publish financial allocations and impact results when they are supported by reviewed records. Until that reporting is in place, this page does not present estimated percentages or unverified impact figures as actual results.',
  reportingNote:
    'Each funded programme should have an approved budget, documented restrictions, recorded disbursements, supporting evidence and a periodic report describing outputs, outcomes and challenges.',
};

export const FOUNDATION_FAQ = [
  {
    q: 'Who can apply for Foundation support?',
    a: 'Learners and communities facing financial, digital or access barriers. You can be an InnoSpeak learner or applying to become one. Each Foundation program has its own eligibility criteria.',
  },
  {
    q: 'How do I apply?',
    a: 'Sign in to your InnoSpeak account and go to your portal. Select Foundation \u2192 My Applications \u2192 Start Application. Choose the program that fits your situation, complete the form and upload any required documents.',
  },
  {
    q: 'How long does the review take?',
    a: 'Review timelines depend on the programme, verification requirements and available funding. Any open application window should publish its expected decision timeline and how applicants will be updated.',
  },
  {
    q: 'Is it really free?',
    a: 'Support terms depend on the approved programme. The application guidance and award letter should state whether support is a grant, bursary, in-kind contribution or another arrangement, and whether repayment applies.',
  },
  {
    q: 'What certificate do Foundation-supported learners receive?',
    a: 'Any certificate depends on the course requirements and the issuing organisation. Foundation support alone is not a qualification or accreditation. The relevant course page should explain the issuer and what the credential represents.',
  },
  {
    q: 'Can I support a specific learner?',
    a: 'Our model prioritises transparent programme funding and needs-based selection. Any restricted contribution or learner-specific sponsorship must be agreed in writing, verified and handled under the applicable privacy and safeguarding rules.',
  },
  {
    q: 'Can I contact the learner I support?',
    a: 'For privacy and safeguarding, no direct contact is allowed. Our Foundation team shares progress reports with supporters and relays any messages. This protects learners and their families.',
  },
  {
    q: 'Is my contribution tax-deductible?',
    a: "Tax treatment depends on the Foundation's legal status and the rules in your jurisdiction. Please obtain confirmation before assuming a contribution is tax-deductible.",
  },
  {
    q: 'What do sponsors receive in return?',
    a: 'Sponsors receive named recognition on program pages, impact reports with learner outcomes, photos and stories from the field, invitations to program milestones, logo placement on sponsored programs and an annual impact summary.',
  },
];

export const FOUNDATION_CLOSING = {
  title: 'Opportunity should not depend on circumstance.',
  subtitle:
    'Help us remove barriers to learning and practical innovation. Contributions should be allocated to approved programmes and reported with clear evidence.',
  primaryCta: { label: 'Apply for Support', to: '/apply?division=foundation' },
  secondaryCta: { label: 'Support a Program', to: '#ways-to-give' },
};
