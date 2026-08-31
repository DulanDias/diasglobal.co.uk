import Script from 'next/script'
import type { BlogPost } from '@/lib/blog-posts'
import { OG_IMAGE_SIZE } from '@/lib/blog-posts'
import { SITE_URL, ORGANIZATION } from '@/lib/site'
import type { Vacancy } from '@/lib/careers'
import type { Product } from '@/lib/island-merchant'
import { PRODUCTS, FAQ_ITEMS, IM_PAGE_URL, LOGO } from '@/lib/island-merchant'

interface CalculatorSchemaProps {
  name: string
  description: string
  url: string
  country: string
  category: string
}

export function CalculatorSchema({ name, description, url, country, category }: CalculatorSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "provider": {
      "@type": "Organization",
      "name": "Dias Global Limited",
      "url": "https://diasglobal.co.uk"
    },
    "featureList": [
      "Tax calculations",
      "Salary breakdown",
      "Financial planning",
      "Downloadable reports"
    ],
    "screenshot": "https://diasglobal.co.uk/logo.png",
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "en-GB",
    "audience": {
      "@type": "Audience",
      "geographicArea": {
        "@type": "Country",
        "name": country
      }
    },
    "about": {
      "@type": "Thing",
      "name": category
    }
  }

  return (
    <Script
      id="calculator-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

interface ToolSchemaProps {
  name: string
  description: string
  url: string
  country: string
  category: string
  features: string[]
}

export function ToolSchema({ name, description, url, country, category, features }: ToolSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "provider": {
      "@type": "Organization",
      "name": "Dias Global Limited",
      "url": "https://diasglobal.co.uk"
    },
    "featureList": features,
    "screenshot": "https://diasglobal.co.uk/logo.png",
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "en-GB",
    "audience": {
      "@type": "Audience",
      "geographicArea": {
        "@type": "Country",
        "name": country
      }
    },
    "about": {
      "@type": "Thing",
      "name": category
    }
  }

  return (
    <Script
      id="tool-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

interface BlogCollectionSchemaProps {
  posts: BlogPost[]
}

export function BlogCollectionSchema({ posts }: BlogCollectionSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Dias Global Blog: Investment & Innovation Insights',
    description:
      'Expert insights on investment strategies, technology trends, and entrepreneurial ventures from Dias Global Limited.',
    url: `${SITE_URL}/blog`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Dias Global Limited',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dias Global Limited',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}${post.href}`,
        name: post.title,
      })),
    },
  }

  return (
    <Script
      id="blog-collection-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  )
}

interface BlogPostingSchemaProps {
  post: BlogPost
}

export function BlogPostingSchema({ post }: BlogPostingSchemaProps) {
  const url = `${SITE_URL}${post.href}`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: [
      {
        '@type': 'ImageObject',
        url: `${SITE_URL}${post.ogImageJpg}`,
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        caption: post.imageAlt,
      },
      {
        '@type': 'ImageObject',
        url: `${SITE_URL}${post.ogImageWebp}`,
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        caption: post.imageAlt,
      },
    ],
    datePublished: post.publishedTime,
    dateModified: post.modifiedTime,
    author: {
      '@type': 'Organization',
      name: 'Dias Global Limited',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dias Global Limited',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    articleSection: post.openGraphSection,
    keywords: post.keywords.join(', '),
    inLanguage: 'en-GB',
    isAccessibleForFree: true,
  }

  return (
    <Script
      id={`blog-post-schema-${post.slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  )
}

interface ToolsPageSchemaProps {
  tools: Array<{
    name: string
    description: string
    url: string
    country: string
    category: string
  }>
}

export function ToolsPageSchema({ tools }: ToolsPageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Financial Tools & Calculators",
    "description": "Free financial tools and calculators for UK and Sri Lanka. Calculate take-home pay, rent vs mortgage, and more.",
    "url": "https://diasglobal.co.uk/tools",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": tools.map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SoftwareApplication",
          "name": tool.name,
          "description": tool.description,
          "url": tool.url,
          "applicationCategory": "FinanceApplication",
          "audience": {
            "@type": "Audience",
            "geographicArea": {
              "@type": "Country",
              "name": tool.country
            }
          }
        }
      }))
    },
    "provider": {
      "@type": "Organization",
      "name": "Dias Global Limited",
      "url": "https://diasglobal.co.uk"
    }
  }

  return (
    <Script
      id="tools-page-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

export function FoundationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "Dias Global Foundation",
    "alternateName": "The Dias Global Foundation",
    "url": `${SITE_URL}/foundation`,
    "logo": `${SITE_URL}/logo.png`,
    "description":
      "The charitable arm of Dias Global Limited. The Dias Global Foundation identifies and helps people in genuine need, providing vetted one-off and recurring support until a defined milestone is reached.",
    "parentOrganization": {
      "@type": "Organization",
      "name": "Dias Global Limited",
      "url": SITE_URL
    },
    "areaServed": {
      "@type": "Place",
      "name": "Global"
    },
    "knowsAbout": [
      "Charitable giving",
      "Education sponsorship",
      "Family welfare support",
      "Humanitarian assistance"
    ],
    "potentialAction": {
      "@type": "DonateAction",
      "name": "Contribute to the Foundation Fund",
      "recipient": {
        "@type": "NGO",
        "name": "Dias Global Foundation"
      }
    }
  }

  return (
    <Script
      id="foundation-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

/* ==========================================================================
   THE ISLAND MERCHANT
   --------------------------------------------------------------------------
   PRE-LAUNCH. There is no stock, no price list and no way to order yet, so
   these nodes carry NO Offer, NO price, NO availability, NO aggregateRating and
   NO review. Inventing any of them would be a lie to the reader and a
   structured-data violation (Google treats fabricated offer/rating markup as
   spam and can manually action the whole domain). Add Offer + AggregateOffer
   only when there is a real, purchasable product behind it.

   The contact address (merchant@diasglobal.co.uk) is deliberately absent: the
   page assembles it client-side from base64 parts precisely so no plaintext
   address ships in the HTML, and JSON-LD is HTML. Putting it here would undo
   that on every one of these pages.
   ========================================================================== */

const IM_ORG_ID = `${IM_PAGE_URL}#organization`
const DGL_ORG_ID = `${SITE_URL}/#organization`

const DGL_POSTAL_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: ORGANIZATION.address.streetAddress,
  addressLocality: ORGANIZATION.address.addressLocality,
  postalCode: ORGANIZATION.address.postalCode,
  addressCountry: ORGANIZATION.address.addressCountry,
} as const

const IM_DESCRIPTION =
  'The Island Merchant is the import and distribution line of Dias Global Limited, supplying Sri Lankan products to the United Kingdom and Europe. The range covers Ceylon cinnamon sticks graded C4 and diced kithul jaggery, in sealed retail packs, for both retail and trade buyers.'

/** Brand / Organization node for The Island Merchant, tied to Dias Global
 *  Limited in both directions (parentOrganization on the child, subOrganization
 *  and brand on the parent) so a consumer arriving at either node can resolve
 *  the relationship without crawling the other page. */
export function IslandMerchantSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'Brand'],
        '@id': IM_ORG_ID,
        name: 'The Island Merchant',
        url: IM_PAGE_URL,
        description: IM_DESCRIPTION,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}${LOGO.light.png}`,
          width: LOGO.light.width,
          height: LOGO.light.height,
        },
        image: `${SITE_URL}${LOGO.light.png}`,
        parentOrganization: {
          '@type': 'Organization',
          '@id': DGL_ORG_ID,
          name: ORGANIZATION.legalName,
          url: SITE_URL,
        },
        address: DGL_POSTAL_ADDRESS,
        areaServed: [
          { '@type': 'Country', name: 'United Kingdom' },
          { '@type': 'Place', name: 'Europe' },
        ],
        knowsAbout: [
          'Ceylon cinnamon',
          'Kithul jaggery',
          'Sri Lankan food products',
          'Import and distribution',
        ],
        inLanguage: 'en-GB',
      },
      {
        '@type': 'Organization',
        '@id': DGL_ORG_ID,
        name: ORGANIZATION.legalName,
        url: SITE_URL,
        identifier: ORGANIZATION.companyNumber,
        address: DGL_POSTAL_ADDRESS,
        subOrganization: { '@id': IM_ORG_ID },
        brand: { '@id': IM_ORG_ID },
      },
    ],
  }

  return (
    <Script
      id="island-merchant-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface IslandMerchantProductSchemaProps {
  /** Defaults to every product. Pass a subset for a single-product page. */
  products?: Product[]
}

/** Product nodes for the retail packs. Weight, grade and origin come from
 *  src/lib/island-merchant.ts, which is the single source of the pack facts —
 *  do not restate them here or the markup and the visible copy will drift. */
export function IslandMerchantProductSchema({
  products = PRODUCTS,
}: IslandMerchantProductSchemaProps = {}) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': products.map((product) => ({
      '@type': 'Product',
      '@id': `${IM_PAGE_URL}#product-${product.slug}`,
      name: product.name,
      description: product.copy.join(' '),
      url: `${IM_PAGE_URL}#im-products`,
      image: [
        `${SITE_URL}${product.images.front.jpg}`,
        `${SITE_URL}${product.images.scene.jpg}`,
      ],
      brand: { '@id': IM_ORG_ID },
      countryOfOrigin: { '@type': 'Country', name: 'Sri Lanka' },
      weight: {
        '@type': 'QuantitativeValue',
        value: product.packWeightGrams,
        unitCode: 'GRM',
        unitText: 'g',
      },
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Botanical name',
          value: product.botanicalName,
        },
        ...product.specs.map((spec) => ({
          '@type': 'PropertyValue',
          name: spec.label,
          value: spec.value,
        })),
      ],
      inLanguage: 'en-GB',
      // No offers / price / availability / aggregateRating / review — pre-launch.
    })),
  }

  return (
    <Script
      id="island-merchant-product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/** FAQPage for /island-merchant. Questions and answers are read straight from
 *  FAQ_ITEMS, which is the same array the visible accordion renders, so the
 *  markup cannot fall out of step with what the user can actually see —
 *  Google's FAQ policy requires the full Q and A to be visible on the page. */
export function IslandMerchantFaqSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${IM_PAGE_URL}#faq`,
    inLanguage: 'en-GB',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <Script
      id="island-merchant-faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/* ==========================================================================
   CAREERS
   ========================================================================== */

interface JobPostingSchemaProps {
  vacancy: Vacancy
}

/**
 * JobPosting for a live vacancy.
 *
 * DELIBERATELY OMITTED: baseSalary and employmentType.
 *
 * The owner has instructed that no remuneration figure and no engagement type
 * may be published, and the source role-scope document is confidential. Neither
 * property is required by Google's JobPosting structured-data spec — the
 * required set is title, description, datePosted and hiringOrganization, plus
 * jobLocation OR (jobLocationType + applicantLocationRequirements), all of
 * which are present. The posting therefore remains fully eligible for the
 * Google Jobs experience.
 *
 * WHAT THE OMISSION COSTS, precisely:
 *   - baseSalary: the listing shows no salary line. Google may display its own
 *     estimated range instead, sourced from third-party data we do not control.
 *     The listing is excluded from salary-range filtering, so a jobseeker who
 *     narrows by pay will not see it. Salary is a "recommended" property, so
 *     Rich Results Test / Search Console report it as a non-blocking warning,
 *     not an error.
 *   - employmentType: the listing is excluded from the FULL_TIME / PART_TIME /
 *     CONTRACTOR job-type filter. Note that the free-text workHours value
 *     ("Full-time equivalent, coordinated to UK business hours") is descriptive
 *     only and does NOT feed that filter, and does not assert a contractual
 *     employment status.
 * Net effect: full eligibility, reduced discoverability inside two filters, two
 * non-blocking warnings. That is the accepted trade for not publishing terms.
 *
 * Nothing here identifies any individual: no names, addresses or identity
 * numbers appear in the vacancy data or in this markup.
 */
export function JobPostingSchema({ vacancy }: JobPostingSchemaProps) {
  const url = `${SITE_URL}/careers/${vacancy.slug}`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    '@id': `${url}#jobposting`,
    title: vacancy.title,
    description: vacancy.descriptionHtml,
    identifier: {
      '@type': 'PropertyValue',
      name: ORGANIZATION.legalName,
      value: vacancy.identifier,
    },
    datePosted: vacancy.datePosted,
    validThrough: vacancy.validThrough,
    hiringOrganization: {
      '@type': 'Organization',
      '@id': DGL_ORG_ID,
      name: ORGANIZATION.legalName,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      address: DGL_POSTAL_ADDRESS,
    },
    // TELECOMMUTE + applicantLocationRequirements is the correct pairing for a
    // fully remote role. jobLocation is intentionally absent: Google treats a
    // physical jobLocation on a TELECOMMUTE posting as contradictory, and we
    // have no office for the holder to attend.
    jobLocationType: 'TELECOMMUTE',
    applicantLocationRequirements: {
      '@type': 'Country',
      name: vacancy.applicantCountry,
    },
    workHours: vacancy.workHours,
    occupationalCategory: vacancy.occupationalCategory,
    industry: vacancy.industry,
    // false, and deliberately. Google defines directApply as "the whole application can
    // be completed at this URL without navigating elsewhere". It cannot: Formspree's free
    // plan carries no attachments, so the success state tells the applicant to email their
    // CV separately, and the application is not assessable until they do. Declaring true
    // would surface this in the Google Jobs apply experience as a complete flow and lose
    // every application from a candidate who closed the tab after seeing the reference.
    directApply: false,
    url,
    inLanguage: 'en-GB',
  }

  return (
    <Script
      id={`job-posting-schema-${vacancy.slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface CareersPageSchemaProps {
  vacancies: Vacancy[]
}

/** CollectionPage for /careers. Each item points at the JobPosting node by
 *  @id rather than repeating it, so the vacancy page stays the single canonical
 *  source of the posting. */
export function CareersPageSchema({ vacancies }: CareersPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/careers#collection`,
    name: 'Careers at Dias Global Limited',
    description:
      'Current openings at Dias Global Limited, a UK company with interests across real assets, technology and entrepreneurial ventures.',
    url: `${SITE_URL}/careers`,
    inLanguage: 'en-GB',
    isPartOf: {
      '@type': 'WebSite',
      name: ORGANIZATION.legalName,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      '@id': DGL_ORG_ID,
      name: ORGANIZATION.legalName,
      url: SITE_URL,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: vacancies.length,
      itemListElement: vacancies.map((vacancy, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/careers/${vacancy.slug}`,
        name: vacancy.title,
        item: { '@id': `${SITE_URL}/careers/${vacancy.slug}#jobposting` },
      })),
    },
  }

  return (
    <Script
      id="careers-page-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaItem {
  name: string
  /** Site-root-relative path, e.g. '/careers'. */
  item: string
}

interface BreadcrumbListSchemaProps {
  items: BreadcrumbSchemaItem[]
}

/** Machine-readable counterpart to the visible <Breadcrumb>. The last crumb has no href in
 *  the visible component but does carry an item URL here, which is what Google expects. */
export function BreadcrumbListSchema({ items }: BreadcrumbListSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: `${SITE_URL}${entry.item}`,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
