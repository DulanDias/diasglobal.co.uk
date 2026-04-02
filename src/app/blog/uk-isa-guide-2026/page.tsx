import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ContactSection from '@/components/sections/contact'
import Breadcrumb from '@/components/breadcrumb'
import { getPost, articleMetadata } from '@/lib/blog-posts'
import { BlogPostingSchema } from '@/components/seo/schema-markup'
import BlogArticleHeroImage from '@/components/blog/article-hero-image'
import IsaSavingsCalculator from '@/components/blog/isa-savings-calculator'

const post = getPost('uk-isa-guide-2026')!

export const metadata: Metadata = articleMetadata(post)

export default function UkIsaGuidePage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'UK ISAs explained' },
  ]

  return (
    <>
      <BlogPostingSchema post={post} />
      <Header />
      <main>
        <Breadcrumb items={breadcrumbItems} />

        <article className="py-16">
          <div className="container max-w-4xl">
            <header className="text-center mb-16 pb-8 border-b border-border">
              <BlogArticleHeroImage post={post} />
              <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm text-text-muted">
                <span>April 8, 2026</span>
                <span>15 min read</span>
                <span>Personal Finance</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                UK ISAs in Plain English: Cash, Stocks, Lifetime, and What &quot;Flexible&quot; Really Means
              </h1>
              <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
                Allowances, tax years, fixed versus variable, and why the same interest rate can leave you
                with different money in your pocket depending on your tax bracket.
              </p>
            </header>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-text-muted leading-relaxed mb-6 text-justify">
                An ISA is not a mystery product. It is mostly a label around a savings or investment
                account so that qualifying interest, dividends, and gains can grow free of UK tax within the
                rules. &quot;I will fix my ISA later&quot; is a sentence I hear often. The allowance is
                use-it-or-lose-it each tax year. This article lays out the main types, the numbers that
                matter, and a few worked comparisons. It is information, not a recommendation and not
                personal advice.
              </p>

              <p className="text-text-muted text-sm font-medium tracking-wide uppercase mb-2">
                The tax year clock
              </p>
              <p className="text-text-muted leading-relaxed mb-6 text-justify">
                The UK tax year runs from 6 April to 5 April the following calendar year. Your ISA
                subscription limit resets on that cycle. If you do not use your allowance before the year
                ends, you do not roll the spare into next year. Gone.
              </p>

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">How much can you put in?</h2>
              <p className="text-text-muted leading-relaxed mb-4 text-justify">
                For many adults the overall ISA allowance has been{' '}
                <strong className="text-text">£20,000 per tax year</strong>. You can split that across
                different ISA types in whatever mix fits your plan, as long as you stay within each
                product&apos;s own rules.
              </p>
              <ul className="list-disc pl-6 mb-6 text-text-muted space-y-2">
                <li>
                  <strong className="text-text">Cash ISA.</strong> Cash deposits. Often easy access, notice,
                  or fixed term.
                </li>
                <li>
                  <strong className="text-text">Stocks and shares ISA.</strong> Investments such as funds
                  and shares. Value can go down.
                </li>
                <li>
                  <strong className="text-text">Lifetime ISA (LISA).</strong> Stricter rules, different
                  purpose. Lower annual cap.
                </li>
              </ul>
              <p className="text-text-muted leading-relaxed mb-6 text-justify">
                HM Revenue and Customs publishes the official limits and conditions on GOV.UK. Always check
                there before you rely on numbers for a big decision. Budgets sometimes change rules forward,
                including how cash can sit inside ISAs from future years, so read the latest guidance.
              </p>

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">Lifetime ISA at a glance</h2>
              <p className="text-text-muted leading-relaxed mb-4 text-justify">
                A LISA is aimed at first-time buyers and retirement saving. You can only pay in up to{' '}
                <strong className="text-text">£4,000 per tax year</strong> into a LISA, and that amount
                counts toward your overall £20,000 ISA limit. The government adds a{' '}
                <strong className="text-text">25% bonus</strong> on what you contribute, subject to caps
                and eligibility. You must be aged 18 to 39 to open one. Withdrawals for anything other than
                an eligible first home purchase or after age 60 can trigger a government charge that can
                leave you with less than you put in. Read the small print before you treat it like a normal
                savings pot.
              </p>
              <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 bg-bg-light rounded-r-lg text-text-muted not-italic">
                &quot;A LISA is not a generic rainy-day account. The exit rules bite if you use it like
                one.&quot;
              </blockquote>

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">Cash ISA: easy access, fixed, and variable</h2>
              <p className="text-text-muted leading-relaxed mb-4 text-justify">
                <strong className="text-text">Easy access</strong> usually means you can withdraw without
                notice, though some accounts limit withdrawals per year. The rate is often{' '}
                <strong className="text-text">variable</strong>. The bank can move it up or down.
              </p>
              <p className="text-text-muted leading-relaxed mb-4 text-justify">
                <strong className="text-text">Fixed-rate</strong> cash ISAs lock your money for a set term.
                You get a known rate for that period. Early access may be blocked or may cost you interest.
                Peace of mind if you do not need the cash until the term ends.
              </p>
              <p className="text-text-muted leading-relaxed mb-6 text-justify">
                Some accounts advertise a headline rate that includes a temporary bonus. The rate can drop
                when the bonus ends. Set a diary note. Switching is normal in a competitive market.
              </p>

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">Stocks and shares ISA</h2>
              <p className="text-text-muted leading-relaxed mb-6 text-justify">
                Same annual subscription limit, different risk. You might hold funds, investment trusts, or
                individual shares. Dividends and capital gains can be tax-free inside the wrapper while you
                remain within ISA rules. You can also lose money. Fees and fund choices matter as much as
                the tax wrapper.
              </p>

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">What &quot;flexible&quot; means</h2>
              <p className="text-text-muted leading-relaxed mb-4 text-justify">
                <strong className="text-text">Flexible</strong> refers to how withdrawals interact with
                your annual allowance in that tax year. On a flexible Cash ISA (or flexible Stocks and
                Shares ISA where offered), if you take money out, you can usually put it back in before 5
                April without using extra subscription. On a non-flexible ISA, a withdrawal might still
                count against what you can replace. Not every provider offers flexibility. Check before you
                move money in a hurry.
              </p>
              <p className="text-center text-text-muted text-sm my-6 font-serif">
                Flexible is about allowance mechanics. It is not the same as &quot;risk free.&quot;
              </p>

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">Indicative cash ISA rates (early 2026)</h2>
              <p className="text-text-muted leading-relaxed mb-4 text-justify">
                Rates change daily. Independent comparison sites in early 2026 have often listed competitive{' '}
                <strong className="text-text">easy-access</strong> cash ISAs in a band of roughly{' '}
                <strong className="text-text">about 4% to about 4.7% AER</strong>, sometimes with a
                time-limited bonus on top of a lower underlying rate.{' '}
                <strong className="text-text">Fixed</strong> cash ISAs for multi-year terms have often
                appeared in a similar ballpark, depending on term length and provider. Names that show up
                frequently in those tables include providers such as Marcus, Cynergy Bank, Trading 212,
                Plum, and Tembo, among others. Treat any figure here as a snapshot idea, not a live quote.
              </p>
              <div className="overflow-x-auto not-prose mb-8 rounded-xl border border-border">
                <table className="w-full text-left text-sm text-text-muted">
                  <thead className="bg-bg-light text-text">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Style</th>
                      <th className="px-4 py-3 font-semibold">Typical range (indicative)</th>
                      <th className="px-4 py-3 font-semibold">Trade-off</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3">Easy access variable</td>
                      <td className="px-4 py-3 font-mono tabular-nums">~4.0% to ~4.7% AER</td>
                      <td className="px-4 py-3">Rate can move. Bonuses may expire.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Fixed term cash ISA</td>
                      <td className="px-4 py-3 font-mono tabular-nums">often mid-4% range</td>
                      <td className="px-4 py-3">Locked for the term. Early exit rules apply.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Ordinary easy-access savings (not ISA)</td>
                      <td className="px-4 py-3 font-mono tabular-nums">often similar band</td>
                      <td className="px-4 py-3">Interest may be taxable after allowances.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-8">
                Always confirm the current rate on the provider&apos;s own site before you apply. Past tables
                are not a promise of future pricing.
              </p>

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">ISA versus ordinary savings and tax brackets</h2>
              <p className="text-text-muted leading-relaxed mb-4 text-justify">
                Interest in a non-ISA savings account is part of your income for tax purposes. The UK uses a{' '}
                <strong className="text-text">Personal Savings Allowance</strong> (PSA). In broad terms, basic
                rate taxpayers can earn up to about <strong className="text-text">£1,000</strong> of savings
                interest per year tax-free. Higher rate taxpayers get about{' '}
                <strong className="text-text">£500</strong>. Additional rate taxpayers get{' '}
                <strong className="text-text">£0</strong> under the PSA. Above those thresholds, tax is
                charged at your marginal income tax rate on the interest that exceeds the allowance.
              </p>
              <p className="text-text-muted leading-relaxed mb-4 text-justify">
                Inside a Cash ISA, qualifying interest is not taxed in this way. That matters most when your
                interest breaches the PSA, or when you are already in a higher bracket.
              </p>
              <p className="text-text-muted leading-relaxed mb-6 text-justify">
                <strong className="text-text">Worked example.</strong> Suppose you hold £50,000 for one year
                at a <strong className="text-text">4.5% AER</strong> gross rate. That is{' '}
                <strong className="text-text">£2,250</strong> interest before tax. In an ISA you keep{' '}
                <strong className="text-text">£2,250</strong>. In an ordinary account, as a basic rate
                taxpayer you might pay tax on roughly £1,250 above the PSA at 20%, which is about{' '}
                <strong className="text-text">£250</strong>, leaving about <strong className="text-text">£2,000</strong> net. As a higher rate taxpayer you might pay tax on roughly £1,750 above the PSA at
                40%, about <strong className="text-text">£700</strong>, leaving about{' '}
                <strong className="text-text">£1,550</strong> net. Same rate on the screen. Different
                outcome in your pocket.
              </p>

              <IsaSavingsCalculator />

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">Quick comparison of ISA types</h2>
              <div className="overflow-x-auto not-prose mb-8 rounded-xl border border-border">
                <table className="w-full text-left text-sm text-text-muted">
                  <thead className="bg-bg-light text-text">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Type</th>
                      <th className="px-4 py-3 font-semibold">Risk</th>
                      <th className="px-4 py-3 font-semibold">Access / notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-medium text-text">Cash ISA</td>
                      <td className="px-4 py-3">Lower</td>
                      <td className="px-4 py-3">Fixed, variable, or easy access. FSCS limits apply per bank.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-text">Stocks and shares ISA</td>
                      <td className="px-4 py-3">Higher</td>
                      <td className="px-4 py-3">Investments can fall. Long-term horizon often assumed.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-text">Lifetime ISA</td>
                      <td className="px-4 py-3">Varies</td>
                      <td className="px-4 py-3">£4k yearly cap. Bonus and withdrawal penalties if misused.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-text">Junior ISA</td>
                      <td className="px-4 py-3">Varies</td>
                      <td className="px-4 py-3">For under-18s. Separate allowance. Locks until adulthood.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">Before you open or switch anything</h2>
              <ul className="list-disc pl-6 mb-6 text-text-muted space-y-2">
                <li>Confirm this year&apos;s subscription limit and any rule changes on GOV.UK.</li>
                <li>Compare the full package: rate, fees, access rules, and whether the ISA is flexible.</li>
                <li>If you transfer, use an official ISA transfer. Do not withdraw large sums to reinvest by hand unless you understand the allowance impact.</li>
                <li>Match the product to the goal. A LISA is not a substitute for an emergency fund if the exit rules do not fit.</li>
              </ul>

              <div
                className="mt-12 rounded-xl border-2 border-amber-200/80 bg-amber-50/90 dark:bg-amber-950/20 dark:border-amber-800/60 p-6 text-text-muted text-sm leading-relaxed not-prose"
                role="note"
              >
                <p className="font-semibold text-text mb-3">Important notice</p>
                <p className="mb-3">
                  This article is general information only. It is{' '}
                  <strong className="text-text">not</strong> financial advice, tax advice, investment
                  advice, or a personal recommendation. Tax rules depend on your circumstances and can
                  change. Rates and products move every day.
                </p>
                <p className="mb-0">
                  For advice tailored to you, speak to a qualified financial adviser or tax specialist. You
                  can also explore our{' '}
                  <Link href="/tools" className="text-accent font-medium hover:underline">
                    planning tools
                  </Link>{' '}
                  alongside professional guidance, not instead of it.
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
      <ContactSection />
      <Footer />
    </>
  )
}
