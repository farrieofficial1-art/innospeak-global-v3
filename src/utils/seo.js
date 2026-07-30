import { BRAND } from './constants.js';

export function buildSeo({
  title,
  description,
  path,
  image,
  type = 'website',
}) {
  const fullTitle = `${title} | ${BRAND.name}`;
  const canonicalUrl = `${BRAND.url}${path || ''}`;
  const ogImage = image || `${BRAND.url}/og-image.png`;

  return {
    fullTitle,
    description,
    canonicalUrl,
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      type,
      siteName: BRAND.name,
      image: ogImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      image: ogImage,
    },
  };
}

export function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: BRAND.name,
    description: BRAND.shortDescription,
    url: BRAND.url,
    email: BRAND.contact.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: BRAND.contact.address,
    },
  };
}
