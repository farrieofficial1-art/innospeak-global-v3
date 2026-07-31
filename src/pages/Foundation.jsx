
import Seo from '../components/ui/Seo.jsx';
import FoundationHero from '../components/sections/foundation/FoundationHero.jsx';
import FocusAreas from '../components/sections/foundation/FocusAreas.jsx';
import WaysToGive from '../components/sections/foundation/WaysToGive.jsx';
import FoundationClosingCTA from '../components/sections/foundation/FoundationClosingCTA.jsx';

export default function Foundation() {
  return (
    <>
      <Seo
        title="InnoSpeak Global Foundation"
        description="A dedicated initiative providing scholarships, community outreach and youth empowerment programmes to make quality education accessible to all."
        path="/foundation"
      />
      <FoundationHero />
      <FocusAreas />
      <WaysToGive />
      <FoundationClosingCTA />
    </>
  );
}