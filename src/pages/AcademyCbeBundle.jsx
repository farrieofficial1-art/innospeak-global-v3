import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Search, X, CheckCircle2 } from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import Container from '../components/ui/Container.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import CourseCard from '../components/academy/CourseCard.jsx';
import { getBundleBySlug, getBundleCourses } from '../lib/data/cbe.js';
import { TRACK_BY_ID } from '../lib/data/academy.js';

export default function AcademyCbeBundle() {
  const { bundleSlug } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const bundle = getBundleBySlug(bundleSlug);

  const courses = useMemo(
    () => (bundle ? getBundleCourses(bundle) : []),
    [bundle],
  );

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const q = searchQuery.toLowerCase().trim();
    return courses.filter(
      (c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q),
    );
  }, [courses, searchQuery]);

  const track = TRACK_BY_ID['cbe'];

  if (!bundle) {
    return (
      <>
        <Seo title="Bundle not found — Kenya CBE" path="/academy/cbe" />
        <section className="bg-navy-radial pt-32 pb-16">
          <div className="container-premium">
            <h1 className="font-display text-3xl font-bold text-white">Bundle not found</h1>
            <Link to="/academy/cbe" className="mt-6 inline-flex items-center gap-2 font-body text-sm font-bold text-gold-400 hover:text-gold-300">
              <ArrowLeft size={16} /> Back to CBE bundles
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo
        title={`${bundle.title} — Kenya CBE`}
        description={bundle.description}
        path={`/academy/cbe/${bundle.slug}`}
      />

      <section className="relative overflow-hidden bg-navy-radial pt-32 pb-16">
        <div className="absolute inset-0 bg-navy-gradient opacity-90" />
        <div className="relative container-premium">
          <Link
            to="/academy/cbe"
            className="inline-flex items-center gap-2 font-body text-xs font-semibold text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} /> Kenya CBE Programme
          </Link>
          <Reveal>
            <span className="eyebrow bg-gold-500/15 text-gold-300">
              {bundle.gradeLevel}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              {bundle.title}
            </h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-white/70 sm:text-lg">
              {bundle.description}
            </p>
            <p className="mt-4 font-body text-sm font-semibold text-white/50">
              {courses.length} course{courses.length === 1 ? '' : 's'} in this bundle
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="mb-8 flex items-center justify-between gap-4">
                <h2 className="font-display text-2xl font-bold text-navy-900">
                  Courses in this bundle
                </h2>
                <span className="rounded-full bg-navy-900 px-4 py-1.5 font-body text-xs font-bold text-white">
                  {filtered.length} of {courses.length}
                </span>
              </div>

              <div className="relative mb-6">
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses in this bundle…"
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

              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-navy-100 bg-white p-10 text-center">
                  <p className="font-body text-sm text-navy-500">
                    No courses match your search. Try a different term.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="btn-outline mt-4"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((course) => (
                    <CourseCard key={course.code} course={course} />
                  ))}
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-premium">
                <h3 className="font-display text-lg font-bold text-navy-900">
                  Learning areas
                </h3>
                <p className="mt-1 font-body text-xs text-navy-500">
                  Subjects covered in this bundle.
                </p>
                <ul className="mt-4 space-y-2">
                  {bundle.subjects.map((s) => (
                    <li key={s} className="flex items-start gap-2 font-body text-sm text-navy-700">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-premium">
                <h3 className="font-display text-lg font-bold text-navy-900">
                  Learning outcomes
                </h3>
                <p className="mt-1 font-body text-xs text-navy-500">
                  Competencies learners will develop.
                </p>
                <ul className="mt-4 space-y-3">
                  {bundle.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 font-body text-sm leading-relaxed text-navy-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-6">
                <h3 className="font-display text-lg font-bold text-navy-900">
                  Ready to start?
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-navy-600">
                  Enrol in any course in this bundle to begin learning. Each course is self-paced and aligned to the Kenya CBC.
                </p>
                <Link
                  to="/learn"
                  className="btn-gold mt-4 inline-flex w-full items-center justify-center gap-2"
                >
                  Go to My Learning
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
