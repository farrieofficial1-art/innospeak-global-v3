import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, CircleCheck, LogIn, TriangleAlert, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getEnrollmentByCode, enrollInCourse } from '../../lib/supabase/portal';

/**
 * EnrollButton: enrols the signed-in student immediately. Fees are settled
 * through the term fee statement and do not gate access to learning.
 */
export default function EnrollButton({ course }) {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  const [enrollment, setEnrollment] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !course?.code) {
      setIsChecking(false);
      return undefined;
    }
    let cancelled = false;
    setIsChecking(true);
    setError(null);

    getEnrollmentByCode(course.code)
      .then((data) => {
        if (!cancelled) setEnrollment(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Could not check your enrolment. Please refresh and try again.');
      })
      .finally(() => {
        if (!cancelled) setIsChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, course?.code]);

  async function handleEnroll() {
    setError(null);
    setIsEnrolling(true);
    try {
      const data = await enrollInCourse({ code: course.code });
      setEnrollment(data);
    } catch (err) {
      setError(err.message || 'Could not enrol you right now. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  }

  if (authLoading || isChecking) {
    return (
      <div className="mx-auto flex w-full min-w-0 max-w-2xl items-center justify-center rounded-2xl border border-navy-100 bg-white px-6 py-6 shadow-premium">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-navy-100 border-t-gold-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col items-stretch gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-premium sm:p-7">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 ring-1 ring-gold-500/20">
            <GraduationCap size={20} />
          </span>
          <div className="min-w-0">
            <p className="font-body text-sm font-bold text-navy-900">Log in to enroll in {course.name}</p>
            <p className="mt-0.5 font-body text-xs text-navy-500">Start learning straight away. Fees can be paid in instalments during the term.</p>
          </div>
        </div>
        <Link
          to="/login"
          state={{ from: location }}
          className="btn-gold inline-flex w-full items-center justify-center gap-2"
        >
          <LogIn size={15} />
          Log In to Enroll
        </Link>
      </div>
    );
  }

  if (enrollment?.status === 'completed') {
    return (
      <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col items-stretch gap-4 rounded-2xl border-2 border-emerald-300/60 bg-emerald-50 p-6 shadow-premium sm:p-7">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white"><CircleCheck size={20} /></span>
          <div className="min-w-0">
            <p className="font-body text-sm font-bold text-emerald-900">Course completed</p>
            <p className="mt-0.5 font-body text-xs text-emerald-800">Your completion is recorded. Visit My Learning to review your progress and eligible certificates.</p>
          </div>
        </div>
        <Link to="/learn" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-body text-sm font-bold text-white transition-all hover:bg-emerald-700">Open My Learning <ArrowRight size={15} /></Link>
      </div>
    );
  }

  if (enrollment && enrollment.status !== 'dropped') {
    return (
      <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col items-stretch gap-4 rounded-2xl border-2 border-emerald-300/60 bg-emerald-50 p-6 shadow-premium sm:p-7">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <CircleCheck size={20} />
          </span>
          <div className="min-w-0">
            <p className="font-body text-sm font-bold text-emerald-900">You're enrolled in this course</p>
            <p className="mt-0.5 font-body text-xs text-emerald-800">Continue from where you left off. Any fee balance is shown on your fee statement.</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            to={enrollment?.courseId ? `/learn/courses/${enrollment.courseId}` : '/learn'}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-body text-sm font-bold text-white transition-all duration-300 hover:bg-emerald-700"
          >
            Continue Learning
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/learn/fees"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-white px-6 py-3 font-body text-sm font-bold text-emerald-900 transition-all hover:border-emerald-500"
          >
            View fee statement
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col items-center gap-4">
      <div className="w-full min-w-0 rounded-2xl border border-navy-100 bg-white p-6 shadow-premium sm:p-7">
        <div className="flex flex-col gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
              <Sparkles size={20} />
            </span>
            <div className="min-w-0">
              <p className="font-body text-sm font-bold text-navy-900">Enrol today and start learning now</p>
              <p className="mt-0.5 font-body text-xs text-navy-500">
                No payment is needed to begin. Tuition is {course.fees || 'listed on the course'} and can be paid in instalments before the term fee deadline.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleEnroll}
              disabled={isEnrolling}
              className="btn-gold inline-flex w-full items-center justify-center gap-2 px-6 py-3 disabled:opacity-60"
            >
              {isEnrolling ? 'Enrolling…' : (
                <>
                  Enrol Now
                  <ArrowRight size={15} />
                </>
              )}
            </motion.button>
            <Link
              to="/contact"
              className="text-center font-body text-[11px] font-semibold text-navy-500 transition-colors hover:text-navy-900"
            >
              Need help? Contact us
            </Link>
          </div>
        </div>

        {error && (
          <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 font-body text-sm text-navy-800">
            <TriangleAlert size={16} className="mt-0.5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
