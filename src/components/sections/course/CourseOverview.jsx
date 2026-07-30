import { motion } from 'framer-motion';
import { Users, Target, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const container = staggerContainer(0.12, 0.1);

function OverviewCard({ icon: Icon, title, children }) {
  return (
    <motion.div
      variants={fadeUpItem}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-navy-100 bg-white p-7 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
        <Icon size={24} aria-hidden="true" />
      </div>
      <h3 className="mt-5 font-display text-lg font-bold text-navy-900">{title}</h3>
      {children}
    </motion.div>
  );
}

export default function CourseOverview({ course }) {
  const { overview } = course;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="Course Overview"
            title="About This Course"
            subtitle={overview.description}
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <OverviewCard icon={Users} title="Who This Is For">
              <p className="mt-3 font-body text-sm leading-relaxed text-navy-600">{overview.targetAudience}</p>
            </OverviewCard>

            <OverviewCard icon={Target} title="Course Objectives">
              <ul className="mt-3 space-y-2">
                {overview.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 font-body text-sm leading-relaxed text-navy-600">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-gold-600" aria-hidden="true" />
                    {obj}
                  </li>
                ))}
              </ul>
            </OverviewCard>

            <OverviewCard icon={CheckCircle2} title="Expected Outcomes">
              <ul className="mt-3 space-y-2">
                {overview.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-2 font-body text-sm leading-relaxed text-navy-600">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-gold-600" aria-hidden="true" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </OverviewCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
}