import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Award,
  Lock,
  BriefcaseBusiness,
} from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import Container from '../components/ui/Container.jsx';
import Button from '../components/ui/Button.jsx';
import EnrollButton from '../components/portal/EnrollButton.jsx';
import LabCourseCard from '../components/academy/LabCourseCard.jsx';
import {
  LAB_BY_SLUG,
  getLabCoursesByTrack,
} from '../lib/data/labs.js';
import { TRACK_BY_ID } from '../lib/data/registry.js';
import { priceKes } from '../lib/data/labs.js';

const OUTCOMES = [
  'Hands-on, project-based learning with real engineering tasks',
  'Self-paced format — complete on your own schedule',
  'Completion certificate to showcase your achievement',
  'Taught by experienced industry practitioners',
];

const TRACK_GRADIENTS = {
  'software-engineering': 'from-blue-600 to-cyan-600',
  'data-analytics': 'from-indigo-600 to-blue-500',
  'ai-intelligent-systems': 'from-emerald-600 to-teal-600',
  'cloud-infrastructure': 'from-sky-600 to-blue-700',
  cybersecurity: 'from-red-600 to-rose-700',
  'engineering-smart-systems': 'from-amber-600 to-orange-600',
  'creative-technology': 'from-pink-600 to-rose-600',
};

export default function LabCourseDetail() {
  const { slug } = useParams();
  const course = LAB_BY_SLUG[slug];

  if (!course) {
    return (
      <>
        <Seo title="Course Not Found" path="/labs" />
        <section className="bg-cream pt-32 pb-20">
          <Container>
            <div className="mx-auto max-w-xl text-center">
              <h1 className="font-display text-3xl font-bold text-navy-900">
                Course not found
              </h1>
              <p className="mt-4 font-body text-navy-500">
                The lab course you're looking for doesn't exist or may have moved.
              </p>
              <Button to="/labs" variant="gold" className="mt-6">
                Back to Labs
              </Button>
            </div>
          </Container>
        </section>
      </>
    );
  }

  const track = TRACK_BY_ID[course.track_id] || {};
  const Icon = track.icon;
  const gradient = TRACK_GRADIENTS[course.track_id] || 'from-navy-600 to-navy-800';
  const kes = priceKes(course.price_usd || 0);
  const enrollmentCourse = {
    code: course.code,
    name: course.title,
    pathway: track.title,
    fees: course.price_usd > 0 ? `${course.price_usd}` : 'Free',
    isFree: course.price_usd === 0,
  };
  const related = getLabCoursesByTrack(course.track_id)
    .filter((c) => c.code !== course.code)
    .slice(0, 4);

  return (
    <>
      <Seo
        title={`${course.title} — ${course.code}`}
        description={`${course.title} — ${course.level} level lab course from InnoSpeak Labs.`}
        path={`/labs/${course.slug}`}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-radial pt-32 pb-16">
        <div className="absolute inset-0 bg-navy-gradient opacity-90" />
        <div className="relative container-premium">
          <Link
            to="/labs"
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-white/70 transition-colors hover:text-gold-400"
          >
            <ArrowLeft size={16} />
            Back to Labs
          </Link>

          <div className="mt-6 flex items-center gap-3">
            {Icon && (
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white`}>
                <Icon size={24} strokeWidth={1.8} />
              </div>
            )}
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-400">
                {track.title || 'Labs'}
              </p>
              <p className="font-mono text-sm font-bold text-white/80">{course.code}</p>
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-5 max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
          >
            {course.title}
          </motion.h1>

          <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-white/70 sm:text-lg">
            {course.summary}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/15 px-4 py-1.5 font-body text-xs font-semibold text-white">
              {course.level}
            </span>
            <span className="flex items-center gap-1.5 font-body text-sm text-white/70">
              <Clock size={15} />
              {course.duration_weeks} weeks · Self-paced
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-cream py-16 lg:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            {/* Left — content */}
            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">
                About this course
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-navy-600">
                {course.title} is a {course.level?.toLowerCase() || 'beginner'}-level
                lab course in the {track.title || 'Labs'} track. You'll learn through
                practical lessons and real-world exercises you can apply immediately
                to your work or projects.
              </p>

              {/* Skills */}
              {course.skills?.length > 0 && (
                <>
                  <h2 className="mt-10 font-display text-2xl font-bold text-navy-900">
                    Skills you'll build
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {course.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/10 px-4 py-2 font-body text-sm font-semibold text-gold-700"
                      >
                        <BriefcaseBusiness size={14} />
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 font-body text-sm text-navy-400">
                    These skills are matched against opportunities in the Career Hub to recommend relevant roles and projects.
                  </p>
                </>
              )}

              <h2 className="mt-10 font-display text-2xl font-bold text-navy-900">
                What you'll achieve
              </h2>
              <ul className="mt-5 space-y-3">
                {OUTCOMES.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-gold-500" />
                    <span className="font-body text-base text-navy-600">{outcome}</span>
                  </li>
                ))}
              </ul>

              <h2 className="mt-10 font-display text-2xl font-bold text-navy-900">
                Course details
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="card-premium p-5">
                  <div className="flex items-center gap-2 text-navy-500">
                    <Award size={18} className="text-gold-500" />
                    <span className="font-body text-sm font-semibold">Level</span>
                  </div>
                  <p className="mt-2 font-display text-lg font-bold text-navy-900">
                    {course.level || 'Beginner'}
                  </p>
                </div>
                <div className="card-premium p-5">
                  <div className="flex items-center gap-2 text-navy-500">
                    <Clock size={18} className="text-gold-500" />
                    <span className="font-body text-sm font-semibold">Duration</span>
                  </div>
                  <p className="mt-2 font-display text-lg font-bold text-navy-900">
                    {course.duration_weeks} weeks · Self-paced
                  </p>
                </div>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl font-bold text-navy-900">
                    More in {track.title}
                  </h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {related.map((c) => (
                      <LabCourseCard key={c.code} course={c} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right — price + CTA */}
            <div>
              <div className="sticky top-24 card-premium p-7">
                <p className="font-body text-sm font-semibold text-navy-500">
                  Course fee
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold text-navy-900">
                    ${course.price_usd}
                  </span>
                  <span className="font-body text-sm text-navy-500">
                    ≈ KES {kes.toLocaleString()}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <EnrollButton course={enrollmentCourse} />
                  <Button to="/labs" variant="outline" className="w-full">
                    Browse more lab courses
                  </Button>
                </div>

                <div className="mt-6 border-t border-navy-100 pt-5">
                  <p className="flex items-center gap-2 font-body text-xs text-navy-500">
                    <Lock size={14} className="text-gold-500" />
                    Secure checkout · Instant access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
