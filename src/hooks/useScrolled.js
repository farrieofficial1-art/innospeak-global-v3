import { useState, useEffect } from 'react';

export default function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = useState(() => window.scrollY > threshold);
  useEffect(() => {
    let frameId = 0;
    const update = () => {
      frameId = 0;
      setScrolled(window.scrollY > threshold);
    };
    const handleScroll = () => {
      if (!frameId) frameId = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [threshold]);
  return scrolled;
}
