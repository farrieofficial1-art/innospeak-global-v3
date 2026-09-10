import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, UserCircle2, ShieldCheck, ChevronDown, GraduationCap, BookOpen } from 'lucide-react';
import useScrolled from '../../hooks/useScrolled.js';
import { useAuth } from '../../context/AuthContext.jsx';
import logo from '../../assets/logo/logo.png';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Academy', to: '/academy' },
  { label: 'Programs', to: '/programs' },
  { label: 'Labs', to: '/labs' },
  { label: 'Career Hub', to: '/career-hub' },
  { label: 'Contact', to: '/contact' },
];

const aboutLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Our Founder', to: '/founder' },
  { label: 'Foundation', to: '/foundation' },
  { label: 'Our Impact', to: '/impact' },
];

export default function Navbar() {
  const scrolled = useScrolled(50);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const accountRef = useRef(null);
  const aboutRef = useRef(null);
  const { pathname } = useLocation();
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const isInstructor = ['admin', 'lms_admin', 'instructor'].includes(profile?.role);

  useEffect(() => {
    function onClickOutside(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
      if (aboutRef.current && !aboutRef.current.contains(e.target)) setAboutOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const aboutActive = aboutLinks.some((l) => pathname === l.to);

  const inLmsOrPortalOrAdmin = pathname.startsWith('/portal') || pathname.startsWith('/learn') || pathname.startsWith('/teach') || pathname.startsWith('/admin');

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
        <ul className="hidden items-center gap-6 lg:flex">
          <li>
            <Link
              to={navLinks[0].to}
              className={`${linkBase} ${linkIdle} ${pathname === navLinks[0].to ? linkActive : ''}`}
            >
              {navLinks[0].label}
            </Link>
          </li>

          <li className="relative" ref={aboutRef}>
            <button
              type="button"
              onClick={() => setAboutOpen((v) => !v)}
              className={`flex items-center gap-1 ${linkBase} ${linkIdle} ${aboutActive ? linkActive : ''}`}
            >
              About
              <ChevronDown size={13} className={`transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {aboutOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-3 w-48 overflow-hidden rounded-xl border border-navy-100 bg-white py-2 shadow-premium-lg"
                >
                  {aboutLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setAboutOpen(false)}
                      className={`block px-4 py-2.5 font-body text-sm font-medium text-navy-700 hover:bg-navy-50 ${
                        pathname === link.to ? 'text-gold-600' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {navLinks.slice(1).map((link) => {
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
        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className={`flex items-center gap-1.5 ${linkBase} ${linkIdle} ${inLmsOrPortalOrAdmin ? linkActive : ''}`}
              >
                <UserCircle2 size={17} />
                My Account
                <ChevronDown size={14} className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-navy-100 bg-white py-2 shadow-premium-lg"
                  >
                    <Link
                      to="/portal"
                      onClick={() => setAccountOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 font-body text-sm font-medium text-navy-700 hover:bg-navy-50 ${
                        pathname === '/portal' ? 'text-gold-600' : ''
                      }`}
                    >
                      <UserCircle2 size={16} />
                      Student Portal
                    </Link>
                    <Link
                      to="/learn"
                      onClick={() => setAccountOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 font-body text-sm font-medium text-navy-700 hover:bg-navy-50 ${
                        pathname.startsWith('/learn') ? 'text-gold-600' : ''
                      }`}
                    >
                      <BookOpen size={16} />
                      E-Learning
                    </Link>
                    {isInstructor && (
                      <Link
                        to="/teach"
                        onClick={() => setAccountOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 font-body text-sm font-medium text-navy-700 hover:bg-navy-50 ${
                          pathname.startsWith('/teach') ? 'text-gold-600' : ''
                        }`}
                      >
                        <GraduationCap size={16} />
                        Teach
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setAccountOpen(false)}
                        className={`flex items-center gap-2.5 border-t border-navy-50 px-4 py-2.5 font-body text-sm font-medium text-navy-700 hover:bg-navy-50 ${
                          pathname.startsWith('/admin') ? 'text-gold-600' : ''
                        }`}
                      >
                        <ShieldCheck size={16} />
                        Staff Panel
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className={`flex items-center gap-1.5 ${linkBase} ${linkIdle} ${pathname === '/login' ? linkActive : ''}`}
            >
              <UserCircle2 size={17} />
              Student Login
            </Link>
          )}
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
              {[navLinks[0], ...aboutLinks, ...navLinks.slice(1)].map((link) => {
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
              <li className="mt-2 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      to="/portal"
                      onClick={() => setMobileOpen(false)}
                      className="btn-outline w-full"
                    >
                      Student Portal
                    </Link>
                    <Link
                      to="/learn"
                      onClick={() => setMobileOpen(false)}
                      className="btn-outline w-full"
                    >
                      E-Learning
                    </Link>
                    {isInstructor && (
                      <Link
                        to="/teach"
                        onClick={() => setMobileOpen(false)}
                        className="btn-outline w-full"
                      >
                        Teach
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="btn-outline w-full"
                      >
                        Staff Panel
                      </Link>
                    )}
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-outline w-full"
                  >
                    Student Login
                  </Link>
                )}
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