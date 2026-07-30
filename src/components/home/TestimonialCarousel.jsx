import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from './testimonialsData.js';

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (dir) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[index];

  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-3xl border border-navy-100 bg-white p-8 shadow-premium sm:p-12">
        <Quote size={40} className="text-gold-500/30" />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mt-6 flex gap-1">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star key={i} size={18} className="fill-gold-500 text-gold-500" />
              ))}
            </div>

            <p className="mt-5 font-display text-lg font-medium leading-relaxed text-navy-800 sm:text-xl">
              {current.quote}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <img
                src={current.image}
                alt={current.name}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-gold-300"
              />
              <div>
                <div className="font-display text-base font-bold text-navy-900">
                  {current.name}
                </div>
                <div className="font-body text-sm text-navy-500">
                  {current.role}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => paginate(-1)}
          aria-label="Previous testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-700 transition-all hover:border-gold-400 hover:text-gold-600"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-8 bg-gold-500' : 'w-2 bg-navy-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => paginate(1)}
          aria-label="Next testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-700 transition-all hover:border-gold-400 hover:text-gold-600"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
