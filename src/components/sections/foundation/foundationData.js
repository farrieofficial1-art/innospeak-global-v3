/**
 * foundationData — content for the InnoSpeak Global Foundation.
 * Programme details live in foundationApplicationsData (FOUNDATION_PROGRAMS).
 */

export const FOUNDATION_HERO = {
  eyebrow: 'InnoSpeak Global Foundation',
  title: 'Fund a defined intervention.',
  highlight: 'See the evidence of change.',
  description:
    'We design targeted education-access, digital opportunity, girls-in-engineering and community innovation programmes. Each programme is intended to have clear eligibility, a costed delivery plan and measurable outcomes before funding opens.',
  primaryCta: { label: 'Explore Our Programs', to: '#foundation-programs' },
  secondaryCta: { label: 'Apply for Support', to: '/apply?division=foundation' },
  tertiaryCta: { label: 'Support a Program', to: '#foundation-programs' },
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
    a: 'Sign in to your InnoSpeak account and go to your portal. Select Foundation → My Applications → Start Application. Choose the program that fits your situation, complete the form and upload any required documents.',
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
    a: 'Our proposed model prioritises transparent programme funding and needs-based selection. Any restricted contribution or learner-specific sponsorship must be agreed in writing, verified and handled under the applicable privacy and safeguarding rules.',
  },
  {
    q: 'Can I contact the learner I support?',
    a: 'For privacy and safeguarding, no direct contact is allowed. Our Foundation team shares progress reports with supporters and relays any messages. This protects learners and their families.',
  },
  {
    q: 'Is my contribution tax-deductible?',
    a: "Tax treatment depends on the Foundation's legal status and the rules in your jurisdiction. Please obtain confirmation before assuming a contribution is tax-deductible.",
  },
];

export const FOUNDATION_CLOSING = {
  title: 'Opportunity should not depend on circumstance.',
  subtitle:
    'Help us remove barriers to learning and practical innovation. Contributions should be allocated to approved programmes and reported with clear evidence.',
  primaryCta: { label: 'Apply for Support', to: '/apply?division=foundation' },
  secondaryCta: { label: 'Support a Program', to: '#foundation-programs' },
};
