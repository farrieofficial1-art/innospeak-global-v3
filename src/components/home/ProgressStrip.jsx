import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { JOURNEY_PROGRESS } from './journeyData.js';

export default function ProgressStrip() {
  return (
    <div className="overflow-hidden rounded-2xl bg-navy-gradient shadow-premium-lg">
      <div className="grid gap-px bg-navy-700/40 sm:grid-cols-2 lg:grid-cols-4">
        {JOURNEY_PROGRESS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="flex items-center gap-3 bg-navy-900/80 px-6 py-6"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-gradient text-navy-900">
              <Check size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display text-sm font-semibold text-white">
                {item.label}
              </div>
              <div className="mt-1 h-1 w-full rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                  className="h-1 rounded-full bg-gold-gradient"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
