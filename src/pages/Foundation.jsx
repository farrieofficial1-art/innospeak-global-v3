import Seo from '../components/ui/Seo.jsx';
import FoundationHero from '../components/sections/foundation/FoundationHero.jsx';
import FoundationImpact from '../components/sections/foundation/FoundationImpact.jsx';
import FocusAreas from '../components/sections/foundation/FocusAreas.jsx';
import UpcomingEvents from '../components/sections/foundation/UpcomingEvents.jsx';
import HowSupportWorks from '../components/sections/foundation/HowSupportWorks.jsx';
import Transparency from '../components/sections/foundation/Transparency.jsx';
import FoundationStories from '../components/sections/foundation/FoundationStories.jsx';
import FoundationFAQ from '../components/sections/foundation/FoundationFAQ.jsx';
import FoundationClosingCTA from '../components/sections/foundation/FoundationClosingCTA.jsx';

export default function Foundation() {
  return (
    <>
      <Seo
        title="InnoSpeak Global Foundation — Opening Doors to Learning, Skills & Opportunity"
        description="The InnoSpeak Global Foundation removes barriers to education, technology, STEM and community opportunity through eleven sponsor-ready programmes."
        path="/foundation"
      />

      {/* ACT 1 — Attention */}
      <FoundationHero />

      {/* ACT 2 — Proof */}
      <FoundationImpact />

      {/* ACT 3 — Programmes (sponsor-ready) */}
      <FocusAreas />

      {/* ACT 4 — Upcoming events & opportunities */}
      <UpcomingEvents />

      {/* ACT 5 — Process (how support works) */}
      <HowSupportWorks />

      {/* ACT 6 — Accountability */}
      <Transparency />

      {/* ACT 7 — Stories from the field */}
      <FoundationStories />

      {/* ACT 8 — Objections */}
      <FoundationFAQ />

      {/* ACT 9 — Close */}
      <FoundationClosingCTA />
    </>
  );
}
