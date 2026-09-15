import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  TrendingUp, BookOpen, CheckCircle2, FileText, Award, Clock,
  ArrowLeft, ChevronRight, BarChart3, Target, AlertCircle,
  RotateCcw, FileCheck2, ListChecks,
} from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import StatCard from '../../components/portal/StatCard.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import StatusBadge from '../../components/portal/StatusBadge.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/portal/PortalStates.jsx';
import {
  getStudentAcademicSummary,
  getStudentCoursePerformance,
  getStudentRecentActivity,
  getStudentCourseDetail,
  getStudentAssessmentPerformance,
} from '../../lib/supabase/lms';

const ACTIVITY_ICONS = {
  lesson_completed: CheckCircle2,
  quiz_submitted: FileCheck2,
  assignment_submitted: FileText,
  assignment_graded: Award,
  resubmission_requested: RotateCcw,
};

const ACTIVITY_LABELS = {
  lesson_completed: 'Lesson Completed',
  quiz_submitted: 'Quiz Submitted',
  assignment_submitted: 'Assignment Submitted',
  assignment_graded: 'Assignment Graded',
  resubmission_requested: 'Resubmission Requested',
};

function ProgressBar({ value, className }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-navy-100 ${className || ''}`}>
      <div
        className="h-full rounded-full bg-gold-500 transition-all duration-500"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

function OverallSummary({ summary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard icon={BookOpen} label="Courses Enrolled" value={summary?.courses_enrolled ?? 0} />
      <StatCard icon={TrendingUp} label="In Progress" value={summary?.courses_in_progress ?? 0} />
      <StatCard icon={CheckCircle2} label="Completed" value={summary?.courses_completed ?? 0} />
      <StatCard icon={BarChart3} label="Overall Progress" value={`${summary?.overall_progress_percent ?? 0}%`} />
      <StatCard icon={CheckCircle2} label="Lessons Completed" value={summary?.lessons_completed ?? 0} hint={`of ${summary?.lessons_total ?? 0}`} />
      <StatCard icon={FileCheck2} label="Quizzes Completed" value={summary?.quizzes_completed ?? 0} />
      <StatCard icon={FileText} label="Assignments Submitted" value={summary?.assignments_submitted ?? 0} />
      <StatCard icon={Award} label="Assignments Graded" value={summary?.assignments_graded ?? 0} />
    </div>
  );
}

function CoursePerformanceRow({ course }) {
  return (
    <Link
      to={`/portal/progress/${course.course_id}`}
      className="block rounded-xl border border-navy-100 bg-white p-4 transition-all hover:border-gold-300 hover:shadow-premium"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-body text-sm font-semibold text-navy-900">{course.course_title}</p>
          <p className="mt-0.5 font-body text-xs text-navy-400">
            {course.lessons_completed}/{course.lessons_total} lessons
            {' · '}
            {course.completion_status === 'completed' ? 'Completed' : course.completion_status === 'in_progress' ? 'In Progress' : 'Not Started'}
            {course.last_activity_at && ` · Last: ${new Date(course.last_activity_at).toLocaleDateString()}`}
          </p>
        </div>
        <ChevronRight size={16} className="mt-1 shrink-0 text-navy-300" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <ProgressBar value={Number(course.progress_percent) || 0} className="flex-1" />
        <span className="font-body text-xs font-semibold text-navy-700">{course.progress_percent}%</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 font-body text-xs text-navy-500">
        {course.quiz_average > 0 && <span>Quiz avg: {course.quiz_average}%</span>}
        {course.assignment_average > 0 && <span>Assignment avg: {course.assignment_average}%</span>}
        {course.performance_percent > 0 && <span className="font-semibold text-gold-700">Overall: {course.performance_percent}%</span>}
      </div>
    </Link>
  );
}

function AssessmentRow({ assessment }) {
  const isQuiz = assessment.assessment_type === 'quiz';
  const Icon = isQuiz ? FileCheck2 : FileText;
  const scoreDisplay = assessment.score != null
    ? isQuiz
      ? `${assessment.score}%`
      : `${assessment.score}/${assessment.max_score}`
    : '—';

  return (
    <div className="flex items-center gap-3 rounded-xl border border-navy-100 px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-500/10 text-gold-700">
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-sm font-semibold text-navy-800">{assessment.assessment_title}</p>
        <p className="font-body text-xs text-navy-400">
          {assessment.course_title} · {isQuiz ? 'Quiz' : 'Assignment'}
          {isQuiz && assessment.attempts > 0 && ` · ${assessment.attempts} attempt(s)`}
        </p>
        {assessment.feedback && (
          <p className="mt-1 font-body text-xs text-navy-500 italic">"{assessment.feedback}"</p>
        )}
      </div>
      <div className="text-right">
        <p className="font-body text-sm font-semibold text-navy-700">{scoreDisplay}</p>
        <StatusBadge
          status={
            assessment.grading_status === 'graded' ? 'graded'
            : assessment.grading_status === 'submitted' ? 'submitted'
            : assessment.grading_status === 'resubmission_required' ? 'resubmission_required'
            : assessment.grading_status === 'in_progress' ? 'in_progress'
            : 'not_started'
          }
        />
      </div>
    </div>
  );
}

function ActivityRow({ activity }) {
  const Icon = ACTIVITY_ICONS[activity.activity_type] || Clock;
  return (
    <div className="flex items-center gap-3 rounded-xl bg-navy-50/60 px-4 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500/10 text-gold-700">
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-body text-sm text-navy-800">
          <span className="font-semibold">{ACTIVITY_LABELS[activity.activity_type] || activity.activity_type}</span>
          {' — '}{activity.description}
        </p>
        <p className="font-body text-xs text-navy-400">{activity.course_title}</p>
      </div>
      <span className="shrink-0 font-body text-xs text-navy-400">
        {new Date(activity.created_at).toLocaleDateString()}
      </span>
    </div>
  );
}

function CourseDetail({ courseId }) {
  const [state, setState] = useState({ loading: true, error: null, detail: null });

  const load = useCallback(() => {
    getStudentCourseDetail(courseId)
      .then((detail) => setState({ loading: false, error: null, detail }))
      .catch((err) => setState({ loading: false, error: err.message || 'Could not load course detail.', detail: null }));
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  if (state.loading) return <LoadingState />;
  if (state.error) return <ErrorState message={state.error} />;
  if (!state.detail) return <EmptyState icon={BookOpen} title="Course not found" />;

  const d = state.detail;

  return (
    <>
      <Link to="/portal/progress" className="inline-flex items-center gap-2 font-body text-sm font-semibold text-navy-600 hover:text-gold-600">
        <ArrowLeft size={16} /> Back to My Progress
      </Link>

      <div className="mt-4">
        <h1 className="font-display text-2xl font-bold text-navy-900">{d.course_title}</h1>
        <div className="mt-3 flex items-center gap-4">
          <ProgressBar value={Number(d.overall_percent) || 0} className="flex-1 max-w-xs" />
          <span className="font-body text-sm font-semibold text-navy-700">{d.overall_percent}%</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-4 font-body text-xs text-navy-500">
          <span>{d.lessons_completed}/{d.lessons_total} lessons completed</span>
          <span>{d.remaining_lessons} remaining</span>
          {d.quiz_average > 0 && <span>Quiz avg: {d.quiz_average}%</span>}
          {d.assignment_average > 0 && <span>Assignment avg: {d.assignment_average}%</span>}
        </div>
      </div>

      <Link
        to={`/learn/courses/${courseId}`}
        className="btn-gold mt-4 inline-flex items-center gap-2 text-sm"
      >
        <BookOpen size={15} /> Continue Learning
      </Link>

      <div className="mt-6 space-y-4">
        {(d.modules || []).map((mod, idx) => (
          <SectionCard
            key={mod.module_id}
            title={`Module ${idx + 1}: ${mod.module_title}`}
            description={`${mod.lessons_completed}/${mod.lessons_total} lessons · ${mod.progress_percent}%`}
          >
            <div className="space-y-2">
              {(mod.lessons || []).map((lesson) => (
                <div key={lesson.lesson_id} className="flex items-center gap-3 rounded-lg bg-navy-50/50 px-3 py-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: lesson.status === 'completed' ? '#059669' : lesson.status === 'in_progress' ? '#d97706' : '#94a3b8' }}>
                    {lesson.status === 'completed' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body text-sm font-semibold text-navy-800">{lesson.lesson_title}</p>
                    <p className="font-body text-xs text-navy-400 capitalize">{lesson.status.replace(/_/g, ' ')}</p>
                  </div>
                  {lesson.quiz_score != null && (
                    <span className="rounded-lg bg-emerald-50 px-2 py-1 font-body text-xs font-semibold text-emerald-700">
                      Quiz: {lesson.quiz_score}%
                    </span>
                  )}
                  {lesson.assignment_score && (
                    <span className="rounded-lg bg-gold-50 px-2 py-1 font-body text-xs font-semibold text-gold-700">
                      {lesson.assignment_score.score != null
                        ? `Asg: ${lesson.assignment_score.score}/${lesson.assignment_score.max_score}`
                        : lesson.assignment_score.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </>
  );
}

export default function MyProgress() {
  const { courseId } = useParams();
  const [summary, setSummary] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (courseId) return;
    Promise.all([
      getStudentAcademicSummary(),
      getStudentCoursePerformance(),
      getStudentAssessmentPerformance(),
      getStudentRecentActivity(15),
    ])
      .then(([s, c, a, act]) => {
        setSummary(s);
        setCourses(c);
        setAssessments(a);
        setActivity(act);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Could not load your academic progress.');
        setLoading(false);
      });
  }, [courseId]);

  if (courseId) return <CourseDetail courseId={courseId} />;

  return (
    <>
      <Seo title="My Progress" description="Your academic progress and performance." path="/portal/progress" />

      <div>
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Student Portal</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">My Progress</h1>
        <p className="mt-2 font-body text-sm text-navy-500">Your academic performance across all enrolled courses.</p>
      </div>

      {loading && <div className="mt-8"><LoadingState /></div>}
      {error && <div className="mt-8"><ErrorState message={error} /></div>}

      {!loading && !error && (
        <>
          {/* 1. Overall Learning Summary */}
          <div className="mt-6">
            <h2 className="font-display text-lg font-bold text-navy-900">Overall Learning Summary</h2>
            <div className="mt-3">
              <OverallSummary summary={summary} />
            </div>
          </div>

          {/* 2. Course Performance */}
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold text-navy-900">Course Performance</h2>
            {courses.length === 0 ? (
              <div className="mt-3"><EmptyState icon={BookOpen} title="No courses enrolled" message="Enroll in a course to start tracking your progress." /></div>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {courses.map((c) => <CoursePerformanceRow key={c.course_id} course={c} />)}
              </div>
            )}
          </div>

          {/* 3. Assessment Performance */}
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold text-navy-900">Assessment Performance</h2>
            {assessments.length === 0 ? (
              <div className="mt-3"><EmptyState icon={ListChecks} title="No assessments yet" message="Quiz and assignment results will appear here." /></div>
            ) : (
              <div className="mt-3 space-y-2">
                {assessments.map((a, i) => <AssessmentRow key={`${a.assessment_type}-${a.assessment_id}-${i}`} assessment={a} />)}
              </div>
            )}
          </div>

          {/* 4. Academic Activity */}
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold text-navy-900">Recent Activity</h2>
            {activity.length === 0 ? (
              <div className="mt-3"><EmptyState icon={Clock} title="No recent activity" message="Your learning activity will appear here." /></div>
            ) : (
              <div className="mt-3 space-y-2">
                {activity.map((act, i) => <ActivityRow key={i} activity={act} />)}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
