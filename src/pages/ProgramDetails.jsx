import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Clock3, GraduationCap, Layers3, Users } from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import {
  getProgramBySlug,
  getProgramCourses,
  getProgramDurationSummary,
  getProgramStudyModes,
  getProgramCta,
} from '../lib/data/programmeData.js';

export default function ProgramDetails() {
  const { slug } = useParams();
  const program = getProgramBySlug(slug);

  if (!program || (program.status !== 'active' && program.status !== 'coming_soon')) {
    return (
      <>
        <Seo title="Program Not Found" description="This program could not be found." path={`/programs/${slug || ''}`} />
        <section className="container-premium py-24 text-center">
          <h1 className="font-display text-3xl font-bold text-navy-900">Program not found</h1>
          <p className="mt-3 font-body text-navy-500">This program may have been renamed or is no longer available.</p>
          <Link to="/programs" className="btn-gold mt-8 inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Programs
          </Link>
        </section>
      </>
    );
  }

  const courses = getProgramCourses(program.id);
  const durationSummary = getProgramDurationSummary(program.id);
  const studyModes = getProgramStudyModes(program.id);
  const cta = getProgramCta(program);

  const hasEntryRequirements = program.entryRequirements && program.entryRequirements.length > 0;
  const hasTargetAudience = Boolean(program.targetAudience);
  const hasLearningOutcomes = program.learningOutcomes && program.learningOutcomes.length > 0;
  const hasCareerPathways = program.careerPathways && program.careerPathways.length > 0;

  return (
    <>
      <Seo
        title={program.title}
        description={program.shortDescription || program.description}
        path={`/programs/${program.slug}`}
      />

      {/* HERO */}
      <section className="bg-navy-gradient text-white">
        <div className="container-premium py-16 sm:py-20">
          <Link to="/programs" className="inline-flex items-center gap-2 font-body text-xs font-semibold text-white/60 hover:text-white">
            <ArrowLeft size={14} /> All Programs
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-body text-xs font-bold uppercase tracking-wide text-gold-300">
              {program.programCode}
            </span>
            {program.status === 'coming_soon' && (
              <span className="rounded-full border border-gold-400/40 bg-gold-500/10 px-3 py-1 font-body text-xs font-bold uppercase tracking-wide text-gold-300">
                Coming Soon
              </span>
            )}
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">{program.title}</h1>
          <p className="mt-5 max-w-2xl font-body text-base leading-7 text-white/70">{program.shortDescription || program.description}</p>

          <div className="mt-8 flex flex-wrap gap-4 font-body text-sm text-white/70">
            <span className="inline-flex items-center gap-2"><GraduationCap size={16} /> {program.level}</span>
            {durationSummary && <span className="inline-flex items-center gap-2"><Clock3 size={16} /> {durationSummary}</span>}
            {studyModes.length > 0 && <span className="inline-flex items-center gap-2"><BookOpen size={16} /> {studyModes.join(' / ')}</span>}
            <span className="inline-flex items-center gap-2"><Layers3 size={16} /> {courses.length} course{courses.length === 1 ? '' : 's'}</span>
          </div>

          <div className="mt-9">
            {cta.disabled ? (
              <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-body text-sm font-bold text-white/50">
                {cta.label}
              </span>
            ) : (
              <Link to={cta.to} className="btn-gold inline-flex items-center gap-2">
                {cta.label} <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="container-premium max-w-4xl py-14 sm:py-16">
        {/* OVERVIEW */}
        <div>
          <h2 className="font-display text-2xl font-bold text-navy-900">Overview</h2>
          <p className="mt-4 font-body text-base leading-7 text-navy-600">{program.description}</p>
        </div>

        {/* WHO IT'S FOR */}
        {hasTargetAudience && (
          <div className="mt-12">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-navy-900"><Users size={20} className="text-gold-600" /> Who It's For</h2>
            <p className="mt-4 font-body text-base leading-7 text-navy-600">{program.targetAudience}</p>
          </div>
        )}

        {/* LEARNING OUTCOMES */}
        {hasLearningOutcomes && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-navy-900">Learning Outcomes</h2>
            <ul className="mt-4 space-y-2 font-body text-base leading-7 text-navy-600">
              {program.learningOutcomes.map((item, i) => <li key={i} className="flex gap-2"><span className="text-gold-600">•</span> {item}</li>)}
            </ul>
          </div>
        )}

        {/* ENTRY REQUIREMENTS */}
        {hasEntryRequirements && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-navy-900">Entry Requirements</h2>
            <ul className="mt-4 space-y-2 font-body text-base leading-7 text-navy-600">
              {program.entryRequirements.map((item, i) => <li key={i} className="flex gap-2"><span className="text-gold-600">•</span> {item}</li>)}
            </ul>
          </div>
        )}

        {/* PROGRAM STRUCTURE */}
        <div className="mt-12 rounded-2xl border border-navy-100 bg-navy-50/60 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-navy-900">Program Structure</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="font-body text-xs font-semibold uppercase tracking-wide text-navy-400">Program Type</dt>
              <dd className="mt-1 font-body text-sm text-navy-700">{program.programType}</dd>
            </div>
            <div>
              <dt className="font-body text-xs font-semibold uppercase tracking-wide text-navy-400">Duration</dt>
              <dd className="mt-1 font-body text-sm text-navy-700">{durationSummary || 'Varies by course'}</dd>
            </div>
            <div>
              <dt className="font-body text-xs font-semibold uppercase tracking-wide text-navy-400">Study Mode</dt>
              <dd className="mt-1 font-body text-sm text-navy-700">{studyModes.length ? studyModes.join(', ') : 'Varies by course'}</dd>
            </div>
            <div>
              <dt className="font-body text-xs font-semibold uppercase tracking-wide text-navy-400">Curriculum Version</dt>
              <dd className="mt-1 font-body text-sm text-navy-700">{program.curriculumVersion}</dd>
            </div>
          </dl>
        </div>

        {/* COURSES */}
        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold text-navy-900">Courses in This Program</h2>
          {courses.length === 0 ? (
            <p className="mt-4 rounded-xl bg-navy-50 p-6 font-body text-sm text-navy-500">Courses for this program will be published soon.</p>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {courses.map((course) => (
                <Link
                  key={course.code}
                  to={`/courses/${course.code}`}
                  className="rounded-2xl border border-navy-100 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-gold-500/10 px-2.5 py-1 font-body text-[11px] font-bold text-gold-700">{course.level}</span>
                    <span className="font-body text-xs font-semibold text-navy-400">{course.code}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-navy-900">{course.name}</h3>
                  <p className="mt-2 line-clamp-3 font-body text-sm leading-6 text-navy-500">{course.shortDescription}</p>
                  <div className="mt-4 flex flex-wrap gap-3 font-body text-xs text-navy-500">
                    <span className="inline-flex items-center gap-1"><Clock3 size={13} /> {course.duration}</span>
                    <span className="inline-flex items-center gap-1"><BookOpen size={13} /> {course.studyMode}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CAREER PATHWAYS */}
        {hasCareerPathways && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-navy-900">Career Pathways</h2>
            <ul className="mt-4 space-y-2 font-body text-base leading-7 text-navy-600">
              {program.careerPathways.map((item, i) => <li key={i} className="flex gap-2"><span className="text-gold-600">•</span> {item}</li>)}
            </ul>
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 rounded-2xl bg-navy-900 p-8 text-center text-white sm:p-10">
          <h2 className="font-display text-2xl font-bold">Ready to get started?</h2>
          <p className="mt-2 font-body text-sm text-white/70">
            {cta.disabled ? 'This program will open for applications soon.' : 'Take the next step in your learning journey.'}
          </p>
          <div className="mt-6">
            {cta.disabled ? (
              <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-body text-sm font-bold text-white/50">
                {cta.label}
              </span>
            ) : (
              <Link to={cta.to} className="btn-gold inline-flex items-center gap-2">
                {cta.label} <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
