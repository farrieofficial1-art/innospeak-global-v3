import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import TestimonialCarousel from './TestimonialCarousel.jsx';
import TestimonialHighlights from './TestimonialHighlights.jsx';
import Button from '../ui/Button.jsx';

export default function Testimonials() {
  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Student Success Stories"
          title="Hear From Our Learners"
          subtitle="Real stories from real people whose lives and careers have been transformed through InnoSpeak Global programmes."
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="mt-12"
        >
          <TestimonialCarousel />
        </motion.div>

        <div className="mt-12">
          <TestimonialHighlights />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 overflow-hidden rounded-3xl bg-navy-gradient p-8 text-center shadow-premium-lg sm:p-12"
        >
          <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Ready to Write Your Success Story?
          </h3>
          <p className="mx-auto mt-3 max-w-xl font-body text-sm text-navy-200 sm:text-base">
            Join hundreds of learners who have transformed their communication, technical and leadership skills with InnoSpeak Global.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button to="/apply" variant="gold" size="lg" className="group">
              Apply Now
              <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:border-gold-400 hover:text-gold-400"
            >
              Talk to Us
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
