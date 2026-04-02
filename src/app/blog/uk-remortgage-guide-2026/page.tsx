import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ContactSection from '@/components/sections/contact'
import Breadcrumb from '@/components/breadcrumb'
import { getPost, articleMetadata } from '@/lib/blog-posts'
import { BlogPostingSchema } from '@/components/seo/schema-markup'
import BlogArticleHeroImage from '@/components/blog/article-hero-image'

const post = getPost('uk-remortgage-guide-2026')!

export const metadata: Metadata = articleMetadata(post)

export default function UkRemortgageGuidePage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Remortgaging in the UK' },
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
              <div className="flex justify-center gap-8 mb-6 text-sm text-text-muted">
                <span>April 1, 2026</span>
                <span>11 min read</span>
                <span>Property Finance</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Remortgaging in the UK: Fees, Fixes, and When Equity Opens Up
              </h1>
              <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
                Fees, fixes, term length, and further advances. What UK homeowners often overlook before
                they remortgage, and why the small print can matter more than the headline rate.
              </p>
            </header>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-text-muted leading-relaxed mb-6 text-justify">
                Most people shop for the lowest rate they can see on a screen. Fair enough. The trouble is
                that a remortgage is rarely just one number. Someone once said to me, &quot;I saved half a
                percent and felt clever until I paid the fee twice.&quot; This piece walks through the
                moving parts so you know what questions to ask. It is not a substitute for a qualified
                mortgage adviser or your own tax and legal professionals.
              </p>

              <p className="text-text-muted text-sm font-medium tracking-wide uppercase mb-2">
                Start here
              </p>
              <p className="text-text-muted leading-relaxed mb-8 text-justify">
                Remortgaging usually means replacing your current mortgage deal with a new one. Same
                property. Often a new lender. Sometimes the same lender on a different product. You might
                do it to cut monthly payments, to lock in a fixed rate before uncertainty builds, or to
                release equity if your home has gone up in value.
              </p>

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">Product fees are not an afterthought</h2>
              <p className="text-text-muted leading-relaxed mb-4 text-justify">
                Many deals carry a product fee. It might sit around a few hundred pounds. It might be
                higher. The key is how you pay it.
              </p>
              <ul className="list-disc pl-6 mb-6 text-text-muted space-y-2">
                <li>
                  <strong className="text-text">Pay upfront.</strong> You hand over cash at completion. It
                  does not accrue interest on the loan. That can be cheaper over the full term if the fee
                  is large.
                </li>
                <li>
                  <strong className="text-text">Add it to the loan.</strong> Easier on cash flow today. The
                  fee then attracts interest like the rest of the borrowing. Small change in monthly payment.
                  Bigger change over years.
                </li>
              </ul>
              <p className="text-text-muted italic mb-6 pl-4 border-l-2 border-accent/40">
                Two deals with the same rate are not the same deal if the fees differ.
              </p>

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">The rate you see is not always the cost you pay</h2>
              <p className="text-text-muted leading-relaxed mb-6 text-justify">
                Lenders publish annual interest rates. Helpful. Still, the &quot;true&quot; cost over the
                initial deal period should include fees, any incentives, and how long you expect to keep that
                product. A slightly higher rate with no fee can beat a razor rate with a chunky arrangement
                charge. Run the numbers over the period you actually plan to hold the deal, not forever.
              </p>

              <div className="bg-card border border-border rounded-xl p-6 mb-8 not-prose">
                <p className="text-text font-semibold mb-2">Quick mental checklist</p>
                <ul className="text-text-muted text-sm space-y-2">
                  <li>What is the product fee, and how am I paying it?</li>
                  <li>Are valuation or legal costs included or separate?</li>
                  <li>Does the deal assume a certain loan to value?</li>
                </ul>
              </div>

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">Fixed, variable, and the fear of guessing</h2>
              <p className="text-text-muted leading-relaxed mb-6 text-justify">
                A fixed rate locks your payments for a set period. Predictable budgeting. Peace of mind for
                many households. A variable or tracker rate can move with wider interest conditions. That
                can help when rates fall. It hurts when they rise. Neither is &quot;right&quot; in the
                abstract. It depends on your sleep at night, your other savings, and how tight the budget
                is if payments shift.
              </p>
              <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 bg-bg-light rounded-r-lg text-text-muted not-italic">
                &quot;I do not try to predict the Bank of England. I try to know what I can afford if things
                move the wrong way.&quot;
              </blockquote>

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">Two years or five years on a fix</h2>
              <p className="text-text-muted leading-relaxed mb-4 text-justify">
                Shorter fixes often come with lower commitment. You reassess sooner. Longer fixes buy
                stability for longer. You are also betting that today&apos;s trade off still suits you in
                half a decade. Think about life events. Job changes. School costs. A planned move.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-8 not-prose">
                <div className="rounded-lg border border-border p-4 bg-bg-light/50">
                  <p className="font-semibold text-text mb-2">Shorter fix (often around two years)</p>
                  <p className="text-text-muted text-sm leading-relaxed">
                    Flexibility to remortgage again. Less time locked in if plans change. More frequent
                    arrangement decisions.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4 bg-bg-light/50">
                  <p className="font-semibold text-text mb-2">Longer fix (often around five years)</p>
                  <p className="text-text-muted text-sm leading-relaxed">
                    Fewer remortgage events. Payment stability. Early repayment charges may matter more if
                    you need to move or overpay heavily.
                  </p>
                </div>
              </div>
              <p className="text-text-muted leading-relaxed mb-6 text-justify">
                Early repayment charges and exit fees sit in the offer documents. Read them before you
                sign, not after you get a job overseas or inherit a deposit for a different house.
              </p>

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">Further advance: when the house is worth more</h2>
              <p className="text-text-muted leading-relaxed mb-4 text-justify">
                If your property value has risen and your income supports it, your lender may agree a
                further advance. That is extra borrowing secured on the same home. It is not free money. It
                is secured debt with its own rate and terms. People sometimes use it to fund improvements,
                to consolidate other borrowing in one place, or to put capital to work elsewhere.
              </p>
              <p className="text-text-muted leading-relaxed mb-4 text-justify">
                Using equity from your home to invest in a business, securities, or other assets carries
                risk. Your home is on the line. Markets move. Trading and business ventures fail. A
                remortgage or further advance might still be structurally possible. Whether it is wise is a
                different conversation. That conversation belongs with regulated advisers who know your full
                picture.
              </p>
              <p className="text-center text-text-muted text-sm my-8 font-serif">
                Equity can be opportunity. It is never a guarantee.
              </p>

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">Before you decide: a practical list</h2>
              <ul className="list-disc pl-6 mb-6 text-text-muted space-y-2">
                <li>Confirm your current balance, rate, and when any deal ends.</li>
                <li>Ask how a new deal treats overpayments and portability if you move house.</li>
                <li>Compare total cost including fees, not just the monthly payment.</li>
                <li>Stress test your budget if rates were one or two percent higher after a fix ends.</li>
                <li>If you are thinking about investing released capital, separate the mortgage decision from
                  the investment hype.</li>
              </ul>

              <h2 className="text-3xl font-bold text-text mb-6 mt-12">Closing thought</h2>
              <p className="text-text-muted leading-relaxed mb-6 text-justify">
                Remortgaging is ordinary. Millions of households do it. The difference is usually in the
                detail. Fees, fix length, and how you treat equity are the parts that age well when you get
                them right, and sting when you do not. Ask blunt questions. Read the offer. Then get
                professional advice if the sums are large or the plan is new.
              </p>

              <div
                className="mt-12 rounded-xl border-2 border-amber-200/80 bg-amber-50/90 dark:bg-amber-950/20 dark:border-amber-800/60 p-6 text-text-muted text-sm leading-relaxed not-prose"
                role="note"
              >
                <p className="font-semibold text-text mb-3">Important notice</p>
                <p className="mb-3">
                  This article is general information and opinion only. It is{' '}
                  <strong className="text-text">not</strong> financial advice, tax advice, legal advice, or
                  a personal recommendation. Nothing here tells you what you must do. Mortgage products,
                  fees, and regulations change. Your circumstances are unique.
                </p>
                <p className="mb-0">
                  Before you make or change borrowing decisions, especially where investments, businesses, or
                  large sums are involved, speak to a qualified mortgage adviser, financial planner, or other
                  regulated professional who can assess your situation properly.
                </p>
              </div>

              <p className="text-text-muted text-sm mt-10">
                Related tools on this site may help with broader planning, but they do not replace tailored
                advice. See our{' '}
                <Link href="/tools" className="text-accent font-medium hover:underline">
                  calculators and tools
                </Link>
                {' '}if you want to explore numbers in parallel with professional guidance.
              </p>
            </div>
          </div>
        </article>
      </main>
      <ContactSection />
      <Footer />
    </>
  )
}
