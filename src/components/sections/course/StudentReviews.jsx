import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const container = staggerContainer(0.1, 0.05);

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function StudentReviews({ course }) {
  const reviews = course.reviews || [];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="Student Reviews"
            title="What Our Students Say"
            subtitle="Real stories from learners who completed this course."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                variants={fadeUpItem}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col rounded-2xl border border-navy-100 bg-cream p-7 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg"
              >
                <Quote size={28} className="text-gold-300" aria-hidden="true" />

                <div className="mt-3 flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={16}
                      className={s < review.rating ? 'fill-gold-500 text-gold-500' : 'text-navy-100'}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <p className="mt-4 flex-1 font-body text-sm leading-relaxed text-navy-600">&ldquo;{review.text}&rdquo;</p>

                <div className="mt-6 flex items-center gap-3 border-t border-navy-100 pt-5">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-navy-900 font-bold text-gold-400">
                    {getInitials(review.name)}
                  </div>
                  <div>
                    <p className="font-body text-sm font-bold text-navy-900">{review.name}</p>
                    <p className="font-body text-xs text-navy-400">{review.country}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}