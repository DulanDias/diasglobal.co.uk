import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Breadcrumb from '@/components/breadcrumb'

export const metadata: Metadata = {
  title: 'Terms of Use | Dias Global Limited | Website Terms and Conditions',
  description: 'Terms of Use for Dias Global Limited website. Read our terms and conditions for using our website and services.',
  keywords: [
    'terms of use',
    'terms and conditions',
    'website terms',
    'Dias Global terms',
    'legal terms',
    'user agreement'
  ],
  openGraph: {
    title: 'Terms of Use | Dias Global Limited',
    description: 'Terms of Use for Dias Global Limited website. Read our terms and conditions for using our website and services.',
    images: ['/logo.png'],
  },
}

export default function TermsOfUsePage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Terms of Use' }
  ]

  return (
    <>
      <Header />
      <main>
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Terms of Use Content */}
        <article className="py-16">
          <div className="container max-w-4xl">
            {/* Header */}
            <header className="text-center mb-16 pb-8 border-b border-border">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-text to-accent bg-clip-text text-transparent">
                  Terms of Use
                </span>
              </h1>
              <p className="text-text-muted">
                Last updated: <span className="font-medium">{new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}</span>
              </p>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">1. Acceptance of Terms</h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  By accessing and using the Dias Global Limited website ("Website"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">2. Use License</h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  Permission is granted to temporarily download one copy of the materials on Dias Global Limited's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 mb-6 text-text-muted space-y-2">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                  <li>attempt to decompile or reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">3. Disclaimer</h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  The materials on Dias Global Limited's website are provided on an 'as is' basis. Dias Global Limited makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">4. Limitations</h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  In no event shall Dias Global Limited or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Dias Global Limited's website, even if Dias Global Limited or a Dias Global Limited authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">5. Accuracy of Materials</h2>
                <p className="text-text-muted leading-relaxed">
                  The materials appearing on Dias Global Limited's website could include technical, typographical, or photographic errors. Dias Global Limited does not warrant that any of the materials on its website are accurate, complete, or current. Dias Global Limited may make changes to the materials contained on its website at any time without notice. However, Dias Global Limited does not make any commitment to update the materials.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">6. Links</h2>
                <p className="text-text-muted leading-relaxed">
                  Dias Global Limited has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Dias Global Limited of the site. Use of any such linked website is at the user's own risk.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">7. Modifications</h2>
                <p className="text-text-muted leading-relaxed">
                  Dias Global Limited may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">8. Governing Law</h2>
                <p className="text-text-muted leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of England and Wales and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">9. Investment Disclaimer</h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  The information on this website is for informational purposes only and does not constitute investment advice, financial advice, trading advice, or any other sort of advice. You should not treat any of the website's content as such. Dias Global Limited does not recommend that any particular security, portfolio of securities, transaction, or investment strategy is suitable for any specific person.
                </p>
                <p className="text-text-muted leading-relaxed">
                  All investments involve risk, and the past performance of a security, industry, sector, market, or financial product does not guarantee future results or returns. You should carefully consider your investment objectives, level of experience, and risk appetite before making any investment decisions.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">10. Contact Information</h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  If you have any questions about these Terms of Use, please contact us:
                </p>
                <div className="bg-card border border-border rounded-xl p-6 mt-4">
                  <p className="text-text-muted">
                    <strong className="text-text">Dias Global Limited</strong><br />
                    71–75 Shelton Street, Covent Garden<br />
                    London WC2H 9JQ, United Kingdom
                  </p>
                </div>
              </section>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
