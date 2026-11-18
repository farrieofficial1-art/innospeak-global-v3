import Seo from '../components/ui/Seo.jsx';

export default function RefundPolicy() {
  return (
    <><Seo title="Refund Policy" description="Draft refund policy for InnoSpeak Global." path="/refund-policy" />
      <section className="container-premium max-w-4xl py-16">
        <p className="inline-flex rounded-full bg-amber-50 px-3 py-1 font-body text-xs font-bold uppercase tracking-wider text-amber-800">Draft — legal review required</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-navy-900">Refund Policy</h1>
        <p className="mt-5 font-body leading-7 text-navy-600">This page is a placeholder for the approved institutional refund terms.</p>
        <div className="mt-10 space-y-6 font-body text-sm leading-7 text-navy-700">
          <p>Refund eligibility, notice periods, instalment treatment and exceptions must be confirmed before a course or programme is offered for paid enrolment.</p>
          <p>Approved terms should identify who to contact, how requests are submitted, the review timeline and the method and timing of approved refunds.</p>
        </div>
      </section>
    </>
  );
}
