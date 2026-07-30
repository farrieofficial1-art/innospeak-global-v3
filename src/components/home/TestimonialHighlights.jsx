import { motion } from 'framer-motion';
import useCountUp from '../../hooks/useCountUp.js';
import useInView from '../../hooks/useInView.js';
import { TESTIMONIAL_HIGHLIGHTS } from './testimonialsData.js';

function HighlightItem({ item, index }) {
  const [ref, inView] = useInView();
  const animated = useCountUp(item.value, 2000, inView);
  const display = item.textValue || (item.value === 0 ? '' : `${animated}${item.suffix}`);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="flex flex-col items-center rounded-2xl border border-navy-100 bg-white px-6 py-8 text-center shadow-premium"
    >
      <div className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">
        {display}
      </div>
      <div className="mt-2 font-body text-sm text-navy-600">
        {item.label}
      </div>
    </motion.div>
  );
}

export default function TestimonialHighlights() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {TESTIMONIAL_HIGHLIGHTS.map((item, i) => (
        <HighlightItem key={item.id} item={item} index={i} />
      ))}
    </div>
  );
}
