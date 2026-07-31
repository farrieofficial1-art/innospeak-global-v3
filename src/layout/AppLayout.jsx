import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar, Footer } from '../components/layout';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import ScrollToTop from './ScrollToTop.jsx';
import TutorWidget from '../tutor/TutorWidget.jsx';


/**
 * AppLayout — the persistent shell wrapping every routed page.
 *
 * Renders the Navbar and Footer once and animates the page content in
 * `<Outlet>` via Framer Motion whenever the route changes. The
 * `key` on the motion wrapper (driven by the pathname) retriggers the
 * enter/exit transition between routes. A Suspense boundary around
 * the Outlet lets lazy-loaded pages resolve without crashing.
 */
export default function AppLayout() {
  const { pathname } = useLocation();

  // Move focus and scroll to top on route change for accessibility.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const main = document.getElementById('main-content');
    if (main) main.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      {/* Skip link for keyboard / screen-reader users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense fallback={null}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      <Outlet />
      </main>
      <Footer />
      <TutorWidget />
    </div>
  );
}
