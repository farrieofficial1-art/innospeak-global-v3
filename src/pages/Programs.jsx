import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import Container from '../components/ui/Container.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import EcosystemCard from '../components/home/EcosystemCard.jsx';
import { ECOSYSTEM_CARDS, ECOSYSTEM_STATEMENT } from '../components/home/ecosystemData.js';

export default function Programs() {
  return (
    <>
      <Seo
        title="All Programs"
        description="Explore InnoSpeak Global Academy, Labs, Career Hub and Foundation programs."
        path="/programs"
      />

      <section className="relative overflow-hidden bg-navy-radial pt-32 pb-16">
        <div className="absolute inset-0 bg-navy-gradient opacity-90" aria-hidden="true" />
        <Container className="relative">
          <div className="max-w-3xl">
            <span className="eyebrow bg-gold-500/15 text-gold-300">
              <Compass size={14} aria-hidden="true" />
              Explore InnoSpeak
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              All Programs
            </h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-white/75 sm:text-lg">
              Choose a starting point for learning, hands-on projects, career growth,
              or community support. Each program connects to the next step in your journey.
            </p>
            <Link
              to="/academy"
              className="btn-gold mt-7 inline-flex items-center gap-2"
            >
              Browse Academy courses
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="One connected journey"
            title="Find the program that fits your next step."
            subtitle="Build skills, put them into practice, connect your work to opportunity, and help communities thrive."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {ECOSYSTEM_CARDS.map((card, index) => (
              <EcosystemCard key={card.id} card={card} index={index} />
            ))}
          </div>
          <p className="mx-auto mt-12 max-w-3xl text-center font-display text-base font-medium italic leading-relaxed text-navy-600 sm:text-lg">
            {ECOSYSTEM_STATEMENT}
          </p>
        </Container>
      </section>
    </>
  );
}
