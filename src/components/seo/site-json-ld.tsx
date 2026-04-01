import Script from 'next/script'
import { DEFAULT_OG_IMAGE, ORGANIZATION, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

/**
 * Site-wide Organization + WebSite structured data for Google rich results and knowledge panels.
 */
export default function SiteJsonLd() {
  const orgId = `${SITE_URL}/#organization`
  const websiteId = `${SITE_URL}/#website`

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': orgId,
      name: ORGANIZATION.name,
      legalName: ORGANIZATION.legalName,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}${DEFAULT_OG_IMAGE.path}`,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
        caption: DEFAULT_OG_IMAGE.alt,
      },
      description: SITE_DESCRIPTION,
      address: {
        '@type': 'PostalAddress',
        streetAddress: ORGANIZATION.address.streetAddress,
        addressLocality: ORGANIZATION.address.addressLocality,
        postalCode: ORGANIZATION.address.postalCode,
        addressCountry: ORGANIZATION.address.addressCountry,
      },
      areaServed: {
        '@type': 'Country',
        name: 'United Kingdom',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': websiteId,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: 'en-GB',
      publisher: { '@id': orgId },
    },
  ]

  return (
    <Script
      id="site-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph),
      }}
    />
  )
}
