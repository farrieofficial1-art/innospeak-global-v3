/**
 * promotionalCampaigns — centralized promotional content system for InnoSpeak.
 * 
 * This is NOT an advertising network. It's InnoSpeak's internal promotional
 * system for highlighting courses, programs, labs, events, and special initiatives.
 * 
 * Each campaign has:
 * - id (unique identifier)
 * - type (featured-course, new-course, new-program, labs-highlight, career-opportunity, event, learning-campaign)
 * - title
 * - subtitle/description
 * - badge (eyebrow text)
 * - image/visual
 * - cta (button label)
 * - ctaRoute (where the button navigates)
 * - startDate
 * - expiryDate
 * - priority (higher number = higher priority)
 * - active (true/false)
 * - metadata (type-specific data like courseCode, labId, etc.)
 */

export const PROMOTIONAL_CAMPAIGNS = [
  // Featured Courses
  {
    id: 'featured-react-2026',
    type: 'featured-course',
    title: 'React Development',
    subtitle: 'Build modern single-page applications with React, hooks, routing and API integration.',
    badge: 'FEATURED COURSE',
    courseCode: 'REA101',
    image: null,
    cta: 'View Course',
    ctaRoute: '/courses/REA101',
    startDate: new Date('2026-09-01'),
    expiryDate: new Date('2026-12-31'),
    priority: 10,
    active: true,
  },
  {
    id: 'featured-ai-fundamentals',
    type: 'featured-course',
    title: 'AI Fundamentals & LLM Applications',
    subtitle: 'Master artificial intelligence, large language models and practical AI applications.',
    badge: 'TRENDING',
    courseCode: 'AIF101',
    image: null,
    cta: 'Explore AI',
    ctaRoute: '/courses/AIF101',
    startDate: new Date('2026-09-01'),
    expiryDate: new Date('2026-12-31'),
    priority: 9,
    active: true,
  },

  // Labs Highlights
  {
    id: 'labs-highlight-software-engineering',
    type: 'labs-highlight',
    title: 'Software Engineering Lab School',
    subtitle: 'Learn by building. Practical labs in Go, Rust, distributed systems and more.',
    badge: 'HANDS-ON LEARNING',
    image: null,
    cta: 'Explore Labs',
    ctaRoute: '/labs',
    startDate: new Date('2026-09-01'),
    expiryDate: new Date('2027-03-31'),
    priority: 8,
    active: true,
  },

  // Career Opportunities
  {
    id: 'career-opportunity-tech-2026',
    type: 'career-opportunity',
    title: 'Tech Career Development',
    subtitle: 'From learning to employment. Develop the technical skills and portfolio needed for tech careers.',
    badge: 'CAREER PATH',
    image: null,
    cta: 'Career Hub',
    ctaRoute: '/career-hub',
    startDate: new Date('2026-09-01'),
    expiryDate: new Date('2027-12-31'),
    priority: 7,
    active: true,
  },

  // Learning Campaigns (seasonal or special initiatives)
  {
    id: 'campaign-digital-skills-2026',
    type: 'learning-campaign',
    title: 'Build Essential Digital Skills',
    subtitle: 'Master communication, technology, and professional tools for the modern workplace.',
    badge: 'LEARNING CAMPAIGN',
    image: null,
    cta: 'Start Learning',
    ctaRoute: '/courses',
    startDate: new Date('2026-09-01'),
    expiryDate: new Date('2027-06-30'),
    priority: 6,
    active: true,
  },

  // Example: Inactive campaign (won't display)
  {
    id: 'event-innospeak-summit-2026',
    type: 'event',
    title: 'InnoSpeak Global Summit 2026',
    subtitle: 'Join us for a day of learning, networking and innovation.',
    badge: 'SPECIAL EVENT',
    image: null,
    cta: 'Register',
    ctaRoute: '/events',
    startDate: new Date('2026-11-01'),
    expiryDate: new Date('2026-11-30'),
    priority: 5,
    active: false, // Not yet active
  },
];

/**
 * getActiveCampaigns — returns all active, non-expired campaigns sorted by priority
 */
export function getActiveCampaigns() {
  const now = new Date();
  return PROMOTIONAL_CAMPAIGNS.filter((c) => {
    if (!c.active) return false;
    if (c.startDate && now < c.startDate) return false;
    if (c.expiryDate && now > c.expiryDate) return false;
    return true;
  }).sort((a, b) => b.priority - a.priority);
}

/**
 * getCampaignsByType — get campaigns filtered by type
 */
export function getCampaignsByType(type) {
  return getActiveCampaigns().filter((c) => c.type === type);
}

/**
 * getFeaturedCampaign — get the highest-priority featured campaign
 */
export function getFeaturedCampaign() {
  const campaigns = getActiveCampaigns();
  return campaigns.length > 0 ? campaigns[0] : null;
}

/**
 * getCampaignById — look up a specific campaign
 */
export function getCampaignById(id) {
  return PROMOTIONAL_CAMPAIGNS.find((c) => c.id === id);
}
