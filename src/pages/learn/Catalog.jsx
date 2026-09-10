import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/portal/PortalStates.jsx';
import { listPublishedCourses, enrollInCourse } from '../../lib/supabase/lms';

export default function Catalog() {
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, error: null, courses: [] });
  const [enrollingId, setEnrollingId] = useState(null);

  useEffect(() => {
    listPublishedCourses()
      .then((courses) => setState({ loading: false, error: null, courses }))
      .catch((err) => setState({ loading: false, error: err.message || 'Could not load the course catalog.', courses: [] }));
  }, []);

  async function handleEnroll(courseId) {
    setEnrollingId(courseId);
    try {
      await enrollInCourse(courseId);
      navigate(`/learn/courses/${courseId}`);
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message || 'Could not enroll in this course.' }));
    } finally {
      setEnrollingId(null);
    }
  }

  return (
    <>
      <Seo title="Browse Courses" description="Find a course to start learning." path="/learn/catalog" />

      <div>
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Learn</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">Browse Courses</h1>
      </div>

      <SectionCard title="Available Courses" className="mt-6">
        {state.loading && <LoadingState />}
        {!state.loading && state.error && <ErrorState message={state.error} />}
        {!state.loading && !state.error && state.courses.length === 0 && (
          <EmptyState icon={Compass} title="No published courses yet" message="Check back once an instructor publishes a course." />
        )}
        {!state.loading && !state.error && state.courses.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {state.courses.map((course) => (
              <div key={course.id} className="rounded-xl border border-navy-100 p-4">
                <p className="font-body text-sm font-semibold text-navy-900">{course.title}</p>
                {course.description && <p className="mt-1 font-body text-sm text-navy-500">{course.description}</p>}
                <button
                  type="button"
                  onClick={() => handleEnroll(course.id)}
                  disabled={enrollingId === course.id}
                  className="btn-gold mt-3 text-xs disabled:opacity-60"
                >
                  {enrollingId === course.id ? 'Enrolling…' : 'Enroll'}
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </>
  );
}
