import { Search, X } from 'lucide-react';
import { TRACKS } from '../../lib/data/academy.js';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function CourseFilters({
  selectedTrack,
  setSelectedTrack,
  selectedLevel,
  setSelectedLevel,
  searchQuery,
  setSearchQuery,
  resultCount,
}) {
  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or code (e.g. Excel, AIC101)…"
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

      {/* Track pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedTrack('all')}
          className={`rounded-full px-4 py-2 font-body text-xs font-semibold transition-all ${
            selectedTrack === 'all'
              ? 'bg-navy-900 text-white shadow-premium'
              : 'bg-white text-navy-600 border border-navy-100 hover:border-navy-300 hover:text-navy-900'
          }`}
        >
          All Tracks
        </button>
        {TRACKS.map((track) => {
          const active = selectedTrack === track.id;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setSelectedTrack(track.id)}
              className={`rounded-full px-4 py-2 font-body text-xs font-semibold transition-all ${
                active
                  ? 'bg-navy-900 text-white shadow-premium'
                  : 'bg-white text-navy-600 border border-navy-100 hover:border-navy-300 hover:text-navy-900'
              }`}
            >
              {track.name}
            </button>
          );
        })}
      </div>

      {/* Level pills + count */}
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
          {LEVELS.map((level) => {
            const active = selectedLevel === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedLevel(level)}
                className={`rounded-full px-3.5 py-1.5 font-body text-xs font-semibold transition-all ${
                  active
                    ? 'bg-gold-500 text-navy-900'
                    : 'bg-white text-navy-500 border border-navy-100 hover:border-gold-300 hover:text-navy-900'
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>

        <p className="font-body text-sm text-navy-500">
          <span className="font-bold text-navy-900">{resultCount}</span> course{resultCount === 1 ? '' : 's'}
        </p>
      </div>
    </div>
  );
}
