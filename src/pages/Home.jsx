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
import PromotionRail from '../components/home/PromotionRail.jsx';
import FeaturedLearning from '../components/home/FeaturedLearning.jsx';
import LearningEcosystem from '../components/home/LearningEcosystem.jsx';
import AnnouncementBanner from '../components/home/AnnouncementBanner.jsx';

export default function Home() {
  return (
    <>
      <Seo
        title="InnoSpeak Global"
        description="Empowering learners through communication, innovation, technology and leadership."
        path="/"
      />

      <div className="pt-20"><AnnouncementBanner /></div>
      <Hero />
      <PromotionRail />
      <Trusted />
      <HighlightStrip />
      <WhyChoose />
      <Pathways />
      <FeaturedLearning />
      <LearningEcosystem />
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
