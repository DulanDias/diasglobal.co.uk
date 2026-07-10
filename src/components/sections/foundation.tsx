import Link from 'next/link'
import ObfuscatedEmail from '@/components/foundation/obfuscated-email'

export default function FoundationSection() {
  return (
    <section id="foundation" className="py-24 bg-bg-light">
      <div className="container">
        <div className="max-w-5xl mx-auto rounded-3xl border border-border bg-gradient-to-br from-bg to-bg-light p-8 md:p-14 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-dark" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="section-eyebrow">Dias Global Foundation</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight text-text leading-tight">
                Giving back, with care and diligence
              </h2>
              <p className="text-text-muted leading-relaxed mb-6">
                Our charitable arm identifies and helps people in genuine need. We support
                carefully vetted families with committed, dignified assistance — one-off or
                recurring — until they reach a meaningful milestone, from education
                sponsorship to essential care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/foundation" className="btn btn-primary">
                  Learn About the Foundation
                </Link>
                <ObfuscatedEmail
                  user="ZHVsYW4="
                  domain="ZGlhc2dsb2JhbC5jby51aw=="
                  subject="Dias Global Foundation — Contribution & Enquiry"
                  label="Contribute"
                  className="btn btn-secondary"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '🔍', title: 'Vetted & Verified', body: 'Help reaches those who genuinely need it.' },
                { icon: '🤝', title: 'Committed Support', body: 'We stay until the milestone is reached.' },
                { icon: '🎓', title: 'Education First', body: 'Sponsoring futures, one child at a time.' },
                { icon: '💚', title: 'Dignity Always', body: 'Support given with respect and discretion.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-base font-semibold mb-1 text-text">{item.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
