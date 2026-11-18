import Seo from '../components/ui/Seo.jsx';
import Accordion from '../components/ui/Accordion.jsx';
import { FAQ_ITEMS } from '../components/home/faqData.js';
import { Link } from 'react-router-dom';
import HeroBackground from '../components/ui/HeroBackground.jsx';

const HOW_IT_WORKS = [
  ['Choose a pathway', 'Explore Academy, Labs, CBE or Foundation programmes.'],
  ['Review the requirements', 'Confirm level, format, prerequisites, fees and support options.'],
  ['Apply or enquire', 'Submit an application or contact an advisor for course availability.'],
  ['Begin learning', 'Complete onboarding and follow the published course or programme workflow.'],
];

export default function FAQ() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <Seo
        title="Frequently Asked Questions"
        description="Answers to common InnoSpeak Global learning and admissions questions."
        path="/faq"
        jsonLd={faqJsonLd}
      />
      <section className="relative overflow-hidden bg-navy-gradient text-white">
        <HeroBackground />
        <div className="container-premium relative z-10 py-20">
          <p className="font-body text-xs font-bold uppercase tracking-[0.22em] text-gold-300">Help Centre</p>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 max-w-2xl font-body leading-7 text-white/70">
            Find answers about programmes, delivery, certificates, applications and learning.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-premium">
          <p className="font-body text-xs font-bold uppercase tracking-[0.22em] text-gold-700">How It Works</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy-900">A clear path from interest to learning</h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map(([title, description], index) => (
              <li key={title} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-premium">
                <p className="font-mono text-2xl font-bold text-gold-600">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-4 font-display text-base font-bold text-navy-900">{title}</h3>
                <p className="mt-2 font-body text-sm leading-6 text-navy-500">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-premium max-w-4xl py-14">
        <div className="rounded-3xl border border-navy-100 bg-white px-6 py-3 shadow-sm sm:px-10">
          <Accordion items={FAQ_ITEMS} />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/contact" className="btn-gold text-sm">Contact Us</Link>
          <Link to="/apply" className="btn-outline text-sm">Apply Now</Link>
        </div>
      </section>
    </>
  );
}
