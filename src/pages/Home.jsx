import Seo from '../components/ui/Seo.jsx';

import AnnouncementBanner from '../components/home/AnnouncementBanner.jsx';
import Hero from '../components/home/Hero.jsx';
import PromotionRail from '../components/home/PromotionRail.jsx';

import WhyChoose from '../components/home/WhyChoose.jsx';
import Ecosystem from '../components/home/Ecosystem.jsx';

import Pathways from '../components/home/Pathways.jsx';
import CertificatePreview from '../components/home/CertificatePreview.jsx';
import FreeCoursesTeaser from '../components/home/FreeCoursesTeaser.jsx';
import NewCourses from '../components/home/NewCourses.jsx';

import LearningJourney from '../components/home/LearningJourney.jsx';
import LearningEcosystem from '../components/home/LearningEcosystem.jsx';
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

      <div className="pt-20">
        <AnnouncementBanner />
      </div>
      <Hero />
      <PromotionRail />

      <WhyChoose />
      <Ecosystem />

      <Pathways />
      <CertificatePreview />
      <FreeCoursesTeaser />
      <NewCourses />

      <LearningJourney />
      <LearningEcosystem />
      <LabsPromotion />

      <Impact />
      <Partners />
      <Testimonials />

      <FAQ />
      <ClosingCTA />
    </>
  );
}
