import Link from 'next/link'
import ObfuscatedEmail from '@/components/foundation/obfuscated-email'

// Address is assembled in the browser from these base64 parts so it never
// appears as plaintext in the served HTML — see ObfuscatedEmail.
const EMAIL_USER = 'ZHVsYW4=' // "dulan"
const EMAIL_DOMAIN = 'ZGlhc2dsb2JhbC5jby51aw==' // "diasglobal.co.uk"
const CONTRIBUTE_SUBJECT = 'Dias Global Foundation — Contribution & Enquiry'

export default function FoundationContent() {
  return (
    <div className="bg-bg">
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-bg to-bg-light">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              The Charitable Arm of Dias Global Limited
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-[1.12]">
              Dias Global
              <span className="text-accent block">Foundation</span>
            </h1>
            <p className="text-lg md:text-xl text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
              We identify and help those in genuine need — supporting carefully vetted
              individuals and families with committed, dignified assistance until they
              reach a meaningful milestone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ObfuscatedEmail
                user={EMAIL_USER}
                domain={EMAIL_DOMAIN}
                subject={CONTRIBUTE_SUBJECT}
                label="Contribute to the Fund"
                className="btn btn-primary"
              />
              <Link href="#how-we-help" className="btn btn-secondary">
                How We Help
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-bg">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Our Purpose</span>
            <h2 className="section-title">Compassion, Applied with Diligence</h2>
            <p className="section-subtitle">
              The Dias Global Foundation is the charitable arm of our family holding
              company. Our objective is simple: to find people facing real hardship and to
              help them meaningfully — funded by Dias Global Limited and supported by those
              who wish to give.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-6">🔍</div>
              <h3 className="text-2xl font-semibold mb-4 text-text">Vetted &amp; Verified</h3>
              <p className="text-text-muted leading-relaxed">
                Every case is carefully reviewed and verified before support begins, so that
                help reaches those who genuinely need it.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-6">🤝</div>
              <h3 className="text-2xl font-semibold mb-4 text-text">Committed Support</h3>
              <p className="text-text-muted leading-relaxed">
                We don&apos;t give once and walk away. Where it matters, we commit — one-off or
                recurring — until a clear milestone is reached.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-6">💚</div>
              <h3 className="text-2xl font-semibold mb-4 text-text">Dignity First</h3>
              <p className="text-text-muted leading-relaxed">
                Support is delivered with respect and discretion, protecting the privacy and
                dignity of every family we help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How we help */}
      <section id="how-we-help" className="py-24 bg-bg-light scroll-mt-24">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Our Model</span>
            <h2 className="section-title">Two Ways We Support</h2>
            <p className="section-subtitle">
              Once a case is vetted, we design the right kind of help for the circumstances —
              from a single intervention to sustained support with a defined endpoint.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card">
              <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl flex items-center justify-center border border-accent/20 mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-accent">
                  <path d="M20 12v10H4V12" />
                  <path d="M2 7h20v5H2z" />
                  <path d="M12 22V7" />
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-text">One-Off Support</h3>
              <p className="text-text-muted mb-6 leading-relaxed">
                A direct, immediate response to a pressing need — clearing an urgent debt,
                covering an essential purchase, or relieving a moment of acute hardship.
              </p>
              <ul className="space-y-2">
                {['Emergency essentials', 'Medical or care costs', 'Critical one-time relief'].map((item) => (
                  <li key={item} className="text-text-muted flex items-center">
                    <span className="text-accent mr-3">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl flex items-center justify-center border border-accent/20 mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-accent">
                  <path d="M3 3v5h5" />
                  <path d="M3 8a9 9 0 1 0 2.5-3.5L3 8" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-text">Recurring Support, Until a Milestone</h3>
              <p className="text-text-muted mb-6 leading-relaxed">
                Sustained help on a regular basis toward a defined goal — for example,
                sponsoring a child&apos;s tuition and study costs through to an examination, then
                celebrating that milestone together.
              </p>
              <ul className="space-y-2">
                {['Education & scholarship sponsorship', 'Monthly stipends for essentials', 'Support with a clear endpoint'].map((item) => (
                  <li key={item} className="text-text-muted flex items-center">
                    <span className="text-accent mr-3">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-bg">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Our Process</span>
            <h2 className="section-title">From Referral to Milestone</h2>
            <p className="section-subtitle">
              A careful, human process ensures our support is fair, verified, and genuinely
              transformative.
            </p>
          </div>
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-12">
              {[
                {
                  title: 'Identification & Referral',
                  body: 'We identify individuals and families facing genuine hardship, whether through direct outreach or trusted referrals.',
                },
                {
                  title: 'Vetting & Verification',
                  body: 'Every case is carefully assessed and verified — understanding the circumstances, needs, and how support can make a lasting difference.',
                },
                {
                  title: 'A Tailored Support Plan',
                  body: 'We agree the right form of help — one-off or recurring — with a clear milestone that defines what success looks like.',
                },
                {
                  title: 'Ongoing Care Until the Milestone',
                  body: 'We stay committed, providing support and checking in until the milestone is reached and the family is on stronger footing.',
                },
              ].map((step, index) => (
                <div key={step.title} className="flex items-start gap-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center flex-shrink-0 relative z-10 shadow-lg text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3 text-text">{step.title}</h3>
                    <p className="text-text-muted leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Funding & transparency */}
      <section className="py-24 bg-bg-light">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <span className="section-eyebrow">How It&apos;s Funded</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-text leading-tight">
                Backed by the family, open to those who wish to give
              </h2>
              <p className="text-text-muted leading-relaxed mb-4">
                The Foundation is funded by Dias Global Limited. This means our commitments to
                the families we support are backed by the holding company — not dependent on
                fundraising.
              </p>
              <p className="text-text-muted leading-relaxed">
                Contributions from friends, partners, and well-wishers extend how many people
                we can reach. If you would like to give, we&apos;d be glad to tell you more about
                where your support goes.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-text">Our commitments</h3>
              <ul className="space-y-4">
                {[
                  'Support only reaches vetted, verified cases',
                  'Each commitment has a clear purpose and milestone',
                  'Families are treated with dignity and discretion',
                  'Contributors can learn exactly how support is used',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-accent flex-shrink-0 mt-0.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span className="text-text-muted leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Get involved / CTA */}
      <section className="py-24 bg-bg">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center bg-card border border-border rounded-2xl p-10 md:p-14">
            <div className="text-5xl mb-6">💌</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-text">
              Contribute to the Foundation Fund
            </h2>
            <p className="text-text-muted leading-relaxed mb-8 max-w-xl mx-auto">
              If you&apos;d like to contribute to the Dias Global Foundation Fund, or simply learn
              more about the work we do, we&apos;d love to hear from you. Reach out and we&apos;ll share
              more information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <ObfuscatedEmail
                user={EMAIL_USER}
                domain={EMAIL_DOMAIN}
                subject={CONTRIBUTE_SUBJECT}
                label="Email the Foundation"
                className="btn btn-primary"
              />
              <ObfuscatedEmail
                user={EMAIL_USER}
                domain={EMAIL_DOMAIN}
                label="Reveal email address"
                showAddress
                className="text-accent font-medium hover:underline"
              />
            </div>
            <p className="mt-8 text-text-muted text-sm leading-relaxed">
              The Dias Global Foundation is the charitable initiative of Dias Global Limited,
              Company No. 16594865, London, United Kingdom.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
