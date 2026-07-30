import Seo from '../components/ui/Seo.jsx';
import Button from '../components/ui/Button.jsx';

export default function PlaceholderPage({
  title,
  description,
  path,
  eyebrow,
}) {
  return (
    <>
      <Seo
        title={title}
        description={description}
        path={path}
      />
      <section className="flex min-h-[60vh] items-center bg-navy-radial">
        <div className="container-premium flex flex-col items-center gap-6 py-24 text-center">
          {eyebrow && <span className="eyebrow border-white/20 text-gold-300">{eyebrow}</span>}
          <h1 className="font-display text-4xl text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-navy-100 sm:text-lg">
            {description}
          </p>
          <Button to="/" variant="primary" size="lg">
            Back to Home
          </Button>
        </div>
      </section>
    </>
  );
}
