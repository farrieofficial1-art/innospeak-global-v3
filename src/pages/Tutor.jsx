import { motion } from 'framer-motion';
import { Sparkles, RotateCcw } from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import TutorPanel from '../components/tutor/TutorPanel.jsx';
import TutorPersonaChips from '../components/tutor/TutorPersonaChips.jsx';
import { getPersonaById } from '../components/tutor/tutorPersonas.js';
import useTutorChat from '../hooks/useTutorChat.js';

/**
 * Tutor — full "InnoSpeak Tutor" session page.
 *
 * Same conversation engine as the floating TutorWidget (via useTutorChat),
 * just given room to breathe: persona picker up top, full-height chat
 * panel below. Reached from the widget's "expand" action or directly at
 * /tutor.
 */
export default function Tutor() {
  const {
    personaId,
    messages,
    isSending,
    error,
    sendMessage,
    resetConversation,
    changePersona,
    isConfigured,
  } = useTutorChat();

  const persona = getPersonaById(personaId);

  return (
    <>
      <Seo
        title="AI Tutor"
        description="Get AI-powered help tailored to learners, innovators, engineers, and developers on the InnoSpeak Global platform."
        path="/tutor"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-gradient py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-navy-radial opacity-60" />
        <div className="container-premium relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-2"
          >
            <Sparkles size={16} className="text-gold-400" />
            <span className="font-body text-xs font-semibold uppercase tracking-wider text-gold-300">
              InnoSpeak Tutor
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl"
          >
            AI help, tuned to your work
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl font-body text-base leading-relaxed text-navy-100/80 sm:text-lg"
          >
            Pick a mode below — Learner, Innovator, Engineer, or Developer — and the
            tutor adapts its focus and depth to match.
          </motion.p>
        </div>
      </section>

      {/* Session panel */}
      <section className="bg-cream py-14 sm:py-16">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="mx-auto flex h-[36rem] max-w-3xl flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-premium-lg sm:h-[40rem]"
          >
            <div className="flex items-center justify-between border-b border-navy-100 px-4 py-3.5 sm:px-6">
              <TutorPersonaChips activeId={personaId} onChange={changePersona} />
              <button
                type="button"
                onClick={resetConversation}
                aria-label="Reset conversation"
                className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-navy-400 transition-colors duration-200 hover:bg-navy-50 hover:text-navy-700"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {!isConfigured ? (
              <div className="flex flex-1 items-center justify-center px-6 text-center">
                <p className="font-body text-sm text-navy-500">
                  The AI Tutor isn&rsquo;t connected yet. Check back soon.
                </p>
              </div>
            ) : (
              <TutorPanel
                personaId={personaId}
                messages={messages}
                isSending={isSending}
                error={error}
                onSend={sendMessage}
                variant="full"
              />
            )}
          </motion.div>

          <p className="mx-auto mt-5 max-w-3xl text-center font-body text-xs text-navy-400">
            {persona.tagline} &mdash; responses are AI-generated and may be imperfect;
            use judgment for anything high-stakes.
          </p>
        </div>
      </section>
    </>
  );
}