import type { Metadata } from 'next'
import { JetBrains_Mono, Sora } from 'next/font/google'
import CookieConsent from '@/components/cookie-consent'
import SiteJsonLd from '@/components/seo/site-json-ld'
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Next-Generation Investment & Innovation | UK Family Global Holding Company`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'investment company',
    'family office',
    'real estate investment',
    'technology investment',
    'entrepreneurial ventures',
    'UK investment',
    'patient capital',
    'global holding company',
    'London investment firm',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Next-Generation Investment & Innovation`,
    description:
      'Investing in real assets, technology, and entrepreneurial ventures with patient capital and long‑term ownership.',
    images: [
      {
        url: `${SITE_URL}${DEFAULT_OG_IMAGE.path}`,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
        alt: DEFAULT_OG_IMAGE.alt,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@diasglobal',
    creator: '@diasglobal',
    title: `${SITE_NAME} | Next-Generation Investment & Innovation`,
    description:
      'Investing in real assets, technology, and entrepreneurial ventures with patient capital and long‑term ownership.',
    images: [
      {
        url: `${SITE_URL}${DEFAULT_OG_IMAGE.path}`,
        alt: DEFAULT_OG_IMAGE.alt,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/logo.png',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  ...(googleVerification
    ? {
        verification: {
          google: googleVerification,
        },
      }
    : {}),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://unpkg.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <meta name="theme-color" content="#fafaf9" />
        <meta name="msapplication-TileColor" content="#e03d2f" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dias Global" />

        <meta name="format-detection" content="telephone=no" />
        <meta name="geo.region" content="GB" />
        <meta name="geo.placename" content="London" />
        <meta name="geo.position" content="51.5074;-0.1278" />
        <meta name="ICBM" content="51.5074, -0.1278" />

        <meta name="business:contact_data:street_address" content="71–75 Shelton Street, Covent Garden" />
        <meta name="business:contact_data:locality" content="London" />
        <meta name="business:contact_data:postal_code" content="WC2H 9JQ" />
        <meta name="business:contact_data:country_name" content="United Kingdom" />

        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FH5W6ETZKR" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FH5W6ETZKR');
            `,
          }}
        />
      </head>
      <body className={`${sora.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <SiteJsonLd />
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
