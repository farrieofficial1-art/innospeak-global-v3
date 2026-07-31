import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const CHANNELS = [
  { icon: Mail, label: 'Email Us', value: 'hello@innospeak.global', href: 'mailto:hello@innospeak.global' },
  { icon: Phone, label: 'Call Us', value: '+1 (000) 000-0000', href: 'tel:+10000000000' },
  { icon: MapPin, label: 'Find Us', value: 'Global · Remote & On-site', href: null },
];

export default function ContactInfo() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {CHANNELS.map(({ icon: Icon, label, value, href }) => {
        const content = (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
              <Icon size={22} aria-hidden="true" />
            </div>
            <p className="mt-4 font-body text-xs font-medium uppercase tracking-wider text-navy-400">{label}</p>
            <p className="mt-1 font-body text-sm font-bold text-navy-900">{value}</p>
          </>
        );

        const className =
          'flex flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg';

        return (
          <motion.div key={label} variants={fadeUpItem} initial="hidden" whileInView="visible" viewport={inViewOnce}>
            {href ? (
              <a href={href} className={className}>
                {content}
              </a>
            ) : (
              <div className={className}>{content}</div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}