import { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ToolsListing from '@/components/tools/tools-listing'
import { ToolsPageSchema } from '@/components/seo/schema-markup'
import Breadcrumb from '@/components/breadcrumb'

export const metadata: Metadata = {
  title: 'Free Financial Tools & Calculators 2024 | UK & Sri Lanka | Salary, Tax & Property Calculators',
  description: 'Free financial tools and calculators for UK and Sri Lanka. Calculate take-home pay, rent vs mortgage, PAYE tax, and more with our comprehensive financial calculators. Make informed financial decisions.',
  keywords: [
    'UK salary calculator',
    'take home pay calculator',
    'rent vs mortgage calculator',
    'Sri Lanka PAYE calculator',
    'UK tax calculator',
    'financial tools',
    'property calculator',
    'salary after tax',
    'free financial calculators',
    'UK financial tools',
    'Sri Lanka financial tools',
    'tax calculator UK',
    'property investment calculator',
    'mortgage calculator UK',
    'PAYE calculator Sri Lanka',
    'EPF ETF calculator',
    'UK take home pay',
    'Sri Lanka take home pay',
    'financial planning tools',
    'salary calculator online',
    'property decision calculator',
    'UK tax brackets calculator',
    'Sri Lanka tax brackets',
    'free online calculators',
    'financial decision tools'
  ],
  openGraph: {
    title: 'Free Financial Tools & Calculators 2024 | UK & Sri Lanka',
    description: 'Free financial tools and calculators for UK and Sri Lanka. Calculate take-home pay, rent vs mortgage, PAYE tax, and more with our comprehensive calculators.',
    images: ['/logo.png'],
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Financial Tools & Calculators 2024 | UK & Sri Lanka',
    description: 'Free financial tools and calculators for UK and Sri Lanka. Make informed financial decisions.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: '/tools',
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

const tools = [
  {
    name: 'UK Take Home Pay Calculator',
    description: 'Calculate your net salary after tax, National Insurance, and deductions across England, Scotland, Wales, and Northern Ireland.',
    url: 'https://diasglobal.co.uk/tools/uk-salary-calculator',
    country: 'United Kingdom',
    category: 'Salary Calculator'
  },
  {
    name: 'UK Rent vs Mortgage Calculator',
    description: 'Compare renting vs buying property with comprehensive analysis including upfront costs, interest rates, and long-term equity building.',
    url: 'https://diasglobal.co.uk/tools/uk-rent-mortgage-calculator',
    country: 'United Kingdom',
    category: 'Property Calculator'
  },
  {
    name: 'Sri Lanka PAYE Tax Calculator',
    description: 'Calculate your take-home pay after PAYE tax deductions in Sri Lanka with accurate tax brackets and allowances.',
    url: 'https://diasglobal.co.uk/tools/sri-lanka-paye-calculator',
    country: 'Sri Lanka',
    category: 'Salary Calculator'
  },
  {
    name: 'Sri Lanka Annual Tax Assessment Calculator',
    description: 'Calculate your total tax liability with multiple income sources, taxes already deducted, WHT on interest, and determine additional tax to pay.',
    url: 'https://diasglobal.co.uk/tools/sri-lanka-annual-tax-assessment',
    country: 'Sri Lanka',
    category: 'Tax Assessment Calculator'
  }
]

export default function ToolsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Tools' }
  ]

  return (
    <>
      <ToolsPageSchema tools={tools} />
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <main>
        <ToolsListing />
      </main>
      <Footer />
    </>
  )
}
