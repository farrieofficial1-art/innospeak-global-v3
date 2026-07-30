import { TRUSTED_LOGOS } from './trustedData.js';
import useMediaQuery from '../../hooks/useMediaQuery.js';

export default function LogoMarquee() {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  if (reduceMotion) {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {TRUSTED_LOGOS.map((logo) => (
          <div
            key={logo.id}
            className="flex h-16 w-32 items-center justify-center rounded-lg border border-navy-100 bg-white px-4 shadow-sm sm:w-40"
          >
            <span className="text-center font-display text-xs font-semibold text-navy-700 sm:text-sm">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent sm:w-32" />
      <div
        className="flex w-max gap-4 group-hover:[animation-play-state:paused]"
        style={{ animation: 'trusted-marquee 30s linear infinite' }}
      >
        {[...TRUSTED_LOGOS, ...TRUSTED_LOGOS].map((logo, i) => (
          <div
            key={`${logo.id}-${i}`}
            className="flex h-16 w-32 shrink-0 items-center justify-center rounded-lg border border-navy-100 bg-white px-4 shadow-sm transition-shadow hover:shadow-premium sm:w-40"
          >
            <span className="text-center font-display text-xs font-semibold text-navy-700 sm:text-sm">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
