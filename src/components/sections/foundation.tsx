import Link from 'next/link'
import ObfuscatedEmail from '@/components/foundation/obfuscated-email'

const pillars = [
  { icon: '🔍', title: 'Vetted & Verified', body: 'Every case is carefully verified, so help reaches those who genuinely need it.' },
  { icon: '🤝', title: 'Committed Support', body: 'One-off or recurring — we stay until a meaningful milestone is reached.' },
  { icon: '🎓', title: 'Education First', body: 'From scholarship tuition to essentials, we help sponsor brighter futures.' },
  { icon: '💚', title: 'Dignity Always', body: 'Support is given with respect, discretion, and care for every family.' },
]

export default function FoundationSection() {
  return (
    <section id="foundation" className="py-24 bg-bg">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Dias Global Foundation</span>
          <h2 className="section-title">Giving Back, With Care and Diligence</h2>
          <p className="section-subtitle">
            Our charitable arm identifies and helps people in genuine need — supporting
            carefully vetted families with committed, dignified assistance until they reach a
            meaningful milestone.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item) => (
            <div key={item.title} className="card text-center">
              <div className="text-4xl mb-5">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-text">{item.title}</h3>
              <p className="text-text-muted leading-relaxed text-[0.9375rem]">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
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
    </section>
  )
}
