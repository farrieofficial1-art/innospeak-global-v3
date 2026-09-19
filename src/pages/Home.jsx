import Seo from '../components/ui/Seo.jsx';

import Hero from '../components/home/Hero.jsx';
import AnnouncementBanner from '../components/home/AnnouncementBanner.jsx';
import PromotionRail from '../components/home/PromotionRail.jsx';
import Trusted from '../components/home/Trusted.jsx';
import HighlightStrip from '../components/home/HighlightStrip.jsx';
import WhyChoose from '../components/home/WhyChoose.jsx';
import Ecosystem from '../components/home/Ecosystem.jsx';
import FeaturedLearning from '../components/home/FeaturedLearning.jsx';
import Pathways from '../components/home/Pathways.jsx';
import LearningEcosystem from '../components/home/LearningEcosystem.jsx';
import LearningJourney from '../components/home/LearningJourney.jsx';
import LabsPromotion from '../components/home/LabsPromotion.jsx';
import Impact from '../components/home/Impact.jsx';
import Partners from '../components/home/Partners.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import FAQ from '../components/home/FAQ.jsx';
import ClosingCTA from '../components/home/ClosingCTA.jsx';

export default function Home() {
  return (
    <>
      <Seo
        title="InnoSpeak Global — Learn. Build. Innovate. Make an Impact."
        description="A connected ecosystem of structured learning, practical innovation, and educational support."
        path="/"
      />

      <div className="pt-20"><AnnouncementBanner /></div>

      {/* Hero — communicates the three pillars + clear CTAs */}
      <Hero />

      {/* Quick promotion rail — bridges hero into the page */}
      <PromotionRail />

      {/* Who We Are — trust signals */}
      <Trusted />

      {/* What InnoSpeak Global Does — highlights */}
      <HighlightStrip />

      {/* Who We Are — why choose us */}
      <WhyChoose />

      {/* Our Ecosystem — three pillars expanded */}
      <Ecosystem />

      {/* Learning / Programs / Pathways — featured courses */}
      <FeaturedLearning />

      {/* Learning / Programs / Pathways — pathways */}
      <Pathways />

      {/* What InnoSpeak Global Does — connected learner journey */}
      <LearningEcosystem />

      {/* Learning journey stages */}
      <LearningJourney />

      {/* Labs / Practical Innovation */}
      <LabsPromotion />

      {/* Foundation / Impact */}
      <Impact />

      {/* Career / Opportunities — partners */}
      <Partners />

      {/* Career / Opportunities — testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* Apply / Get Started */}
      <ClosingCTA />
    </>
  );
}
