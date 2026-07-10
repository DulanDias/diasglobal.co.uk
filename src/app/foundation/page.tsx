import { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Breadcrumb from '@/components/breadcrumb'
import FoundationContent from '@/components/foundation/foundation-content'
import { FoundationSchema } from '@/components/seo/schema-markup'
import { defaultOgTwitter, standardRobots } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'Dias Global Foundation | The Charitable Arm of Dias Global Limited',
  description:
    'The Dias Global Foundation identifies and helps people in genuine need. We provide carefully vetted one-off and recurring support — such as education sponsorship — until a meaningful milestone is reached. Funded by Dias Global Limited.',
  keywords: [
    'Dias Global Foundation',
    'charity',
    'charitable foundation',
    'family foundation',
    'education sponsorship',
    'helping families in need',
    'humanitarian support',
    'Dias Global charity',
    'donate',
    'foundation fund',
    'scholarship sponsorship',
    'Sri Lanka charity',
  ],
  ...defaultOgTwitter(
    '/foundation',
    'Dias Global Foundation | The Charitable Arm of Dias Global Limited',
    'We identify and help people in genuine need with vetted one-off and recurring support until a meaningful milestone is reached. Funded by Dias Global Limited.'
  ),
  alternates: {
    canonical: '/foundation',
  },
  robots: standardRobots,
}

export default function FoundationPage() {
  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Foundation' }]

  return (
    <>
      <FoundationSchema />
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <main>
        <FoundationContent />
      </main>
      <Footer />
    </>
  )
}
