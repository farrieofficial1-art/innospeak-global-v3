import { useState, useMemo } from 'react';
import { Search, X, BookOpen } from 'lucide-react';
import { ACADEMY_COURSES, TRACKS } from '../../lib/data/academy.js';

export default function CourseCatalogPicker({ value, onChange, helpText }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    if (!search.trim()) return ACADEMY_COURSES.slice(0, 50);
    const q = search.toLowerCase().trim();
    return ACADEMY_COURSES.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q),
    ).slice(0, 50);
  }, [search]);

  const selected = ACADEMY_COURSES.find((c) => c.code === value) || null;
  const trackName = (id) => TRACKS.find((t) => t.id === id)?.name || '';

  function pick(code) {
    const course = ACADEMY_COURSES.find((c) => c.code === code) || null;
    onChange(code, course);
    setOpen(false);
    setSearch('');
  }

  function clear() {
    onChange(null, null);
  }

  return (
    <div>
      {helpText && (
        <p className="mb-3 font-body text-xs text-navy-400">{helpText}</p>
      )}

      {selected ? (
        <div className="flex items-center justify-between rounded-xl border border-gold-200 bg-gold-50/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
              <BookOpen size={18} />
            </div>
            <div>
              <p className="font-body text-sm font-bold text-navy-900">
                {selected.title}
              </p>
              <p className="font-mono text-xs text-navy-500">
                {selected.code} · {trackName(selected.track_id)} · {selected.level}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clear}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
            aria-label="Unlink catalogue course"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border border-dashed border-navy-200 px-4 py-3 font-body text-sm text-navy-500 transition-colors hover:border-gold-300 hover:bg-gold-50/30"
        >
          Link a catalogue course…
          <Search size={16} />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-navy-100 bg-white shadow-premium-lg">
            <div className="border-b border-navy-100 p-4">
              <div className="relative">
                <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or code…"
                  className="w-full rounded-xl border border-navy-100 bg-cream py-2.5 pl-10 pr-10 font-body text-sm text-navy-900 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="p-6 text-center font-body text-sm text-navy-400">
                  No courses found.
                </p>
              ) : (
                results.map((course) => (
                  <button
                    key={course.code}
                    type="button"
                    onClick={() => pick(course.code)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-navy-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-sm font-semibold text-navy-900">
                        {course.title}
                      </p>
                      <p className="font-mono text-xs text-navy-500">
                        {course.code} · {trackName(course.track_id)} · {course.level}
                      </p>
                    </div>
                    <span className="font-body text-xs font-bold text-navy-600">
                      ${course.price_usd}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
