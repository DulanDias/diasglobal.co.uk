export type ProductSlug = 'ceylon-cinnamon-sticks' | 'ceylon-kithul-jaggery-diced'

export type SpecRow = { label: string; value: string }

export type ProductImage = {
  webp: string
  jpg: string
  width: number
  height: number
  alt: string
}

export type Product = {
  slug: ProductSlug
  /** Exact pack name. Do not paraphrase. */
  name: string
  botanicalName: string
  /** Net weight of one retail pack, in grams. THE ONLY source of pack weight. */
  packWeightGrams: number
  /** Rendered net-weight string, e.g. '100 g'. */
  netWeight: string
  /** Front-of-pack descriptors, verbatim from the packaging. */
  frontOfPack: string[]
  /** Body copy paragraphs for the product card. */
  copy: string[]
  specs: SpecRow[]
  image: ProductImage
  /** Label used in the enquiry summary quantity lines. */
  summaryLabel: string
}

export type EnquiryMode = 'retail' | 'wholesale' | 'producer'

export type Audience = {
  mode: EnquiryMode
  /** Tab / radio label. */
  label: string
  /** One-line description shown under the label. */
  blurb: string
  /** Exact Formspree _subject for this mode. */
  subject: string
  /** Human-readable type shown in the enquiry summary. */
  summaryType: string
}

export type FaqItem = { question: string; answer: string }

export const IM_EMAIL_USER = 'bWVyY2hhbnQ=' // 'merchant'
export const IM_EMAIL_DOMAIN = 'ZGlhc2dsb2JhbC5jby51aw==' // 'diasglobal.co.uk'

/** Re-exported so callers of this module keep a single import site. */
export { FORMSPREE_ENDPOINT } from '@/lib/site'

export const IM_PAGE_URL = 'https://diasglobal.co.uk/island-merchant/'

export const IM_SECTION_IDS = [
  'im-story',
  'im-products',
  'im-retail',
  'im-wholesale',
  'im-producers',
  'im-enquire',
  'im-faq',
] as const

export type SectionId = (typeof IM_SECTION_IDS)[number]

export type SectionLink = { id: SectionId; label: string }

/** In-page sub-navigation, in document order. */
export const IM_SECTION_NAV: SectionLink[] = [
  { id: 'im-story', label: 'The Island Merchant' },
  { id: 'im-products', label: 'Products' },
  { id: 'im-retail', label: 'Buying for yourself' },
  { id: 'im-wholesale', label: 'Trade & wholesale' },
  { id: 'im-producers', label: 'Sri Lankan producers' },
  { id: 'im-enquire', label: 'Register interest' },
  { id: 'im-faq', label: 'Questions' },
]

export const LOGO = {
  light: {
    webp: '/island-merchant/island-merchant-logo.webp',
    png: '/island-merchant/island-merchant-logo.png',
    width: 744,
    height: 866,
    alt: 'The Island Merchant',
  },
  reverse: {
    webp: '/island-merchant/island-merchant-logo-reverse.webp',
    png: '/island-merchant/island-merchant-logo-reverse.png',
    width: 744,
    height: 866,
    alt: 'The Island Merchant',
  },
} as const

export const MARK = {
  light: { png: '/island-merchant/island-merchant-mark.png', width: 256, height: 275, alt: '' },
  reverse: {
    png: '/island-merchant/island-merchant-mark-reverse.png',
    width: 256,
    height: 275,
    alt: '',
  },
} as const

export const PRODUCTS: Product[] = [
  {
    slug: 'ceylon-cinnamon-sticks',
    name: 'Ceylon Cinnamon Sticks',
    botanicalName: 'Cinnamomum verum',
    packWeightGrams: 100,
    netWeight: '100 g',
    frontOfPack: ['Premium Ceylon Cinnamon', 'Hand Selected | Sun Dried | Naturally Aromatic'],
    copy: [
      'True Ceylon cinnamon — Cinnamomum verum — not the cassia sold as “cinnamon” in most supermarkets. You can see the difference in your hand: many fine layers rolled into a brittle, tan quill that crumbles between your fingers, where cassia is a single thick, hard, dark curl that snaps like a twig.',
      'Grown in the wet-zone districts of south-western Sri Lanka, hand selected, and sun dried to hold on to the aroma and the natural sweetness. The flavour is delicate, sweet and layered rather than blunt and hot.',
      'Graded C4 — a Continental-family export grade under Sri Lanka’s national cinnamon grading system, which sorts quills by diameter, count per kilogram and surface uniformity. Grading certification available on request.',
    ],
    specs: [
      { label: 'Botanical name', value: 'Cinnamomum verum' },
      { label: 'Grade', value: 'C4 (Continental family)' },
      { label: 'Form', value: 'Whole quills' },
      { label: 'Net weight', value: '100 g' },
      { label: 'Pack', value: 'Sealed retail pouch' },
      { label: 'Origin', value: 'Product of Sri Lanka' },
      { label: 'Storage', value: 'Cool and dry, out of direct sunlight. Keep the pack sealed.' },
    ],
    image: {
      webp: '/island-merchant/cinnamon-quills.webp',
      jpg: '/island-merchant/cinnamon-quills.jpg',
      width: 1200,
      height: 900,
      alt: 'Front and back of the Island Merchant Ceylon Cinnamon Sticks retail pouch, 100 g',
    },
    summaryLabel: 'Ceylon Cinnamon Sticks C4, 100 g',
  },
  {
    slug: 'ceylon-kithul-jaggery-diced',
    name: 'Ceylon Kithul Jaggery — DICED',
    botanicalName: 'Caryota urens',
    packWeightGrams: 200,
    netWeight: '200 g',
    frontOfPack: [
      'Premium Sri Lankan Kithul Jaggery',
      'Unrefined | Natural Sweetener | Rich & Aromatic',
    ],
    copy: [
      'Made from the sap of kithul palm blossoms — Caryota urens. The sap is tapped by hand from the unopened flower, filtered, and slowly boiled down until it sets. Nothing is added and nothing is refined out. The flavour is deep and caramel-like, with a smoky treacle depth that refined sugar simply does not have.',
      'The traditional practice of kithul tapping was inscribed on UNESCO’s Representative List of the Intangible Cultural Heritage of Humanity in December 2025. It is tapped in the wet-zone hills of Sabaragamuwa and the Southern Province.',
      'Traditionally, kithul jaggery is set in a solid dome that has to be chipped or grated. We buy ours diced into cubes — easier to portion by hand, quicker to dissolve into a pan or a cup, and it fills a retail pack to a consistent weight without breaking up in transit.',
    ],
    specs: [
      { label: 'Botanical source', value: 'Caryota urens (kithul palm)' },
      { label: 'Form', value: 'Diced cubes' },
      { label: 'Net weight', value: '200 g' },
      { label: 'Pack', value: 'Sealed retail pouch' },
      { label: 'Origin', value: 'Product of Sri Lanka' },
      {
        label: 'Storage',
        value:
          'Airtight, cool and dry, out of the sun. Kithul jaggery draws in moisture from the air.',
      },
    ],
    image: {
      webp: '/island-merchant/kithul-jaggery.webp',
      jpg: '/island-merchant/kithul-jaggery.jpg',
      width: 1200,
      height: 900,
      alt: 'Front and back of the Island Merchant Ceylon Kithul Jaggery diced retail pouch, 200 g',
    },
    summaryLabel: 'Ceylon Kithul Jaggery DICED, 200 g',
  },
]

export const AUDIENCES: Audience[] = [
  {
    mode: 'retail',
    label: 'I want to buy for myself',
    blurb: 'Small quantities for your own kitchen.',
    subject: 'Island Merchant — RETAIL interest',
    summaryType: 'Retail',
  },
  {
    mode: 'wholesale',
    label: 'I am buying for a business',
    blurb: 'Trade and wholesale, in the same retail packs.',
    subject: 'Island Merchant — WHOLESALE / TRADE interest',
    summaryType: 'Wholesale / Trade',
  },
  {
    mode: 'producer',
    label: 'I produce something in Sri Lanka',
    blurb: 'Pitch your product for us to import and distribute.',
    subject: 'Island Merchant — PRODUCER / SUPPLIER enquiry',
    summaryType: 'Producer / Supplier',
  },
]

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Can I buy from you today?',
    answer:
      'Not yet. The Island Merchant is pre-launch. We are registering interest now so that our first shipment matches real demand. Register your interest and we will contact you when we have stock, pricing and a way to order.',
  },
  {
    question: 'What is the difference between Ceylon cinnamon and the cinnamon in the supermarket?',
    answer:
      'Most supermarket cinnamon is cassia, a different species. Ceylon cinnamon is Cinnamomum verum. You can tell them apart in your hand: a Ceylon quill is many fine layers rolled together, tan to light brown, and brittle enough to crumble between your fingers. A cassia quill is a single thick, hard, dark reddish-brown curl that snaps like a twig. Ceylon tastes delicate, sweet and layered; cassia is blunt and hot.',
  },
  {
    question: 'What does grade C4 mean?',
    answer:
      'C4 is a Continental-family export grade under Sri Lanka’s national cinnamon grading system, which sorts quills by diameter, count per kilogram and surface uniformity. It sits in the middle of the Continental grades. Grading certification is available on request.',
  },
  {
    question: 'What size are the packs?',
    answer:
      'Ceylon Cinnamon Sticks come in a 100 g sealed retail pouch. Ceylon Kithul Jaggery — DICED comes in a 200 g sealed retail pouch. Wholesale buyers order in those same retail packs, not in cases and not in bulk kilos.',
  },
  {
    question: 'How should I store them?',
    answer:
      'Keep the cinnamon in a cool, dry place away from direct sunlight, with the pack sealed — whole quills hold their aroma far better than ground cinnamon. Kithul jaggery draws in moisture from the air, so once opened keep it in an airtight container somewhere cool, dry and out of the sun, and it will stay firm and easy to portion.',
  },
  {
    question: 'I produce something in Sri Lanka. How do I get it to the UK through you?',
    answer:
      'Use the enquiry form and choose the producer option. Tell us what you make, how much of it you can supply, and what documentation you already hold. We will come back to you honestly about whether we can work with that today.',
  },
]

/** The CustomEvent name EnquireButton dispatches and InterestForm listens for. */
export const ENQUIRE_EVENT = 'island-merchant:enquire' as const

export type EnquireEventDetail = {
  mode: EnquiryMode
  /** Optional: pre-set this product's quantity to 1 if it is currently 0. */
  product?: ProductSlug
}

/** THE single weight formatter. Used by the live readout, the hidden summary field
 *  and the mailto fallback, so all three always agree. Pure, no Intl, no locale APIs
 *  (SSR/client must produce byte-identical output). */
export function formatWeight(grams: number): string {
  if (!Number.isFinite(grams) || grams <= 0) return '0 g'
  const withCommas = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (grams < 1000) return `${grams} g`
  const kgRaw = Math.round(grams / 100) / 10
  const kg = Number.isInteger(kgRaw) ? String(kgRaw) : kgRaw.toFixed(1)
  return `${kg} kg (${withCommas(grams)} g)`
}

/** Total pack weight in grams. Non-finite / negative inputs count as 0. */
export function totalWeightGrams(quantities: Record<ProductSlug, number>): number {
  return PRODUCTS.reduce((sum, p) => {
    const q = quantities[p.slug]
    const n = Number.isFinite(q) && q > 0 ? Math.floor(q) : 0
    return sum + n * p.packWeightGrams
  }, 0)
}
