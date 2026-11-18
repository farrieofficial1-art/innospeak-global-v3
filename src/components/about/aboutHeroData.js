export const ABOUT_HERO_BADGE = 'About InnoSpeak Global';

export const ABOUT_HERO_HEADLINE = [
  { text: 'Learn. Build.', highlight: false },
  { text: 'Innovate. Impact.', highlight: true },
];

export const ABOUT_HERO_SUBTITLE =
  'A connected ecosystem of structured learning, practical innovation, and educational support — built to equip learners, professionals and communities with the skills that matter.';

export const ABOUT_HERO_BUTTONS = [
  { label: 'Explore the Academy', to: '/academy' },
  { label: 'Our Story', to: '/founder' },
];

export const ABOUT_HERO_IMAGE =
  'https://images.pexels.com/photos/8423040/pexels-photo-8423040.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100';

import { CATALOGUE_STATS } from '../../config/catalogueStats.js';

export const ABOUT_HERO_STATS = [
  { value: CATALOGUE_STATS.totalCourses, label: 'Courses' },
  { value: CATALOGUE_STATS.academyTracks + CATALOGUE_STATS.labTracks, label: 'Tracks' },
  { value: CATALOGUE_STATS.ecosystemPillars, label: 'Programs' },
];
