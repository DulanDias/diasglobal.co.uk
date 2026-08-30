'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FOOTER_NAV, isCurrentPath } from '@/lib/navigation'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()

  return (
    <footer className="bg-bg-light border-t border-border py-12">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-10 mb-10 pb-10 border-b border-border">
          <div className="flex flex-col gap-4">
            <Link href="/" className="block transition-transform duration-200 hover:scale-[1.02] w-fit">
              <Image
                src="/dias-global-light.png"
                alt="Dias Global"
                width={200}
                height={80}
                className="max-h-20 w-auto rounded-sm object-contain self-start"
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
            <p className="text-text-muted max-w-sm leading-relaxed text-[0.9375rem]">
              Building the future through innovation with patient capital and long-term vision across real assets, technology, and entrepreneurial ventures.
            </p>
          </div>

          {/* Mirrors the header IA: both are rendered from '@/lib/navigation', so they cannot drift. */}
          <nav aria-label="Footer" className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {FOOTER_NAV.map((column) => (
              <div key={column.heading}>
                <h2 className="text-sm font-semibold mb-4 text-text uppercase tracking-wider">
                  {column.heading}
                </h2>
                <ul className="flex flex-col gap-3 list-none m-0 p-0">
                  {column.links.map((link) => {
                    const isActive = isCurrentPath(pathname, link.href)
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`footer-link${isActive ? ' active' : ''}`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {link.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 flex-wrap">
          <p className="text-text-muted text-sm">
            &copy; {currentYear} Dias Global Limited. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="legal-link">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="legal-link">
              Terms of Use
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-text-muted text-xs leading-relaxed text-center max-w-4xl mx-auto">
            <strong className="font-medium text-text-muted">Disclaimer:</strong> Financial tools and calculators provided on this website are for informational purposes only and should not be considered as financial, tax, investment, or legal advice.
            Please consult with qualified professionals before making financial decisions.
            <Link href="/tools" className="text-accent hover:underline ml-1">View full disclaimer</Link>.
          </p>
        </div>
      </div>

      <style jsx global>{`
        .footer-link {
          display: block;
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.9375rem;
          transition: color 0.2s ease;
        }

        .footer-link:hover,
        .footer-link.active {
          color: var(--color-accent);
        }

        .legal-link {
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }

        .legal-link:hover {
          color: var(--color-accent);
        }
      `}</style>
    </footer>
  )
}
