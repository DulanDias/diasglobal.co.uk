import { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import SriLankaPAYECalculator from '@/components/tools/sri-lanka-paye-calculator'
import { CalculatorSchema } from '@/components/seo/schema-markup'
import Breadcrumb from '@/components/breadcrumb'
import { defaultOgTwitter, standardRobots } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'Sri Lanka PAYE Tax Calculator 2025 | Free Take Home Pay Calculator | EPF ETF Deductions',
  description:
    'Free Sri Lanka PAYE tax calculator 2025. Calculate your take-home pay after PAYE tax, EPF, and ETF deductions. Accurate Sri Lanka salary calculator with detailed breakdown of tax brackets and statutory deductions.',
  keywords: [
    'Sri Lanka PAYE calculator',
    'Sri Lanka tax calculator',
    'take home pay calculator Sri Lanka',
    'PAYE tax calculator Sri Lanka',
    'EPF ETF calculator',
    'Sri Lanka salary calculator',
    'income tax Sri Lanka',
    'net salary calculator Sri Lanka',
    'Sri Lanka payroll calculator',
    'PAYE tax rates Sri Lanka',
    'EPF contribution calculator',
    'ETF contribution calculator',
    'Sri Lanka tax brackets 2025',
    'Sri Lanka salary after tax',
    'Sri Lanka income tax calculator',
    'Sri Lanka take home pay',
    'PAYE deductions Sri Lanka',
    'Sri Lanka employment tax',
    'Sri Lanka salary deductions',
    'free Sri Lanka tax calculator',
  ],
  ...defaultOgTwitter(
    '/tools/sri-lanka-paye-calculator',
    'Sri Lanka PAYE Tax Calculator 2025 | Free Take Home Pay Calculator',
    'Calculate your take-home pay after PAYE tax, EPF, and ETF deductions in Sri Lanka. Free Sri Lanka salary calculator with detailed breakdown.',
    'en_LK'
  ),
  alternates: {
    canonical: '/tools/sri-lanka-paye-calculator',
  },
  robots: standardRobots,
}

export default function SriLankaPAYECalculatorPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Tools', href: '/tools' },
    { label: 'Sri Lanka PAYE Tax Calculator' }
  ]

  return (
    <>
      <CalculatorSchema
        name="Sri Lanka PAYE Tax Calculator"
        description="Calculate your take-home pay after PAYE tax, EPF, and ETF deductions in Sri Lanka."
        url="https://diasglobal.co.uk/tools/sri-lanka-paye-calculator"
        country="Sri Lanka"
        category="Salary Calculator"
      />
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <main>
        <SriLankaPAYECalculator />
      </main>
      <Footer />
    </>
  )
}
