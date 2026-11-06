import { ArrowRight, Wrench, Lightbulb, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading.jsx';
import { LAB_COURSES } from '../../lib/data/labs.js';
import { TRACK_BY_ID } from '../../lib/data/registry.js';

const labBenefits = [
  {
    icon: Wrench,
    title: 'Learn by Building',
    description: 'Work on real technical challenges and experiments, not just lectures.',
  },
  {
    icon: Lightbulb,
    title: 'Apply Concepts',
    description: 'Turn theory into practice through hands-on projects and practical assessments.',
  },
  {
    icon: Rocket,
    title: 'Create Evidence',
    description: 'Build portfolio pieces and credentials that prove your capabilities.',
  },
];

const LEVEL_STYLES = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-amber-100 text-amber-700',
  Expert: 'bg-rose-100 text-rose-700',
};

export default function LabsPromotion() {
  const featuredLabs = LAB_COURSES.filter((c) =>
    ['LAB-SE104', 'LAB-AI103', 'LAB-CI109', 'LAB-DA107', 'LAB-CY101', 'LAB-CT102']
      .includes(c.code)
  );

  return (
    <section className="py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Practical Learning"
          title="Don't Just Learn It. Build It."
          subtitle="Practical Labs help you apply concepts through experiments, technical tasks, projects and evidence-based assessments."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {labBenefits.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-navy-100 bg-white p-6 transition hover:shadow-premium">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600">
                <Icon size={24} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-navy-900">{title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-navy-600">{description}</p>
            </div>
          ))}
        </div>

        {/* Featured Labs courses — unified catalogue preview */}
        <div className="mt-14">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <h3 className="font-display text-xl font-bold text-navy-900">
              Featured Labs Courses
            </h3>
            <Link
              to="/labs"
              className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-gold-700 transition-colors hover:text-gold-600"
            >
              View all {LAB_COURSES.length} Labs courses
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredLabs.map((course, i) => {
              const track = TRACK_BY_ID[course.track_id] || {};
              const levelClass = LEVEL_STYLES[course.level] || 'bg-navy-100 text-navy-700';
              return (
                <motion.div
                  key={course.code}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={`/labs/${course.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-navy-400">
                        {track.code || 'LAB'}
                      </span>
                      <span className={`rounded-full px-3 py-1 font-body text-xs font-semibold ${levelClass}`}>
                        {course.level}
                      </span>
                    </div>
                    <h4 className="mt-3 font-display text-base font-bold leading-snug text-navy-900">
                      {course.title}
                    </h4>
                    <p className="mt-2 line-clamp-2 font-body text-sm leading-relaxed text-navy-500">
                      {course.summary}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-5">
                      <span className="font-display text-lg font-bold text-navy-900">
                        ${course.price_usd}
                      </span>
                      <span className="inline-flex items-center gap-1 font-body text-sm font-bold text-gold-600 transition-all group-hover:gap-2">
                        View course
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/labs"
            className="btn-gold inline-flex items-center gap-2"
          >
            Explore All Labs
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
