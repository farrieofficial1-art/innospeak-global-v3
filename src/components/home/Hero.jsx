import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, GraduationCap, FlaskConical, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import HeroSlider from './HeroSlider.jsx';
import HeroStats from './HeroStats.jsx';
import HeroFloatingCards from './HeroFloatingCards.jsx';
import { HERO_BADGE, HERO_HEADLINE, HERO_DESCRIPTION, PILLAR_CARDS } from './heroData.js';

const PILLAR_ICONS = { graduation: GraduationCap, flask: FlaskConical, heart: HeartHandshake };
const PILLAR_STYLES = {
  gold: { border: 'border-gold-500/30', bg: 'bg-gold-500/10', text: 'text-gold-300', iconBg: 'bg-gold-gradient text-navy-900' },
  navy: { border: 'border-navy-400/30', bg: 'bg-navy-500/10', text: 'text-navy-200', iconBg: 'bg-navy-700 text-gold-300' },
  emerald: { border: 'border-emerald-400/30', bg: 'bg-emerald-500/10', text: 'text-emerald-200', iconBg: 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white' },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-[100vh] items-center overflow-hidden bg-navy-900">
      <HeroSlider />
      <HeroFloatingCards />

      <div className="container-premium relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 backdrop-blur-sm"
          >
            <Sparkles size={16} className="text-gold-400" />
            <span className="font-body text-xs font-semibold uppercase tracking-wider text-gold-300">
              {HERO_BADGE}
            </span>
          </motion.div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {HERO_HEADLINE.map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                className={line.highlight ? 'block text-gradient-gold' : 'block'}
              >
                {line.text}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 max-w-xl font-body text-base leading-relaxed text-white/80 sm:text-lg"
          >
            {HERO_DESCRIPTION}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <Button to="/apply" variant="gold" size="lg" className="group">
              Apply Now
              <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              to="/programs"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white hover:text-navy-900"
            >
              Explore Programs
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12 border-t border-white/10 pt-8"
          >
            <HeroStats />
          </motion.div>
        </motion.div>
      </div>

      {/* Three ecosystem pillars */}
      <div className="container-premium relative z-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="grid gap-4 sm:grid-cols-3"
        >
          {PILLAR_CARDS.map((pillar) => {
            const Icon = PILLAR_ICONS[pillar.icon] || GraduationCap;
            const s = PILLAR_STYLES[pillar.color];
            return (
              <Link
                key={pillar.id}
                to={pillar.link}
                className={`group rounded-2xl border ${s.border} ${s.bg} p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.iconBg} shadow-md`}>
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className={`font-body text-xs font-bold uppercase tracking-wider ${s.text}`}>
                      {pillar.action}
                    </p>
                    <p className="font-display text-sm font-bold text-white">{pillar.label}</p>
                  </div>
                </div>
                <p className="mt-3 font-body text-sm leading-relaxed text-white/70">
                  {pillar.description}
                </p>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
