import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { NAV_LINKS, NAV_CTA } from '../../lib/nav';
import { Logo } from '../ui';

/**
 * MobileMenu — full-screen animated navigation overlay.
 *
 * Fades and slides in over the viewport with staggered link entries and
 * large, touch-friendly targets. A large gold "Apply Now" button sits at
 * the foot of the menu. Body scroll is locked by the parent Navbar while
 * the overlay is open, and selecting any link closes the menu via the
 * shared `onNavigate` handler.
 */

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

const panelVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.07, delayChildren: 0.1, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

export default function MobileMenu({ open, onNavigate }) {
  const { pathname } = useLocation();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-40 flex flex-col bg-white/97 backdrop-blur-2xl lg:hidden"
        >
          {/* Subtle accent line under the header */}
          <div className="absolute inset-x-0 top-[88px] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          {/* Brand row — matches the 88px navbar height */}
          <div className="container-px flex h-[88px] items-center justify-between">
            <Logo onClick={onNavigate} />
          </div>

          <motion.nav
            variants={panelVariants}
            className="container-px flex flex-1 flex-col pb-10"
            aria-label="Mobile"
          >
            <ul className="flex flex-col gap-1 pt-4">
              {NAV_LINKS.map((link) => {
                const active = link.end
                  ? pathname === link.to
                  : pathname.startsWith(link.to);
                return (
                  <motion.li key={link.to} variants={itemVariants}>
                    <NavLink
                      to={link.to}
                      end={link.end}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center justify-between rounded-2xl px-5 py-5 text-2xl font-medium transition-colors duration-300 ${
                        active
                          ? 'bg-navy/[0.05] text-navy'
                          : 'text-navy/70 hover:bg-navy/[0.03] hover:text-navy'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`h-1.5 w-1.5 rounded-full bg-gold transition-opacity duration-300 ${
                            active ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                        {link.label}
                      </span>
                      <ArrowRight
                        size={20}
                        className={`text-navy/30 transition-opacity duration-300 ${
                          active ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </NavLink>
                  </motion.li>
                );
              })}
            </ul>

            <motion.div variants={itemVariants} className="mt-auto pt-8">
              <Link
                to={NAV_CTA.to}
                onClick={onNavigate}
                className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-gold px-8 py-4 text-base font-semibold text-navy shadow-navy transition-all duration-300 ease-out-expo hover:bg-gold-400 hover:shadow-gold-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                <span>{NAV_CTA.label}</span>
                <ArrowRight
                  size={20}
                  className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
