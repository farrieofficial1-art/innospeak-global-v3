import { GA4_MEASUREMENT_ID } from '../config/analytics.js';

const CONSENT_KEY = 'innospeak.analytics.consent.v1';

export function getAnalyticsConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(consent) {
  try {
    window.localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    return;
  }
  applyConsent(consent);
}

export function applyConsent(consent) {
  if (typeof window === 'undefined') return;
  window.gtag = window.gtag || function gtag() {
    (window.gtag.q = window.gtag.q || []).push(arguments);
  };
  window.gtag('consent', 'update', {
    analytics_storage: consent === 'granted' ? 'granted' : 'denied',
    ad_storage: 'denied',
  });
  if (consent === 'granted') loadGa4();
}

function loadGa4() {
  if (!GA4_MEASUREMENT_ID || document.querySelector(`script[data-ga4="${GA4_MEASUREMENT_ID}"]`)) return;
  const script = document.createElement('script');
  script.async = true;
  script.dataset.ga4 = GA4_MEASUREMENT_ID;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
  window.gtag('js', new Date());
  window.gtag('config', GA4_MEASUREMENT_ID, { anonymize_ip: true });
}

export function trackEvent(name, parameters = {}) {
  if (getAnalyticsConsent() !== 'granted' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, parameters);
}
