import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, School, ArrowRight } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { inViewOnce } from '../../../lib/motion/presets';
import { CBE_INFO, SCHOOL_LEVELS } from '../../../lib/data/cbeData';

const ICON_MAP = {
  primary: School,
  'junior-secondary': BookOpen,
  'senior-school': GraduationCap,
};

export default function CbeAcademy() {
  return (
    <section id="cbe-academy" className="bg-navy-950 py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Kenya CBC Pathway"
          title={
            <>
              CBE / CBC Academy
              <span className="block text-gradient-gold">Grades 3\u201312 Learning Support</span>
            </>
          }
          subtitle={CBE_INFO.description}
          dark
        />

        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {SCHOOL_LEVELS.map((level, i) => {
            const Icon = ICON_MAP[level.id] || School;
            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewOnce}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy-700 bg-navy-900 p-8 shadow-premium transition-all duration-300 hover:border-gold-400/60 hover:shadow-premium-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient text-navy-900 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={26} strokeWidth={1.8} />
                </div>
                <p className="mt-5 font-body text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">
                  {level.grades}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold text-white">{level.title}</h3>
                <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-navy-200">
                  {level.description}
                </p>
                <Link
                  to={`/academy/cbe/${level.id}`}
                  className="mt-6 inline-flex items-center gap-2 font-body text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300"
                >
                  {level.button}
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
