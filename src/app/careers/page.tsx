import { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Breadcrumb from '@/components/breadcrumb'
import CareersContent from '@/components/careers/careers-content'
import { BreadcrumbListSchema, CareersPageSchema } from '@/components/seo/schema-markup'
import { VACANCIES } from '@/lib/careers'
import { defaultOgTwitter, standardRobots } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  // Bare string, not 'Careers | Dias Global Limited': layout.tsx sets a
  // title.template of '%s | Dias Global Limited', so spelling the brand out here
  // rendered it twice in the <title>.
  title: 'Careers',
  description:
    'Open roles at Dias Global Limited, a UK company with interests across real assets, technology and entrepreneurial ventures. See what we are recruiting for and how to apply.',
  keywords: [
    'Dias Global careers',
    'Dias Global jobs',
    'careers',
    'open roles',
    'vacancies',
    'management trainee',
    'remote roles Sri Lanka',
    'UK company careers',
    'finance and operations roles',
  ],
  ...defaultOgTwitter(
    '/careers',
    'Careers | Dias Global Limited',
    'Open roles at Dias Global Limited. Broad, hands-on positions across finance, operations and business development — and how to apply.'
  ),
  alternates: {
    canonical: '/careers',
  },
  robots: standardRobots,
}

export default function CareersPage() {
  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Careers' }]

  return (
    <>
      <CareersPageSchema vacancies={VACANCIES} />
      <BreadcrumbListSchema
        items={[
          { name: 'Home', item: '/' },
          { name: 'Careers', item: '/careers' },
        ]}
      />
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <main>
        <CareersContent />
      </main>
      <Footer />
    </>
  )
}
