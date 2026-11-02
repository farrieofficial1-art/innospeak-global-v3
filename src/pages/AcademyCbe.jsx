import { useState, useMemo } from 'react';
import Seo from '../components/ui/Seo.jsx';
import Container from '../components/ui/Container.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import CbeBundleCard from '../components/academy/CbeBundleCard.jsx';
import {
  CBE_BUNDLES,
  CBE_STAGES,
  getCbeBundleCourseCount,
  getBundlesByStage,
} from '../lib/data/cbe.js';
import { TRACK_BY_ID } from '../lib/data/academy.js';

export default function AcademyCbe() {
  const [selectedStage, setSelectedStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const totalCourses = getCbeBundleCourseCount();
  const track = TRACK_BY_ID['cbe'];

  const visibleBundles = useMemo(() => {
    let bundles = getBundlesByStage(selectedStage);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      bundles = bundles.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.subjects.some((s) => s.toLowerCase().includes(q)),
      );
    }
    return bundles;
  }, [selectedStage, searchQuery]);

  const grouped = useMemo(() => {
    if (selectedStage !== 'all') {
      const stage = CBE_STAGES.find((s) => s.id === selectedStage);
      return [{ stage, bundles: visibleBundles }];
    }
    return CBE_STAGES.map((stage) => ({
      stage,
      bundles: visibleBundles.filter((b) => b.stage === stage.id),
    })).filter((group) => group.bundles.length > 0);
  }, [visibleBundles, selectedStage]);

  return (
    <>
      <Seo
        title="Kenya CBE School Programme"
        description="Competency-Based Curriculum courses for Grades 3–12 plus electives — organised into structured learning bundles aligned to the Kenyan CBC."
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
              CBC-aligned bundles for every grade.
            </h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-white/70 sm:text-lg">
              {totalCourses} courses across {CBE_BUNDLES.length} structured bundles covering Grades 3–12
              core subjects and electives — all aligned with Kenya's Competency-Based Curriculum.
              Open a bundle to explore its courses, subjects and learning outcomes.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-20">
        <Container>
          <div className="mb-8">
            <SectionHeading
              eyebrow={track.name}
              title="Choose a learning bundle"
              subtitle="Each bundle groups the subjects and courses for a grade level or elective pathway. Open any bundle to see its courses, learning areas and outcomes."
              center={false}
            />
          </div>

          {/* Stage filter pills */}
          <div className="mb-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedStage('all')}
              className={`rounded-full px-4 py-2 font-body text-xs font-semibold transition-all ${
                selectedStage === 'all'
                  ? 'bg-navy-900 text-white shadow-premium'
                  : 'bg-white text-navy-600 border border-navy-100 hover:border-navy-300 hover:text-navy-900'
              }`}
            >
              All Stages
            </button>
            {CBE_STAGES.map((stage) => {
              const active = selectedStage === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setSelectedStage(stage.id)}
                  className={`rounded-full px-4 py-2 font-body text-xs font-semibold transition-all ${
                    active
                      ? 'bg-navy-900 text-white shadow-premium'
                      : 'bg-white text-navy-600 border border-navy-100 hover:border-navy-300 hover:text-navy-900'
                  }`}
                >
                  {stage.name}
                  <span className="ml-1.5 text-navy-400">· {stage.grades}</span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative mb-10 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bundles by name or subject…"
              className="w-full rounded-2xl border border-navy-100 bg-white py-3 pl-4 pr-10 font-body text-sm text-navy-900 shadow-premium outline-none transition-colors placeholder:text-navy-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 transition-colors hover:text-navy-700"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {grouped.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="font-body text-lg text-navy-500">
                No bundles match your search. Try a different stage or term.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedStage('all');
                  setSearchQuery('');
                }}
                className="btn-outline mt-6"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-14">
              {grouped.map(({ stage, bundles }) => (
                <div key={stage.id}>
                  <div className="mb-6 flex items-baseline gap-3">
                    <h2 className="font-display text-xl font-bold text-navy-900">
                      {stage.name}
                    </h2>
                    <span className="font-body text-sm text-navy-400">
                      {stage.grades} · {bundles.length} bundle{bundles.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {bundles.map((bundle) => (
                      <CbeBundleCard key={bundle.id} bundle={bundle} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
