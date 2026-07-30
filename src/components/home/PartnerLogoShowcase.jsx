import { PARTNER_LOGO_CATEGORIES } from './partnersData.js';
import useMediaQuery from '../../hooks/useMediaQuery.js';

export default function PartnerLogoShowcase() {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  if (reduceMotion) {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {PARTNER_LOGO_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-2.5 rounded-xl border border-navy-100 bg-white px-5 py-3 shadow-premium"
          >
            <span className="h-2 w-2 rounded-full bg-gold-gradient" />
            <span className="font-display text-base font-semibold text-navy-700">
              {cat.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-navy-100 bg-white/60 py-6 shadow-premium backdrop-blur-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent sm:w-32" />

      <div
        className="flex w-max gap-4 px-4 group-hover:[animation-play-state:paused]"
        style={{ animation: 'trusted-marquee 35s linear infinite' }}
      >
        {[...PARTNER_LOGO_CATEGORIES, ...PARTNER_LOGO_CATEGORIES].map((cat, i) => (
          <div
            key={`${cat.id}-${i}`}
            className="flex shrink-0 items-center gap-2.5 rounded-xl border border-navy-100 bg-white px-5 py-3 shadow-sm transition-all duration-300 hover:border-gold-300/60 hover:shadow-premium"
          >
            <span className="h-2 w-2 rounded-full bg-gold-gradient" />
            <span className="font-display text-base font-semibold text-navy-700">
              {cat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
