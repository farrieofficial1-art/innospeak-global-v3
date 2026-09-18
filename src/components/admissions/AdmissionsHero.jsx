import { motion } from 'framer-motion';
import { staggerContainer, fadeUpItem } from '../../lib/motion/presets';
import { GraduationCap, FlaskConical, ArrowRight } from 'lucide-react';

const container = staggerContainer(0.12, 0.1);

/**
 * AdmissionsHero — premium application gateway.
 *
 * Communicates that the applicant is choosing a learning pathway,
 * not just filling a form. Shows a clean headline, short supporting
 * message, and the current step indicator (passed as children = Stepper).
 */
export default function AdmissionsHero({ children, currentStep = 1, totalSteps = 7 }) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 pt-28 pb-16 md:pt-32 md:pb-20">
      {/* Subtle grid pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Layered depth glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gold-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-navy-500/15 blur-[100px]" />

      <div className="container-premium relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUpItem} className="flex justify-center">
            <span className="eyebrow">Global Admissions</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUpItem}
            className="mt-6 font-display text-4xl font-bold leading-[1.15] text-white md:text-5xl lg:text-6xl"
          >
            Choose Your
            <span className="block text-gradient-gold">Learning Pathway</span>
          </motion.h1>

          {/* Supporting message */}
          <motion.p
            variants={fadeUpItem}
            className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-navy-200 md:text-lg"
          >
            Whether you're pursuing structured professional education or
            hands-on engineering and innovation, your journey starts here.
            Select your division, pick your programme, and apply in minutes.
          </motion.p>

          {/* Step indicator + progress bar */}
          <motion.div
            variants={fadeUpItem}
            className="mx-auto mt-10 flex max-w-md items-center gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-body text-xs font-semibold uppercase tracking-wider text-navy-300">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="font-body text-xs font-semibold text-gold-400">
                  {Math.round(progress)}% complete
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gold-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>

          {/* Two-pathway teaser */}
          <motion.div
            variants={fadeUpItem}
            className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
              <GraduationCap size={20} className="text-gold-400" />
              <span className="font-body text-sm font-medium text-navy-100">
                Academy — Structured Learning
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
              <FlaskConical size={20} className="text-gold-400" />
              <span className="font-body text-sm font-medium text-navy-100">
                Labs — Practical Innovation
              </span>
            </div>
          </motion.div>

          {/* Stepper (children) */}
          {children && (
            <motion.div variants={fadeUpItem} className="mt-10">
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
