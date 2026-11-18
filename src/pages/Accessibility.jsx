import Seo from '../components/ui/Seo.jsx';

export default function Accessibility() {
  return (
    <><Seo title="Accessibility" description="InnoSpeak Global accessibility statement." path="/accessibility" />
      <section className="container-premium max-w-4xl py-16">
        <p className="inline-flex rounded-full bg-amber-50 px-3 py-1 font-body text-xs font-bold uppercase tracking-wider text-amber-800">Draft — legal review required</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-navy-900">Accessibility Statement</h1>
        <p className="mt-5 font-body leading-7 text-navy-600">InnoSpeak Global aims to provide an accessible experience across learning, applications and institutional services.</p>
        <div className="mt-10 space-y-6 font-body text-sm leading-7 text-navy-700">
          <p>Where an accessibility barrier is encountered, users can report the affected page and describe the issue through the contact form.</p>
          <p>Accessibility support, assistive formats and review commitments should be confirmed during legal and operational review.</p>
        </div>
      </section>
    </>
  );
}
