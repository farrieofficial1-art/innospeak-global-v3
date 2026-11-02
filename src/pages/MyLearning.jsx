import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BookOpen, Plus, Loader2 } from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import Container from '../components/ui/Container.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import CourseCard from '../components/academy/CourseCard.jsx';
import Button from '../components/ui/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase/client.js';
import { ACADEMY_BY_CODE } from '../lib/data/academy.js';

export default function MyLearning() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);

  const loadEnrollments = useCallback(async () => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('academy_enrollments')
      .select('id, course_code, status, enrolled_at')
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false });
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setEnrollments(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadEnrollments();
  }, [loadEnrollments]);

  // Handle ?enroll=CODE query param for self-enrollment
  useEffect(() => {
    const code = searchParams.get('enroll');
    if (!code || !user || !supabase || enrolling) return;

    (async () => {
      setEnrolling(true);
      const { error: insertError } = await supabase
        .from('academy_enrollments')
        .insert({ course_code: code, user_id: user.id, status: 'active' });
      if (insertError) {
        setError(insertError.message);
      } else {
        searchParams.delete('enroll');
        setSearchParams(searchParams, { replace: true });
        await loadEnrollments();
      }
      setEnrolling(false);
    })();
  }, [searchParams, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const enrolledCourses = enrollments
    .map((e) => ACADEMY_BY_CODE[e.course_code])
    .filter(Boolean);

  return (
    <>
      <Seo
        title="My Learning"
        description="Your enrolled Academy courses."
        path="/my-learning"
      />

      <section className="bg-cream pt-32 pb-16 lg:pb-20">
        <Container>
          <SectionHeading
            eyebrow="Your courses"
            title="My Learning"
            subtitle="Pick up where you left off or browse the academy for your next course."
            center={false}
          />

          {enrolling && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-gold-50 px-5 py-3 font-body text-sm text-gold-700">
              <Loader2 size={16} className="animate-spin" />
              Enrolling you in this course…
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl bg-rose-50 px-5 py-3 font-body text-sm text-rose-700">
              {error}
            </div>
          )}

          {!user ? (
            <div className="mt-10 card-premium p-8 text-center">
              <BookOpen size={32} className="mx-auto text-navy-400" />
              <p className="mt-4 font-body text-lg text-navy-600">
                Sign in to see your enrolled courses.
              </p>
              <Button to="/login?redirect=/my-learning" variant="gold" className="mt-5">
                Sign in
              </Button>
            </div>
          ) : loading ? (
            <div className="mt-10 flex items-center gap-3 font-body text-navy-500">
              <Loader2 size={20} className="animate-spin" />
              Loading your courses…
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="mt-10 card-premium p-8 text-center">
              <BookOpen size={32} className="mx-auto text-navy-400" />
              <p className="mt-4 font-body text-lg text-navy-600">
                You haven't enrolled in any courses yet.
              </p>
              <Link to="/academy" className="btn-gold mt-5">
                <Plus size={18} />
                Browse the Academy
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {enrolledCourses.map((course) => (
                <CourseCard key={course.code} course={course} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
