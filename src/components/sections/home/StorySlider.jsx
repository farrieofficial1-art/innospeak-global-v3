import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

/**
 * StorySlider — premium 3-slide hero carousel.
 *
 * Autoplays every 7s with fade + gentle zoom transitions, prev/next
 * arrows, animated progress indicators, and touch swipe support. Slides
 * use elegant CSS gradient illustrations (no stock images). The glass
 * container has 32px corners, a soft glow, and a gentle floating loop.
 */

const SLIDES = [
  {
    id: 'academy',
    title: 'InnoSpeak Global Academy',
    headline: 'Learn.\nCommunicate.\nLead Globally.',
    description:
      'Master communication, global languages, ICT and internationally recognised qualifications.',
    cta: { label: 'Explore Academy', to: '/programs' },
    gradient: 'from-navy via-navy-600 to-gold-500',
    accent: 'from-gold-400/30 to-transparent',
  },
  {
    id: 'foundation',
    title: 'InnoSpeak Global Foundation',
    headline: 'Transforming Communities Through Education',
    description:
      'Building stronger communities through mentorship, scholarships, leadership and opportunity.',
    cta: { label: 'Explore Foundation', to: '/programs' },
    gradient: 'from-gold-500 via-gold-400 to-navy',
    accent: 'from-navy/30 to-transparent',
  },
  {
    id: 'labs',
    title: 'InnoSpeak Global Labs',
    headline: 'Build.\nInnovate.\nCreate.',
    description:
      'Discover engineering, AI, software development, freelancing, entrepreneurship and future technologies.',
    cta: { label: 'Explore Labs', to: '/programs' },
    gradient: 'from-navy-700 via-navy to-gold-600',
    accent: 'from-gold-400/30 to-transparent',
  },
];

const AUTOPLAY_MS = 7000;
const slideVariants = {
  enter: { opacity: 0, scale: 1.08 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.04 },
};

export default function StorySlider() {
  const [[index, dir], setState] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const paginate = useCallback((next) => {
    setState(([prev]) => {
      const total = SLIDES.length;
      const target = (next + total) % total;
      return [target, target > prev ? 1 : -1];
    });
  }, []);

  const goPrev = useCallback(() => paginate(index - 1), [index, paginate]);
  const goNext = useCallback(() => paginate(index + 1), [index, paginate]);

  // Autoplay every 7s, pausable on hover/focus.
  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => goNext(), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, isPaused, goNext]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) paginate(index + (delta < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  const slide = SLIDES[index];

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="InnoSpeak Global ecosystems"
    >
      {/* Floating glass container */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-white/40 bg-white/10 shadow-navy-lg backdrop-blur-2xl sm:aspect-[5/4] md:aspect-[4/5] lg:aspect-[3/4]"
      >
        {/* Soft outer glow */}
        <div
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-gold/10 blur-3xl"
          aria-hidden="true"
        />

        <AnimatePresence custom={dir} initial={false}>
          <motion.div
            key={slide.id}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col justify-end p-8 md:p-10"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${SLIDES.length}: ${slide.title}`}
          >
            {/* Elegant gradient illustration */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} aria-hidden="true" />
            <div className={`absolute inset-0 bg-gradient-to-tr ${slide.accent}`} aria-hidden="true" />
            {/* Subtle geometric accent */}
            <div className="absolute right-8 top-8 h-24 w-24 rounded-full border border-white/20" aria-hidden="true" />
            <div className="absolute right-14 top-14 h-12 w-12 rounded-full border border-white/10" aria-hidden="true" />

            {/* Slide content */}
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                {slide.title}
              </span>
              <h3 className="mt-4 whitespace-pre-line font-serif text-2xl font-bold leading-tight text-white md:text-3xl">
                {slide.headline}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
                {slide.description}
              </p>
              <Link
                to={slide.cta.to}
                className="group/cta mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {slide.cta.label}
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover/cta:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next arrows */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronRight size={20} />
        </button>

        {/* Animated progress bar */}
        <div className="absolute inset-x-8 bottom-6 h-1 overflow-hidden rounded-full bg-white/20" aria-hidden="true">
          <motion.div
            key={`${index}-${isPaused}`}
            initial={{ width: '0%' }}
            animate={{ width: isPaused ? '0%' : '100%' }}
            transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
            className="h-full rounded-full bg-gold"
          />
        </div>
      </motion.div>

      {/* Progress indicators */}
      <div className="mt-6 flex items-center justify-center gap-2.5" role="tablist" aria-label="Slide navigation">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to slide ${i + 1}: ${s.title}`}
            onClick={() => paginate(i)}
            className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
              i === index ? 'w-8 bg-gold' : 'w-2.5 bg-navy/20 hover:bg-navy/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
