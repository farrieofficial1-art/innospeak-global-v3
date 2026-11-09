import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import { ACADEMY_COURSES, priceKes } from '../../lib/data/academy.js';

export default function FreeCoursesTeaser() {
  const courses = ACADEMY_COURSES.filter((c) => c.price_usd <= 19).slice(0, 4);

  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Start for less"
          title="Affordable Courses to Get You Going"
          subtitle="High-impact courses from just $19. Build real skills without breaking the bank."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course, i) => (
            <motion.article
              key={course.code}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/60 hover:shadow-premium-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Sparkles size={22} strokeWidth={1.8} />
                </div>
                <span className="font-display text-xs font-bold text-gold-600">
                  {course.code}
                </span>
              </div>

              <h3 className="mt-4 font-display text-base font-bold leading-snug text-navy-900">
                {course.title}
              </h3>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-emerald-100 px-2.5 py-1 font-body text-xs font-bold uppercase tracking-wide text-emerald-700">
                  From ${course.price_usd}
                </span>
                <span className="rounded-md bg-navy-50 px-2.5 py-1 font-body text-xs font-medium text-navy-700">
                  {course.level}
                </span>
              </div>

              <Link
                to={`/academy/${course.slug}`}
                className="mt-auto inline-flex items-center gap-1.5 pt-5 font-body text-sm font-semibold text-navy-900 transition-colors group-hover:text-gold-600"
              >
                View Course
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
