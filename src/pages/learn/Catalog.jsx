import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Search, Clock, ChartBar as BarChart3, Award, BookOpen, ArrowRight } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import StatusBadge from '../../components/portal/StatusBadge.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/portal/PortalStates.jsx';
import { listPublishedCourses, enrollInCourse } from '../../lib/supabase/lms';

export default function Catalog() {
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, error: null, courses: [] });
  const [enrollingId, setEnrollingId] = useState(null);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    listPublishedCourses()
      .then((courses) => setState({ loading: false, error: null, courses }))
      .catch((err) => setState({ loading: false, error: err.message || 'Could not load the course catalog.', courses: [] }));
  }, []);

  const levels = useMemo(() => {
    const set = new Set();
    state.courses.forEach((c) => { if (c.level) set.add(c.level); });
    return ['all', ...Array.from(set).sort()];
  }, [state.courses]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return state.courses.filter((c) => {
      const matchesSearch = !q || (c.title || '').toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q);
      const matchesLevel = levelFilter === 'all' || c.level === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [state.courses, search, levelFilter]);

  async function handleEnroll(courseId) {
    setEnrollingId(courseId);
    try {
      await enrollInCourse(courseId);
      navigate(`/learn/courses/${courseId}`);
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message || 'Could not enroll in this course.' }));
    } finally {
      setEnrollingId(null);
    }
  }

  return (
    <>
      <Seo title="Browse Courses" description="Find a course to start learning." path="/learn/catalog" />

      <div>
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Learn</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">Browse Courses</h1>
      </div>

      {/* Search + filter bar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by title or description..."
            className="w-full rounded-xl border border-navy-100 bg-white py-2.5 pl-10 pr-4 font-body text-sm text-navy-900 shadow-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
          />
        </div>
        {levels.length > 2 && (
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="rounded-xl border border-navy-100 bg-white px-4 py-2.5 font-body text-sm text-navy-900 shadow-sm focus:border-gold-500 focus:outline-none"
          >
            {levels.map((lv) => (
              <option key={lv} value={lv}>{lv === 'all' ? 'All Levels' : lv}</option>
            ))}
          </select>
        )}
      </div>

      {state.loading && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="h-5 w-3/4 rounded bg-navy-100" />
                  <div className="mt-2 h-3 w-1/3 rounded bg-navy-50" />
                </div>
                <div className="h-6 w-16 rounded-full bg-navy-50" />
              </div>
              <div className="mt-3 h-4 w-full rounded bg-navy-50" />
              <div className="mt-2 h-4 w-2/3 rounded bg-navy-50" />
              <div className="mt-4 flex gap-4">
                <div className="h-3 w-16 rounded bg-navy-50" />
                <div className="h-3 w-16 rounded bg-navy-50" />
                <div className="h-3 w-16 rounded bg-navy-50" />
              </div>
              <div className="mt-4 h-9 w-28 rounded-lg bg-navy-50" />
            </div>
          ))}
        </div>
      )}

      {!state.loading && state.error && (
        <SectionCard className="mt-6">
          <ErrorState message={state.error} />
        </SectionCard>
      )}

      {!state.loading && !state.error && state.courses.length === 0 && (
        <SectionCard className="mt-6">
          <EmptyState icon={Compass} title="No published courses yet" message="Check back once an instructor publishes a course." />
        </SectionCard>
      )}

      {!state.loading && !state.error && state.courses.length > 0 && (
        <>
          {filtered.length === 0 ? (
            <SectionCard className="mt-6">
              <EmptyState icon={Search} title="No matching courses" message="Try adjusting your search or filter." />
            </SectionCard>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {filtered.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-premium"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-bold text-navy-900">{course.title}</p>
                      {course.category && (
                        <span className="mt-1 inline-block font-body text-xs font-semibold uppercase tracking-wider text-gold-600">{course.category}</span>
                      )}
                    </div>
                    {course.level && <StatusBadge status={course.level} />}
                  </div>

                  {/* Description */}
                  {course.description && (
                    <p className="mt-2 line-clamp-2 font-body text-sm text-navy-500">{course.description}</p>
                  )}

                  {/* Metadata row */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    {course.duration && (
                      <span className="inline-flex items-center gap-1.5 font-body text-xs text-navy-500">
                        <Clock size={13} className="text-navy-400" /> {course.duration}
                      </span>
                    )}
                    {course.estimated_hours && (
                      <span className="inline-flex items-center gap-1.5 font-body text-xs text-navy-500">
                        <BarChart3 size={13} className="text-navy-400" /> {course.estimated_hours}h
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 font-body text-xs text-navy-500">
                      <BookOpen size={13} className="text-navy-400" /> Self-paced
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-body text-xs text-navy-500">
                      <Award size={13} className="text-navy-400" /> Certificate
                    </span>
                  </div>

                  {/* Action */}
                  <div className="mt-4 flex items-center justify-between border-t border-navy-50 pt-4">
                    <button
                      type="button"
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrollingId === course.id}
                      className="btn-gold inline-flex items-center gap-2 text-sm disabled:opacity-60"
                    >
                      {enrollingId === course.id ? 'Enrolling…' : 'Enroll Now'}
                      {enrollingId !== course.id && <ArrowRight size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
