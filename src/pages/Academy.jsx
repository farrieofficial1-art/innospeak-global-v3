import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Seo from '../components/ui/Seo.jsx';
import Container from '../components/ui/Container.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import CourseCard from '../components/academy/CourseCard.jsx';
import CourseFilters from '../components/academy/CourseFilters.jsx';
import {
  ACADEMY_COURSES,
  PUBLISHED_COURSES,
  TRACKS,
  TRACK_BY_ID,
} from '../lib/data/academy.js';

export default function Academy() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTrack = searchParams.get('track') || 'all';

  const [selectedTrack, setSelectedTrack] = useState(initialTrack);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const t = searchParams.get('track') || 'all';
    if (t !== selectedTrack) setSelectedTrack(t);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleTrackChange(trackId) {
    setSelectedTrack(trackId);
    if (trackId === 'all') {
      searchParams.delete('track');
    } else {
      searchParams.set('track', trackId);
    }
    setSearchParams(searchParams, { replace: true });
  }

  const filtered = useMemo(() => {
    let list = PUBLISHED_COURSES;
    if (selectedTrack !== 'all') {
      list = list.filter((c) => c.track_id === selectedTrack);
    }
    if (selectedLevel !== 'all') {
      list = list.filter((c) => c.level === selectedLevel);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q),
      );
    }
    return list;
  }, [selectedTrack, selectedLevel, searchQuery]);

  const activeTrack = selectedTrack !== 'all' ? TRACK_BY_ID[selectedTrack] : null;

  return (
    <>
      <Seo
        title="Academy — Browse All Courses"
        description="Explore 400+ on-demand courses across AI, data, marketing, engineering, languages, CBE and more."
        path="/academy"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-radial pt-32 pb-16">
        <div className="absolute inset-0 bg-navy-gradient opacity-90" />
        <div className="relative container-premium">
          <Reveal>
            <span className="eyebrow bg-gold-500/15 text-gold-300">
              InnoSpeak Academy
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Learn on your own schedule.
            </h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-white/70 sm:text-lg">
              {ACADEMY_COURSES.length}+ on-demand courses across {TRACKS.length} tracks —
              from AI and data to languages, engineering and the Kenya CBE school programme.
              Pay per course, learn at your pace.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Course grid */}
      <section className="bg-cream py-16 lg:py-20">
        <Container>
          {activeTrack && (
            <div className="mb-10">
              <SectionHeading
                eyebrow={activeTrack.name}
                title={activeTrack.description}
                center={false}
              />
            </div>
          )}

          <CourseFilters
            selectedTrack={selectedTrack}
            setSelectedTrack={handleTrackChange}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            resultCount={filtered.length}
          />

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
                <CourseCard key={course.code} course={course} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
