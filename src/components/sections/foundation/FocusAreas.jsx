import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { FOUNDATION_PROGRAMS } from '../../../lib/data/foundationApplicationsData.js';

export default function FocusAreas() {
  return (
    <section id="foundation-programs" className="bg-cream py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Our Programs"
          title="Focused Programmes. Clear Outcomes."
          subtitle="Each programme has defined eligibility, a costed plan and measurable outcomes. Sponsors can fund a single learner, a cohort or a full initiative."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {FOUNDATION_PROGRAMS.map((program, i) => (
            <motion.article
              key={program.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group flex h-full flex-col rounded-2xl border border-emerald-100 bg-white p-7 shadow-premium transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-premium-lg"
            >
              <span className="self-start rounded-full bg-emerald-50 px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Programme {String(i + 1).padStart(2, '0')}
              </span>

              <h3 className="mt-5 font-display text-xl font-bold text-navy-900">{program.label}</h3>
              <p className="mt-3 font-body text-sm leading-6 text-navy-600">{program.goal}</p>
              <p className="mt-4 font-body text-sm font-semibold text-emerald-700">{program.hook}</p>

              <div className="mt-5 border-t border-navy-100 pt-5">
                <p className="mb-3 font-body text-[11px] font-bold uppercase tracking-wider text-navy-400">
                  Sponsor impact
                </p>
                <ul className="space-y-2">
                  {program.sponsorImpact.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-body text-sm leading-5 text-navy-700">
                      <Check size={14} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
                <Link
                  to={`/apply?division=foundation&program=${program.id}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-5 py-2.5 font-body text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
                >
                  Apply for Support
                </Link>
                <Link
                  to={`/contact?interest=foundation-donate-${program.id}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-5 py-2.5 font-body text-sm font-bold text-navy-900 transition-colors hover:border-emerald-400 hover:text-emerald-700"
                >
                  Sponsor This Programme
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-10 text-center font-body text-xs text-navy-500">
          Each program has its own eligibility and application. Programmes open for funding only after approval and reporting are in place.
        </p>
      </div>
    </section>
  );
}
