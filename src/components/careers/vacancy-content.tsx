import Link from 'next/link'
import ApplicationForm from '@/components/careers/application-form'
import ObfuscatedEmail from '@/components/foundation/obfuscated-email'
import {
  APPLICATION_SUBJECT,
  CAREERS_EMAIL_DOMAIN,
  CAREERS_EMAIL_USER,
  type Vacancy,
} from '@/lib/careers'

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 text-accent shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-text-muted leading-relaxed">
          <CheckIcon />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function VacancyContent({ vacancy }: { vacancy: Vacancy }) {
  return (
    <div className="bg-bg">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-bg to-bg-light" aria-labelledby="vacancy-title">
        <div className="container">
          <div className="max-w-3xl">
            <span className="section-eyebrow">Open Role</span>
            <h1
              id="vacancy-title"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-[1.12]"
            >
              {vacancy.title}
            </h1>
            <p className="text-lg md:text-xl text-muted leading-relaxed mb-8">{vacancy.summary}</p>

            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted mb-2">
                  Location
                </dt>
                <dd className="text-text font-semibold">{vacancy.location}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted mb-2">
                  Working pattern
                </dt>
                <dd className="text-text font-semibold">{vacancy.workingPattern}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted mb-2">
                  Reference
                </dt>
                <dd className="text-text font-semibold font-mono">{vacancy.identifier}</dd>
              </div>
            </dl>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#apply" className="btn btn-primary">
                Apply for this role
              </Link>
              <Link href="#the-role" className="btn btn-secondary">
                What the role involves
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Working remotely */}
      <section className="py-16 md:py-20 bg-bg" aria-labelledby="remote-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto card">
            <h2 id="remote-heading" className="text-2xl font-semibold text-text mb-4">
              Where the work happens
            </h2>
            <p className="text-text-muted leading-relaxed mb-4">{vacancy.remoteStatement}</p>
            <p className="text-text-muted leading-relaxed">
              You would be working with Dias Global Limited, a UK company, on the working pattern
              set out above.
            </p>
          </div>
        </div>
      </section>

      {/* Responsibilities */}
      <section id="the-role" className="py-20 md:py-24 bg-bg-light scroll-mt-24" aria-labelledby="the-role-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">The Work</span>
            <h2 id="the-role-heading" className="section-title">
              What the role involves
            </h2>
            <p className="section-subtitle">
              This is a deliberately broad brief. You will not sit in one function — you will move
              across them, and be expected to hold your own in each.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {vacancy.responsibilities.map((group) => (
              <div key={group.id} className="card">
                <h3 className="text-xl font-semibold text-text mb-5">{group.heading}</h3>
                <BulletList items={group.items} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 md:py-24 bg-bg" aria-labelledby="requirements-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Requirements</span>
            <h2 id="requirements-heading" className="section-title">
              What we are looking for
            </h2>
            <p className="section-subtitle">
              If you meet the essentials and some of the rest, we would rather hear from you than
              not.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-5">Essential</h3>
              <BulletList items={vacancy.essential} />
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-5">Desirable</h3>
              <BulletList items={vacancy.desirable} />
            </div>
          </div>
        </div>
      </section>

      {/* Development */}
      <section className="py-20 md:py-24 bg-bg-light" aria-labelledby="development-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Development</span>
            <h2 id="development-heading" className="section-title">
              What you would get out of it
            </h2>
          </div>

          <div className="max-w-3xl mx-auto card">
            <BulletList items={vacancy.development} />
          </div>
        </div>
      </section>

      {/* Engagement */}
      <section className="py-16 md:py-20 bg-bg" aria-labelledby="engagement-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto card">
            <h2 id="engagement-heading" className="text-2xl font-semibold text-text mb-4">
              Engagement
            </h2>
            <p className="text-text-muted leading-relaxed">{vacancy.engagementNote}</p>
          </div>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="py-20 md:py-24 bg-bg-light scroll-mt-24" aria-labelledby="apply-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Apply</span>
            <h2 id="apply-heading" className="section-title">
              Apply for this role
            </h2>
            <p className="section-subtitle">
              Fill in the form below. You will be given an application reference — email your CV to
              us quoting it, and the two will be matched up at our end.
            </p>
          </div>

          <ApplicationForm vacancy={vacancy} />

          <div className="text-center mt-12 max-w-2xl mx-auto">
            <p className="text-text-muted text-sm leading-relaxed">
              Questions about the role before you apply? Write to our careers address —{' '}
              <ObfuscatedEmail
                user={CAREERS_EMAIL_USER}
                domain={CAREERS_EMAIL_DOMAIN}
                subject={`Question — ${APPLICATION_SUBJECT}`}
                label="ask us anything"
                className="text-accent underline underline-offset-2"
              />
              . You can also{' '}
              <Link href="/careers" className="text-accent underline underline-offset-2">
                see all open roles
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Equal opportunities */}
      <section
        id="equal-opportunities"
        className="py-16 md:py-20 bg-bg scroll-mt-24"
        aria-labelledby="equal-opportunities-heading"
      >
        <div className="container">
          <div className="max-w-3xl mx-auto card">
            <h2 id="equal-opportunities-heading" className="text-2xl font-semibold text-text mb-4">
              Equal opportunities
            </h2>
            <p className="text-text-muted leading-relaxed">
              We welcome applications from everyone who meets the requirements of the role. If you
              need any adjustment to take part in our selection process — captions or a written
              alternative to a video call, extra time, a different format, or anything else — tell
              us in the form above or by email and we will arrange it. Asking has no bearing on how
              your application is assessed.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
