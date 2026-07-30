import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading.jsx';
import LogoMarquee from './LogoMarquee.jsx';
import FeatureCard from './FeatureCard.jsx';

export default function Trusted() {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="container-premium">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-body text-sm font-medium uppercase tracking-wider text-navy-500"
        >
          Trusted by learners and institutions worldwide
        </motion.p>

        <div className="mt-8">
          <LogoMarquee />
        </div>

        <div className="mt-10">
          <FeatureCard />
        </div>
      </div>
    </section>
  );
}
