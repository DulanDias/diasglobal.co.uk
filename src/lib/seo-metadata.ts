import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/site'

/** Shared Open Graph + Twitter defaults for tool and legal pages using the default logo image. */
export function defaultOgTwitter(
  path: string,
  title: string,
  description: string,
  locale: string = 'en_GB'
): Pick<Metadata, 'openGraph' | 'twitter'> {
  const url = `${SITE_URL}${path}`
  const image = {
    url: DEFAULT_OG_IMAGE.path,
    width: DEFAULT_OG_IMAGE.width,
    height: DEFAULT_OG_IMAGE.height,
    alt: DEFAULT_OG_IMAGE.alt,
    type: 'image/png' as const,
  }
  return {
    openGraph: {
      type: 'website',
      locale,
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export const standardRobots: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}
