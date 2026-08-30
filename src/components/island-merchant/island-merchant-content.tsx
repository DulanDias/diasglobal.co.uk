import ObfuscatedEmail from '@/components/foundation/obfuscated-email'
import EnquireButton from '@/components/island-merchant/enquire-button'
import IslandNav from '@/components/island-merchant/island-nav'
import InterestForm from '@/components/island-merchant/interest-form'
import {
  FAQ_ITEMS,
  IM_EMAIL_DOMAIN,
  IM_EMAIL_USER,
  LOGO,
  PRODUCTS,
  type Product,
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
 * #b08848 is 3.04:1 — decorative rules and borders only on cream, though it
 * is 4.23:1 on the deep brown panel and may carry text there.
 *
 * The palette tokens (--im-ink, --im-accent, …), the remap of the shared Dias
 * tokens and the anchor scroll-margin all live in the `.im-theme` block in
 * globals.css — this component only adds the focus-ring rule, which has no
 * counterpart there. Do not redeclare the tokens here: this <style> block is
 * unlayered and would silently out-specify the stylesheet.
 */
const THEME_CSS = `
.im-theme a:focus-visible,
.im-theme button:focus-visible,
.im-theme input:focus-visible,
.im-theme select:focus-visible,
.im-theme textarea:focus-visible {
  outline: 2px solid var(--im-accent);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Accent #8b6b39 on the deep brown #3b2a14 is only 2.79:1, below the 3:1 that
   WCAG 1.4.11 requires of a focus indicator against its adjacent colour — and
   outline-offset puts brown on both sides of the ring. Cream is 12.85:1. Any
   dark panel carries .im-on-dark so the indicator flips with it. */
.im-theme .im-on-dark a:focus-visible,
.im-theme .im-on-dark button:focus-visible,
.im-theme .im-on-dark input:focus-visible,
.im-theme .im-on-dark select:focus-visible,
.im-theme .im-on-dark textarea:focus-visible,
.im-theme .im-on-dark:focus-visible {
  outline-color: var(--im-cream);
}
`

const ENQUIRY_SUBJECT = 'The Island Merchant — enquiry'

/** Short pack badge shown beside each product name. */
const PACK_BADGE: Record<ProductSlug, string> = {
  'ceylon-cinnamon-sticks': 'Grade C4',
  'ceylon-kithul-jaggery-diced': 'Diced cubes',
}

/** Tasting and usage notes, written for the advert — not packaging copy. */
const USAGE_NOTES: Record<ProductSlug, { heading: string; notes: string[] }> = {
  'ceylon-cinnamon-sticks': {
    heading: 'Tasting and usage',
    notes: [
      'Warm, sweet and faintly floral rather than hot — closer to a dessert spice than to the sharp bite of cassia.',
      'Use the quills whole: one in the pan when you start a rice, a curry or a dhal; in chai, mulled wine or a pot of tea; simmered into stewed fruit or a sugar syrup.',
      'Grind only what you need. The quills are brittle enough to break up in a mortar or a spice grinder, and they hold their aroma far longer whole than ground.',
    ],
  },
  'ceylon-kithul-jaggery-diced': {
    heading: 'Tasting and usage',
    notes: [
      'Deep and caramel-like with a smoky treacle finish, and less flatly sweet than refined sugar.',
      'Use it wherever sugar goes: dissolved into tea or coffee, melted over curd or yoghurt, stirred into porridge, or in baking where a treacle note is welcome.',
      'The diced cubes portion by hand and dissolve faster than a chipped block, so there is no grating and no chisel.',
    ],
  },
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const headingId = `im-product-${product.slug}`
  const usage = USAGE_NOTES[product.slug]

  return (
    <article
      aria-labelledby={headingId}
      className="overflow-hidden rounded-2xl border border-[#b08848]/40 bg-[#faf7f0]"
    >
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="bg-[#f2ebdd]">
          <picture>
            <source
              srcSet={`${product.image.webp} ${product.image.width}w`}
              sizes="(min-width: 1024px) 34rem, 100vw"
              type="image/webp"
            />
            { }
            <img
              src={product.image.jpg}
              srcSet={`${product.image.jpg} ${product.image.width}w`}
              sizes="(min-width: 1024px) 34rem, 100vw"
              width={product.image.width}
              height={product.image.height}
              alt={product.image.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="h-full w-full object-cover"
            />
          </picture>
        </div>

        <div className="p-6 md:p-8">
          <h3 id={headingId} className="text-2xl font-bold tracking-tight text-[#3b2a14] md:text-3xl">
            {product.name}
          </h3>
          <p className="mt-1 text-sm italic text-[#6d563a]">{product.botanicalName}</p>

          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Pack details">
            <li className="rounded-full bg-[#3b2a14] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#faf7f0]">
              {PACK_BADGE[product.slug]}
            </li>
            <li className="rounded-full bg-[#3b2a14] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#faf7f0]">
              {product.netWeight}
            </li>
            <li className="rounded-full border border-[#b08848] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#765b30]">
              Product of Sri Lanka
            </li>
          </ul>

          <ul className="mt-4 space-y-1 text-sm font-semibold text-[#765b30]">
            {product.frontOfPack.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <div className="mt-5 space-y-4 text-base leading-relaxed text-[#3b2a14]">
            {product.copy.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <h4 className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-[#765b30]">
            {usage.heading}
          </h4>
          <ul className="mt-3 space-y-2 text-base leading-relaxed text-[#3b2a14]">
            {usage.notes.map((note) => (
              <li key={note.slice(0, 32)} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b08848]" />
                <span>{note}</span>
              </li>
            ))}
          </ul>

          {/* tabIndex makes the overflow container reachable without a mouse; without it the
              second column cannot be scrolled into view on a narrow viewport by keyboard. */}
          <div
            className="mt-6 overflow-x-auto"
            tabIndex={0}
            role="region"
            aria-label={`Indicative specification — ${product.name}`}
          >
            <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
              <caption className="mb-3 text-left text-sm font-semibold text-[#765b30]">
                Indicative specification — {product.name}
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

          <p className="mt-4 text-sm leading-relaxed text-[#6d563a]">
            Indicative only, and given in good faith ahead of launch. Where a grade is quoted it
            follows Sri Lanka’s national cinnamon grading system, and grading certification is
            available on request. Commodity codes and import classification will be confirmed per
            consignment at customs entry and are not a substitute for your own tariff advice.
            The specification that counts is the one printed on the pack and on the documents
            travelling with each shipment.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <EnquireButton mode="retail" product={product.slug} variant="primary">
              Register for a pack
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

export default function IslandMerchantContent() {
  return (
    <div className="im-theme bg-[#faf7f0] text-[#3b2a14]">
      <style dangerouslySetInnerHTML={{ __html: THEME_CSS }} />

      <IslandNav />

      {/* Hero — deep brown panel, reverse lockup */}
      <div className="im-on-dark bg-[#3b2a14] py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            {/* alt="" on purpose: the <h1> two elements below reads "The Island Merchant", and
                a named lockup here would make a screen reader announce it twice in a row. The
                FAQ footer lockup keeps its name, where no adjacent heading repeats it. */}
            <picture>
              <source srcSet={LOGO.reverse.webp} type="image/webp" />
              { }
              <img
                src={LOGO.reverse.png}
                width={LOGO.reverse.width}
                height={LOGO.reverse.height}
                sizes="(min-width: 768px) 200px, 150px"
                alt=""
                loading="eager"
                decoding="async"
                className="mx-auto h-auto w-[150px] md:w-[200px]"
              />
            </picture>

            {/* Cream label on a gold rule. Gold #b08848 on brown #3b2a14 is 4.23:1, fine for
                a border but short of the 4.5:1 this 12px run needs. Cream is 12.85:1. */}
            <p className="mt-8 inline-block rounded-full border border-[#b08848] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#faf7f0]">
              Pre-launch — registering interest
            </p>

            <h1 className="mt-6 text-4xl font-bold leading-[1.12] tracking-tight text-[#faf7f0] md:text-5xl lg:text-6xl">
              The Island Merchant
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-[#f2ebdd] md:text-xl">
              Sri Lankan products, brought properly to the United Kingdom and Europe. We import and
              distribute a short list of Sri Lankan products we know well — starting with true
              Ceylon cinnamon and unrefined kithul jaggery, in sealed retail packs.
            </p>

            <p className="mt-4 text-base leading-relaxed text-[#f2ebdd]">
              Nothing is for sale yet. We are registering interest now — from households, from trade
              buyers, and from producers in Sri Lanka — so that the first shipment matches real
              demand.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <EnquireButton mode="retail" variant="onDark">
                Register your interest
              </EnquireButton>
              <a
                href="#im-products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#b08848] px-6 py-3 text-base font-semibold text-[#faf7f0] transition-colors duration-200 hover:bg-[#faf7f0]/10"
              >
                See the products
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Story */}
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
                The Island Merchant is a new line of business under Dias Global Limited, a UK
                company. We import Sri Lankan products into the United Kingdom and Europe and
                distribute them — to households, and to the shops, cafés, caterers and distributors
                who sell them on.
              </p>
              <p>
                We would rather carry a short list, know exactly where each item comes from, and
                sell it in the pack it was made for, than carry a wide range we cannot speak for.
                Ceylon cinnamon in particular is often blended with or sold as cassia by the time it
                reaches a European shelf, and we would rather you could see which one you have.
              </p>
              <p>
                We are pre-launch. This page exists so that anyone who wants these products can tell
                us before the first order is placed, and so that producers in Sri Lanka can reach us
                directly rather than through three intermediaries.
              </p>
            </div>
          </div>

          <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            <li className="rounded-2xl border border-[#b08848]/40 bg-[#f2ebdd] p-5">
              <h3 className="text-base font-semibold text-[#3b2a14]">Two products to start</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6d563a]">
                Ceylon cinnamon sticks and diced kithul jaggery. More only when we can stand behind
                them.
              </p>
            </li>
            <li className="rounded-2xl border border-[#b08848]/40 bg-[#f2ebdd] p-5">
              <h3 className="text-base font-semibold text-[#3b2a14]">Sealed retail packs</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6d563a]">
                100 g of cinnamon, 200 g of jaggery. Trade buyers order in those same packs — no
                cases, no bulk kilos.
              </p>
            </li>
            <li className="rounded-2xl border border-[#b08848]/40 bg-[#f2ebdd] p-5">
              <h3 className="text-base font-semibold text-[#3b2a14]">Direct from Sri Lanka</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6d563a]">
                Product of Sri Lanka, imported and distributed by Dias Global Limited in London.
              </p>
            </li>
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
              The first two products
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#765b30]">
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
                If you want a pouch or two for your own kitchen, tell us which products and roughly
                how many packs. There is nothing to pay and nothing to commit to — we are not taking
                orders yet, and registering interest simply puts you on the list.
              </p>
              <p>
                Quantities are useful to us even when they are approximate. They are how we decide
                how much to bring in, and they are the difference between a first shipment that
                sells and one that sits.
              </p>
            </div>

            <ol className="mt-8 space-y-4">
              <li className="rounded-2xl border border-[#b08848]/40 bg-[#f2ebdd] p-5">
                <h3 className="text-base font-semibold text-[#3b2a14]">1. Tell us what you want</h3>
                <p className="mt-2 text-base leading-relaxed text-[#6d563a]">
                  Pick your packs on the form below, and add anything else from Sri Lanka you would
                  like us to bring in.
                </p>
              </li>
              <li className="rounded-2xl border border-[#b08848]/40 bg-[#f2ebdd] p-5">
                <h3 className="text-base font-semibold text-[#3b2a14]">2. We come back to you</h3>
                <p className="mt-2 text-base leading-relaxed text-[#6d563a]">
                  When we have stock, a price and a way to order, we email the people who
                  registered.
                </p>
              </li>
              <li className="rounded-2xl border border-[#b08848]/40 bg-[#f2ebdd] p-5">
                <h3 className="text-base font-semibold text-[#3b2a14]">3. You decide then</h3>
                <p className="mt-2 text-base leading-relaxed text-[#6d563a]">
                  Registering is not an order and it is not a contract. You are free to walk away.
                </p>
              </li>
            </ol>

            <div className="mt-8">
              <EnquireButton mode="retail" variant="primary">
                Register as a retail buyer
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#765b30]">
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
                across the whole business — and it means a genuinely small first order is possible
                while you find out how the product sells.
              </p>
              <p>
                Put the number of packs you would expect to take into the form and it keeps a
                running total weight as you go, so you can sanity-check a parcel or a pallet before
                you send the enquiry.
              </p>
            </div>

            <h3 className="mt-8 text-lg font-semibold text-[#3b2a14]">Worth telling us</h3>
            <ul className="mt-4 space-y-3 text-base leading-relaxed text-[#3b2a14]">
              {[
                'Roughly how many packs per order, and how often you would expect to reorder.',
                'What you sell and where — a shop, a café, an online listing, a wholesale book.',
                'Which market the stock is going to: the UK, the EU, or both.',
                'What documentation your own buyers or auditors will ask you for.',
                'Anything else from Sri Lanka your customers keep asking you for.',
              ].map((item) => (
                <li key={item.slice(0, 24)} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b08848]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-base leading-relaxed text-[#6d563a]">
              Trade terms, pricing and lead times are discussed once we have stock. Nothing on this
              page is an offer or a quotation.
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f2ebdd]">
              Producers &amp; suppliers
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
                the United Kingdom or in Europe, talk to us. Alongside the cinnamon and the jaggery
                we are looking for a small number of further products to import, market and
                distribute here.
              </p>
              <p>
                We are a UK company with a UK address and UK banking, buying in our own name. For a
                producer that means one buyer to deal with instead of a scattering of agents in
                several countries, and one conversation about specification, packing and volume.
              </p>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              <li className="rounded-2xl border border-[#b08848]/50 bg-[#faf7f0]/10 p-5">
                <h3 className="text-base font-semibold text-[#faf7f0]">A route to the market</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#f2ebdd]">
                  We will buy, import and sell into the UK and Europe under our own name. You would
                  supply to an agreed specification; you would not have to build a distribution
                  network abroad.
                </p>
              </li>
              <li className="rounded-2xl border border-[#b08848]/50 bg-[#faf7f0]/10 p-5">
                <h3 className="text-base font-semibold text-[#faf7f0]">Distribution and demand</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#f2ebdd]">
                  Placing a product with retail and trade buyers here — listings, samples, packaging
                  conversations, the follow-up — would be our cost and our work, not yours.
                </p>
              </li>
              <li className="rounded-2xl border border-[#b08848]/50 bg-[#faf7f0]/10 p-5">
                <h3 className="text-base font-semibold text-[#faf7f0]">Import compliance at our end</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#f2ebdd]">
                  Customs entry, tariff classification, destination-market labelling and the
                  paperwork that travels with a consignment will be handled at our end. You would
                  deal with the product; we would deal with the border. We are pre-launch and have
                  not yet shipped a consignment, so treat this as what we are set up to do rather
                  than a track record.
                </p>
              </li>
              <li className="rounded-2xl border border-[#b08848]/50 bg-[#faf7f0]/10 p-5">
                <h3 className="text-base font-semibold text-[#faf7f0]">A straight answer</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#f2ebdd]">
                  If we cannot sell it here, or the volumes do not work, we will say so plainly
                  rather than leave you waiting on a maybe.
                </p>
              </li>
            </ul>

            <h3 className="mt-10 text-lg font-semibold text-[#faf7f0]">What to send us</h3>
            <ul className="mt-4 space-y-3 text-base leading-relaxed text-[#f2ebdd]">
              {[
                'What you make, how it is processed and how it is packed today.',
                'How much you can supply, how reliably, and at what times of year.',
                'What documentation you already hold, and what you would need help with.',
                'Whether you have exported before, and where to.',
              ].map((item) => (
                <li key={item.slice(0, 24)} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b08848]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

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
        className="py-16 md:py-24 outline-none"
      >
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#765b30]">
              Register interest
            </p>
            <h2
              id="im-enquire-heading"
              className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#3b2a14] md:text-4xl"
            >
              Register your interest
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#6d563a]">
              One form, three ways in: buying for yourself, buying for a business, or offering us
              something you produce in Sri Lanka. Say which you are and the rest of the form follows.
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
      <section
        id="im-faq"
        aria-labelledby="im-faq-heading"
        className="bg-[#f2ebdd] py-16 md:py-24"
      >
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

            <div className="mt-8 space-y-6">
              {FAQ_ITEMS.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-[#b08848]/40 bg-[#faf7f0] p-6"
                >
                  <h3 className="text-lg font-semibold text-[#3b2a14]">{item.question}</h3>
                  <p className="mt-3 text-base leading-relaxed text-[#6d563a]">{item.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-start gap-4 rounded-2xl border border-[#b08848]/40 p-6">
              <picture>
                <source srcSet={LOGO.light.webp} type="image/webp" />
                { }
                <img
                  src={LOGO.light.png}
                  width={LOGO.light.width}
                  height={LOGO.light.height}
                  sizes="72px"
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
