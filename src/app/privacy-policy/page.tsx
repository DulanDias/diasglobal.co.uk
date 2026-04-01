import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Breadcrumb from '@/components/breadcrumb'
import { defaultOgTwitter, standardRobots } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: {
    absolute: 'Privacy Policy | Dias Global Limited | Data Protection & Privacy Information',
  },
  description:
    'Privacy Policy for Dias Global Limited. Learn how we collect, use, and protect your personal information in compliance with UK data protection laws and GDPR regulations.',
  keywords: [
    'privacy policy',
    'data protection',
    'GDPR compliance',
    'personal data',
    'Dias Global privacy',
    'UK data protection',
    'privacy rights',
  ],
  ...defaultOgTwitter(
    '/privacy-policy',
    'Privacy Policy | Dias Global Limited',
    'Privacy Policy for Dias Global Limited. Learn how we collect, use, and protect your personal information.'
  ),
  alternates: {
    canonical: '/privacy-policy',
  },
  robots: standardRobots,
}

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Privacy Policy' }
  ]

  return (
    <>
      <Header />
      <main>
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Privacy Policy Content */}
        <article className="py-16">
          <div className="container max-w-4xl">
            {/* Header */}
            <header className="text-center mb-16 pb-8 border-b border-border">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-text to-accent bg-clip-text text-transparent">
                  Privacy Policy
                </span>
              </h1>
              <p className="text-text-muted">
                Last updated: <span className="font-medium">{new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}</span>
              </p>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">1. Introduction</h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  Dias Global Limited ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or contact us through our forms.
                </p>
                <p className="text-text-muted leading-relaxed">
                  By using our website and services, you consent to the data practices described in this policy.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-text mb-4 mt-8">2.1 Personal Information</h3>
                <p className="text-text-muted leading-relaxed mb-4">
                  We collect only the information necessary to respond to your enquiry via the contact form. This typically includes:
                </p>
                <ul className="list-disc pl-6 mb-6 text-text-muted space-y-2">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Company name (if provided)</li>
                  <li>Message content</li>
                  <li>Investment capacity and preferences (if applicable)</li>
                </ul>

                <h3 className="text-xl font-semibold text-text mb-4 mt-8">2.2 Automatically Collected Information</h3>
                <p className="text-text-muted leading-relaxed mb-4">
                  When you visit our website, we may automatically collect certain information about your device, including:
                </p>
                <ul className="list-disc pl-6 mb-6 text-text-muted space-y-2">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent</li>
                  <li>Referring website</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">3. How We Use Your Information</h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc pl-6 mb-6 text-text-muted space-y-2">
                  <li>To respond to your enquiries and provide customer support</li>
                  <li>To send you information about investment opportunities (with your consent)</li>
                  <li>To improve our website and services</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">4. Legal Basis for Processing</h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  We process your personal data based on the following legal grounds:
                </p>
                <ul className="list-disc pl-6 mb-6 text-text-muted space-y-2">
                  <li><strong className="text-text">Consent:</strong> When you explicitly agree to our processing of your data</li>
                  <li><strong className="text-text">Legitimate Interest:</strong> To provide and improve our services</li>
                  <li><strong className="text-text">Legal Obligation:</strong> To comply with applicable laws and regulations</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">5. Data Protection</h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 mb-6 text-text-muted space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Secure hosting and infrastructure</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">6. Data Sharing and Disclosure</h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mb-6 text-text-muted space-y-2">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                  <li>With trusted service providers who assist us in operating our website (under strict confidentiality agreements)</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">7. Your Rights</h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  Under applicable data protection laws, you have the following rights:
                </p>
                <ul className="list-disc pl-6 mb-6 text-text-muted space-y-2">
                  <li><strong className="text-text">Access:</strong> Request a copy of your personal data</li>
                  <li><strong className="text-text">Rectification:</strong> Request correction of inaccurate data</li>
                  <li><strong className="text-text">Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong className="text-text">Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong className="text-text">Objection:</strong> Object to processing of your data</li>
                  <li><strong className="text-text">Withdrawal:</strong> Withdraw consent at any time</li>
                </ul>
                <p className="text-text-muted leading-relaxed">
                  To exercise these rights, please contact us using the form on our website.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">8. Data Retention</h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Typically, we retain:
                </p>
                <ul className="list-disc pl-6 mb-6 text-text-muted space-y-2">
                  <li>Contact form submissions: 2 years</li>
                  <li>Investment enquiries: 5 years</li>
                  <li>Website analytics: 26 months</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">9. International Transfers</h2>
                <p className="text-text-muted leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">10. Cookies and Tracking</h2>
                <p className="text-text-muted leading-relaxed">
                  We use cookies and similar technologies to enhance your browsing experience. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">11. Children's Privacy</h2>
                <p className="text-text-muted leading-relaxed">
                  Our website is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">12. Changes to This Policy</h2>
                <p className="text-text-muted leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b-2 border-accent">13. Contact Us</h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
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
