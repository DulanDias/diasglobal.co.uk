import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-posts'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

const toolsLastMod = new Date('2026-04-01T00:00:00.000Z')
const islandMerchantLastMod = new Date('2026-09-01T00:00:00.000Z')
// Keep in step with MANAGEMENT_TRAINEE.datePosted in src/lib/careers.ts.
const careersLastMod = new Date('2026-09-01T00:00:00.000Z')

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}${post.href}`,
    lastModified: new Date(post.modifiedTime),
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(
        Math.max(...blogPosts.map((p) => new Date(p.modifiedTime).getTime()))
      ),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...blogEntries,
    {
      url: `${SITE_URL}/tools`,
      lastModified: toolsLastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/foundation`,
      lastModified: new Date('2026-07-10T00:00:00.000Z'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools/uk-salary-calculator`,
      lastModified: toolsLastMod,
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/tools/uk-rent-mortgage-calculator`,
      lastModified: toolsLastMod,
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/tools/sri-lanka-paye-calculator`,
      lastModified: toolsLastMod,
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/tools/sri-lanka-annual-tax-assessment`,
      lastModified: toolsLastMod,
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    {
      url: `${SITE_URL}/island-merchant`,
      lastModified: islandMerchantLastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/careers`,
      lastModified: careersLastMod,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // RETIREMENT: delete this entry when the vacancy is filled — see the note at
    // the head of src/lib/careers.ts.
    {
      url: `${SITE_URL}/careers/management-trainee-sri-lanka`,
      lastModified: careersLastMod,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date('2025-01-01T00:00:00.000Z'),
      changeFrequency: 'yearly',
      priority: 0.35,
    },
    {
      url: `${SITE_URL}/terms-of-use`,
      lastModified: new Date('2025-01-01T00:00:00.000Z'),
      changeFrequency: 'yearly',
      priority: 0.35,
    },
  ]
}
