import { motion } from 'framer-motion';
import { Award, FileText, Briefcase } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

/**
 * Certification — what learners receive after successful completion.
 *
 * Same three cards as before (digital certificates, transcripts,
 * career portfolio), restyled on the same premium-card recipe as
 * AboutAcademy/EcosystemCard/WhyChooseCard: solid bg-white,
 * shadow-premium -> shadow-premium-lg, navy-900/gold-400 icon badge
 * inverting to gold-gradient on hover.
 */

const CERTIFICATES = [
  {
    icon: Award,
    title: 'Digital Certificates',
    description: 'Verified, shareable digital certificates that validate your achievements and skills.',
  },
  {
    icon: FileText,
    title: 'Professional Transcripts',
    description: 'Detailed transcripts documenting the modules, assessments and outcomes you completed.',
  },
  {
    icon: Briefcase,
    title: 'Career Portfolio',
    description: 'A curated portfolio of projects and evidence that showcases your real-world capability.',
  },
];

const container = staggerContainer(0.12, 0.1);

function CertCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      variants={fadeUpItem}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-7 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
        <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <h3 className="mt-5 font-display text-lg font-bold text-navy-900">{title}</h3>
      <p className="mt-3 font-body text-sm leading-relaxed text-navy-600">{description}</p>
    </motion.div>
  );
}

export default function Certification() {
  return (
    <section aria-label="Certification" className="bg-cream py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Certification"
          title="Recognised Credentials for Every Step"
          subtitle="On successful completion of your programme, you receive a portfolio of credentials that document your growth and open new doors."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {CERTIFICATES.map((cert) => (
            <CertCard key={cert.title} {...cert} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}