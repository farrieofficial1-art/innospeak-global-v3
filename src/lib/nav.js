/**
 * NAV_LINKS — single source of truth for primary navigation.
 *
 * Shared by the desktop bar and the full-screen mobile menu so the two
 * never drift. `end` is needed for the index route so it only matches
 * the root path exactly.
 */
export const NAV_LINKS = [
  { label: 'Home', to: '/', end: true },
  { label: 'About', to: '/about', end: false },
  { label: 'Programs', to: '/programs', end: false },
  { label: 'Founder', to: '/founder', end: false },
  { label: 'Impact', to: '/impact', end: false },
  { label: 'Contact', to: '/contact', end: false },
];

/** Primary CTA shown in the navbar (desktop) and inside the mobile menu. */
export const NAV_CTA = { label: 'Apply Now', to: '/apply' };
