import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedCampaign } from '../../lib/data/promotionalCampaigns.js';

/**
 * PromotionalBanner — displays the active featured promotional campaign.
 * 
 * Shows as a strong banner but not intrusive. Uses real campaign data,
 * not fake urgency or false claims.
 */
export default function PromotionalBanner() {
  const campaign = getFeaturedCampaign();

  if (!campaign) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 py-8 sm:py-12">
      {/* Ambient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="container-premium relative z-10">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="max-w-2xl">
            <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
              {campaign.badge}
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
              {campaign.title}
            </h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-white/80 sm:text-base">
              {campaign.subtitle}
            </p>
          </div>

          <Link
            to={campaign.ctaRoute}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gold-500 px-5 py-3 font-body text-sm font-bold text-navy-900 transition hover:bg-gold-400"
          >
            {campaign.cta}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
