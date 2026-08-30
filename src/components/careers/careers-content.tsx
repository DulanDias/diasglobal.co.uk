import Link from 'next/link'
import ObfuscatedEmail from '@/components/foundation/obfuscated-email'
import {
  CAREERS_EMAIL_DOMAIN,
  CAREERS_EMAIL_USER,
  VACANCIES,
  vacancyUrl,
} from '@/lib/careers'

const SPECULATIVE_SUBJECT = 'Careers enquiry — Dias Global Limited'

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 shrink-0"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export default function CareersContent() {
  const hasVacancies = VACANCIES.length > 0

  return (
    <div className="bg-bg">
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-bg to-bg-light" aria-labelledby="careers-title">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <span className="section-eyebrow">Careers</span>
            <h1
              id="careers-title"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-[1.12]"
            >
              Work with
              <span className="text-accent block">Dias Global</span>
            </h1>
            <p className="text-lg md:text-xl text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
              We are a small UK company with interests across real assets, technology and
              entrepreneurial ventures. Roles here are broad by design: you see the whole business
              rather than one corner of it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#open-roles" className="btn btn-primary">
                See open roles
              </Link>
              <Link href="#how-to-apply" className="btn btn-secondary">
                How to apply
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section id="open-roles" className="py-24 bg-bg scroll-mt-24" aria-labelledby="open-roles-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Opportunities</span>
            <h2 id="open-roles-heading" className="section-title">
              Open roles
            </h2>
            <p className="section-subtitle">
              Everything we are currently recruiting for is listed here. When a role is filled, it
              comes off this page.
            </p>
          </div>

          {hasVacancies ? (
            <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
              {VACANCIES.map((vacancy) => (
                <article key={vacancy.slug} className="card">
                  <h3 className="text-2xl font-semibold text-text mb-4">
                    <Link
                      href={vacancyUrl(vacancy.slug)}
                      className="hover:text-accent transition-colors duration-200"
                    >
                      {vacancy.title}
                    </Link>
                  </h3>

                  <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-5 text-sm text-text-muted">
                    <li className="inline-flex items-center gap-2">
                      <PinIcon />
                      {vacancy.location}
                    </li>
                    <li className="inline-flex items-center gap-2">
                      <ClockIcon />
                      {vacancy.workingPattern}
                    </li>
                  </ul>

                  <p className="text-text-muted leading-relaxed mb-6">{vacancy.summary}</p>

                  <Link href={vacancyUrl(vacancy.slug)} className="btn btn-primary">
                    View role and apply
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto card text-center">
              <p className="text-text-muted leading-relaxed">
                There are no open roles at the moment. You are still welcome to write to us — see
                below.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How to apply */}
      <section id="how-to-apply" className="py-24 bg-bg-light scroll-mt-24" aria-labelledby="how-to-apply-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Applying</span>
            <h2 id="how-to-apply-heading" className="section-title">
              How to apply
            </h2>
            <p className="section-subtitle">
              Two routes, both landing in the same inbox. Applications are considered against the
              requirements set out for the role you are applying to.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-4">Through the role page</h3>
              <p className="text-text-muted leading-relaxed mb-4">
                Each open role has its own page with the full brief and an application form. The
                form cannot carry attachments, so when you send it you are given an application
                reference — email your CV to us quoting that reference and the two are matched up
                at our end.
              </p>
              {hasVacancies && (
                <Link href={vacancyUrl(VACANCIES[0].slug)} className="btn btn-secondary">
                  Go to the open role
                </Link>
              )}
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-4">By email</h3>
              <p className="text-text-muted leading-relaxed mb-4">
                If you would rather not use the form — or nothing listed here fits and you still
                think there is something you could do for us — write to our careers address with
                your CV and a short covering note saying what you are looking for.
              </p>
              <ObfuscatedEmail
                user={CAREERS_EMAIL_USER}
                domain={CAREERS_EMAIL_DOMAIN}
                subject={SPECULATIVE_SUBJECT}
                label="Write to our careers address"
                className="btn btn-secondary"
              />
            </div>
          </div>

          <div className="text-center mt-12 max-w-2xl mx-auto">
            <p className="text-text-muted text-sm leading-relaxed">
              Anything you send is used only to consider your application. See our{' '}
              <Link href="/privacy-policy" className="text-accent underline underline-offset-2">
                Privacy Policy
              </Link>{' '}
              for how we handle personal data.
            </p>
          </div>
        </div>
      </section>

      {/* Equal opportunities */}
      <section
        id="equal-opportunities"
        className="py-20 bg-bg scroll-mt-24"
        aria-labelledby="equal-opportunities-heading"
      >
        <div className="container">
          <div className="max-w-3xl mx-auto card">
            <h2 id="equal-opportunities-heading" className="text-2xl font-semibold text-text mb-4">
              Equal opportunities
            </h2>
            <p className="text-text-muted leading-relaxed mb-4">
              We welcome applications from everyone who meets the requirements of the role. We
              assess applications on what you have done and what you could do here, and on nothing
              else.
            </p>
            <p className="text-text-muted leading-relaxed">
              We will make reasonable adjustments to our selection process on request. If you need
              anything to take part — captions or a written alternative to a video call, extra
              time, a different format, or anything else — tell us in the form on the role page or
              by email and we will arrange it. Asking has no bearing on how your application is
              assessed.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
