import { SelectField } from '../../ui';
import StepCard from '../StepCard';
import { ACADEMY, PATHWAYS, PROGRAMMES, INTAKES, STUDY_MODES } from '../../../lib/data/programmeData';

/**
 * Step1Programme — programme selection step.
 *
 * If the learner arrived via an Apply button on a specific programme,
 * the academy/pathway/programme/course code/duration/mode/fees are
 * pre-filled. Otherwise the learner selects manually from dropdowns.
 */
export default function Step1Programme({ data, errors, update }) {
  const availableProgrammes = data.pathway
    ? PROGRAMMES.filter((p) => p.pathwayId === data.pathway)
    : PROGRAMMES;

  const pathwayOptions = PATHWAYS.map((p) => ({ value: p.id, label: p.title }));

  const handleProgrammeChange = (e) => {
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
  };

  const handlePathwayChange = (e) => {
    update({
      pathway: e.target.value,
      programme: '',
      courseCode: '',
      duration: '',
      studyMode: '',
      fees: '',
    });
  };

  return (
    <StepCard
      stepNum={1}
      title="Programme Selection"
      description="Choose your academy, pathway, programme, intake and study mode. If you came from a specific programme, these may already be filled in."
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SelectField
          label="Academy"
          name="academy"
          value={data.academy}
          onChange={(e) => update({ academy: e.target.value })}
          error={errors.academy}
          required
          options={[{ value: ACADEMY, label: ACADEMY }]}
        />
        <SelectField
          label="Pathway"
          name="pathway"
          value={data.pathway}
          onChange={handlePathwayChange}
          error={errors.pathway}
          required
          placeholder="Select a pathway..."
          options={pathwayOptions}
        />
        <SelectField
          label="Programme"
          name="programme"
          value={data.courseCode}
          onChange={handleProgrammeChange}
          error={errors.programme}
          required
          placeholder="Select a programme..."
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
    </StepCard>
  );
}