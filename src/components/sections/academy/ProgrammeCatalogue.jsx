import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Search, SlidersHorizontal, X, Grid3x3 as Grid3X3, ArrowRight } from 'lucide-react';

import SectionHeading from '../../ui/SectionHeading.jsx';
import CourseCard from './CourseCard';

import useFavourites from '../../../lib/hooks/useFavourites';

import {
  COURSES,
  PATHWAYS,
  LEVELS,
  STUDY_MODES,
  DURATIONS,
  parseFee,
  getAcademyCourses,
} from '../../../lib/data/programmeData';

import {
  staggerContainer,
  fadeUpItem,
  inViewOnce,
} from '../../../lib/motion/presets';

/**
 * ProgrammeCatalogue — search/filter/sort UI restyled on the verified
 * live Home patterns: ui/SectionHeading for the header, container-premium,
 * the navy-900/gold-500 token scale, and the same rounded-2xl /
 * shadow-premium card recipe used by CourseCard and the Home page cards.
 * All state, filtering, sorting and favouriting logic is unchanged.
 */

const container = staggerContainer(0.08, 0.05);

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'alphabetical', label: 'A–Z' },
  { value: 'price-low', label: 'Price ↑' },
  { value: 'price-high', label: 'Price ↓' },
];

function matchesPrice(fee, range) {
  if (range === 'all') return true;
  const [min, max] = range.split('-').map(Number);
  const amount = parseFee(fee);
  return amount >= min && amount <= max;
}

/**
 * normalizeCourse — defensively fills in fallback values for any course
 * record that might be missing fields, so a malformed entry in COURSES
 * never breaks the render.
 */
function normalizeCourse(course, index) {
  return {
    ...course,
    code: course.code || course.courseCode || course.id || `COURSE-${index + 1}`,
    name:
      course.name ||
      course.title ||
      course.programmeName ||
      course.programme ||
      'Untitled programme',
    shortDescription:
      course.shortDescription ||
      course.description ||
      course.summary ||
      course.overview ||
      'Explore the course overview, learning outcomes and pathway details.',
    category:
      course.category ||
      course.pathway ||
      course.pathwayTitle ||
      course.area ||
      '',
    pathwayId:
      course.pathwayId ||
      course.pathway_id ||
      course.pathway ||
      course.pathwaySlug ||
      '',
    level: course.level || course.levelLabel || course.difficulty || 'Flexible',
    studyMode: course.studyMode || course.mode || course.deliveryMode || 'Flexible',
    duration: course.duration || course.length || course.durationText || 'Flexible',
    fees: course.fees ?? course.price ?? course.fee ?? 'Contact us',
    certification:
      course.certification ||
      course.certificate ||
      course.outcome ||
      'Certificate available',
    language: course.language || course.languages || '',
    featured: Boolean(course.featured),
    createdAt: course.createdAt || course.created_at || course.publishedAt || '',
  };
}

export default function ProgrammeCatalogue() {
  const { toggle, isFavourite } = useFavourites();

  const [search, setSearch] = useState('');

  const [filters, setFilters] = useState({
    pathway: '',
    level: '',
    studyMode: '',
    duration: '',
    price: 'all',
  });

  const [sortBy, setSortBy] = useState('featured');

  const [showFilters, setShowFilters] = useState(false);

  const normalizedCourses = useMemo(
    () => getAcademyCourses().map((course, index) => normalizeCourse(course, index)),
    []
  );

  const filteredCourses = useMemo(() => {
    let results = [...normalizedCourses];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();
      results = results.filter((course) =>
        [
          course.name,
          course.code,
          course.shortDescription,
          course.category,
          course.language,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query)
      );
    }

    // Pathway
    if (filters.pathway) {
      results = results.filter((course) => course.pathwayId === filters.pathway);
    }

    // Level
    if (filters.level) {
      results = results.filter((course) => course.level === filters.level);
    }

    // Study Mode
    if (filters.studyMode) {
      results = results.filter((course) => course.studyMode === filters.studyMode);
    }

    // Duration
    if (filters.duration) {
      results = results.filter((course) => course.duration === filters.duration);
    }

    // Sorting
    switch (sortBy) {
      case 'alphabetical':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case 'price-low':
        results.sort((a, b) => parseFee(a.fees) - parseFee(b.fees));
        break;

      case 'price-high':
        results.sort((a, b) => parseFee(b.fees) - parseFee(a.fees));
        break;

      case 'newest':
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;

      default:
        results.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.name.localeCompare(b.name);
        });
    }

    return results;
  }, [normalizedCourses, search, filters, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setFilters({
      pathway: '',
      level: '',
      studyMode: '',
      duration: '',
      price: 'all',
    });
    setSortBy('featured');
  };

  return (
    <section id="programme-catalogue" className="bg-cream py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Explore Learning Pathways"
          title={
            <>
              Discover Programmes Designed
              <span className="block text-gradient-gold">For Global Opportunities</span>
            </>
          }
          subtitle="Browse our internationally focused learning pathways. Whether you are preparing for global careers, university, freelancing, engineering, business or language mastery, InnoSpeak Global Academy has a programme for you."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.5 }}
          className="mt-12 rounded-2xl border border-navy-100 bg-white p-6 shadow-premium"
        >
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                type="text"
                placeholder="Search programmes, languages, certifications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-14 w-full rounded-2xl border border-navy-100 bg-white pl-14 pr-5 font-body text-sm text-navy-900 outline-none transition-colors duration-300 placeholder:text-navy-400 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-navy-100 px-6 font-body font-semibold text-navy-900 transition-colors duration-300 hover:border-gold-500 hover:text-gold-600"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <label className="mb-2 block font-body text-sm font-semibold text-navy-900">Learning Pathway</label>
                    <select
                      value={filters.pathway}
                      onChange={(e) => setFilters({ ...filters, pathway: e.target.value })}
                      className="w-full rounded-xl border border-navy-100 bg-white px-4 py-3 font-body text-sm text-navy-900 outline-none transition-colors duration-300 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20"
                    >
                      <option value="">All Pathways</option>
                      {PATHWAYS.map((pathway) => (
                        <option key={pathway.id} value={pathway.id}>
                          {pathway.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-body text-sm font-semibold text-navy-900">Level</label>
                    <select
                      value={filters.level}
                      onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                      className="w-full rounded-xl border border-navy-100 bg-white px-4 py-3 font-body text-sm text-navy-900 outline-none transition-colors duration-300 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20"
                    >
                      <option value="">All Levels</option>
                      {LEVELS.map((level) => (
                        <option key={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-body text-sm font-semibold text-navy-900">Study Mode</label>
                    <select
                      value={filters.studyMode}
                      onChange={(e) => setFilters({ ...filters, studyMode: e.target.value })}
                      className="w-full rounded-xl border border-navy-100 bg-white px-4 py-3 font-body text-sm text-navy-900 outline-none transition-colors duration-300 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20"
                    >
                      <option value="">All Modes</option>
                      {STUDY_MODES.map((mode) => (
                        <option key={mode}>{mode}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-body text-sm font-semibold text-navy-900">Duration</label>
                    <select
                      value={filters.duration}
                      onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                      className="w-full rounded-xl border border-navy-100 bg-white px-4 py-3 font-body text-sm text-navy-900 outline-none transition-colors duration-300 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20"
                    >
                      <option value="">All Durations</option>
                      {DURATIONS.map((duration) => (
                        <option key={duration}>{duration}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="font-body text-sm text-navy-600">
                    Showing
                    <span className="mx-1 font-bold text-navy-900">{filteredCourses.length}</span>
                    programmes
                  </div>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2 font-body text-sm font-semibold text-red-600 transition-colors duration-300 hover:bg-red-50"
                  >
                    <X size={16} />
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-14">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="font-display text-2xl font-bold text-navy-900">Available Programmes</h3>
              <p className="mt-1 font-body text-navy-600">Explore our globally competitive learning opportunities.</p>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-navy-900 px-5 py-2 text-gold-400 md:flex">
              <Grid3X3 size={18} />
              <span className="font-body font-semibold">{filteredCourses.length} Courses</span>
            </div>
          </div>

          {filteredCourses.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={inViewOnce}
              className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
            >
              {filteredCourses.map((course, index) => (
                <motion.div key={course.code} variants={fadeUpItem}>
                  <CourseCard
                    course={course}
                    index={index}
                    isFavourite={isFavourite(course.code)}
                    onToggleFavourite={() => toggle(course.code)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-dashed border-navy-200 bg-white py-20 text-center">
              <h3 className="font-display text-2xl font-bold text-navy-900">No programmes found</h3>
              <p className="mt-4 font-body text-navy-600">Try changing your search or clearing the filters.</p>
              <button
                onClick={clearFilters}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-body font-semibold text-navy-900 transition-transform duration-300 hover:scale-105"
              >
                <ArrowRight size={18} />
                Show All Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}