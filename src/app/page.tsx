import { Metadata } from 'next'
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
  title: 'Dias Global Limited | Next-Generation Investment & Innovation | UK Family Global Holding Company',
  description: 'Dias Global Limited is a UK family global holding company focused on real assets, technology, and entrepreneurial ventures. We deploy patient capital with rigorous operational discipline and a long‑term owner\'s mindset to build enduring value.',
  openGraph: {
    title: 'Dias Global Limited | Next-Generation Investment & Innovation',
    description: 'Investing in real assets, technology, and entrepreneurial ventures with patient capital and long‑term ownership.',
    images: ['/logo.png'],
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