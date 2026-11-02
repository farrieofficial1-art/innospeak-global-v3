import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Award,
  PlayCircle,
  Lock,
} from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import Container from '../components/ui/Container.jsx';
import Button from '../components/ui/Button.jsx';
import CourseCard from '../components/academy/CourseCard.jsx';
import {
  ACADEMY_BY_SLUG,
  TRACK_BY_ID,
  getCoursesByTrack,
  priceKes,
} from '../lib/data/academy.js';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase/client.js';

const OUTCOMES = [
  'Practical, project-based learning you can apply immediately',
  'Self-paced format — complete on your own schedule',
  'Completion certificate to showcase your achievement',
  'Taught by experienced industry practitioners',
];

export default function AcademyCourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [checking, setChecking] = useState(true);

  const course = ACADEMY_BY_SLUG[slug];

  useEffect(() => {
    let cancelled = false;
    async function checkEnrollment() {
      if (!course || !user || !supabase) {
        setChecking(false);
        return;
      }
      const { data } = await supabase
        .from('academy_enrollments')
        .select('id')
        .eq('course_code', course.code)
        .eq('user_id', user.id)
        .maybeSingle();
      if (!cancelled) {
        setEnrolled(Boolean(data));
        setChecking(false);
      }
    }
    checkEnrollment();
    return () => {
      cancelled = true;
    };
  }, [course, user]);

  if (!course) {
    return (
      <>
        <Seo title="Course Not Found" path="/academy" />
        <section className="bg-cream pt-32 pb-20">
          <Container>
            <div className="mx-auto max-w-xl text-center">
              <h1 className="font-display text-3xl font-bold text-navy-900">
                Course not found
              </h1>
              <p className="mt-4 font-body text-navy-500">
                The course you're looking for doesn't exist or may have moved.
              </p>
              <Button to="/academy" variant="gold" className="mt-6">
                Back to Academy
              </Button>
            </div>
          </Container>
        </section>
      </>
    );
  }

  const track = TRACK_BY_ID[course.track_id] || {};
  const Icon = track.icon;
  const kes = priceKes(course.price_usd || 0);
  const related = getCoursesByTrack(course.track_id)
    .filter((c) => c.code !== course.code)
    .slice(0, 4);

  return (
    <>
      <Seo
        title={`${course.title} — ${course.code}`}
        description={`${course.title} — ${course.level} level course from InnoSpeak Academy.`}
        path={`/academy/${course.slug}`}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-radial pt-32 pb-16">
        <div className="absolute inset-0 bg-navy-gradient opacity-90" />
        <div className="relative container-premium">
          <Link
            to="/academy"
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-white/70 transition-colors hover:text-gold-400"
          >
            <ArrowLeft size={16} />
            Back to Academy
          </Link>

          <div className="mt-6 flex items-center gap-3">
            {Icon && (
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${track.gradient || 'from-navy-600 to-navy-800'} text-white`}>
                <Icon size={24} strokeWidth={1.8} />
              </div>
            )}
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-400">
                {track.name || 'Course'}
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

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/15 px-4 py-1.5 font-body text-xs font-semibold text-white">
              {course.level}
            </span>
            <span className="flex items-center gap-1.5 font-body text-sm text-white/70">
              <Clock size={15} />
              Self-paced
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
                course in the {track.name || 'Academy'} track. You'll learn through
                practical lessons and real-world exercises you can apply immediately
                to your work or studies.
              </p>

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
                    <span className="font-body text-sm font-semibold">Format</span>
                  </div>
                  <p className="mt-2 font-display text-lg font-bold text-navy-900">
                    Self-paced, on-demand
                  </p>
                </div>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl font-bold text-navy-900">
                    More in {track.name}
                  </h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {related.map((c) => (
                      <CourseCard key={c.code} course={c} />
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
                  {checking ? (
                    <p className="font-body text-sm text-navy-400">Checking enrollment…</p>
                  ) : enrolled ? (
                    <Button
                      to="/my-learning"
                      variant="gold"
                      className="w-full"
                    >
                      <PlayCircle size={18} />
                      Continue Learning
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        if (!user) {
                          navigate('/login?redirect=/academy/' + course.slug);
                          return;
                        }
                        navigate(`/my-learning?enroll=${course.code}`);
                      }}
                      variant="gold"
                      className="w-full"
                    >
                      Enroll Now
                    </Button>
                  )}
                  <Button
                    to="/academy"
                    variant="outline"
                    className="w-full"
                  >
                    Browse more courses
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
