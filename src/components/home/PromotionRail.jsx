import { ArrowRight, CalendarDays, GraduationCap, Sparkles, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const campaigns = [
  { icon: Sparkles, eyebrow: 'NEW LEARNING', title: 'AI, data & automation', text: 'Build practical digital skills around modern AI workflows, data and intelligent systems.', to: '/courses' },
  { icon: Wrench, eyebrow: 'HANDS-ON', title: 'Engineering & innovation labs', text: 'Turn theory into practical projects, evidence and portfolio-ready work.', to: '/labs' },
  { icon: CalendarDays, eyebrow: 'FLEXIBLE', title: 'Online, physical & hybrid', text: 'Choose a study mode that fits your schedule and learning goals.', to: '/academy' },
];

export default function PromotionRail() {
  return (
    <section className="container-premium -mt-8 relative z-20 pb-10">
      <div className="grid gap-4 lg:grid-cols-3">
        {campaigns.map(({ icon: Icon, eyebrow, title, text, to }) => (
          <Link key={title} to={to} className="group rounded-3xl border border-white/20 bg-white p-6 shadow-premium-lg transition hover:-translate-y-1">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-700"><Icon size={20} /></span>
              <ArrowRight size={18} className="text-navy-300 transition group-hover:translate-x-1 group-hover:text-gold-600" />
            </div>
            <p className="mt-5 font-body text-[10px] font-bold tracking-[0.2em] text-gold-700">{eyebrow}</p>
            <h3 className="mt-2 font-display text-xl font-bold text-navy-900">{title}</h3>
            <p className="mt-2 font-body text-sm leading-6 text-navy-500">{text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
