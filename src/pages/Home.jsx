import Seo from '../components/ui/Seo.jsx';

import Hero from '../components/home/Hero.jsx';
import AnnouncementBanner from '../components/home/AnnouncementBanner.jsx';
import WhyChoose from '../components/home/WhyChoose.jsx';
import Ecosystem from '../components/home/Ecosystem.jsx';
import Pathways from '../components/home/Pathways.jsx';
import LabsPromotion from '../components/home/LabsPromotion.jsx';
import Impact from '../components/home/Impact.jsx';
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

      {/* Who We Are */}
      <WhyChoose />

      {/* Our Ecosystem — three pillars expanded */}
      <Ecosystem />

      {/* Programs / Learning Pathways */}
      <Pathways />

      {/* Practical Innovation / Labs */}
      <LabsPromotion />

      {/* Foundation / Impact */}
      <Impact />

      {/* Apply / Get Started */}
      <ClosingCTA />
    </>
  );
}
