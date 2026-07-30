import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, BarChart3, Award } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';
import { getProgrammeByCode } from '../../../lib/data/programmeData';

const container = staggerContainer(0.1, 0.05);

export default function RelatedCourses({ course }) {
  const related = (course.relatedCourses || [])
    .map((code) => getProgrammeByCode(code))
    .filter(Boolean);

  if (related.length === 0) return null;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="Related Courses"
            title="Continue Your Learning Journey"
            subtitle="Explore these related courses to deepen your skills."
          />

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <motion.div key={p.code} variants={fadeUpItem}>
                <Link
                  to={`/courses/${p.code}`}
                  className="group flex h-full flex-col rounded-2xl border border-navy-100 bg-cream p-6 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg"
                >
                  <span className="inline-flex w-fit items-center rounded-full bg-navy-900 px-3 py-1 font-mono text-xs font-bold text-gold-400">
                    {p.code}
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold leading-snug text-navy-900">{p.name}</h3>
                  <p className="mt-2 font-body text-xs leading-relaxed text-navy-600 line-clamp-2">{p.shortDescription}</p>

                  <div className="mt-4 flex items-center gap-3 font-body text-xs text-navy-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={13} aria-hidden="true" />
                      {p.duration}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BarChart3 size={13} aria-hidden="true" />
                      {p.level}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Award size={13} aria-hidden="true" />
                      {p.studyMode}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 font-body text-sm font-semibold text-gold-600">
                    View Course
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}