import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import CookieConsent from '@/components/cookie-consent'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Dias Global Limited | Next-Generation Investment & Innovation | UK Family Global Holding Company',
    template: '%s | Dias Global Limited'
  },
  description: 'Dias Global Limited is a UK family global holding company focused on real assets, technology, and entrepreneurial ventures. We deploy patient capital with rigorous operational discipline and a long‑term owner\'s mindset to build enduring value.',
  keywords: [
    'investment company',
    'family office',
    'real estate investment',
    'technology investment',
    'entrepreneurial ventures',
    'UK investment',
    'patient capital',
    'global holding company',
    'London investment firm'
  ],
  authors: [{ name: 'Dias Global Limited' }],
  creator: 'Dias Global Limited',
  publisher: 'Dias Global Limited',
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
    url: 'https://diasglobal.co.uk',
    siteName: 'Dias Global Limited',
    title: 'Dias Global Limited | Next-Generation Investment & Innovation',
    description: 'Investing in real assets, technology, and entrepreneurial ventures with patient capital and long‑term ownership.',
    images: [
      {
        url: 'https://diasglobal.co.uk/logo.png',
        width: 1200,
        height: 630,
        alt: 'Dias Global Limited - UK Family Global Holding Company',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@diasglobal',
    creator: '@diasglobal',
    title: 'Dias Global Limited | Next-Generation Investment & Innovation',
    description: 'Investing in real assets, technology, and entrepreneurial ventures with patient capital and long‑term ownership.',
    images: [
      {
        url: 'https://diasglobal.co.uk/logo.png',
        alt: 'Dias Global Limited - UK Family Global Holding Company',
        width: 1200,
        height: 630,
      }
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/favicon.png',
    apple: '/logo.png',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://diasglobal.co.uk'),
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'your-google-verification-code', // Add your actual verification code
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://unpkg.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <meta name="theme-color" content="#0f0f23" />
        <meta name="msapplication-TileColor" content="#0f0f23" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dias Global" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="geo.region" content="GB" />
        <meta name="geo.placename" content="London" />
        <meta name="geo.position" content="51.5074;-0.1278" />
        <meta name="ICBM" content="51.5074, -0.1278" />
        
        {/* Social Media Optimization */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="Dias Global Limited - UK Family Global Holding Company" />
        
        {/* Twitter Card Optimization */}
        <meta name="twitter:image:alt" content="Dias Global Limited - UK Family Global Holding Company" />
        
        {/* Business/Organization Schema */}
        <meta name="business:contact_data:street_address" content="71–75 Shelton Street, Covent Garden" />
        <meta name="business:contact_data:locality" content="London" />
        <meta name="business:contact_data:postal_code" content="WC2H 9JQ" />
        <meta name="business:contact_data:country_name" content="United Kingdom" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}