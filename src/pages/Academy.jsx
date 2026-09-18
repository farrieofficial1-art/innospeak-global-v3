import Seo from '../components/ui/Seo.jsx';
import AcademyHero from '../components/sections/academy/AcademyHero.jsx';
import AboutAcademy from '../components/sections/academy/AboutAcademy.jsx';
import ProgrammeCatalogue from '../components/sections/academy/ProgrammeCatalogue.jsx';
import LearningModel from '../components/sections/academy/LearningModel.jsx';
import LearningPathways from '../components/sections/academy/LearningPathways.jsx';
import Certification from '../components/sections/academy/Certification.jsx';
import CareerOpportunities from '../components/sections/academy/CareerOpportunities.jsx';
import WhyStudyWithUs from '../components/sections/academy/WhyStudyWithUs.jsx';
import WhoItIsFor from '../components/sections/academy/WhoItIsFor.jsx';
import FAQ from '../components/sections/academy/FAQ.jsx';
import FinalCTA from '../components/sections/academy/FinalCTA.jsx';
import CbeAcademy from '../components/sections/academy/CbeAcademy.jsx';

export default function Academy() {
  return (
    <>
      <Seo
        title="InnoSpeak Academy"
        description="Develop world-class communication, technical and professional skills through InnoSpeak Academy."
        path="/academy"
      />

      <AcademyHero />
      <AboutAcademy />
      <ProgrammeCatalogue />
      <CbeAcademy />
      <LearningModel />
      <LearningPathways />
      <Certification />
      <CareerOpportunities />
      <WhyStudyWithUs />
      <WhoItIsFor />
      <FAQ />
      <FinalCTA />
    </>
  );
}