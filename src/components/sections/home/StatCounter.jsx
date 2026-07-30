import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, animate } from 'framer-motion';

/**
 * StatCounter — animated count-up statistic.
 *
 * Animates a numeric value from 0 to `value` once when scrolled into
 * view. Non-numeric labels (e.g. "Future Ready") render as-is. Respects
 * reduced-motion via framer-motion's built-in handling.
 */
export default function StatCounter({ value, label, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState('0');

  // Detect whether the value has a numeric prefix (e.g. "100+", "03").
  const match = typeof value === 'string' ? value.match(/^(\d+)(.*)$/) : null;
  const numeric = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';
  const isText = numeric === null;

  useEffect(() => {
    if (!inView || isText) {
      if (isText) setDisplay(value);
      return;
    }
    const controls = animate(motionValue, numeric, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        const padded = numeric < 10 ? String(Math.round(v)).padStart(2, '0') : String(Math.round(v));
        setDisplay(padded + suffix);
      },
    });
    return () => controls.stop();
  }, [inView, isText, numeric, suffix, value, motionValue]);

  return (
    <div ref={ref} className={`flex flex-col ${className}`}>
      <span className="text-3xl font-bold text-navy md:text-4xl">
        {isText ? value : display}
      </span>
      <span className="mt-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
    </div>
  );
}
