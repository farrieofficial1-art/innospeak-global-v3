import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { applyConsent, getAnalyticsConsent, setAnalyticsConsent, trackEvent } from '../../lib/analytics.js';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const consent = getAnalyticsConsent();
    if (!consent) {
      applyConsent('denied');
      setVisible(true);
    } else {
      applyConsent(consent);
    }
  }, []);

  useEffect(() => {
    if (getAnalyticsConsent() === 'granted') {
      trackEvent('page_view', { page_path: location.pathname + location.search });
    }
  }, [location.pathname, location.search]);

  if (!visible) return null;

  function choose(consent) {
    setAnalyticsConsent(consent);
    setVisible(false);
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-xl rounded-2xl border border-navy-100 bg-white p-4 shadow-premium-lg sm:left-auto sm:right-4" role="dialog" aria-modal="false" aria-labelledby="analytics-consent-title" aria-describedby="analytics-consent-description">
      <h2 id="analytics-consent-title" className="font-body text-sm font-bold text-navy-900">Analytics consent</h2>
      <p id="analytics-consent-description" className="mt-1 font-body text-xs leading-5 text-navy-600">
        We use Google Analytics to understand how this site is used. Analytics cookies are disabled until you accept.
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => choose('granted')} className="btn-gold px-4 py-2 text-xs">Accept</button>
        <button type="button" onClick={() => choose('denied')} className="rounded-xl border border-navy-200 px-4 py-2 font-body text-xs font-bold text-navy-700">Reject</button>
      </div>
    </div>
  );
}
