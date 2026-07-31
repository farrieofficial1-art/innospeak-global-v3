import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import useScrolled from '../../hooks/useScrolled.js';
import logo from '../../assets/logo/logo.png';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Academy', to: '/academy' },
  { label: 'Foundation', to: '/foundation' },
  { label: 'Labs', to: '/labs' },
  { label: 'Founder', to: '/founder' },
  { label: 'Impact', to: '/impact' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const scrolled = useScrolled(50);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const linkBase = 'font-body text-sm font-medium transition-colors duration-200';
  const linkIdle = scrolled ? 'text-navy-700 hover:text-gold-600' : 'text-white hover:text-gold-400';
  const linkActive = scrolled ? 'text-gold-600' : 'text-gold-400';
  const wordmarkColor = scrolled ? 'text-navy-900' : 'text-white';
  const menuIconColor = scrolled ? 'text-navy-900 hover:bg-navy-50' : 'text-white hover:bg-white/10';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-navy-100 bg-white/90 shadow-premium backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="container-premium flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group flex items-center" onClick={() => setMobileOpen(false)}>
          <img
            src={logo}
            alt="InnoSpeak Global"
            className="mr-2 h-10 w-10 select-none"
            draggable={false}
          />
          <span className={`font-display text-xl font-bold tracking-tight transition-colors duration-300 sm:text-2xl ${wordmarkColor}`}>
            InnoSpeak
          </span>
          <span className="ml-1 inline-block h-2 w-2 rounded-full bg-gold-gradient shadow-gold transition-transform duration-300 group-hover:scale-125" />
          <span className={`ml-2 font-display text-xl font-bold tracking-tight transition-colors duration-300 sm:text-2xl ${wordmarkColor}`}>
            Global
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`${linkBase} ${linkIdle} ${active ? linkActive : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Link to="/apply" className="btn-gold">
            Apply Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className={`inline-flex items-center justify-center rounded-lg p-2 transition-colors lg:hidden ${menuIconColor}`}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-navy-100 bg-white shadow-premium-lg lg:hidden"
          >
            <ul className="container-premium flex flex-col gap-1 py-4">
              {navLinks.map((link) => {
                const active = pathname === link.to;
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-lg px-4 py-3 font-body text-sm font-medium transition-colors ${
                        active
                          ? 'bg-gold-500/10 text-gold-700'
                          : 'text-navy-700 hover:bg-navy-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="mt-2">
                <Link
                  to="/apply"
                  onClick={() => setMobileOpen(false)}
                  className="btn-gold w-full"
                >
                  Apply Now
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}