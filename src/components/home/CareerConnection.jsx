import { ArrowRight, BookOpen, Wrench, FolderOpen, Award, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading.jsx';

const journey = [
  {
    step: 1,
    icon: BookOpen,
    label: 'Learn',
    description: 'Structured courses',
  },
  {
    step: 2,
    icon: Wrench,
    label: 'Build Skills',
    description: 'Practice through labs',
  },
  {
    step: 3,
    icon: FolderOpen,
    label: 'Create Projects',
    description: 'Practical work samples',
  },
  {
    step: 4,
    icon: Award,
    label: 'Earn Credentials',
    description: 'Verified certificates',
  },
  {
    step: 5,
    icon: Rocket,
    label: 'Career Growth',
    description: 'Professional development',
  },
];

/**
 * CareerConnection — shows how learning connects to career development.
 * 
 * Visual flow from learning → skills → projects → credentials → opportunities.
 * Links to Career Hub if it exists.
 */
export default function CareerConnection() {
  return (
    <section className="py-20 sm:py-24 bg-navy-50">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Your Career Path"
          title="From Learning to Career"
          subtitle="InnoSpeak connects structured learning with real projects, credentials and career development opportunities."
        />

        <div className="mt-12">
          {/* Desktop: Horizontal flow */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-2">
            {journey.map(({ step, icon: Icon, label, description }, idx) => (
              <div key={step} className="flex flex-col items-center">
                {/* Step card */}
                <div className="w-full rounded-2xl border border-navy-200 bg-white p-6 text-center transition hover:shadow-premium">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 mx-auto">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 font-display text-sm font-bold text-navy-900">{label}</h3>
                  <p className="mt-1 font-body text-xs text-navy-500">{description}</p>
                </div>

                {/* Arrow to next */}
                {idx < journey.length - 1 && (
                  <div className="mt-4 mb-4">
                    <ArrowRight size={20} className="text-gold-600 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: Vertical stack */}
          <div className="lg:hidden space-y-4">
            {journey.map(({ step, icon: Icon, label, description }, idx) => (
              <div key={step}>
                <div className="rounded-2xl border border-navy-200 bg-white p-6 flex items-center gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 shrink-0">
                    <Icon size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display text-sm font-bold text-navy-900">{label}</h3>
                    <p className="font-body text-xs text-navy-500">{description}</p>
                  </div>
                </div>
                {idx < journey.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowRight size={20} className="text-gold-600 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/career-hub"
            className="btn-gold inline-flex items-center gap-2"
          >
            Explore Career Hub
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
