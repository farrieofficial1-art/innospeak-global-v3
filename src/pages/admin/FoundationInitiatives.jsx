import { Target, Layers, HandCoins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FOUNDATION_PROGRAMS } from '../../lib/data/foundationApplicationsData.js';

export default function FoundationInitiatives() {
  return (
    <div>
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
              <Target size={20} />
            </div>
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-wider text-emerald-700">
                Foundation
              </p>
              <h1 className="font-display text-2xl font-bold text-navy-900">
                Programmes & Sponsorship
              </h1>
            </div>
          </div>
          <p className="mt-3 max-w-2xl font-body text-sm leading-6 text-navy-600">
            The eleven sponsor-ready programmes published on the Foundation website. Funding totals are recorded on the Contributions page.
          </p>
        </div>
        <Link
          to="/admin/foundation/contributions"
          className="inline-flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-4 py-2.5 font-body text-sm font-bold text-navy-900 transition-colors hover:border-emerald-400 hover:text-emerald-700"
        >
          <HandCoins size={15} /> View contributions
        </Link>
      </header>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <SummaryTile icon={Layers} label="Sponsor-ready programmes" value={FOUNDATION_PROGRAMS.length} />
        <SummaryTile icon={HandCoins} label="Sponsorship tiers per programme" value={FOUNDATION_PROGRAMS[0].sponsorImpact.length} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {FOUNDATION_PROGRAMS.map((program) => (
          <div key={program.id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
            <h3 className="font-display text-base font-bold text-navy-900">{program.label}</h3>
            <p className="mt-1 font-body text-sm leading-6 text-navy-600">{program.goal}</p>
            <p className="mt-3 font-body text-xs font-semibold text-emerald-700">{program.hook}</p>
            <ul className="mt-4 space-y-1.5 border-t border-navy-100 pt-4">
              {program.sponsorImpact.map((tier) => (
                <li key={tier} className="font-body text-xs text-navy-700">{tier}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon size={18} />
      </div>
      <p className="mt-3 font-body text-[11px] font-bold uppercase tracking-wider text-navy-500">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold text-navy-900">{value}</p>
    </div>
  );
}
