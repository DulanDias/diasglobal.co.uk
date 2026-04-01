import { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import UKSalaryCalculator from '@/components/tools/uk-salary-calculator'
import { CalculatorSchema } from '@/components/seo/schema-markup'
import Breadcrumb from '@/components/breadcrumb'
import { defaultOgTwitter, standardRobots } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'UK Take Home Pay Calculator 2024 | Free Salary After Tax Calculator | England, Scotland, Wales, Northern Ireland',
  description:
    'Free UK take home pay calculator 2024. Calculate your net salary after tax, National Insurance, and deductions across England, Scotland, Wales, and Northern Ireland. Accurate tax calculations with detailed breakdowns.',
  keywords: [
    'UK salary calculator',
    'take home pay calculator',
    'UK tax calculator 2024',
    'salary after tax calculator',
    'National Insurance calculator',
    'England tax calculator',
    'Scotland tax calculator',
    'Wales tax calculator',
    'Northern Ireland tax calculator',
    'PAYE calculator UK',
    'UK income tax calculator',
    'net salary calculator',
    'UK payroll calculator',
    'tax free allowance UK',
    'UK tax brackets 2024',
    'National Insurance rates UK',
    'UK salary after deductions',
    'free UK tax calculator',
    'UK take home pay 2024',
    'UK salary calculator online',
  ],
  ...defaultOgTwitter(
    '/tools/uk-salary-calculator',
    'UK Take Home Pay Calculator 2024 | Free Salary After Tax Calculator',
    'Calculate your take-home pay after tax, National Insurance, and deductions in England, Scotland, Wales, and Northern Ireland. Free UK salary calculator with detailed breakdown.'
  ),
  alternates: {
    canonical: '/tools/uk-salary-calculator',
  },
  robots: standardRobots,
}

export default function UKSalaryCalculatorPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Tools', href: '/tools' },
    { label: 'UK Take Home Pay Calculator' }
  ]

  return (
    <>
      <CalculatorSchema
        name="UK Take Home Pay Calculator"
        description="Calculate your take-home pay after tax, National Insurance, and deductions in England, Scotland, Wales, and Northern Ireland."
        url="https://diasglobal.co.uk/tools/uk-salary-calculator"
        country="United Kingdom"
        category="Salary Calculator"
      />
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <main>
        <UKSalaryCalculator />
      </main>
      <Footer />
    </>
  )
}
