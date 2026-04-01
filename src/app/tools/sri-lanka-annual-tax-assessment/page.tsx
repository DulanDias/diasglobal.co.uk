import { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import SriLankaAnnualTaxAssessment from '@/components/tools/sri-lanka-annual-tax-assessment'
import { CalculatorSchema } from '@/components/seo/schema-markup'
import Breadcrumb from '@/components/breadcrumb'
import { defaultOgTwitter, standardRobots } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'Sri Lanka Annual Personal Tax Assessment Calculator 2025 | Free Tax Calculator | Multiple Income Sources',
  description:
    'Free Sri Lanka annual personal tax assessment calculator 2025. Calculate your total tax liability with multiple income sources, taxes already deducted, WHT on interest, and determine additional tax to pay. Comprehensive tax assessment tool.',
  keywords: [
    'Sri Lanka annual tax assessment',
    'Sri Lanka personal tax calculator',
    'multiple income sources Sri Lanka',
    'Sri Lanka tax assessment 2025',
    'WHT interest Sri Lanka',
    'tax already deducted Sri Lanka',
    'additional tax to pay Sri Lanka',
    'Sri Lanka income tax assessment',
    'personal tax calculator Sri Lanka',
    'Sri Lanka tax liability calculator',
    'annual tax return Sri Lanka',
    'Sri Lanka tax assessment tool',
    'free Sri Lanka tax calculator',
    'Sri Lanka tax planning calculator',
    'income tax assessment Sri Lanka',
    'Sri Lanka tax calculation tool',
    'annual tax assessment calculator',
    'Sri Lanka tax compliance calculator',
    'personal income tax Sri Lanka',
    'Sri Lanka tax year assessment',
  ],
  ...defaultOgTwitter(
    '/tools/sri-lanka-annual-tax-assessment',
    'Sri Lanka Annual Personal Tax Assessment Calculator 2025',
    'Calculate your total tax liability with multiple income sources, taxes already deducted, WHT on interest, and determine additional tax to pay in Sri Lanka.',
    'en_LK'
  ),
  alternates: {
    canonical: '/tools/sri-lanka-annual-tax-assessment',
  },
  robots: standardRobots,
}

export default function SriLankaAnnualTaxAssessmentPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Tools', href: '/tools' },
    { label: 'Sri Lanka Annual Tax Assessment Calculator' }
  ]

  return (
    <>
      <CalculatorSchema
        name="Sri Lanka Annual Personal Tax Assessment Calculator"
        description="Calculate your total tax liability with multiple income sources, taxes already deducted, WHT on interest, and determine additional tax to pay."
        url="https://diasglobal.co.uk/tools/sri-lanka-annual-tax-assessment"
        country="Sri Lanka"
        category="Tax Assessment Calculator"
      />
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <main>
        <SriLankaAnnualTaxAssessment />
      </main>
      <Footer />
    </>
  )
}
