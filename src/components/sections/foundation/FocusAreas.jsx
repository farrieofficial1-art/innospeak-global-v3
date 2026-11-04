import { motion } from 'framer-motion';
import {
  Award,
  Sparkles,
  Heart,
  Laptop,
  Briefcase,
  Users,
  Accessibility,
  Globe,
  Building,
  Leaf,
  Store,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { FOCUS_AREAS } from './foundationData.js';

const ICONS = {
  award: Award,
  sparkles: Sparkles,
  heart: Heart,
  laptop: Laptop,
  briefcase: Briefcase,
  users: Users,
  accessibility: Accessibility,
  globe: Globe,
  building: Building,
  leaf: Leaf,
  store: Store,
};

export default function FocusAreas() {
  return (
    <section id="foundation-programs" className="bg-cream py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Our Programs"
          title="Eleven Sponsor-Ready Programs. Clear Outcomes."
          subtitle="Each programme has a defined goal, costed sponsor impact tiers and measurable outcomes. Choose a program to support, or apply if you or your community need assistance."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-7">
          {FOCUS_AREAS.map((area, i) => {
            const Icon = ICONS[area.icon] || Award;
            return (
              <motion.article
                key={area.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                className="group flex h-full flex-col rounded-2xl border border-emerald-100 bg-white p-7 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-premium-lg"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-md">
                    <Icon size={24} strokeWidth={1.8} />
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Program {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Name + short */}
                <h3 className="mt-5 font-display text-xl font-bold text-navy-900">
                  {area.name}
                </h3>
                <p className="mt-1 font-body text-sm font-semibold text-emerald-700">
                  {area.short}
                </p>

                {/* Goal */}
                <p className="mt-3 font-body text-sm leading-6 text-navy-600">
                  <span className="font-bold text-navy-800">Goal: </span>
                  {area.goal}
                </p>

                {/* Sponsor impact tiers */}
                <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <p className="font-body text-[11px] font-bold uppercase tracking-wider text-navy-500">
                    Sponsor Impact
                  </p>
                  <ul className="mt-3 space-y-2">
                    {area.sponsorImpact.map((tier) => (
                      <li
                        key={tier.amount}
                        className="flex items-start justify-between gap-3 font-body text-sm text-navy-700"
                      >
                        <span className="flex items-start gap-2">
                          <Check size={14} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                          <span>{tier.label}</span>
                        </span>
                        <span className="shrink-0 font-display text-sm font-bold text-emerald-700">
                          ${tier.amount.toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 border-t border-emerald-100 pt-3 font-body text-sm italic leading-5 text-emerald-800">
                    &ldquo;{area.sponsorHook}&rdquo;
                  </p>
                </div>

                {/* Description */}
                <p className="mt-5 font-body text-sm leading-6 text-navy-600">
                  {area.description}
                </p>

                <div className="mt-5 rounded-xl border border-navy-100 bg-navy-50/30 p-4">
                  <p className="font-body text-[11px] font-bold uppercase tracking-wider text-navy-500">Who this is designed to serve</p>
                  <p className="mt-2 font-body text-sm leading-6 text-navy-700">{area.targetGroup}</p>
                </div>

                {/* What the program supports */}
                <div className="mt-5 border-t border-navy-100 pt-5">
                  <p className="mb-3 font-body text-[11px] font-bold uppercase tracking-wider text-navy-400">
                    What this program supports
                  </p>
                  <ul className="space-y-2">
                    {area.supports.map((item) => (
                      <li key={item} className="flex items-start gap-2 font-body text-sm leading-5 text-navy-700">
                        <Check size={14} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 border-t border-navy-100 pt-5">
                  <p className="font-body text-[11px] font-bold uppercase tracking-wider text-navy-400">Intended outcomes</p>
                  <ul className="mt-3 space-y-2">
                    {area.intendedOutcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2 font-body text-sm leading-5 text-navy-700">
                        <Check size={14} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 font-body text-xs leading-5 text-navy-500"><strong>Potential sponsor use:</strong> {area.sponsorFunding}</p>
                  <p className="mt-2 font-body text-xs leading-5 text-navy-500"><strong>How results may be measured:</strong> {area.measurement}</p>
                </div>

                {/* CTAs */}
                <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
                  {area.canApply && (
                    <Link
                      to={area.applyTo}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-5 py-2.5 font-body text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
                    >
                      View Support Options
                      <ArrowRight size={14} />
                    </Link>
                  )}
                  <Link
                    to={area.applyTo?.replace('/apply', '/contact').replace('?division=foundation', '?interest=foundation') || '/contact'}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-5 py-2.5 font-body text-sm font-bold text-navy-900 transition-colors hover:border-emerald-400 hover:text-emerald-700"
                  >
                    Ask About Programme
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-10 text-center font-body text-xs text-navy-500">
          Each program has its own eligibility and application. Sponsorship packages range from $25 to $25,000 depending on the program and tier.
        </p>
      </div>
    </section>
  );
}
