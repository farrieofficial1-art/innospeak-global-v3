import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Search,
  Sparkles,
  GraduationCap,
  FlaskConical,
  HeartHandshake,
  Layers3,
  Award,
  MonitorPlay,
} from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import {
  COURSES,
  getVisiblePrograms,
  getAcademyPathways,
  getLabsCourses,
} from '../lib/data/programmeData.js';
import { LAB_SCHOOLS } from '../lib/data/labsData.js';

const academyPathways = getAcademyPathways();
const labsSchools = LAB_SCHOOLS;

const ALL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const PILLARS = [
  {
    id: 'academy',
    title: 'InnoSpeak Global Academy',
    tagline: 'Structured Learning & Certification',
    description:
      'Structured learning, professional development, digital skills, communication, technical education and certification.',
    icon: GraduationCap,
    to: '/academy',
    cta: 'Explore Academy',
    accent: 'from-gold-500/10 to-gold-400/5',
    border: 'border-gold-500/30',
    iconBg: 'bg-gold-gradient',
  },
  {
    id: 'labs',
    title: 'InnoSpeak Global Labs',
    tagline: 'Practical Innovation & Engineering',
    description:
      'Practical engineering, technology, innovation, projects, entrepreneurship and hands-on development.',
    icon: FlaskConical,
    to: '/labs',
    cta: 'Explore Labs',
    accent: 'from-navy-500/10 to-navy-400/5',
    border: 'border-navy-400/30',
    iconBg: 'bg-navy-800',
  },
  {
    id: 'foundation',
    title: 'InnoSpeak Global Foundation',
    tagline: 'Scholarships & Educational Support',
    description:
      'Scholarships, educational support, opportunity access and community impact.',
    icon: HeartHandshake,
    to: '/foundation',
    cta: 'Explore Foundation',
    accent: 'from-emerald-500/10 to-emerald-400/5',
    border: 'border-emerald-400/30',
    iconBg: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
  },
];

const DIVISION_FILTERS = [
  { id: 'all', label: 'All Programs' },
  { id: 'academy', label: 'Academy' },
  { id: 'labs', label: 'Labs' },
];

export default function Programs() {
  const [query, setQuery] = useState('');
  const [division, setDivision] = useState('all');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');

  // Build category list from visible programs
  const categories = useMemo(() => {
    const set = new Set();
    COURSES.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set).sort();
  }, []);

  // Flatten all courses with their pathway info for filtering
  const allCourses = useMemo(() => {
    return COURSES.map((c) => {
      const pathway =
        academyPathways.find((p) => p.id === c.pathwayId) ||
        labsSchools.find((s) => s.id === c.pathwayId);
      return {
        ...c,
        pathwayTitle: pathway?.title || c.category || 'General',
        pillar: c.pillar || 'academy',
      };
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allCourses.filter((c) => {
      if (division !== 'all' && c.pillar !== division) return false;
      if (category !== 'all' && c.category !== category) return false;
      if (level !== 'all' && c.level !== level) return false;
      if (q && !`${c.name} ${c.shortDescription} ${c.category} ${c.code}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [allCourses, division, category, level, query]);

  const academyCount = allCourses.filter((c) => c.pillar === 'academy').length;
  const labsCount = allCourses.filter((c) => c.pillar === 'labs').length;

  return (
    <>
      <Seo
        title="Programs — Learn. Build. Innovate."
        description="Explore the pathways within the InnoSpeak Global ecosystem — structured learning, practical innovation, and educational support."
        path="/programs"
      />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)
              `,
              backgroundSize: '64px 64px',
            }}
          />
        </div>
        <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gold-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-navy-500/15 blur-[100px]" />

        <div className="container-premium relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="eyebrow">The InnoSpeak Global Ecosystem</span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.12] text-white md:text-5xl lg:text-6xl">
              Learn. Build. Innovate.
              <span className="block text-gradient-gold">Make an Impact.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-navy-200 md:text-lg">
              Explore the pathways within the InnoSpeak Global ecosystem —
              structured learning, practical innovation, and educational support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Three Pillars ────────────────────────────────── */}
      <section className="container-premium py-16 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="font-body text-xs font-bold uppercase tracking-[0.22em] text-gold-700">
            One Ecosystem. Three Pathways.
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy-900 md:text-4xl">
            Choose your path within InnoSpeak Global
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative overflow-hidden rounded-3xl border-2 ${pillar.border} bg-gradient-to-br ${pillar.accent} p-8 transition-all duration-300 hover:shadow-premium-lg`}
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${pillar.iconBg} text-white shadow-md`}>
                  <Icon size={28} strokeWidth={1.8} />
                </div>
                <h3 className="font-display text-xl font-bold text-navy-900">
                  {pillar.title}
                </h3>
                <p className="mt-1 font-body text-xs font-semibold uppercase tracking-wider text-gold-700">
                  {pillar.tagline}
                </p>
                <p className="mt-4 font-body text-sm leading-relaxed text-navy-600">
                  {pillar.description}
                </p>
                <Link
                  to={pillar.to}
                  className="mt-6 inline-flex items-center gap-2 font-body text-sm font-bold text-navy-800 transition-colors hover:text-gold-700"
                >
                  {pillar.cta}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Program Discovery ────────────────────────────── */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container-premium">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-[0.22em] text-gold-700">
                Program Discovery
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-navy-900 md:text-4xl">
                Explore Academy & Labs programs
              </h2>
              <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-navy-500">
                {academyCount} Academy courses across {academyPathways.length} programs.
                {' '}{labsCount} Labs courses across {labsSchools.length} schools.
              </p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 rounded-2xl border border-navy-100 bg-white px-4 py-3 shadow-sm md:w-80">
              <Search size={18} className="shrink-0 text-navy-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search programs and courses..."
                className="w-full bg-transparent font-body text-sm text-navy-900 outline-none placeholder:text-navy-300"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-3">
            {/* Division */}
            <div className="flex gap-2">
              {DIVISION_FILTERS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDivision(d.id)}
                  className={`rounded-full px-4 py-2 font-body text-sm font-semibold transition-colors ${
                    division === d.id
                      ? 'bg-navy-900 text-white'
                      : 'bg-white text-navy-600 hover:bg-navy-50'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full border border-navy-100 bg-white px-4 py-2 font-body text-sm font-semibold text-navy-600 outline-none hover:border-gold-300"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Level */}
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-full border border-navy-100 bg-white px-4 py-2 font-body text-sm font-semibold text-navy-600 outline-none hover:border-gold-300"
            >
              <option value="all">All levels</option>
              {ALL_LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            {(division !== 'all' || category !== 'all' || level !== 'all' || query) && (
              <button
                onClick={() => { setDivision('all'); setCategory('all'); setLevel('all'); setQuery(''); }}
                className="rounded-full px-4 py-2 font-body text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Results count */}
          <p className="mb-6 font-body text-sm text-navy-500">
            Showing {filtered.length} {filtered.length === 1 ? 'course' : 'courses'}
          </p>

          {/* Course grid */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center">
              <p className="font-body text-sm text-navy-500">
                No programs match your filters. Try adjusting your search.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course) => (
                <Link
                  key={course.code}
                  to={`/courses/${course.code}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Top bar with division + level */}
                  <div className="flex items-center justify-between border-b border-navy-50 px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 font-body text-[11px] font-bold uppercase tracking-wide ${
                        course.pillar === 'labs'
                          ? 'bg-navy-700 text-gold-300'
                          : 'bg-gold-500/10 text-gold-700'
                      }`}
                    >
                      {course.pillar === 'labs' ? 'Labs' : 'Academy'}
                    </span>
                    <span className="font-body text-xs font-semibold text-navy-400">
                      {course.code}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-bold leading-snug text-navy-900 group-hover:text-gold-700">
                      {course.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 font-body text-sm leading-relaxed text-navy-500">
                      {course.shortDescription}
                    </p>

                    {/* Meta row */}
                    <div className="mt-4 flex flex-wrap gap-3 font-body text-xs text-navy-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={13} /> {course.duration}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MonitorPlay size={13} /> {course.studyMode}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Layers3 size={13} /> {course.level}
                      </span>
                    </div>

                    {/* Category + fees + certificate */}
                    <div className="mt-4 flex items-center justify-between border-t border-navy-50 pt-4">
                      <span className="font-body text-xs font-medium text-navy-400">
                        {course.category}
                      </span>
                      {course.certification && (
                        <span className="inline-flex items-center gap-1 font-body text-xs font-semibold text-gold-700">
                          <Award size={13} /> Certificate
                        </span>
                      )}
                    </div>
                    {course.fees && (
                      <p className="mt-2 font-body text-sm font-bold text-navy-900">
                        {course.fees}
                      </p>
                    )}

                    {/* CTA */}
                    <div className="mt-4 inline-flex items-center gap-2 font-body text-sm font-bold text-navy-800 group-hover:text-gold-700">
                      View course
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA to Apply ──────────────────────────────────── */}
      <section className="bg-navy-900 py-16 md:py-20">
        <div className="container-premium text-center">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Ready to start your journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-navy-200">
            Apply to InnoSpeak Global Academy or Labs and take the first step
            toward your future.
          </p>
          <Link
            to="/apply"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-8 py-3.5 font-body text-sm font-bold text-navy-900 shadow-md transition-transform hover:scale-[1.03]"
          >
            Apply Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
