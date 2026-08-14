import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, LogOut, TriangleAlert } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import { useAuth } from '../../context/AuthContext';
import { getMyEnrollments } from '../../lib/supabase/portal';
import { getTimeGreeting } from '../../lib/tutor/greeting';

export default function StudentDashboard() {
  const { profile, user, signOut } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getMyEnrollments()
      .then((data) => {
        if (!cancelled) setEnrollments(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load your courses.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = profile?.full_name || user?.email;

  return (
    <>
      <Seo title="My Portal" description="Your InnoSpeak Global student dashboard." path="/portal" />

      <section className="bg-navy-gradient py-14 sm:py-16">
        <div className="container-premium flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-300">
              Student Portal
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              {getTimeGreeting()}{displayName ? `, ${displayName}` : ''}
            </h1>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 font-body text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
          >
            <LogOut size={15} />
            Log Out
          </button>
        </div>
      </section>

      <section className="bg-cream py-14 sm:py-16">
        <div className="container-premium">
          <h2 className="font-display text-xl font-bold text-navy-900">Your Courses</h2>

          {isLoading && (
            <div className="mt-6 flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-100 border-t-gold-500" />
            </div>
          )}

          {!isLoading && error && (
            <div className="mt-6 flex items-start gap-2 rounded-xl border border-gold-300 bg-gold-50 px-4 py-3 font-body text-sm text-navy-800">
              <TriangleAlert size={16} className="mt-0.5 shrink-0 text-gold-700" />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && !error && enrollments.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl border border-navy-100 bg-white px-6 py-12 text-center shadow-premium"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 ring-1 ring-gold-500/20">
                <GraduationCap size={22} />
              </span>
              <p className="mt-4 font-body text-sm text-navy-600">
                You&rsquo;re not enrolled in any courses yet.
              </p>
              <a href="/academy" className="btn-gold mt-5 inline-block">
                Browse the Academy
              </a>
            </motion.div>
          )}

          {!isLoading && !error && enrollments.length > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="rounded-2xl border border-navy-100 bg-white p-5 shadow-premium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-premium-lg"
                >
                  <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">
                    {enrollment.courses?.pathway}
                  </p>
                  <h3 className="mt-1 font-display text-base font-bold text-navy-900">
                    {enrollment.courses?.title}
                  </h3>
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-navy-50">
                    <div
                      className="h-full rounded-full bg-gold-gradient"
                      style={{ width: `${enrollment.progress_percent}%` }}
                    />
                  </div>
                  <p className="mt-1.5 font-body text-xs text-navy-400">
                    {enrollment.progress_percent}% complete &middot; {enrollment.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}