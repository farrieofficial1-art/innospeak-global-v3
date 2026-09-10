import { ArrowRight, BriefcaseBusiness, FlaskConical, GraduationCap, LibraryBig, Medal, MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading.jsx';

const items = [
  ['Learn', 'Structured courses, lessons, assignments and assessments.', '/learn', GraduationCap],
  ['Practice', 'Hands-on labs and project work that turn knowledge into evidence.', '/labs', FlaskConical],
  ['Connect', 'Sessions, discussions, instructors and mentorship around your learning.', '/community', MessageSquareText],
  ['Prove', 'Certificates, competencies and a portfolio of work you can share.', '/career-hub', Medal],
  ['Grow', 'Career pathways, opportunities and professional development.', '/career-hub', BriefcaseBusiness],
  ['Explore', 'Resources and learning opportunities across the academy.', '/academy', LibraryBig],
];

export default function LearningEcosystem() {
  return (
    <section className="bg-navy-950 py-20 text-white sm:py-24">
      <div className="container-premium">
        <SectionHeading eyebrow="One connected learning ecosystem" title="Not just courses. A complete learner journey." subtitle="InnoSpeak connects discovery, learning, practical work, assessment, evidence and career development in one platform." light />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, text, to, Icon]) => (
            <Link key={title} to={to} className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
              <Icon size={22} className="text-gold-300" />
              <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 font-body text-sm leading-6 text-white/65">{text}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-body text-sm font-bold text-gold-300">Explore <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
