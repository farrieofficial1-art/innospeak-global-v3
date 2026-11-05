import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import ScrollToTop from './ScrollToTop.jsx';

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-gold-500" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <ScrollToTop />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
