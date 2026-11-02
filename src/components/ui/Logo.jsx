import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Wordmark({ light = false }) {
  return (
    <span className="inline-flex flex-col leading-none">
      <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">
        <span className={light ? 'text-gold-400' : 'text-gold-500'}>Inno</span>
        <span className={light ? 'text-white' : 'text-navy-900'}>Speak</span>
      </span>
      <span className={`mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.35em] ${light ? 'text-white/50' : 'text-navy-500'}`}>
        Global
      </span>
    </span>
  );
}

export default function Logo({ className = '', onClick, light = false }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`group inline-flex items-center ${className}`}
      aria-label="InnoSpeak Global — home"
    >
      <motion.span
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center"
      >
        <Wordmark light={light} />
      </motion.span>
    </Link>
  );
}
