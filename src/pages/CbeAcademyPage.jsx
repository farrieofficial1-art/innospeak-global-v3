import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FlaskConical,
  Globe,
  Palette,
  School,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import {
  CBE_INFO,
  SCHOOL_LEVELS,
  GRADES,
  SENIOR_PATHWAYS,
  getSchoolLevelById,
  getGradesByLevel,
  getSubjectsByGrade,
  getSubjectGroups,
  getGradeById,
} from '../lib/data/cbeData';
import { inViewOnce } from '../lib/motion/presets';

const LEVEL_ICONS = {
  primary: School,
  'junior-secondary': BookOpen,
  'senior-school': GraduationCap,
};

const PATHWAY_ICONS = {
  core: BookOpen,
  stem: FlaskConical,
  'social-sciences': Globe,
  'arts-sports': Palette,
};

function Breadcrumb({ items }) {
  return (
    <nav className="mb-8 flex flex-wrap items-center gap-1.5 font-body text-sm">
      <Link to="/academy" className="text-navy-500 transition-colors hover:text-gold-600">
        Academy
      </Link>
      <ChevronRight size={14} className="text-navy-300" />
      <Link to="/academy#cbe-academy" className="text-navy-500 transition-colors hover:text-gold-600">
        CBE / CBC
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={14} className="text-navy-300" />
          <span className={i === items.length - 1 ? 'font-semibold text-navy-900' : 'text-navy-500'}>
            {item}
          </span>
        </span>
      ))}
    </nav>
  );
}

function GradeCard({ grade, levelId }) {
  return (
    <Link
      to={`/academy/cbe/${levelId}/${grade.id}`}
      className="group relative flex flex-col items-center justify-center rounded-2xl border border-navy-100 bg-white p-8 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/60 hover:shadow-premium-lg"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
        <span className="font-display text-xl font-bold">{grade.order}</span>
      </div>
      <p className="mt-4 font-display text-base font-bold text-navy-900">{grade.label}</p>
      <p className="mt-1 font-body text-xs text-navy-500">
        {grade.order <= 6 ? 'Primary' : grade.order <= 9 ? 'Junior Secondary' : 'Senior School'}
      </p>
    </Link>
  );
}

function SubjectCard({ subject, gradeId, levelId }) {
  const badgeColor =
    subject.type === 'core'
      ? 'bg-navy-900 text-gold-400'
      : subject.type === 'pathway'
      ? 'bg-gold-gradient text-navy-900'
      : 'bg-navy-100 text-navy-700';

  return (
    <Link
      to={`/academy/cbe/${levelId}/${gradeId}/${subject.id}`}
      className="group flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/60 hover:shadow-premium-lg"
    >
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center rounded-full px-3 py-1 font-body text-xs font-semibold ${badgeColor}`}>
          {subject.type === 'core' ? 'Core' : subject.type === 'pathway' ? 'Pathway' : 'Optional'}
        </span>
        {subject.group && (
          <span className="font-body text-xs font-medium text-navy-400">{subject.group}</span>
        )}
      </div>
      <h4 className="mt-4 font-display text-base font-bold text-navy-900">{subject.name}</h4>
      <p className="mt-2 flex-1 font-body text-xs leading-relaxed text-navy-600">
        {subject.description}
      </p>
      <div className="mt-4 inline-flex items-center gap-1.5 font-body text-xs font-semibold text-gold-600 transition-colors group-hover:text-gold-700">
        View Subject
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function SeniorPathwayFilter({ active, onChange }) {
  return (
    <div className="mb-10 flex flex-wrap gap-3">
      {SENIOR_PATHWAYS.map((pw) => {
        const Icon = PATHWAY_ICONS[pw.id] || BookOpen;
        const isActive = active === pw.id;
        return (
          <button
            key={pw.id}
            onClick={() => onChange(pw.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-body text-sm font-semibold transition-all duration-300 ${
              isActive
                ? 'border-gold-400 bg-gold-gradient text-navy-900 shadow-premium'
                : 'border-navy-100 bg-white text-navy-700 hover:border-gold-300/60 hover:text-navy-900'
            }`}
          >
            <Icon size={16} />
            {pw.title}
          </button>
        );
      })}
    </div>
  );
}

export default function CbeAcademyPage() {
  const { levelId, gradeId, subjectId } = useParams();
  const navigate = useNavigate();
  const [seniorPathway, setSeniorPathway] = useState('core');

  // ── Level view: show grades for a school level ────────────
  const level = levelId ? getSchoolLevelById(levelId) : null;
  const grade = gradeId ? getGradeById(gradeId) : null;
  const subjects = gradeId ? getSubjectsByGrade(gradeId) : [];
  const isSenior = levelId === 'senior-school';

  const filteredSubjects = useMemo(() => {
    if (!isSenior || !gradeId) return subjects;
    if (seniorPathway === 'core') return subjects.filter((s) => s.pathway === 'core');
    return subjects.filter((s) => s.pathway === seniorPathway);
  }, [subjects, isSenior, gradeId, seniorPathway]);

  const groupedSubjects = useMemo(() => getSubjectGroups(filteredSubjects), [filteredSubjects]);

  // ── Subject detail view ───────────────────────────────────
  const subject = subjectId ? subjects.find((s) => s.id === subjectId) : null;

  // ── Render: Subject detail ────────────────────────────────
  if (grade && subject) {
    return (
      <>
        <Seo
          title={`${subject.name} — ${grade.label} — CBE Academy`}
          description={subject.description}
          path={`/academy/cbe/${levelId}/${gradeId}/${subjectId}`}
        />
        <section className="bg-cream py-20 sm:py-24">
          <div className="container-premium">
            <Breadcrumb items={[level.title, grade.label, subject.name]} />

            <div className="rounded-2xl border border-navy-100 bg-white p-8 shadow-premium sm:p-12">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-navy-900 px-4 py-1.5 font-body text-xs font-semibold text-gold-400">
                  {grade.label}
                </span>
                {subject.group && (
                  <span className="font-body text-xs font-medium uppercase tracking-wider text-gold-600">
                    {subject.group}
                  </span>
                )}
              </div>
              <h1 className="mt-5 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
                {subject.name}
              </h1>
              <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-navy-600">
                {subject.description}
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-navy-100 bg-cream p-6">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-navy-900">
                    Curriculum Structure
                  </h3>
                  <ul className="mt-4 space-y-3 font-body text-sm text-navy-600">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                      Strands & Sub-strands
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                      Learning Outcomes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                      Lessons & Activities
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                      Knowledge Checks & Quizzes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                      Assignments & Progress Tracking
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-navy-100 bg-cream p-6">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-navy-900">
                    Learning Experience
                  </h3>
                  <p className="mt-4 font-body text-sm leading-relaxed text-navy-600">
                    This subject connects to the InnoSpeak Global LMS. Learners can access lessons,
                    complete activities, take quizzes, submit assignments, and track their progress
                    through the existing learning system. Completion earns a certificate through
                    the existing certification engine.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/learn"
                  className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 font-body text-sm font-semibold text-white transition-colors duration-300 hover:bg-gold-gradient hover:text-navy-900"
                >
                  Start Learning
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to={`/academy/cbe/${levelId}/${gradeId}`}
                  className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-white px-6 py-3 font-body text-sm font-semibold text-navy-900 transition-all duration-300 hover:border-navy-900 hover:bg-navy-900 hover:text-white"
                >
                  <ArrowLeft size={16} />
                  Back to {grade.label}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ── Render: Grade view (subjects) ──────────────────────────
  if (level && grade) {
    return (
      <>
        <Seo
          title={`${grade.label} — ${level.title} — CBE Academy`}
          description={`Subjects for ${grade.label} under ${level.title}.`}
          path={`/academy/cbe/${levelId}/${gradeId}`}
        />
        <section className="bg-cream py-20 sm:py-24">
          <div className="container-premium">
            <Breadcrumb items={[level.title, grade.label]} />

            <SectionHeading
              eyebrow={level.title}
              title={`${grade.label} Subjects`}
              subtitle={`Explore the learning areas available for ${grade.label}. Select a subject to view its curriculum, lessons, activities and assessments.`}
            />

            {isSenior && (
              <div className="mt-12">
                <SeniorPathwayFilter active={seniorPathway} onChange={setSeniorPathway} />
              </div>
            )}

            <div className="mt-8 space-y-10">
              {groupedSubjects.map(([groupName, groupSubjects]) => (
                <div key={groupName}>
                  <h3 className="mb-5 font-display text-lg font-bold text-navy-900">{groupName}</h3>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={inViewOnce}
                    transition={{ duration: 0.4 }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {groupSubjects.map((subject) => (
                      <SubjectCard
                        key={subject.id}
                        subject={subject}
                        gradeId={gradeId}
                        levelId={levelId}
                      />
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Link
                to={`/academy/cbe/${levelId}`}
                className="inline-flex items-center gap-2 font-body text-sm font-semibold text-navy-700 transition-colors hover:text-gold-600"
              >
                <ArrowLeft size={16} />
                Back to {level.title}
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ── Render: Level view (grades) ────────────────────────────
  if (level) {
    const grades = getGradesByLevel(levelId);
    const Icon = LEVEL_ICONS[levelId] || School;

    return (
      <>
        <Seo
          title={`${level.title} — CBE Academy`}
          description={level.description}
          path={`/academy/cbe/${levelId}`}
        />
        <section className="bg-cream py-20 sm:py-24">
          <div className="container-premium">
            <Breadcrumb items={[level.title]} />

            <div className="rounded-2xl border border-navy-100 bg-white p-8 shadow-premium sm:p-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-gradient text-navy-900">
                <Icon size={30} strokeWidth={1.8} />
              </div>
              <p className="mt-5 font-body text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                {level.grades}
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
                {level.title}
              </h1>
              <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-navy-600">
                {level.description}
              </p>
            </div>

            <h2 className="mt-12 font-display text-xl font-bold text-navy-900">
              Select a Grade
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewOnce}
              transition={{ duration: 0.5 }}
              className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
            >
              {grades.map((g) => (
                <GradeCard key={g.id} grade={g} levelId={levelId} />
              ))}
            </motion.div>

            <div className="mt-12">
              <Link
                to="/academy#cbe-academy"
                className="inline-flex items-center gap-2 font-body text-sm font-semibold text-navy-700 transition-colors hover:text-gold-600"
              >
                <ArrowLeft size={16} />
                Back to CBE / CBC Academy
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ── Render: Top-level CBE overview ────────────────────────
  return (
    <>
      <Seo
        title="CBE / CBC Academy — InnoSpeak Global"
        description={CBE_INFO.description}
        path="/academy/cbe"
      />
      <section className="bg-navy-950 py-20 sm:py-24">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Kenya CBC Pathway"
            title={
              <>
                CBE / CBC Academy
                <span className="block text-gradient-gold">Grades 3–12 Learning Support</span>
              </>
            }
            subtitle={CBE_INFO.description}
            light
          />

          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {SCHOOL_LEVELS.map((lvl, i) => {
              const Icon = LEVEL_ICONS[lvl.id] || School;
              return (
                <motion.div
                  key={lvl.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inViewOnce}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy-700 bg-navy-900 p-8 shadow-premium transition-all duration-300 hover:border-gold-400/60 hover:shadow-premium-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient text-navy-900 transition-transform duration-300 group-hover:scale-110">
                    <Icon size={26} strokeWidth={1.8} />
                  </div>
                  <p className="mt-5 font-body text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">
                    {lvl.grades}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold text-white">{lvl.title}</h3>
                  <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-navy-200">
                    {lvl.description}
                  </p>
                  <Link
                    to={`/academy/cbe/${lvl.id}`}
                    className="mt-6 inline-flex items-center gap-2 font-body text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300"
                  >
                    {lvl.button}
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
