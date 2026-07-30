import { motion } from 'framer-motion';
import {
  Mic, Briefcase, Presentation, Code, BarChart3, Brain, Users, Rocket,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ICONS = {
  mic: Mic,
  briefcase: Briefcase,
  presentation: Presentation,
  code: Code,
  'bar-chart': BarChart3,
  brain: Brain,
  users: Users,
  rocket: Rocket,
};

export default function PathwayCard({ pathway, index }) {
  const Icon = ICONS[pathway.icon] ?? Mic;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl border border-navy-100 bg-white p-6 shadow-premium transition-all duration-300 hover:border-gold-300/60 hover:shadow-premium-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
          <Icon size={22} strokeWidth={1.8} />
        </div>
        <span className="font-display text-xs font-bold text-gold-600">
          {pathway.code}
        </span>
      </div>

      <h3 className="mt-4 font-display text-base font-bold text-navy-900">
        {pathway.title}
      </h3>

      <div className="mt-4 flex items-center gap-3 font-body text-xs text-navy-500">
        <span className="rounded-md bg-navy-50 px-2 py-1 font-medium">
          {pathway.duration}
        </span>
        <span className="rounded-md bg-gold-50 px-2 py-1 font-medium text-gold-700">
          {pathway.level}
        </span>
      </div>

      <Link
        to="/academy"
        className="mt-5 inline-flex items-center gap-1.5 font-body text-sm font-semibold text-navy-900 transition-colors group-hover:text-gold-600"
      >
        View Programme
      </Link>
    </motion.div>
  );
}
