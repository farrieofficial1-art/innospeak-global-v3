import { motion } from 'framer-motion';
import { staggerContainer, fadeUpItem } from '../../lib/motion/presets';
import {
  Globe,
  GraduationCap,
  Briefcase,
  Award,
} from 'lucide-react';

const container = staggerContainer(0.12, 0.1);

const features = [
  {
    icon: Globe,
    text: 'International Curriculum',
  },
  {
    icon: GraduationCap,
    text: 'Flexible Learning',
  },
  {
    icon: Briefcase,
    text: 'Career-Focused Training',
  },
  {
    icon: Award,
    text: 'Professional Certification',
  },
];

/** Fixed positions/delays so particles don't reshuffle on every re-render. */
const PARTICLES = [
  { top: '18%', left: '8%', size: 5, duration: 7, delay: 0 },
  { top: '65%', left: '5%', size: 3, duration: 9, delay: 1.2 },
  { top: '30%', left: '92%', size: 4, duration: 8, delay: 0.6 },
  { top: '75%', left: '90%', size: 3, duration: 6.5, delay: 2 },
  { top: '10%', left: '48%', size: 3, duration: 10, delay: 0.8 },
  { top: '88%', left: '55%', size: 4, duration: 7.5, delay: 1.6 },
];

export default function AdmissionsHero({ children }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 pt-32 pb-20">

      {/* Animated grid pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <motion.div
          animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Layered glows for depth */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold-500/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-navy-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute left-0 top-1/3 h-64 w-64 rounded-full bg-gold-400/10 blur-[100px]" />

      {/* Slow-rotating decorative rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute left-10 top-20 h-28 w-28 rounded-full border border-white/10"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute right-20 top-44 h-16 w-16 rounded-full border border-gold-400/20"
      />
      <div className="pointer-events-none absolute bottom-16 left-1/4 h-10 w-10 rounded-full border border-white/10" />

      {/* Soft drifting particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gold-300"
            style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
            animate={{ y: [0, -18, 0], opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="container-premium relative z-10">

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-xl"
        >
          {/* Top gold accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gold-gradient" />

          <motion.div variants={fadeUpItem} className="flex justify-center">
            <span className="eyebrow">
              Global Admissions
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUpItem}
            className="mt-6 text-center font-display text-5xl font-bold leading-tight text-white md:text-6xl"
          >
            Begin Your
            <span className="block text-gradient-gold">
              Global Learning Journey
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUpItem}
            className="mx-auto mt-8 max-w-3xl text-center font-body text-lg leading-8 text-navy-200"
          >
            Join ambitious learners preparing for international careers
            through communication, innovation, engineering thinking and
            world-class professional education.
          </motion.p>

          <motion.div
            variants={fadeUpItem}
            className="mt-10 grid gap-4 md:grid-cols-4"
          >
            {features.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-colors duration-300 hover:border-gold-400/30 hover:bg-white/10"
                >
                  <Icon
                    size={22}
                    className="text-gold-400"
                  />

                  <span className="font-body text-sm font-medium text-white">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </motion.div>

          <motion.div
            variants={fadeUpItem}
            className="mt-12"
          >
            {children}
          </motion.div>

        </motion.div>

      </div>

    </section>
  );
}