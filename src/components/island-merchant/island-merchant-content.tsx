import ObfuscatedEmail from '@/components/foundation/obfuscated-email'
import Disclosure from '@/components/island-merchant/disclosure'
import EnquireButton from '@/components/island-merchant/enquire-button'
import IslandNav from '@/components/island-merchant/island-nav'
import InterestForm from '@/components/island-merchant/interest-form'
import {
  AwardIcon,
  BoxIcon,
  CheckIcon,
  DocumentIcon,
  LeafIcon,
  ScaleIcon,
  ShieldIcon,
  ShipIcon,
  SpoonIcon,
  SproutIcon,
  StoreIcon,
  TagIcon,
} from '@/components/island-merchant/icons'
import {
  FAQ_ITEMS,
  IM_EMAIL_DOMAIN,
  IM_EMAIL_USER,
  LOGO,
  PRODUCTS,
  type Product,
  type ProductImage,
  type ProductSlug,
} from '@/lib/island-merchant'
import { ORGANIZATION } from '@/lib/site'

/**
 * Scoped Island Merchant theme.
 *
 * Everything inside `.im-theme` uses the packaging palette; the Dias Global
 * Header, Breadcrumb and Footer render outside it and keep the red accent.
 * Contrast ratios against cream #faf7f0: ink #3b2a14 12.85:1, muted #6d563a
 * 6.45:1, accent #8b6b39 4.61:1, accent-dark #765b30 5.93:1. Brand gold
 * #b08848 is 3.04:1, so it is used for decorative rules and borders only on
 * cream, though it is 4.23:1 on the deep brown panel and may carry text there.
 *
 * The palette tokens (--im-ink, --im-accent, …), the remap of the shared Dias
 * tokens and the anchor scroll-margin all live in the `.im-theme` block in
 * globals.css. This block only adds rules with no counterpart there. Do not
 * redeclare the tokens here: this <style> is unlayered and would silently
 * out-specify the stylesheet.
 */
const THEME_CSS = `
.im-theme a:focus-visible,
.im-theme button:focus-visible,
.im-theme summary:focus-visible,
.im-theme input:focus-visible,
.im-theme select:focus-visible,
.im-theme textarea:focus-visible {
  outline: 2px solid var(--im-accent);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Accent #8b6b39 on the deep brown #3b2a14 is only 2.79:1, below the 3:1 that
   WCAG 1.4.11 requires of a focus indicator against its adjacent colour, and
   outline-offset puts brown on both sides of the ring. Cream is 12.85:1. Any
   dark panel carries .im-on-dark so the indicator flips with it. */
.im-theme .im-on-dark a:focus-visible,
.im-theme .im-on-dark button:focus-visible,
.im-theme .im-on-dark summary:focus-visible,
.im-theme .im-on-dark input:focus-visible,
.im-theme .im-on-dark select:focus-visible,
.im-theme .im-on-dark textarea:focus-visible,
.im-theme .im-on-dark:focus-visible {
  outline-color: var(--im-cream);
}

/* Replace the default disclosure triangle with the chevron rendered inside the
   summary. Both selectors are needed: the pseudo-element for WebKit, and
   list-style for everything else. */
.im-theme .im-disclosure > summary {
  list-style: none;
}
.im-theme .im-disclosure > summary::-webkit-details-marker {
  display: none;
}
.im-theme .im-disclosure[open] > summary .im-chevron {
  transform: rotate(180deg);
}

/* The section bar scrolls horizontally on narrow viewports. The site styles
   scrollbars globally at 10px with a visible track, which under a 56px bar
   reads as a stray rule across the page, so it is hidden here. The links stay
   reachable by keyboard through normal tab order, and the fade on the trailing
   edge signals that there is more to scroll. */
.im-theme .im-navbar-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.im-theme .im-navbar-scroll::-webkit-scrollbar {
  display: none;
}
`

const ENQUIRY_SUBJECT = 'The Island Merchant enquiry'

/** Short pack badge shown beside each product name. */
const PACK_BADGE: Record<ProductSlug, string> = {
  'ceylon-cinnamon-sticks': 'Grade C4',
  'ceylon-kithul-jaggery-diced': 'Diced cubes',
}

/** Tasting and usage notes, written for the page rather than lifted from the pack. */
const USAGE_NOTES: Record<ProductSlug, string[]> = {
  'ceylon-cinnamon-sticks': [
    'Warm, sweet and faintly floral rather than hot, closer to a dessert spice than to the sharp bite of cassia.',
    'Use the quills whole: one in the pan when you start a rice, a curry or a dhal; in chai, mulled wine or a pot of tea; simmered into stewed fruit or a sugar syrup.',
    'Grind only what you need. The quills are brittle enough to break up in a mortar or a spice grinder, and they hold their aroma far longer whole than ground.',
  ],
  'ceylon-kithul-jaggery-diced': [
    'Deep and caramel-like with a smoky treacle finish, and less flatly sweet than refined sugar.',
    'Use it wherever sugar goes: dissolved into tea or coffee, melted over curd or yoghurt, stirred into porridge, or in baking where a treacle note is welcome.',
    'The diced cubes portion by hand and dissolve faster than a chipped block, so there is no grating and no chisel.',
  ],
}

/** Picture element for a product photograph, webp first with a jpeg fallback. */
function ProductPicture({
  image,
  className,
  loading = 'lazy',
}: {
  image: ProductImage
  className?: string
  loading?: 'eager' | 'lazy'
}) {
  return (
    <picture>
      <source srcSet={image.webp} type="image/webp" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.jpg}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading={loading}
        decoding="async"
        className={className}
      />
    </picture>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const headingId = `im-product-${product.slug}`
  const [lead, ...rest] = product.copy

  return (
    <article
      aria-labelledby={headingId}
      className="overflow-hidden rounded-2xl border border-[#b08848]/40 bg-[#faf7f0] shadow-[0_2px_16px_rgba(59,42,20,0.06)]"
    >
      <div className="grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        {/* The pouch is a portrait cut-out on a warm ground rather than a cropped
            scene, so the whole pack including the net weight stays readable. */}
        <div className="flex items-center justify-center bg-gradient-to-b from-[#f2ebdd] to-[#e6d9c0] p-8 lg:p-10">
          <ProductPicture
            image={product.images.front}
            loading={index === 0 ? 'eager' : 'lazy'}
            className="h-auto w-full max-w-[15rem] object-contain drop-shadow-[0_12px_28px_rgba(59,42,20,0.25)]"
          />
        </div>

        <div className="p-6 md:p-8">
          <h3
            id={headingId}
            className="text-2xl font-bold tracking-tight text-[#3b2a14] md:text-3xl"
          >
            {product.name}
          </h3>
          <p className="mt-1 text-sm italic text-[#6d563a]">{product.botanicalName}</p>

          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Pack details">
            <li className="inline-flex items-center gap-1.5 rounded-full bg-[#3b2a14] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#faf7f0]">
              <AwardIcon className="h-3.5 w-3.5" />
              {PACK_BADGE[product.slug]}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-[#3b2a14] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#faf7f0]">
              <ScaleIcon className="h-3.5 w-3.5" />
              {product.netWeight}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full border border-[#b08848] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#765b30]">
              <LeafIcon className="h-3.5 w-3.5" />
              Product of Sri Lanka
            </li>
          </ul>

          <p className="mt-4 text-sm font-semibold text-[#765b30]">
            {product.frontOfPack.join('  ·  ')}
          </p>

          <p className="mt-5 text-base leading-relaxed text-[#3b2a14]">{lead}</p>

          {/* The detail below is what a trade buyer needs and a browsing visitor
              does not, so it is collapsed by default to keep the pack in view. */}
          <div className="mt-6 space-y-3">
            <Disclosure summary="More about this product" icon={<LeafIcon className="h-5 w-5" />}>
              <div className="space-y-4 text-base leading-relaxed">
                {rest.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </Disclosure>

            <Disclosure summary="Tasting and usage" icon={<SpoonIcon className="h-5 w-5" />}>
              <ul className="space-y-2.5 text-base leading-relaxed">
                {USAGE_NOTES[product.slug].map((note) => (
                  <li key={note.slice(0, 32)} className="flex gap-3">
                    <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[#8b6b39]" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </Disclosure>

            <Disclosure summary="Specification" icon={<DocumentIcon className="h-5 w-5" />}>
              {/* tabIndex makes the overflow container reachable without a mouse; without
                  it the second column cannot be scrolled into view on a narrow viewport. */}
              <div
                className="overflow-x-auto"
                tabIndex={0}
                role="region"
                aria-label={`Indicative specification for ${product.name}`}
              >
                <table className="w-full min-w-[18rem] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Indicative specification for {product.name}
                  </caption>
                  <thead>
                    <tr className="border-b border-[#b08848]">
                      <th scope="col" className="py-2 pr-4 font-semibold text-[#3b2a14]">
                        Attribute
                      </th>
                      <th scope="col" className="py-2 font-semibold text-[#3b2a14]">
                        Detail
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.specs.map((row) => (
                      <tr key={row.label} className="border-b border-[#b08848]/30 align-top">
                        <th scope="row" className="py-2 pr-4 font-medium text-[#6d563a]">
                          {row.label}
                        </th>
                        <td className="py-2 text-[#3b2a14]">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm leading-relaxed">
                Indicative. Where a grade is quoted it follows Sri Lanka’s national cinnamon
                grading system, and grading certification is available on request. Commodity
                codes and import classification are confirmed per consignment at customs entry
                and are not a substitute for your own tariff advice. The specification that
                counts is the one printed on the pack and on the documents travelling with each
                shipment.
              </p>
            </Disclosure>

            <Disclosure summary="What is on the pack" icon={<TagIcon className="h-5 w-5" />}>
              <div className="grid gap-5 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:items-start">
                <div className="rounded-xl bg-gradient-to-b from-[#f2ebdd] to-[#e6d9c0] p-4">
                  {/* Deliberately eager. Chromium never queues a `loading="lazy"`
                      image that was inside a closed <details> at parse time, so a
                      lazy back panel stays blank even after the user opens this
                      section. The crop is built at 420px for this ~160px slot to
                      keep the eager cost small. */}
                  <ProductPicture
                    image={product.images.back}
                    loading="eager"
                    className="h-auto w-full object-contain drop-shadow-[0_8px_20px_rgba(59,42,20,0.2)]"
                  />
                </div>
                <p className="text-base leading-relaxed">
                  The back of the pouch carries the full declaration: ingredients, grade, net
                  weight, country of origin, storage guidance, best before and batch number, and
                  the name and address of {ORGANIZATION.name} as importer and distributor.
                </p>
              </div>
            </Disclosure>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <EnquireButton mode="retail" product={product.slug} variant="primary">
              Order this pack
            </EnquireButton>
            <EnquireButton mode="wholesale" product={product.slug} variant="secondary">
              Enquire as a trade buyer
            </EnquireButton>
          </div>
        </div>
      </div>
    </article>
  )
}

/** Compact trust markers under the hero. */
const HERO_MARKERS = [
  { icon: LeafIcon, label: 'Product of Sri Lanka' },
  { icon: ScaleIcon, label: 'Sealed retail packs' },
  { icon: ShipIcon, label: 'UK importer of record' },
  { icon: BoxIcon, label: 'Retail and trade supply' },
]

/** What the business does, shown as a feature band in place of a wall of prose. */
const CAPABILITIES = [
  {
    icon: AwardIcon,
    title: 'Named grades, not vague ones',
    body: 'Ceylon cinnamon is graded C4 under Sri Lanka’s national system rather than sold as unspecified “cinnamon”. Grading certification is available on request.',
  },
  {
    icon: ScaleIcon,
    title: 'One pack, every channel',
    body: 'Households and trade buyers order the identical sealed retail pouch, so there is one specification and one shelf-ready unit across the whole business.',
  },
  {
    icon: ShieldIcon,
    title: 'The border is our problem',
    body: 'Customs entry, tariff classification, destination-market labelling and the paperwork travelling with a consignment are handled at our end.',
  },
  {
    icon: SproutIcon,
    title: 'Straight to the producer',
    body: 'We buy in our own name as a UK company, which means one buyer and one conversation about specification, packing and volume.',
  },
]

export default function IslandMerchantContent() {
  return (
    <div className="im-theme bg-[#faf7f0] text-[#3b2a14]">
      <style dangerouslySetInnerHTML={{ __html: THEME_CSS }} />

      <IslandNav />

      {/* Hero */}
      <div className="im-on-dark relative overflow-hidden bg-[#3b2a14] py-16 md:py-24">
        {/* Decorative wash, kept subtle so the cream headline stays at 12.85:1. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(176,136,72,0.28),transparent_60%)]"
        />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            {/* alt="" on purpose: the <h1> below reads "The Island Merchant", and a named
                lockup here would make a screen reader announce it twice in a row. */}
            <picture>
              <source srcSet={LOGO.reverse.webp} type="image/webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOGO.reverse.png}
                width={LOGO.reverse.width}
                height={LOGO.reverse.height}
                alt=""
                loading="eager"
                decoding="async"
                className="mx-auto h-auto w-[150px] md:w-[190px]"
              />
            </picture>

            <h1 className="mt-8 text-4xl font-bold leading-[1.12] tracking-tight text-[#faf7f0] md:text-5xl lg:text-6xl">
              Sri Lankan provisions, brought properly to the UK and Europe
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-[#f2ebdd] md:text-xl">
              We import and distribute a short, carefully chosen list of Sri Lankan products in
              sealed retail packs: true Ceylon cinnamon graded C4, and unrefined kithul jaggery
              diced ready to use.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <EnquireButton mode="retail" variant="onDark">
                Order or enquire
              </EnquireButton>
              <a
                href="#im-products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#b08848] px-6 py-3 text-base font-semibold text-[#faf7f0] transition-colors duration-200 hover:bg-[#faf7f0]/10"
              >
                See the range
              </a>
            </div>
          </div>

          <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {HERO_MARKERS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-2 text-center">
                <Icon className="h-6 w-6 text-[#d9bd86]" />
                <span className="text-sm font-medium leading-snug text-[#f2ebdd]">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Who we are */}
      <section id="im-story" aria-labelledby="im-story-heading" className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#765b30]">
              Who we are
            </p>
            <h2
              id="im-story-heading"
              className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#3b2a14] md:text-4xl"
            >
              The Island Merchant
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-[#3b2a14]">
              <p>
                The Island Merchant is the import and distribution line of Dias Global Limited, a
                UK company. We bring Sri Lankan products into the United Kingdom and Europe and
                supply them to households, and to the shops, cafés, caterers and distributors who
                sell them on.
              </p>
              <p>
                We would rather carry a short list, know exactly where each item comes from, and
                sell it in the pack it was made for, than carry a wide range we cannot speak for.
                Ceylon cinnamon in particular is often blended with or sold as cassia by the time
                it reaches a European shelf, and we would rather you could see which one you have.
              </p>
            </div>
          </div>

          <ul className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
            {CAPABILITIES.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="rounded-2xl border border-[#b08848]/40 bg-[#f2ebdd] p-6"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#b08848]/50 bg-[#faf7f0] text-[#8b6b39]">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[#3b2a14]">{title}</h3>
                <p className="mt-2 text-base leading-relaxed text-[#6d563a]">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Products */}
      <section
        id="im-products"
        aria-labelledby="im-products-heading"
        className="bg-[#f2ebdd] py-16 md:py-24"
      >
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#765b30]">
              The range
            </p>
            <h2
              id="im-products-heading"
              className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#3b2a14] md:text-4xl"
            >
              What we supply
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#6d563a]">
              Both were chosen for the same reason: the difference between the real thing and the
              substitute is obvious the moment you have it in your hand.
            </p>
          </div>

          <div className="mt-10 space-y-8">
            {PRODUCTS.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Retail */}
      <section id="im-retail" aria-labelledby="im-retail-heading" className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#765b30]">
              <StoreIcon className="h-4 w-4" />
              Retail
            </p>
            <h2
              id="im-retail-heading"
              className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#3b2a14] md:text-4xl"
            >
              Buying for yourself
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-[#3b2a14]">
              <p>
                If you want a pouch or two for your own kitchen, tell us which products and how
                many packs. We confirm availability, price and delivery for your order and come
                straight back to you.
              </p>
              <p>
                There is nothing to pay at the enquiry stage, and you are free to walk away once
                you have the numbers.
              </p>
            </div>

            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Tell us what you want',
                  body: 'Pick your packs on the form below, and add anything else from Sri Lanka you would like us to bring in.',
                },
                {
                  step: '2',
                  title: 'We come back to you',
                  body: 'We confirm availability, the price for your quantity, and how quickly we can get it to you.',
                },
                {
                  step: '3',
                  title: 'You decide then',
                  body: 'Nothing is committed until you say so. No payment is taken through this page.',
                },
              ].map((item) => (
                <li
                  key={item.step}
                  className="rounded-2xl border border-[#b08848]/40 bg-[#f2ebdd] p-5"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#3b2a14] text-sm font-bold text-[#faf7f0]">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-[#3b2a14]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6d563a]">{item.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8">
              <EnquireButton mode="retail" variant="primary">
                Order for your kitchen
              </EnquireButton>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale */}
      <section
        id="im-wholesale"
        aria-labelledby="im-wholesale-heading"
        className="bg-[#f2ebdd] py-16 md:py-24"
      >
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#765b30]">
              <BoxIcon className="h-4 w-4" />
              Trade
            </p>
            <h2
              id="im-wholesale-heading"
              className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#3b2a14] md:text-4xl"
            >
              Trade and wholesale
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-[#3b2a14]">
              <p>
                Shops, delis, cafés, caterers, importers and distributors order in exactly the same
                sealed retail packs as everyone else: 100 g for the cinnamon, 200 g for the kithul
                jaggery. No cases and no bulk kilos.
              </p>
              <p>
                One pack means one specification, one shelf-ready unit and one quality standard
                across the whole business, and it means a genuinely small first order is possible
                while you find out how the product sells.
              </p>
              <p>
                Put the number of packs you expect to take into the form and it keeps a running
                total weight as you go, so you can sanity-check a parcel or a pallet before you
                send the enquiry.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-[#b08848]/40 bg-[#faf7f0] p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-[#3b2a14]">
                <DocumentIcon className="h-5 w-5 text-[#8b6b39]" />
                Worth telling us
              </h3>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-[#3b2a14]">
                {[
                  'Roughly how many packs per order, and how often you would expect to reorder.',
                  'What you sell and where: a shop, a café, an online listing, a wholesale book.',
                  'Which market the stock is going to: the UK, the EU, or both.',
                  'What documentation your own buyers or auditors will ask you for.',
                  'Anything else from Sri Lanka your customers keep asking you for.',
                ].map((item) => (
                  <li key={item.slice(0, 24)} className="flex gap-3">
                    <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[#8b6b39]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 text-base leading-relaxed text-[#6d563a]">
              Trade pricing and lead times are confirmed against your quantity and destination.
              Nothing on this page is an offer or a quotation.
            </p>

            <div className="mt-8">
              <EnquireButton mode="wholesale" variant="primary">
                Enquire as a trade buyer
              </EnquireButton>
            </div>
          </div>
        </div>
      </section>

      {/* Sri Lankan producers and suppliers */}
      <section
        id="im-producers"
        aria-labelledby="im-producers-heading"
        className="im-on-dark bg-[#3b2a14] py-16 md:py-24"
      >
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {/* Kraft, not gold: gold on brown is 4.23:1 and this is a 12px run. */}
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f2ebdd]">
              <SproutIcon className="h-4 w-4" />
              Producers and suppliers
            </p>
            <h2
              id="im-producers-heading"
              className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#faf7f0] md:text-4xl"
            >
              Do you make something in Sri Lanka?
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-[#f2ebdd]">
              <p>
                If you grow, process or pack a product in Sri Lanka and you want it on a shelf in
                the United Kingdom or in Europe, talk to us. Alongside the cinnamon and the
                jaggery we are looking for a small number of further products to import, market
                and distribute here.
              </p>
              <p>
                We are a UK company with a UK address and UK banking, buying in our own name. For
                a producer that means one buyer to deal with instead of a scattering of agents in
                several countries, and one conversation about specification, packing and volume.
              </p>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: ShipIcon,
                  title: 'A route to the market',
                  body: 'We buy, import and sell into the UK and Europe under our own name. You supply to an agreed specification and do not have to build a distribution network abroad.',
                },
                {
                  icon: StoreIcon,
                  title: 'Distribution and demand',
                  body: 'Placing a product with retail and trade buyers here, including listings, samples, packaging conversations and the follow-up, is our cost and our work rather than yours.',
                },
                {
                  icon: ShieldIcon,
                  title: 'Import compliance at our end',
                  body: 'Customs entry, tariff classification, destination-market labelling and the paperwork that travels with a consignment are handled here. You deal with the product, we deal with the border.',
                },
                {
                  icon: CheckIcon,
                  title: 'A straight answer',
                  body: 'If we cannot sell it here, or the volumes do not work, we will say so plainly rather than leave you waiting on a maybe.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <li
                  key={title}
                  className="rounded-2xl border border-[#b08848]/50 bg-[#faf7f0]/10 p-6"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#b08848]/60 text-[#d9bd86]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-[#faf7f0]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#f2ebdd]">{body}</p>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-[#b08848]/50 p-6">
              <h3 className="text-lg font-semibold text-[#faf7f0]">What to send us</h3>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-[#f2ebdd]">
                {[
                  'What you make, how it is processed and how it is packed today.',
                  'How much you can supply, how reliably, and at what times of year.',
                  'What documentation you already hold, and what you would need help with.',
                  'Whether you have exported before, and where to.',
                ].map((item) => (
                  <li key={item.slice(0, 24)} className="flex gap-3">
                    <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[#d9bd86]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <EnquireButton mode="producer" variant="onDark">
                Pitch your product
              </EnquireButton>
            </div>
          </div>
        </div>
      </section>

      {/* Register interest */}
      {/* tabIndex={-1}: EnquireButton moves focus here before scrolling, so a keyboard or
          screen-reader user lands on the form it has just reconfigured. */}
      <section
        id="im-enquire"
        aria-labelledby="im-enquire-heading"
        tabIndex={-1}
        className="py-16 outline-none md:py-24"
      >
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#765b30]">
              Enquiries
            </p>
            <h2
              id="im-enquire-heading"
              className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#3b2a14] md:text-4xl"
            >
              Tell us what you need
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#6d563a]">
              One form, three ways in: buying for yourself, buying for a business, or offering us
              something you produce in Sri Lanka. Say which you are and the rest of the form
              follows.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl">
            <InterestForm />
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-base text-[#6d563a]">
            Prefer email?{' '}
            <ObfuscatedEmail
              user={IM_EMAIL_USER}
              domain={IM_EMAIL_DOMAIN}
              subject={ENQUIRY_SUBJECT}
              label="Write to The Island Merchant"
              className="font-semibold text-[#765b30] underline underline-offset-4"
            />
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="im-faq" aria-labelledby="im-faq-heading" className="bg-[#f2ebdd] py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#765b30]">
              Questions
            </p>
            <h2
              id="im-faq-heading"
              className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#3b2a14] md:text-4xl"
            >
              Questions people ask
            </h2>

            <div className="mt-8 space-y-3">
              {FAQ_ITEMS.map((item, index) => (
                <Disclosure
                  key={item.question}
                  summary={item.question}
                  defaultOpen={index === 0}
                >
                  <p className="text-base leading-relaxed">{item.answer}</p>
                </Disclosure>
              ))}
            </div>

            <div className="mt-10 flex items-start gap-4 rounded-2xl border border-[#b08848]/40 bg-[#faf7f0] p-6">
              <picture>
                <source srcSet={LOGO.light.webp} type="image/webp" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={LOGO.light.png}
                  width={LOGO.light.width}
                  height={LOGO.light.height}
                  alt={LOGO.light.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-[72px] shrink-0"
                />
              </picture>
              <p className="text-sm leading-relaxed text-[#6d563a]">
                The Island Merchant is a line of business of {ORGANIZATION.name}, company number{' '}
                {ORGANIZATION.companyNumber}, {ORGANIZATION.address.streetAddress},{' '}
                {ORGANIZATION.address.addressLocality} {ORGANIZATION.address.postalCode}. Products
                are a Product of Sri Lanka, imported and distributed by {ORGANIZATION.name}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
