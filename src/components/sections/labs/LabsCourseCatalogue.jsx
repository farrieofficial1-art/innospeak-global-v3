import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Search, SlidersHorizontal, X, Grid3x3 as Grid3X3, ArrowRight } from 'lucide-react';

import SectionHeading from '../../ui/SectionHeading.jsx';
import CourseCard from '../academy/CourseCard';

import useFavourites from '../../../lib/hooks/useFavourites';

import {
  LEVELS,
  STUDY_MODES,
  DURATIONS,
  parseFee,
  getLabsCourses,
} from '../../../lib/data/programmeData';
import { LAB_SCHOOLS } from '../../../lib/data/labsData';

import {
  staggerContainer,
  fadeUpItem,
  inViewOnce,
} from '../../../lib/motion/presets';

/**
 * LabsCourseCatalogue — same search/filter/sort/favourite pattern as
 * Academy's ProgrammeCatalogue, scoped to Labs courses (pillar === 'labs')
 * and filtered by the 7 Lab Schools instead of the Academy pathways.
 * Reuses CourseCard unchanged — it already renders code, price, duration,
 * level, study mode and entry requirements for any course object.
 */

const container = staggerContainer(0.08, 0.05);

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'alphabetical', label: 'A–Z' },
  { value: 'price-low', label: 'Price ↑' },
  { value: 'price-high', label: 'Price ↓' },
];

function normalizeCourse(course, index) {
  return {
    ...course,
    code: course.code || `LAB-${index + 1}`,
    name: course.name || 'Untitled course',
    shortDescription: course.shortDescription || 'More details coming soon.',
    category: course.category || '',
    pathwayId: course.pathwayId || '',
    level: course.level || 'Flexible',
    studyMode: course.studyMode || 'Flexible',
    duration: course.duration || 'Flexible',
    fees: course.fees ?? 'Contact us',
    certification: course.certification || 'Certificate available',
    language: course.language || '',
    featured: Boolean(course.featured),
    createdAt: course.createdAt || '',
  };
}

export default function LabsCourseCatalogue() {
  const { toggle, isFavourite } = useFavourites();

  const [search, setSearch] = useState('');

  const [filters, setFilters] = useState({
    pathway: '',
    level: '',
    studyMode: '',
    duration: '',
  });

  const [sortBy, setSortBy] = useState('featured');

  const [showFilters, setShowFilters] = useState(false);

  const normalizedCourses = useMemo(
    () => getLabsCourses().map((course, index) => normalizeCourse(course, index)),
    []
  );

  const filteredCourses = useMemo(() => {
    let results = [...normalizedCourses];

    if (search.trim()) {
      const query = search.toLowerCase();
      results = results.filter((course) =>
        [course.name, course.code, course.shortDescription, course.category, course.language]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query)
      );
    }

    if (filters.pathway) {
      results = results.filter((course) => course.pathwayId === filters.pathway);
    }

    if (filters.level) {
      results = results.filter((course) => course.level === filters.level);
    }

    if (filters.studyMode) {
      results = results.filter((course) => course.studyMode === filters.studyMode);
    }

    if (filters.duration) {
      results = results.filter((course) => course.duration === filters.duration);
    }

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
    setFilters({ pathway: '', level: '', studyMode: '', duration: '' });
    setSortBy('featured');
  };

  return (
    <section id="labs-catalogue" className="bg-cream py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Explore Lab Courses"
          title={
            <>
              Every Course, Every Pathway
              <span className="block text-gradient-gold">Priced and Ready</span>
            </>
          }
          subtitle="Search and filter across all seven innovation pathways to find the exact course you want to build with — AI, cloud, data, security, engineering, software and creative technology."
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
                placeholder="Search lab courses, pathways, technologies..."
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
                    <label className="mb-2 block font-body text-sm font-semibold text-navy-900">Lab Pathway</label>
                    <select
                      value={filters.pathway}
                      onChange={(e) => setFilters({ ...filters, pathway: e.target.value })}
                      className="w-full rounded-xl border border-navy-100 bg-white px-4 py-3 font-body text-sm text-navy-900 outline-none transition-colors duration-300 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20"
                    >
                      <option value="">All Pathways</option>
                      {LAB_SCHOOLS.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.title}
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
                    lab courses
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
              <h3 className="font-display text-2xl font-bold text-navy-900">Available Lab Courses</h3>
              <p className="mt-1 font-body text-navy-600">Real courses, real pricing, real entry requirements.</p>
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
              <h3 className="font-display text-2xl font-bold text-navy-900">No lab courses found</h3>
              <p className="mt-4 font-body text-navy-600">Try changing your search or clearing the filters.</p>
              <button
                onClick={clearFilters}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-body font-semibold text-navy-900 transition-transform duration-300 hover:scale-105"
              >
                <ArrowRight size={18} />
                Show All Lab Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}