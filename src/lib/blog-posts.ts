import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'

export { SITE_URL }

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const
export const CARD_IMAGE_SIZE = { width: 800, height: 420 } as const

export interface BlogPost {
  slug: string
  title: string
  metaTitle: string
  description: string
  excerpt: string
  category: string
  date: string
  readTime: string
  href: string
  tags: string[]
  keywords: string[]
  cardImage: string
  ogImageJpg: string
  ogImageWebp: string
  imageAlt: string
  openGraphSection: string
  openGraphTags: string[]
  publishedTime: string
  modifiedTime: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'uk-remortgage-guide-2026',
    title: 'Remortgaging in the UK: Fees, Fixes, and When Equity Opens Up',
    metaTitle:
      'Remortgaging in the UK: Fees, Fixed Rates, Further Advances & What to Check | Dias Global',
    description:
      'A practical UK-focused look at remortgages: product fees, fixed vs variable terms, two- versus five-year fixes, further advances, and what to verify before using equity for other investments. General information only, not personal advice.',
    excerpt:
      'Fees, fixes, term length, and further advances. What UK homeowners often overlook before they remortgage, and why the small print matters more than the headline rate.',
    category: 'Property Finance',
    date: 'April 1, 2026',
    readTime: '11 min read',
    href: '/blog/uk-remortgage-guide-2026',
    tags: ['Remortgage', 'UK Property', 'Mortgage'],
    keywords: [
      'remortgage UK',
      'UK mortgage fees',
      'fixed rate mortgage',
      'further advance',
      'product fee mortgage',
      'remortgage equity',
      'two year vs five year fix',
      'loan to value',
    ],
    cardImage: '/blog/uk-remortgage-guide-2026-card.webp',
    ogImageJpg: '/blog/uk-remortgage-guide-2026-og.jpg',
    ogImageWebp: '/blog/uk-remortgage-guide-2026-og.webp',
    imageAlt:
      'Warm daylight on a kitchen table with house keys, papers, and tea, suggesting a calm moment to review remortgage options at home.',
    openGraphSection: 'Property Finance',
    openGraphTags: ['Remortgage', 'UK Mortgages', 'Property Finance'],
    publishedTime: '2026-04-01T00:00:00+00:00',
    modifiedTime: '2026-04-01T00:00:00+00:00',
  },
  {
    slug: 'ai-investment-trends-2024',
    title: 'The Future of AI Investment: Trends to Watch in 2025',
    metaTitle: 'AI Investment Trends 2025: The Future of Artificial Intelligence Investment | Dias Global',
    description:
      'Discover the key AI investment opportunities and emerging trends that will define the artificial intelligence landscape in 2025. Expert analysis on AI investment strategies, market dynamics, and risk considerations.',
    excerpt:
      'As artificial intelligence continues to reshape industries, we explore the key investment opportunities and emerging trends that will define the AI landscape in 2025 and beyond.',
    category: 'Technology',
    date: 'August 31, 2025',
    readTime: '5 min read',
    href: '/blog/ai-investment-trends-2024',
    tags: ['AI', 'Investment', 'Technology'],
    keywords: [
      'AI investment',
      'artificial intelligence investment',
      'AI trends 2025',
      'technology investment',
      'AI market analysis',
      'investment opportunities',
      'AI startups',
      'machine learning investment',
    ],
    cardImage: '/blog/ai-investment-trends-2024-card.webp',
    ogImageJpg: '/blog/ai-investment-trends-2024-og.jpg',
    ogImageWebp: '/blog/ai-investment-trends-2024-og.webp',
    imageAlt:
      'Abstract visualization of AI and machine learning networks representing artificial intelligence investment trends and technology strategy.',
    openGraphSection: 'Technology Investment',
    openGraphTags: ['AI Investment', 'Artificial Intelligence', 'Technology Trends'],
    publishedTime: '2024-08-31T00:00:00+00:00',
    modifiedTime: '2024-08-31T00:00:00+00:00',
  },
  {
    slug: 'real-estate-investment-strategy-2025',
    title: 'Strategic Real Estate Investment: The Renovation-to-Rental Model',
    metaTitle: 'Strategic Real Estate Investment: The Renovation-to-Rental Model | Dias Global',
    description:
      "Discover Dias Global's innovative approach to real estate investment: purchasing undervalued properties, executing strategic renovations, and creating sustainable rental income streams.",
    excerpt:
      "Discover Dias Global's innovative approach to real estate investment: purchasing undervalued properties, executing strategic renovations, and creating sustainable rental income streams.",
    category: 'Real Estate Investment',
    date: 'August 31, 2025',
    readTime: '8 min read',
    href: '/blog/real-estate-investment-strategy-2025',
    tags: ['Real Estate', 'Investment', 'Renovation'],
    keywords: [
      'real estate investment',
      'renovation to rental',
      'property investment strategy',
      'UK real estate',
      'investment opportunities',
      'property development',
      'rental income',
    ],
    cardImage: '/blog/real-estate-investment-strategy-2025-card.webp',
    ogImageJpg: '/blog/real-estate-investment-strategy-2025-og.jpg',
    ogImageWebp: '/blog/real-estate-investment-strategy-2025-og.webp',
    imageAlt:
      'Modern residential property illustrating strategic real estate investment and renovation-to-rental strategy in the UK.',
    openGraphSection: 'Real Estate Investment',
    openGraphTags: ['Real Estate', 'Investment Strategy', 'Property Development'],
    publishedTime: '2024-08-31T00:00:00+00:00',
    modifiedTime: '2024-08-31T00:00:00+00:00',
  },
  {
    slug: 'real-estate-innovation-disruption',
    title: 'Real Estate Innovation: How Technology is Disrupting Traditional Markets',
    metaTitle: 'Real Estate Innovation: How Technology is Disrupting Traditional Markets | Dias Global',
    description:
      'From proptech startups to sustainable development, discover how innovation is transforming the real estate sector and creating new investment opportunities.',
    excerpt:
      'From proptech startups to sustainable development, discover how innovation is transforming the real estate sector and creating new investment opportunities.',
    category: 'Real Estate',
    date: 'August 31, 2025',
    readTime: '7 min read',
    href: '/blog/real-estate-innovation-disruption',
    tags: ['Real Estate', 'Proptech', 'Innovation'],
    keywords: [
      'real estate innovation',
      'proptech',
      'real estate technology',
      'property technology',
      'real estate disruption',
      'sustainable development',
      'real estate investment',
    ],
    cardImage: '/blog/real-estate-innovation-disruption-card.webp',
    ogImageJpg: '/blog/real-estate-innovation-disruption-og.jpg',
    ogImageWebp: '/blog/real-estate-innovation-disruption-og.webp',
    imageAlt:
      'Smart city and digital property technology concept representing real estate innovation and proptech disruption.',
    openGraphSection: 'Real Estate',
    openGraphTags: ['Real Estate', 'Proptech', 'Innovation'],
    publishedTime: '2024-08-31T00:00:00+00:00',
    modifiedTime: '2024-08-31T00:00:00+00:00',
  },
  {
    slug: 'building-entrepreneurial-ecosystem',
    title: 'Building Entrepreneurial Ecosystems: The Foundation of Innovation',
    metaTitle: 'Building Entrepreneurial Ecosystems: The Foundation of Innovation | Dias Global',
    description:
      'Discover how Dias Global is creating and nurturing entrepreneurial ecosystems through strategic investments, mentorship programs, and collaborative partnerships.',
    excerpt:
      'Discover how Dias Global is creating and nurturing entrepreneurial ecosystems through strategic investments, mentorship programs, and collaborative partnerships.',
    category: 'Entrepreneurship',
    date: 'August 31, 2025',
    readTime: '6 min read',
    href: '/blog/building-entrepreneurial-ecosystem',
    tags: ['Entrepreneurship', 'Ecosystem', 'Innovation'],
    keywords: [
      'entrepreneurial ecosystem',
      'startup ecosystem',
      'innovation',
      'entrepreneurship',
      'venture capital',
      'startup support',
      'business development',
    ],
    cardImage: '/blog/building-entrepreneurial-ecosystem-card.webp',
    ogImageJpg: '/blog/building-entrepreneurial-ecosystem-og.jpg',
    ogImageWebp: '/blog/building-entrepreneurial-ecosystem-og.webp',
    imageAlt:
      'Network of connected nodes symbolizing entrepreneurial ecosystems, collaboration, and innovation partnerships.',
    openGraphSection: 'Entrepreneurship',
    openGraphTags: ['Entrepreneurship', 'Ecosystem', 'Innovation'],
    publishedTime: '2024-08-31T00:00:00+00:00',
    modifiedTime: '2024-08-31T00:00:00+00:00',
  },
]

export const blogPostsBySlug = Object.fromEntries(blogPosts.map((p) => [p.slug, p])) as Record<
  string,
  BlogPost
>

export function getPost(slug: string): BlogPost | undefined {
  return blogPostsBySlug[slug]
}

export function articleOgImages(post: BlogPost) {
  return [
    {
      url: post.ogImageJpg,
      ...OG_IMAGE_SIZE,
      alt: post.imageAlt,
      type: 'image/jpeg',
    },
    {
      url: post.ogImageWebp,
      ...OG_IMAGE_SIZE,
      alt: post.imageAlt,
      type: 'image/webp',
    },
  ]
}

export const blogIndexOgImages = [
  {
    url: '/blog/blog-index-og.jpg',
    ...OG_IMAGE_SIZE,
    alt: 'Dias Global investment blog: insights on real estate, technology, AI, and entrepreneurship.',
    type: 'image/jpeg' as const,
  },
  {
    url: '/blog/blog-index-og.webp',
    ...OG_IMAGE_SIZE,
    alt: 'Dias Global investment blog: insights on real estate, technology, AI, and entrepreneurship.',
    type: 'image/webp' as const,
  },
]

export function blogIndexMetadata(): Metadata {
  return {
    title: {
      absolute:
        'Investment Blog & Insights | Dias Global Limited | Real Estate, Technology & Entrepreneurship',
    },
    description:
      'Expert insights on investment strategies, technology trends, and entrepreneurial ventures. Discover thought leadership content from Dias Global Limited on real estate investment, AI trends, and building successful business ecosystems.',
    keywords: [
      'investment blog',
      'real estate investment',
      'technology investment',
      'entrepreneurial ventures',
      'investment insights',
      'business strategy',
      'AI investment trends',
      'UK investment blog',
    ],
    alternates: {
      canonical: '/blog',
    },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/blog`,
      siteName: 'Dias Global Limited',
      locale: 'en_GB',
      title: 'Investment Blog & Insights | Dias Global Limited',
      description:
        'Expert insights on investment strategies, technology trends, and entrepreneurial ventures from Dias Global Limited.',
      images: blogIndexOgImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Investment Blog & Insights | Dias Global Limited',
      description:
        'Expert insights on investment strategies, technology trends, and entrepreneurial ventures from Dias Global Limited.',
      images: ['/blog/blog-index-og.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  }
}

export function articleMetadata(post: BlogPost): Metadata {
  const url = `${SITE_URL}${post.href}`
  return {
    title: {
      absolute: post.metaTitle,
    },
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: post.href,
    },
    openGraph: {
      type: 'article',
      url,
      siteName: 'Dias Global Limited',
      locale: 'en_GB',
      title: post.title,
      description: post.description,
      images: articleOgImages(post),
      publishedTime: post.publishedTime,
      modifiedTime: post.modifiedTime,
      authors: ['Dias Global Limited'],
      section: post.openGraphSection,
      tags: post.openGraphTags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.ogImageJpg],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}
