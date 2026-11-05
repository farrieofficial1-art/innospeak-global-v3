// src/lib/data/registry.js
//
// Source of truth for Labs tracks (7) and Academy pathways (12).
// Consumed by labsData.js (Labs schools), programmeData.js (admissions),
// and the catalogue audit scripts.

import {
  Code, BarChart3, Brain, Cloud, ShieldCheck, Cog, Sparkles,
} from 'lucide-react';

export const TRACKS = [
  {
    id: 'software-engineering',
    code: 'LAB-SE',
    title: 'Software Engineering',
    slug: 'software-engineering',
    shortDescription: 'Full-stack web, mobile, and backend development with modern tooling.',
    description: 'From coding fundamentals to full-stack and mobile development — build, ship, and maintain production software with modern frameworks and engineering practices.',
    icon: Code,
    status: 'open',
  },
  {
    id: 'data-analytics',
    code: 'LAB-DA',
    title: 'Data Analytics',
    slug: 'data-analytics',
    shortDescription: 'Data literacy, SQL, Python, BI and data science for decision-making.',
    description: 'Turn raw data into insight — Excel, SQL, Power BI, Python, and applied data science for analytics, engineering, and business intelligence.',
    icon: BarChart3,
    status: 'open',
  },
  {
    id: 'ai-intelligent-systems',
    code: 'LAB-AI',
    title: 'AI & Intelligent Systems',
    slug: 'ai-intelligent-systems',
    shortDescription: 'Applied AI, prompt engineering, agents, and machine learning.',
    description: 'Practical and production AI — prompt engineering, generative applications, agents, and machine learning models integrated into real systems.',
    icon: Brain,
    status: 'open',
  },
  {
    id: 'cloud-infrastructure',
    code: 'LAB-CI',
    title: 'Cloud & Infrastructure',
    slug: 'cloud-infrastructure',
    shortDescription: 'AWS, Azure, Linux, networking, DevOps, and containers.',
    description: 'Build and operate cloud and on-prem infrastructure — cloud platforms, Linux administration, networking, DevOps pipelines, and container orchestration.',
    icon: Cloud,
    status: 'open',
  },
  {
    id: 'cybersecurity',
    code: 'LAB-CY',
    title: 'Cybersecurity',
    slug: 'cybersecurity',
    shortDescription: 'Security fundamentals, network security, SOC, and forensics.',
    description: 'Defend systems and respond to threats — security fundamentals, network and cloud security, application security, SOC analysis, incident response, and digital forensics.',
    icon: ShieldCheck,
    status: 'open',
  },
  {
    id: 'engineering-smart-systems',
    code: 'LAB-ES',
    title: 'Engineering & Smart Systems',
    slug: 'engineering-smart-systems',
    shortDescription: 'Electrical, electronics, automation, IoT, robotics, and solar.',
    description: 'Hands-on engineering for the physical world — electrical installation, electronics, PLC programming, industrial automation, IoT, robotics, and renewable energy.',
    icon: Cog,
    status: 'open',
  },
  {
    id: 'creative-technology',
    code: 'LAB-CT',
    title: 'Creative Technology',
    slug: 'creative-technology',
    shortDescription: 'Motion graphics, video, podcasting, 3D, and AI-generated media.',
    description: 'Create with technology — motion design, videography, podcast production, 3D modeling, and AI-powered image and video generation and editing.',
    icon: Sparkles,
    status: 'open',
  },
];

export const PATHWAYS = [
  { id: 'english-communication', title: 'English Communication', slug: 'english-communication', description: 'English language skills for everyday and professional contexts.' },
  { id: 'world-languages', title: 'World Languages', slug: 'world-languages', description: 'Swahili, Spanish, French, German, Mandarin, Japanese, Korean and more.' },
  { id: 'international-qualifications', title: 'International Qualifications', slug: 'international-qualifications', description: 'IELTS, SAT, IGCSE, GMAT, GRE, TOEFL and other exam prep.' },
  { id: 'kenya-curriculum-tvet', title: 'Kenya Curriculum & TVET', slug: 'kenya-curriculum-tvet', description: 'CBE school programme (Grades 3–12), TVET, and engineering trades.' },
  { id: 'digital-skills-productivity', title: 'Digital Skills & Productivity', slug: 'digital-skills-productivity', description: 'AI, data, coding, cloud, cybersecurity, and digital tools.' },
  { id: 'creative-design-media', title: 'Creative Design & Media', slug: 'creative-design-media', description: 'Design, video, photography, animation, and AI-generated media.' },
  { id: 'business-entrepreneurship', title: 'Business & Entrepreneurship', slug: 'business-entrepreneurship', description: 'Business, leadership, marketing, finance, and operations.' },
  { id: 'freelancing-remote-work', title: 'Freelancing & Remote Work', slug: 'freelancing-remote-work', description: 'Build a freelance career, win global clients, and work remotely.' },
  { id: 'career-global', title: 'Career Global', slug: 'career-global', description: 'Job search, interview prep, and global career advancement.' },
  { id: 'education-teaching-training', title: 'Education & Training', slug: 'education-teaching-training', description: 'Teaching methodologies, curriculum, EdTech, and instructional design.' },
  { id: 'health-hospitality-community', title: 'Health & Community Services', slug: 'health-hospitality-community', description: 'Hospitality, caregiving, community health, and events.' },
  { id: 'personal-life-skills', title: 'Personal & Professional Development', slug: 'personal-life-skills', description: 'Thinking, productivity, branding, communication, and resilience.' },
];

export function getGrouping() { return null; }

export const TRACK_BY_ID = Object.fromEntries(TRACKS.map((t) => [t.id, t]));
export const TRACK_BY_SLUG = Object.fromEntries(TRACKS.map((t) => [t.slug, t]));
export const PATHWAY_BY_ID = Object.fromEntries(PATHWAYS.map((p) => [p.id, p]));
