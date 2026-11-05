import { ACADEMY_COURSES, TRACKS } from '../../lib/data/academy.js';

export const IMPACT_STATS = [
  { id: 'courses', value: ACADEMY_COURSES.length, suffix: '+', label: 'On-Demand Courses', description: `Across ${TRACKS.length} learning tracks` },
  { id: 'tracks', value: TRACKS.length, suffix: '', label: 'Learning Tracks', description: 'From AI to languages, CBE to engineering' },
  { id: 'languages', value: 11, suffix: '+', label: 'Global Languages', description: 'English, Swahili, Spanish, French, German, Mandarin and more' },
  { id: 'grades', value: 10, suffix: '', label: 'CBE Grade Levels', description: 'Grades 3–12 plus electives, aligned to Kenyan CBC' },
  { id: 'price', value: 19, suffix: '$', label: 'Starting Price', description: 'Affordable, pay-per-course learning' },
  { id: 'programs', value: 4, suffix: '', label: 'Connected Programs', description: 'Academy, Labs, Career Hub and Foundation' },
];

export const IMPACT_HIGHLIGHTS = [
  {
    id: 'skills',
    icon: 'trending-up',
    title: 'Real Skills, Real Growth',
    description: 'Practical, project-based courses that build job-ready skills from day one.',
  },
  {
    id: 'careers',
    icon: 'briefcase',
    title: 'Career Advancement',
    description: 'Courses aligned to what employers are hiring for, across Kenya and globally.',
  },
  {
    id: 'global',
    icon: 'globe',
    title: 'Global Community',
    description: 'Join learners from across the world in a connected ecosystem of education and innovation.',
  },
  {
    id: 'impact',
    icon: 'heart',
    title: 'Purpose-Driven',
    description: 'Every enrollment supports our Foundation, helping underserved learners access quality education.',
  },
];

export const IMPACT_QUOTE = {
  text: 'We believe education should not merely prepare people for employment. It should prepare them to become innovators, ethical leaders, and lifelong learners capable of solving society\u2019s greatest challenges.',
  author: 'Fred Omondi',
  role: 'Founder & CEO, InnoSpeak Global',
};
