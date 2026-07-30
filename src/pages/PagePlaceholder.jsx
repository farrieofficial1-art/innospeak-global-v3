import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container, Button } from '../components/ui';
import SectionLabel from '../components/sections/home/SectionLabel';
import useDocumentTitle from '../lib/hooks/useDocumentTitle';
import { staggerContainer, fadeUpItem } from '../lib/motion/presets';

/**
 * PagePlaceholder — reusable coming-soon page for routes whose full
 * content has not been built yet. Keeps navigation working without
 * crashes, preserves the design system, and signals the page is coming.
 *
 * Pass `title`, `eyebrow`, `description`, and an optional `navLabel`
 * (the nav link to highlight in the heading).
 */
export default function PagePlaceholder({ eyebrow, title, description }) {
  useDocumentTitle(`${title} — InnoSpeak Global`);
  const container = staggerContainer(0.12, 0.1);

  return (
    <motion.section
      aria-label={title}
      variants={container}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden bg-gradient-to-b from-light-gray via-white to-light-gray pb-28 pt-40 md:pt-48"
    >
      {/* Soft ambient glows */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-navy/5 blur-3xl" aria-hidden="true" />

      <Container className="relative">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <motion.div variants={fadeUpItem}>
            <SectionLabel>{eyebrow}</SectionLabel>
          </motion.div>

          <motion.h1
            variants={fadeUpItem}
            className="mt-6 text-h1 font-serif font-bold leading-[1.1] text-navy"
          >
            {title}
          </motion.h1>

          <motion.p
            variants={fadeUpItem}
            className="mt-6 max-w-xl text-base leading-relaxed text-body md:text-lg"
          >
            {description}
          </motion.p>

          <motion.div variants={fadeUpItem} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button to="/" variant="primary" size="md">
              Back to Home
            </Button>
            <Button to="/academy" variant="secondary" size="md" withArrow={false}>
              Explore Academy
            </Button>
          </motion.div>

          {/* Coming soon badge */}
          <motion.div
            variants={fadeUpItem}
            className="mt-14 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-2 text-sm font-semibold text-gold"
          >
            <ArrowRight size={16} className="text-gold" aria-hidden="true" />
            Full page coming soon
          </motion.div>
        </div>
      </Container>
    </motion.section>
  );
}
