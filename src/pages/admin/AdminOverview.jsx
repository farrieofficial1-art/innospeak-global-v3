import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, BookOpenText } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import StatCard from '../../components/portal/StatCard.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import { LoadingState, ErrorState } from '../../components/portal/PortalStates.jsx';
import { listStudents, listAllEnrollments } from '../../lib/supabase/admin';

export default function AdminOverview() {
  const [state, setState] = useState({ loading: true, error: null, students: [], enrollments: [] });

  useEffect(() => {
    let cancelled = false;
    Promise.all([listStudents(), listAllEnrollments()])
      .then(([students, enrollments]) => {
        if (!cancelled) setState({ loading: false, error: null, students, enrollments });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ loading: false, error: err.message || 'Could not load overview.', students: [], enrollments: [] });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const studentCount = state.students.filter((s) => s.role === 'student').length;
  const staffCount = state.students.filter((s) => s.role !== 'student').length;
  const activeEnrollments = state.enrollments.filter((e) => e.status === 'active').length;

  return (
    <>
      <Seo title="Staff Overview" description="InnoSpeak Global staff panel." path="/admin" />

      <div>
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Staff Panel</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">Overview</h1>
      </div>

      {state.loading && <div className="mt-8"><LoadingState /></div>}
      {!state.loading && state.error && <div className="mt-8"><ErrorState message={state.error} /></div>}

      {!state.loading && !state.error && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard icon={Users} label="Students" value={studentCount} />
            <StatCard icon={GraduationCap} label="Active Enrollments" value={activeEnrollments} />
            <StatCard icon={BookOpenText} label="Staff Accounts" value={staffCount} />
          </div>

          <div className="mt-6">
            <SectionCard title="Quick Links">
              <div className="flex flex-wrap gap-3">
                <Link to="/admin/students" className="btn-outline">
                  Manage Students
                </Link>
                <Link to="/admin/content" className="btn-gold">
                  Manage Course Content
                </Link>
              </div>
            </SectionCard>
          </div>
        </>
      )}
    </>
  );
}