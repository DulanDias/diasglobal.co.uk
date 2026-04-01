/** Canonical site origin — use for absolute URLs in metadata, JSON-LD, and sitemaps. */
export const SITE_URL = 'https://diasglobal.co.uk' as const

export const SITE_NAME = 'Dias Global Limited' as const

export const SITE_DESCRIPTION =
  'Dias Global Limited is a UK family global holding company focused on real assets, technology, and entrepreneurial ventures. We deploy patient capital with rigorous operational discipline and a long‑term owner’s mindset to build enduring value.'

export const DEFAULT_OG_IMAGE = {
  path: '/logo.png' as const,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — UK family global holding company`,
}

export const ORGANIZATION = {
  name: SITE_NAME,
  legalName: SITE_NAME,
  companyNumber: '16594865',
  email: 'info@diasglobal.co.uk',
  address: {
    streetAddress: '71–75 Shelton Street, Covent Garden',
    addressLocality: 'London',
    postalCode: 'WC2H 9JQ',
    addressCountry: 'GB',
  },
} as const
