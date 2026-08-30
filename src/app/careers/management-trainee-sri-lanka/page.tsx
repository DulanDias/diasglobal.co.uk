import { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Breadcrumb from '@/components/breadcrumb'
import VacancyContent from '@/components/careers/vacancy-content'
import { BreadcrumbListSchema, JobPostingSchema } from '@/components/seo/schema-markup'
import { MANAGEMENT_TRAINEE, vacancyUrl } from '@/lib/careers'
import { defaultOgTwitter, standardRobots } from '@/lib/seo-metadata'

const vacancy = MANAGEMENT_TRAINEE
const path = vacancyUrl(vacancy.slug)

// `absolute` suppresses layout.tsx's '%s | Dias Global Limited' template, which was
// appending the brand a second time and pushing the tag past 90 characters — Google
// truncates around 60, so the duplicate was crowding out the role itself.
const title = 'Management Trainee (Remote, Sri Lanka) | Dias Global Limited'
const description =
  'Management Trainee with Dias Global Limited, a UK company — performed remotely from Sri Lanka. A broad, hands-on role across finance, tax and compliance, operations, HR administration and business development.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    'Management Trainee',
    'management trainee Sri Lanka',
    'remote job Sri Lanka',
    'finance and accounting role',
    'bookkeeping role Sri Lanka',
    'tax and compliance role',
    'graduate trainee',
    'CA Sri Lanka',
    'CIMA',
    'ACCA',
    'Dias Global careers',
  ],
  ...defaultOgTwitter(path, title, description),
  alternates: {
    canonical: path,
  },
  robots: standardRobots,
}

export default function ManagementTraineeSriLankaPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Careers', href: '/careers' },
    { label: vacancy.title },
  ]

  return (
    <>
      <JobPostingSchema vacancy={vacancy} />
      <BreadcrumbListSchema
        items={[
          { name: 'Home', item: '/' },
          { name: 'Careers', item: '/careers' },
          { name: vacancy.title, item: path },
        ]}
      />
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <main>
        <VacancyContent vacancy={vacancy} />
      </main>
      <Footer />
    </>
  )
}
