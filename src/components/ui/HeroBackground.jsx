import { HERO_SLIDES } from '../home/heroData.js';

const BACKGROUND_IMAGES = {
  foundation: 'https://images.pexels.com/photos/8423040/pexels-photo-8423040.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1200',
  professional: 'https://images.pexels.com/photos/6549587/pexels-photo-6549587.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1200',
  homepage: HERO_SLIDES[0]?.image || null,
  learning: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=85',
};

export default function HeroBackground({ variant = 'foundation' }) {
  return (
    <img
      src={BACKGROUND_IMAGES[variant] || BACKGROUND_IMAGES.foundation}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-25"
    />
  );
}