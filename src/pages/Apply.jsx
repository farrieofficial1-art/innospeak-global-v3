import { useState } from 'react';
import Seo from '../components/ui/Seo';
import { Button } from '../components/ui';
import AdmissionsHero from '../components/admissions/AdmissionsHero';
import Stepper from '../components/admissions/Stepper';
import ApplicationSuccess from '../components/admissions/ApplicationSuccess';

import Step1Programme from '../components/admissions/steps/Step1Programme';
import Step2Personal from '../components/admissions/steps/Step2Personal';
import Step3Address from '../components/admissions/steps/Step3Address';
import Step4Education from '../components/admissions/steps/Step4Education';
import Step5Preferences from '../components/admissions/steps/Step5Preferences';
import Step6Documents from '../components/admissions/steps/Step6Documents';
import Step7Review from '../components/admissions/steps/Step7Review';
import { submitApplication, downloadSummary } from '../lib/supabase/applications';

/**
 * generateId — crypto.randomUUID() requires a secure context (HTTPS or
 * localhost) and is undefined in some dev/preview setups. Falling back
 * avoids crashing the whole page on mount when it's unavailable.
 */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Apply — the seven-step admissions form.
 *
 * `draftId` is generated once per form session and passed down to
 * Step6Documents, which needs it to group a given applicant's document
 * uploads in Supabase Storage before an application_number exists yet
 * (see lib/supabase/storage.js).
 */
export default function Apply() {
  const [step, setStep] = useState(1);
  const [draftId] = useState(() => generateId());

  const [data, setData] = useState({
    academy: 'InnoSpeak Global Academy',
    pathway: '',
    programme: '',
    courseCode: '',
    duration: '',
    studyMode: '',
    fees: '',
    intake: '',

    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    phoneNumber: '',
    whatsappNumber: '',
    email: '',
    nationalId: '',

    country: '',
    countyState: '',
    city: '',
    postalAddress: '',

    educationLevel: '',
    institution: '',
    yearCompleted: '',
    currentOccupation: '',

    preferredSchedule: '',
    preferredLearningMode: '',
    referralSource: '',

    documents: {},
    declaration: false,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function update(values) {
    setData((prev) => ({ ...prev, ...values }));
  }

  function validateStep() {
    const e = {};

    if (step === 1) {
      if (!data.pathway) e.pathway = 'Required';
      if (!data.programme) e.programme = 'Required';
      if (!data.intake) e.intake = 'Required';
      if (!data.studyMode) e.studyMode = 'Required';
    }

    if (step === 2) {
      if (!data.firstName) e.firstName = 'Required';
      if (!data.lastName) e.lastName = 'Required';
      if (!data.gender) e.gender = 'Required';
      if (!data.dateOfBirth) e.dateOfBirth = 'Required';
      if (!data.nationality) e.nationality = 'Required';
      if (!data.phoneNumber) e.phoneNumber = 'Required';
      if (!data.email) e.email = 'Required';
    }

    if (step === 3) {
      if (!data.country) e.country = 'Required';
      if (!data.countyState) e.countyState = 'Required';
      if (!data.city) e.city = 'Required';
    }

    if (step === 4) {
      if (!data.educationLevel) e.educationLevel = 'Required';
      if (!data.institution) e.institution = 'Required';
      if (!data.yearCompleted) e.yearCompleted = 'Required';
    }

    if (step === 5) {
      if (!data.preferredSchedule) e.preferredSchedule = 'Required';
      if (!data.preferredLearningMode) e.preferredLearningMode = 'Required';
    }

    if (step === 7) {
      if (!data.declaration) e.declaration = 'Please accept the declaration.';
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (!validateStep()) return;
    if (step < 7) setStep(step + 1);
  }

  function previousStep() {
    if (step > 1) setStep(step - 1);
  }

  async function handleSubmit() {
    if (!validateStep()) return;
    setSubmitError('');

    const allDocFiles = Object.values(data.documents || {}).flat();

    if (allDocFiles.some((f) => f.status === 'uploading')) {
      setSubmitError('Please wait for all documents to finish uploading before submitting.');
      return;
    }

    if (allDocFiles.some((f) => f.status === 'error')) {
      setSubmitError('One or more documents failed to upload. Please retry or remove them before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);

      const sanitizedDocuments = Object.fromEntries(
        Object.entries(data.documents || {}).map(([key, docFiles]) => [
          key,
          docFiles.map(({ _file, ...rest }) => rest),
        ])
      );

      const result = await submitApplication({ ...data, documents: sanitizedDocuments });

      setApplicationNumber(result.applicationNumber);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'We could not submit your application. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <>
        <Seo title="Application Submitted" path="/apply" />
        <ApplicationSuccess
          application={data}
          applicationNumber={applicationNumber}
          onDownload={() => downloadSummary(data, applicationNumber)}
        />
      </>
    );
  }

  return (
    <>
      <Seo title="Apply" path="/apply" />

      <AdmissionsHero>
        <Stepper current={step} onStepClick={setStep} />
      </AdmissionsHero>

      <section className="container-premium py-12">
        {step === 1 && <Step1Programme data={data} errors={errors} update={update} />}

        {step === 2 && <Step2Personal data={data} errors={errors} update={update} />}

        {step === 3 && <Step3Address data={data} errors={errors} update={update} />}

        {step === 4 && <Step4Education data={data} errors={errors} update={update} />}

        {step === 5 && <Step5Preferences data={data} errors={errors} update={update} />}

        {step === 6 && (
          <Step6Documents data={data} errors={errors} update={update} draftId={draftId} />
        )}

        {submitError && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">{submitError}</div>
        )}

        {step === 7 && (
          <Step7Review
            data={data}
            errors={errors}
            update={update}
            onEdit={setStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {step < 7 && (
          <div className="mt-10 flex items-center justify-between">
            <Button variant="outline" onClick={previousStep} disabled={step === 1}>
              Back
            </Button>

            <Button variant="gold" onClick={nextStep} withArrow={false}>
              Continue
            </Button>
          </div>
        )}
      </section>
    </>
  );
}