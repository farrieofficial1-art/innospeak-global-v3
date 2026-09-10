import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Compass } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/portal/PortalStates.jsx';
import { listMyEnrollments, getCourseProgress } from '../../lib/supabase/lms';
import { useAuth } from '../../context/AuthContext';

export default function LearnDashboard() {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, error: null, enrollments: [] });

  useEffect(() => {
    listMyEnrollments()
      .then(async (enrollments) => {
        const withProgress = await Promise.all(
          enrollments.map(async (e) => {
            try {
              const progress = await getCourseProgress(e.course_id, user.id);
              return { ...e, progress };
            } catch {
              return { ...e, progress: null };
            }
          })
        );
        setState({ loading: false, error: null, enrollments: withProgress });
      })
      .catch((err) => setState({ loading: false, error: err.message || 'Could not load your courses.', enrollments: [] }));
  }, [user?.id]);

  return (
    <>
      <Seo title="My Learning" description="Your enrolled courses and learning progress." path="/learn" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Learn</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">My Learning</h1>
        </div>
        <Link to="/learn/catalog" className="btn-outline inline-flex items-center gap-2 text-sm">
          <Compass size={15} /> Browse Courses
        </Link>
      </div>

      <SectionCard title="My Courses" className="mt-6">
        {state.loading && <LoadingState />}
        {!state.loading && state.error && <ErrorState message={state.error} />}
        {!state.loading && !state.error && state.enrollments.length === 0 && (
          <EmptyState
            icon={GraduationCap}
            title="You're not enrolled in any course yet"
            message="Browse the catalog to find a course to start learning."
            action={
              <Link to="/learn/catalog" className="btn-gold text-sm">
                Browse Courses
              </Link>
            }
          />
        )}
        {!state.loading && !state.error && state.enrollments.length > 0 && (
          <div className="space-y-3">
            {state.enrollments.map((e) => (
              <Link
                key={e.id}
                to={`/learn/courses/${e.course_id}`}
                className="block rounded-xl border border-navy-100 px-4 py-4 transition-colors hover:bg-navy-50/60"
              >
                <div className="flex items-center justify-between">
                  <p className="font-body text-sm font-semibold text-navy-900">{e.courses?.title}</p>
                  <span className="font-body text-xs font-semibold text-gold-700">Continue →</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-navy-100">
                  <div
                    className="h-2 rounded-full bg-gold-500"
                    style={{ width: `${e.progress?.percent ?? 0}%` }}
                  />
                </div>
                <p className="mt-1 font-body text-xs text-navy-500">
                  {e.progress ? `${e.progress.completed_lessons} / ${e.progress.total_lessons} lessons complete` : 'Progress unavailable'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
    </>
  );
}
