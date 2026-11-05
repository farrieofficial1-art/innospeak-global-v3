import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, X } from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import Container from '../components/ui/Container.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import LabCourseCard from '../components/academy/LabCourseCard.jsx';
import { TRACKS, TRACK_BY_ID } from '../lib/data/registry.js';
import { LAB_COURSES, LAB_BY_TRACK } from '../lib/data/labs.js';
import { inViewOnce } from '../lib/motion/presets';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function Labs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTrack = searchParams.get('track') || 'all';
  const [selectedTrack, setSelectedTrack] = useState(initialTrack);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  function handleTrackChange(trackId) {
    setSelectedTrack(trackId);
    if (trackId === 'all') searchParams.delete('track');
    else searchParams.set('track', trackId);
    setSearchParams(searchParams, { replace: true });
  }

  const filtered = useMemo(() => {
    let list = LAB_COURSES;
    if (selectedTrack !== 'all') list = list.filter((c) => c.track_id === selectedTrack);
    if (selectedLevel !== 'all') list = list.filter((c) => c.level === selectedLevel);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.skills?.some((s) => s.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [selectedTrack, selectedLevel, searchQuery]);

  const activeTrack = selectedTrack !== 'all' ? TRACK_BY_ID[selectedTrack] : null;

  return (
    <>
      <Seo
        title="Labs — Practical Engineering & Innovation Tracks"
        description="175 hands-on courses across software engineering, data, AI, cloud, cybersecurity, smart systems, and creative technology."
        path="/labs"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-radial pt-32 pb-16">
        <div className="absolute inset-0 bg-navy-gradient opacity-90" />
        <div className="pointer-events-none absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" aria-hidden="true" />
        <div className="relative container-premium">
          <Reveal>
            <span className="eyebrow bg-gold-500/15 text-gold-300">
              InnoSpeak Labs
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Practical engineering & innovation.
            </h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-white/70 sm:text-lg">
              {LAB_COURSES.length} hands-on courses across {TRACKS.length} tracks —
              from software engineering and AI to cloud, cybersecurity, smart systems,
              and creative technology. Build, break, and ship real projects.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/apply" className="btn-gold inline-flex items-center gap-2">
                Apply to a Lab track
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/career-hub"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 font-body text-sm font-bold text-white backdrop-blur-sm transition-all hover:border-gold-400 hover:text-gold-300"
              >
                Explore career paths
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Track cards */}
      {!activeTrack && (
        <section className="bg-white py-16 lg:py-20">
          <Container>
            <SectionHeading
              eyebrow="7 Tracks"
              title="Choose your engineering path"
              subtitle="Each track is a focused curriculum of 25 courses from fundamentals to expert-level practice."
            />
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
              className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {TRACKS.map((track) => {
                const Icon = track.icon;
                const count = LAB_BY_TRACK[track.id]?.length || 0;
                return (
                  <motion.div
                    key={track.id}
                    variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                  >
                    <Link
                      to={`/labs?track=${track.id}`}
                      className="group flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/60 hover:shadow-premium-lg"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 transition-colors group-hover:bg-gold-gradient group-hover:text-navy-900">
                        {Icon && <Icon size={24} strokeWidth={1.8} />}
                      </div>
                      <h3 className="mt-4 font-display text-lg font-bold text-navy-900">
                        {track.title}
                      </h3>
                      <p className="mt-2 flex-1 font-body text-sm leading-6 text-navy-500">
                        {track.shortDescription}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-navy-400">
                          {track.code} · {count} courses
                        </span>
                        <span className="inline-flex items-center gap-1 font-body text-sm font-bold text-gold-700 transition-all group-hover:gap-2">
                          Explore
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </Container>
        </section>
      )}

      {/* Course grid */}
      <section className="bg-cream py-16 lg:py-20">
        <Container>
          {activeTrack && (
            <div className="mb-10">
              <SectionHeading
                eyebrow={activeTrack.code}
                title={activeTrack.title}
                subtitle={activeTrack.description}
                center={false}
              />
            </div>
          )}

          {/* Filters */}
          <div className="space-y-5">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, code, or skill (e.g. React, AWS, Python)…"
                className="w-full rounded-2xl border border-navy-100 bg-white py-3.5 pl-12 pr-12 font-body text-sm text-navy-900 shadow-premium outline-none transition-colors placeholder:text-navy-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 transition-colors hover:text-navy-700"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleTrackChange('all')}
                className={`rounded-full px-4 py-2 font-body text-xs font-semibold transition-all ${
                  selectedTrack === 'all'
                    ? 'bg-navy-900 text-white shadow-premium'
                    : 'bg-white text-navy-600 border border-navy-100 hover:border-navy-300 hover:text-navy-900'
                }`}
              >
                All Tracks
              </button>
              {TRACKS.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleTrackChange(track.id)}
                  className={`rounded-full px-4 py-2 font-body text-xs font-semibold transition-all ${
                    selectedTrack === track.id
                      ? 'bg-navy-900 text-white shadow-premium'
                      : 'bg-white text-navy-600 border border-navy-100 hover:border-navy-300 hover:text-navy-900'
                  }`}
                >
                  {track.title}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLevel('all')}
                  className={`rounded-full px-3.5 py-1.5 font-body text-xs font-semibold transition-all ${
                    selectedLevel === 'all'
                      ? 'bg-gold-500 text-navy-900'
                      : 'bg-white text-navy-500 border border-navy-100 hover:border-gold-300 hover:text-navy-900'
                  }`}
                >
                  All Levels
                </button>
                {LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedLevel(level)}
                    className={`rounded-full px-3.5 py-1.5 font-body text-xs font-semibold transition-all ${
                      selectedLevel === level
                        ? 'bg-gold-500 text-navy-900'
                        : 'bg-white text-navy-500 border border-navy-100 hover:border-gold-300 hover:text-navy-900'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="font-body text-sm text-navy-500">
                <span className="font-bold text-navy-900">{filtered.length}</span> course{filtered.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="font-body text-lg text-navy-500">
                No courses match your filters. Try a different track, level, or search term.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleTrackChange('all');
                  setSelectedLevel('all');
                  setSearchQuery('');
                }}
                className="btn-outline mt-6"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((course) => (
                <LabCourseCard key={course.code} course={course} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
