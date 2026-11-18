import Seo from '../components/ui/Seo.jsx';

export default function Privacy() {
  return (
    <>
      <Seo title="Privacy" description="InnoSpeak Global privacy information." path="/privacy" />
      <section className="container-premium max-w-4xl py-16">
        <p className="inline-flex rounded-full bg-amber-50 px-3 py-1 font-body text-xs font-bold uppercase tracking-wider text-amber-800">
          Draft — legal review required
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold text-navy-900">Privacy Policy</h1>
        <p className="mt-5 font-body leading-7 text-navy-600">
          InnoSpeak Global should collect only the information needed to provide admissions, learning and student services.
        </p>
        <div className="mt-10 space-y-8 font-body text-sm leading-7 text-navy-700">
          <section>
            <h2 className="font-display text-xl font-bold text-navy-900">Information we may collect</h2>
            <p className="mt-2">Account details, application information, academic records, learning activity and support requests may be collected when those services are used.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-navy-900">Your choices</h2>
            <p className="mt-2">Learners should be able to request access to or correction of personal information through the appropriate support channel.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-navy-900">Third-party services</h2>
            <p className="mt-2">External payment, conferencing, storage or messaging services should receive only the information necessary for the selected service.</p>
          </section>
        </div>
      </section>
    </>
  );
}
