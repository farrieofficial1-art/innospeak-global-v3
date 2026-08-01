import { motion } from 'framer-motion';
import { Brain, Code, Cloud, ShieldCheck, ChartBar as BarChart3, Cog, Sparkles, Lightbulb, FlaskConical, Rocket, Wrench } from 'lucide-react';
import { staggerContainer, fadeUpItem } from '../../../lib/motion/presets';
import LabsHeroSlider from './LabsHeroSlider.jsx';

const container = staggerContainer(0.1, 0.1);

const CATEGORIES = [
  { icon: Brain, label: 'AI' },
  { icon: Code, label: 'Software Engineering' },
  { icon: Cloud, label: 'Cloud & DevOps' },
  { icon: ShieldCheck, label: 'Cybersecurity' },
  { icon: BarChart3, label: 'Data Science' },
  { icon: Cog, label: 'Engineering & Innovation' },
  { icon: Sparkles, label: 'Creative AI & Immersive' },
];

const TRACKS = [
  { icon: Lightbulb, label: 'Innovation Projects' },
  { icon: FlaskConical, label: 'Research & Development' },
  { icon: Rocket, label: 'Startup Incubation' },
  { icon: Wrench, label: 'Tech Workshops' },
];

export default function LabsHero() {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-20 pt-32 md:pt-40">
      <LabsHeroSlider />

      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold-500/15 blur-[140px]" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-navy-700/30 blur-[120px]" aria-hidden="true" />

      <div className="container-premium relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span
            variants={fadeUpItem}
            className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-gold-300 backdrop-blur-sm"
          >
            <Sparkles size={14} aria-hidden="true" />
            Innovate. Build. Launch.
          </motion.span>

          <motion.h1
            variants={fadeUpItem}
            className="mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
          >
            InnoSpeak Global Labs
          </motion.h1>

          <motion.p
            variants={fadeUpItem}
            className="mx-auto mt-8 max-w-2xl font-body text-lg leading-relaxed text-navy-200"
          >
            Seven innovation schools where learners collaborate on AI, software engineering,
            cloud, cybersecurity, data science, robotics and creative media projects with real-world impact.
          </motion.p>

          <motion.div variants={fadeUpItem} className="mt-10">
            <p className="mb-4 font-body text-xs font-semibold uppercase tracking-wider text-gold-400">
              Seven Schools
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
                >
                  <item.icon size={20} className="text-gold-400" aria-hidden="true" />
                  <span className="font-body text-sm font-medium text-white">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUpItem} className="mt-6">
            <p className="mb-4 font-body text-xs font-semibold uppercase tracking-wider text-gold-400">
              Four Ways to Get Involved
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {TRACKS.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md"
                >
                  <item.icon size={16} className="text-gold-400" aria-hidden="true" />
                  <span className="font-body text-xs font-medium text-white">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
