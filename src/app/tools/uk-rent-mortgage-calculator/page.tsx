import { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import UKRentMortgageCalculator from '@/components/tools/uk-rent-mortgage-calculator'
import { CalculatorSchema } from '@/components/seo/schema-markup'
import Breadcrumb from '@/components/breadcrumb'

export const metadata: Metadata = {
  title: 'UK Rent vs Mortgage Calculator 2024 | Free Property Investment Calculator | Compare Renting vs Buying',
  description: 'Free UK rent vs mortgage calculator 2024. Compare renting vs buying property with comprehensive analysis of upfront costs, monthly payments, equity building, and long-term financial benefits. Make informed property decisions.',
  keywords: [
    'UK rent vs mortgage calculator',
    'rent vs buy calculator',
    'property calculator UK',
    'mortgage calculator UK',
    'rental vs buying analysis',
    'property investment calculator',
    'UK property costs',
    'mortgage vs rent comparison',
    'UK property investment',
    'buy vs rent calculator',
    'property affordability calculator',
    'UK mortgage calculator',
    'rent vs mortgage analysis',
    'property investment UK',
    'UK housing calculator',
    'mortgage affordability UK',
    'property cost calculator',
    'UK real estate calculator',
    'rent vs buy analysis UK',
    'property decision calculator'
  ],
  openGraph: {
    title: 'UK Rent vs Mortgage Calculator 2024 | Free Property Investment Calculator',
    description: 'Compare renting vs buying property in the UK. Calculate upfront costs, monthly payments, and long-term equity building with our comprehensive calculator.',
    images: ['/logo.png'],
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Rent vs Mortgage Calculator 2024 | Free Property Investment Calculator',
    description: 'Compare renting vs buying property in the UK. Make informed property investment decisions.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: '/tools/uk-rent-mortgage-calculator',
  },
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
}

export default function UKRentMortgageCalculatorPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Tools', href: '/tools' },
    { label: 'UK Rent vs Mortgage Calculator' }
  ]

  return (
    <>
      <CalculatorSchema
        name="UK Rent vs Mortgage Calculator"
        description="Compare renting vs buying property in the UK. Calculate upfront costs, monthly payments, and long-term equity building."
        url="https://diasglobal.co.uk/tools/uk-rent-mortgage-calculator"
        country="United Kingdom"
        category="Property Calculator"
      />
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <main>
        <UKRentMortgageCalculator />
      </main>
      <Footer />
    </>
  )
}
