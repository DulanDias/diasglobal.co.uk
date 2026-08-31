import type { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Breadcrumb from '@/components/breadcrumb'
import IslandMerchantContent from '@/components/island-merchant/island-merchant-content'
import {
  BreadcrumbListSchema,
  IslandMerchantSchema,
  IslandMerchantProductSchema,
  IslandMerchantFaqSchema,
} from '@/components/seo/schema-markup'
import { standardRobots } from '@/lib/seo-metadata'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { PRODUCTS } from '@/lib/island-merchant'

const TITLE = 'The Island Merchant | Ceylon Cinnamon & Kithul Jaggery'

// ~150 characters, with the call to action inside the first half. The previous
// description ran to about 300 and Google cut it off before the pre-launch line.
const DESCRIPTION =
  'Pre-launch: register retail or wholesale interest in Ceylon cinnamon sticks and kithul jaggery, or pitch your product as a Sri Lankan producer.'

const SOCIAL_DESCRIPTION =
  'Importer and distributor of Sri Lankan products into the UK and Europe. Ceylon cinnamon sticks graded C4 and diced kithul jaggery, in sealed retail packs. Retail and trade enquiries welcome.'

// This page does NOT spread defaultOgTwitter: that helper hard-codes /logo.png with
// the holding-company alt text, so every share of a page about cinnamon and jaggery
// showed the corporate Dias Global logo.
const OG_IMAGE = PRODUCTS[0].images.scene

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'The Island Merchant',
    'Ceylon cinnamon UK',
    'Ceylon cinnamon sticks C4',
    'Cinnamomum verum',
    'kithul jaggery UK',
    'Caryota urens',
    'Sri Lankan products UK',
    'Sri Lankan food importer',
    'Sri Lanka to UK distribution',
    'wholesale Ceylon cinnamon',
    'wholesale kithul jaggery',
    'Sri Lankan producers export to UK',
    'Dias Global Limited',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: `${SITE_URL}/island-merchant`,
    siteName: SITE_NAME,
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE.jpg,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    images: [OG_IMAGE.jpg],
  },
  alternates: {
    canonical: '/island-merchant',
  },
  robots: standardRobots,
}

export default function IslandMerchantPage() {
  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'The Island Merchant' }]

  return (
    <>
      <IslandMerchantSchema />
      <BreadcrumbListSchema
        items={[
          { name: 'Home', item: '/' },
          { name: 'The Island Merchant', item: '/island-merchant' },
        ]}
      />
      <IslandMerchantProductSchema />
      <IslandMerchantFaqSchema />
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <main>
        <IslandMerchantContent />
      </main>
      <Footer />
    </>
  )
}
