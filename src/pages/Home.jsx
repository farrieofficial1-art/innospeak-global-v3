import Seo from '../components/ui/Seo.jsx';

import Hero from '../components/home/Hero.jsx';
import Trusted from '../components/home/Trusted.jsx';
import HighlightStrip from '../components/home/HighlightStrip.jsx';
import WhyChoose from '../components/home/WhyChoose.jsx';
import Pathways from '../components/home/Pathways.jsx';
import LearningJourney from '../components/home/LearningJourney.jsx';
import Ecosystem from '../components/home/Ecosystem.jsx';
import Impact from '../components/home/Impact.jsx';
import Partners from '../components/home/Partners.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import FAQ from '../components/home/FAQ.jsx';
import ClosingCTA from '../components/home/ClosingCTA.jsx';

export default function Home() {
  return (
    <>
      <Seo
        title="InnoSpeak Global"
        description="Empowering learners through communication, innovation, technology and leadership."
        path="/"
      />

      <Hero />
      <Trusted />
      <HighlightStrip />
      <WhyChoose />
      <Pathways />
      <LearningJourney />
      <Ecosystem />
      <Impact />
      <Partners />
      <Testimonials />
      <FAQ />
      <ClosingCTA />
    </>
  );
}
