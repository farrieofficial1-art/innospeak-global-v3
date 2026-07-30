import { motion } from 'framer-motion';
import { Laptop, Building2, Shuffle, Award } from 'lucide-react';
import { HERO_FLOATING_CARDS } from './heroData.js';

const ICONS = {
  laptop: Laptop,
  building: Building2,
  shuffle: Shuffle,
  award: Award,
};

export default function HeroFloatingCards() {
  return (
    <div className="absolute inset-0 z-20 hidden lg:block">
      {HERO_FLOATING_CARDS.map((card, i) => {
        const Icon = ICONS[card.icon] ?? Laptop;
        const positions = [
          'left-[6%] top-[22%]',
          'right-[6%] top-[18%]',
          'left-[8%] bottom-[18%]',
          'right-[8%] bottom-[22%]',
        ];
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute ${positions[i]} flex items-center gap-3 rounded-xl border border-white/20 bg-white/90 px-4 py-3 shadow-glass backdrop-blur-md`}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                card.color === 'gold'
                  ? 'bg-gold-gradient text-navy-900'
                  : 'bg-navy-900 text-gold-400'
              }`}
            >
              <Icon size={18} strokeWidth={1.8} />
            </div>
            <span className="font-body text-sm font-semibold text-navy-900">
              {card.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
