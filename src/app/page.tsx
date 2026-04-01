import { Metadata } from 'next'
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Hero from '@/components/hero'
import AboutSection from '@/components/sections/about'
import SectorsSection from '@/components/sections/sectors'
import ApproachSection from '@/components/sections/approach'
import InsightsSection from '@/components/sections/insights'
import ContactSection from '@/components/sections/contact'
import ScrollToTop from '@/components/scroll-to-top'

export const metadata: Metadata = {
  title: {
    absolute:
      'Dias Global Limited | Next-Generation Investment & Innovation | UK Family Global Holding Company',
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
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
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <SectorsSection />
        <ApproachSection />
        <InsightsSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}