import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dias Global Limited',
    short_name: 'Dias Global',
    description: 'Next-generation family global holding company investing in real assets, technology, and entrepreneurial ventures.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafaf9',
    theme_color: '#e03d2f',
    icons: [
      {
        src: '/favicon.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/favicon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
