import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_ORIGIN } from '../../config/site.js';

const DEFAULT_DESCRIPTION = 'InnoSpeak Global — Transforming communication, technical and leadership skills for the next generation.';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/og-default.svg`;

export function createCourseJsonLd({ name, description, url, provider = SITE_NAME }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: provider,
      url: SITE_ORIGIN,
    },
  };
}

export function createBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_ORIGIN}${item.path}`,
    })),
  };
}

export default function Seo({ title, description, path, image, type = 'website', jsonLd }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonical = `${SITE_ORIGIN}${path || '/'}`;
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_ORIGIN,
  };
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || DEFAULT_DESCRIPTION} />
      <meta name="robots" content="index,follow" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || DEFAULT_DESCRIPTION} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image || DEFAULT_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || DEFAULT_DESCRIPTION} />
      <meta name="twitter:image" content={image || DEFAULT_IMAGE} />
      <link rel="canonical" href={canonical} />
      <script type="application/ld+json">{JSON.stringify(jsonLd || organizationJsonLd)}</script>
    </Helmet>
  );
}
