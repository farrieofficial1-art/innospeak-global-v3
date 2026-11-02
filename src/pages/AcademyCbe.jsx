import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Seo from '../components/ui/Seo.jsx';
import Container from '../components/ui/Container.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import CourseCard from '../components/academy/CourseCard.jsx';
import CourseFilters from '../components/academy/CourseFilters.jsx';
import { CBE_COURSES, TRACKS, TRACK_BY_ID } from '../lib/data/academy.js';

const CBE_GRADES = [
  'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9',
  'Grade 10', 'Grade 11', 'Grade 12',
  'Electives',
];

function gradeOf(title) {
  const m = title.match(/^(Grade \d+|Electives)/);
  return m ? m[1] : 'Electives';
}

export default function AcademyCbe() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let list = CBE_COURSES;
    if (selectedGrade !== 'all') {
      list = list.filter((c) => {
        const g = gradeOf(c.title);
        return selectedGrade === 'Electives' ? g === 'Electives' : g === selectedGrade;
      });
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
  }, [selectedGrade, selectedLevel, searchQuery]);

  const track = TRACK_BY_ID['cbe'];

  return (
    <>
      <Seo
        title="Kenya CBE School Programme"
        description="Competency-Based Curriculum courses for Grades 3–12 plus electives — aligned to the Kenyan CBC."
        path="/academy/cbe"
      />

      <section className="relative overflow-hidden bg-navy-radial pt-32 pb-16">
        <div className="absolute inset-0 bg-navy-gradient opacity-90" />
        <div className="relative container-premium">
          <Reveal>
            <span className="eyebrow bg-gold-500/15 text-gold-300">
              Kenya CBE School Programme
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              CBC-aligned courses for every grade.
            </h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-white/70 sm:text-lg">
              {CBE_COURSES.length} courses covering Grades 3–12 core subjects
              and electives — all aligned with Kenya's Competency-Based Curriculum.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-20">
        <Container>
          <div className="mb-8">
            <SectionHeading
              eyebrow={track.name}
              title={track.description}
              center={false}
            />
          </div>

          {/* Grade pills */}
          <div className="mb-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedGrade('all')}
              className={`rounded-full px-4 py-2 font-body text-xs font-semibold transition-all ${
                selectedGrade === 'all'
                  ? 'bg-navy-900 text-white shadow-premium'
                  : 'bg-white text-navy-600 border border-navy-100 hover:border-navy-300 hover:text-navy-900'
              }`}
            >
              All Grades
            </button>
            {CBE_GRADES.map((grade) => {
              const active = selectedGrade === grade;
              return (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setSelectedGrade(grade)}
                  className={`rounded-full px-4 py-2 font-body text-xs font-semibold transition-all ${
                    active
                      ? 'bg-navy-900 text-white shadow-premium'
                      : 'bg-white text-navy-600 border border-navy-100 hover:border-navy-300 hover:text-navy-900'
                  }`}
                >
                  {grade}
                </button>
              );
            })}
          </div>

          <CourseFilters
            selectedTrack="cbe"
            setSelectedTrack={() => {}}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            resultCount={filtered.length}
          />

          {filtered.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="font-body text-lg text-navy-500">
                No courses match your filters. Try a different grade or search term.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedGrade('all');
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
