import { motion } from 'framer-motion';
import { GraduationCap, FlaskConical, Check, BookOpen, Cpu } from 'lucide-react';
import { SelectField } from '../../ui';
import StepCard from '../StepCard';
import {
  ACADEMY,
  PATHWAYS,
  PROGRAMMES,
  INTAKES,
  STUDY_MODES,
  getAcademyPathways,
  getLabsCourses,
  getAcademyCourses,
} from '../../../lib/data/programmeData';
import { LAB_SCHOOLS } from '../../../lib/data/labsData';

const DIVISIONS = [
  {
    id: 'academy',
    label: 'InnoSpeak Global Academy',
    icon: GraduationCap,
    tagline: 'Structured Professional Learning',
    description:
      'Academic, professional and structured learning. Courses, programs, skills and certification.',
    accent: 'from-gold-500/15 to-gold-400/5',
    border: 'border-gold-500/40',
    iconBg: 'bg-gold-gradient',
  },
  {
    id: 'labs',
    label: 'InnoSpeak Global Labs',
    icon: FlaskConical,
    tagline: 'Practical Innovation & Engineering',
    description:
      'Practical learning. Engineering, technology, innovation, projects and hands-on development.',
    accent: 'from-navy-500/15 to-navy-400/5',
    border: 'border-navy-400/40',
    iconBg: 'bg-navy-700',
  },
];

/**
 * Step1Programme — division + programme selection step.
 *
 * Applicants first choose between Academy and Labs using selectable cards.
 * The pathway and programme dropdowns then filter to show only courses
 * for the selected division. If the learner arrived via an Apply button
 * on a specific programme, fields are pre-filled.
 */
export default function Step1Programme({ data, errors, update }) {
  const isAcademy = data.division === 'academy';
  const isLabs = data.division === 'labs';

  const availablePathways = isAcademy
    ? getAcademyPathways()
    : isLabs
      ? LAB_SCHOOLS.map((s) => ({ id: s.id, title: s.title }))
      : [];

  const availableProgrammes = data.pathway
    ? PROGRAMMES.filter((p) => p.pathwayId === data.pathway)
    : [];

  function handleDivisionChange(divisionId) {
    const division = DIVISIONS.find((d) => d.id === divisionId);
    update({
      division: divisionId,
      academy: division ? division.label : '',
      pathway: '',
      programme: '',
      courseCode: '',
      duration: '',
      studyMode: '',
      fees: '',
    });
  }

  function handlePathwayChange(e) {
    update({
      pathway: e.target.value,
      programme: '',
      courseCode: '',
      duration: '',
      studyMode: '',
      fees: '',
    });
  }

  function handleProgrammeChange(e) {
    const code = e.target.value;
    const programme = PROGRAMMES.find((p) => p.code === code);
    if (programme) {
      update({
        programme: programme.name,
        courseCode: code,
        pathway: programme.pathwayId,
        duration: programme.duration,
        studyMode: programme.studyMode,
        fees: programme.fees,
      });
    }
  }

  return (
    <StepCard
      stepNum={1}
      title="Choose Your Pathway"
      description="Select your InnoSpeak Global division, then pick your programme, intake and study mode. If you came from a specific programme, these may already be filled in."
    >
      {/* Pre-filled info banner */}
      {data.courseCode && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-gold-500/30 bg-gold-500/5 px-5 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-700">
            Pre-selected
          </span>
          <span className="font-mono text-sm font-bold text-navy-900">{data.courseCode}</span>
          <span className="text-sm text-navy-600">— {data.programme}</span>
        </div>
      )}

      {/* Division selection cards */}
      <div>
        <p className="mb-4 font-body text-sm font-bold tracking-wide text-navy-900">
          Which division are you applying to?
          <span className="ml-1 text-gold-600">*</span>
        </p>
        {errors.division && (
          <p className="mb-3 font-body text-xs font-semibold text-red-500">{errors.division}</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {DIVISIONS.map((div) => {
            const selected = data.division === div.id;
            const Icon = div.icon;

            return (
              <button
                key={div.id}
                type="button"
                onClick={() => handleDivisionChange(div.id)}
                className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
                  selected
                    ? `${div.border} bg-gradient-to-br ${div.accent} shadow-lg`
                    : 'border-navy-100 bg-white hover:border-gold-300 hover:shadow-md'
                }`}
              >
                {/* Selected checkmark */}
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-navy-900"
                  >
                    <Check size={16} strokeWidth={3} />
                  </motion.div>
                )}

                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${div.iconBg} text-white shadow-md`}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy-900">
                      {div.label}
                    </h3>
                    <p className="mt-0.5 font-body text-xs font-semibold uppercase tracking-wider text-gold-700">
                      {div.tagline}
                    </p>
                    <p className="mt-2 font-body text-sm leading-relaxed text-navy-600">
                      {div.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pathway + Programme + Intake + Study Mode (only after division selected) */}
      {data.division && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="h-px bg-gradient-to-r from-gold-300/60 via-navy-100 to-transparent" />

          <div className="pt-6">
            <p className="mb-4 flex items-center gap-2 font-body text-sm font-bold tracking-wide text-navy-900">
              {isAcademy ? <BookOpen size={16} className="text-gold-600" /> : <Cpu size={16} className="text-gold-600" />}
              {isAcademy ? 'Choose your Academy programme' : 'Choose your Labs school'}
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SelectField
                label={isAcademy ? 'Programme' : 'Lab School'}
                name="pathway"
                value={data.pathway}
                onChange={handlePathwayChange}
                error={errors.pathway}
                required
                placeholder={isAcademy ? 'Select a programme...' : 'Select a lab school...'}
                options={availablePathways.map((p) => ({
                  value: p.id,
                  label: p.title,
                }))}
              />

              <SelectField
                label="Course"
                name="programme"
                value={data.courseCode}
                onChange={handleProgrammeChange}
                error={errors.programme}
                required
                placeholder="Select a course..."
                options={availableProgrammes.map((p) => ({
                  value: p.code,
                  label: `${p.code} — ${p.name}`,
                }))}
                className="sm:col-span-2"
              />

              <SelectField
                label="Intake"
                name="intake"
                value={data.intake}
                onChange={(e) => update({ intake: e.target.value })}
                error={errors.intake}
                required
                placeholder="Select intake..."
                options={INTAKES}
              />

              <SelectField
                label="Study Mode"
                name="studyMode"
                value={data.studyMode}
                onChange={(e) => update({ studyMode: e.target.value })}
                error={errors.studyMode}
                required
                placeholder="Select study mode..."
                options={STUDY_MODES}
              />
            </div>

            {/* Auto-filled summary */}
            {(data.duration || data.fees) && (
              <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-cream px-5 py-4 sm:grid-cols-3">
                {data.duration && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-navy-600">Duration</p>
                    <p className="mt-1 text-sm font-bold text-navy-900">{data.duration}</p>
                  </div>
                )}
                {data.fees && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-navy-600">Fees</p>
                    <p className="mt-1 text-sm font-bold text-navy-900">{data.fees}</p>
                  </div>
                )}
                {data.courseCode && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-navy-600">Course Code</p>
                    <p className="mt-1 text-sm font-bold text-navy-900">{data.courseCode}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </StepCard>
  );
}
