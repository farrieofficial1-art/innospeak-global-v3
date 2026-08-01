import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, FlaskConical, Rocket, Wrench, ChevronDown, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce, easeOutExpo } from '../../../lib/motion/presets';

const TRACKS = [
  {
    id: 'innovation-projects',
    icon: Lightbulb,
    title: 'Innovation Projects',
    description:
      'Join a small team tackling a real, sourced challenge — from community problems to business needs — over a fixed project run.',
    activities: [
      'Get matched into a small project team',
      'Work against a real, sourced challenge with a mentor',
      'Present your outcome at a public demo day',
    ],
  },
  {
    id: 'research-development',
    icon: FlaskConical,
    title: 'Research & Development',
    description:
      'Investigate emerging technology, methods and ideas — the findings feed back into Academy curriculum and real practice.',
    activities: [
      'Take on a defined research question or theme',
      'Work with a mentor to test and document findings',
      'Contribute to a case study, report or working paper',
    ],
  },
  {
    id: 'startup-incubation',
    icon: Rocket,
    title: 'Startup Incubation',
    description:
      'Bring your own idea and get incubator-style support to take it from concept to a working, pitch-ready product.',
    activities: [
      'Validate your idea with structured mentor feedback',
      'Build toward a minimum viable product',
      'Pitch to a mentor panel at the end of the track',
    ],
  },
  {
    id: 'tech-workshops',
    icon: Wrench,
    title: 'Tech Workshops',
    description:
      'Short, hands-on sessions in electronics, coding, robotics and applied AI tools — a lighter, practical entry point into Labs.',
    activities: [
      'Attend a focused, hands-on session',
      'Build a small working thing on the spot',
      'Take home practical skills you can apply immediately',
    ],
  },
];

const container = staggerContainer(0.1, 0.1);

function TrackCard({ track, isOpen, onToggle }) {
  return (
    <motion.div variants={fadeUpItem} className="h-full">
      <div
        className={`overflow-hidden rounded-2xl border bg-white shadow-premium transition-all duration-300 ${
          isOpen ? 'border-gold-300/60 shadow-premium-lg' : 'border-navy-100 hover:border-gold-300/60 hover:shadow-premium-lg'
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`track-detail-${track.id}`}
          className="flex w-full items-start gap-4 p-7 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
        >
          <div
            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl transition-colors duration-300 ${
              isOpen ? 'bg-gold-gradient text-navy-900' : 'bg-navy-900 text-gold-400'
            }`}
          >
            <track.icon size={26} strokeWidth={1.8} aria-hidden="true" />
          </div>

          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-navy-900">{track.title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-navy-600">{track.description}</p>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-900"
          >
            <ChevronDown size={18} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={`track-detail-${track.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: easeOutExpo }}
              className="overflow-hidden"
            >
              <div className="border-t border-navy-100 px-7 pb-7 pt-6">
                <p className="mb-3 font-body text-xs font-semibold uppercase tracking-wider text-gold-600">
                  What You'll Do
                </p>
                <ul className="space-y-2">
                  {track.activities.map((activity, i) => (
                    <li key={i} className="flex items-start gap-2 font-body text-sm leading-relaxed text-navy-700">
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-gold-600" aria-hidden="true" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function LabTracks() {
  const [openId, setOpenId] = useState('innovation-projects');

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="Lab Tracks"
            title="Four Ways to Get Involved"
            subtitle="Pick the track that matches how you want to build."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {TRACKS.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                isOpen={openId === track.id}
                onToggle={() => setOpenId(openId === track.id ? null : track.id)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}