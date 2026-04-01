'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navbar/90 backdrop-blur-xl border-b border-border/80 transition-all duration-300 shadow-xs">
      <div className="container">
        <div className="flex items-center justify-between h-[4.5rem]">
          <div className="flex items-center">
            <Link href="/" className="block transition-transform duration-200 hover:scale-[1.02]">
              <Image
                src="/dias-global-light.png"
                alt="Dias Global"
                width={120}
                height={40}
                className="h-10 w-auto rounded-sm"
                priority
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/#about" className="nav-link">
              About
            </Link>
            <Link href="/#sectors" className="nav-link">
              Sectors
            </Link>
            <Link href="/#approach" className="nav-link">
              Approach
            </Link>
            <Link href="/tools" className="nav-link">
              Tools
            </Link>
            <Link href="/#insights" className="nav-link">
              Insights
            </Link>
            <Link href="/#contact" className="nav-link">
              Contact
            </Link>
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col gap-1 bg-transparent border-none cursor-pointer p-2 z-50"
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
          >
            <span className={`w-6 h-0.5 bg-text transition-all duration-200 ${
              isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
            }`} />
            <span className={`w-6 h-0.5 bg-text transition-all duration-200 ${
              isMenuOpen ? 'opacity-0' : ''
            }`} />
            <span className={`w-6 h-0.5 bg-text transition-all duration-200 ${
              isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`} />
          </button>
        </div>

        <div className={`md:hidden fixed top-[4.5rem] left-0 right-0 bg-navbar-mobile backdrop-blur-xl border-b border-border flex flex-col p-6 gap-1 transform transition-all duration-300 z-40 min-h-[calc(100vh-4.5rem)] shadow-lg ${
          isMenuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}>
          <Link href="/#about" className="nav-link-mobile" onClick={closeMenu}>
            About
          </Link>
          <Link href="/#sectors" className="nav-link-mobile" onClick={closeMenu}>
            Sectors
          </Link>
          <Link href="/#approach" className="nav-link-mobile" onClick={closeMenu}>
            Approach
          </Link>
          <Link href="/tools" className="nav-link-mobile" onClick={closeMenu}>
            Tools
          </Link>
          <Link href="/#insights" className="nav-link-mobile" onClick={closeMenu}>
            Insights
          </Link>
          <Link href="/#contact" className="nav-link-mobile" onClick={closeMenu}>
            Contact
          </Link>
        </div>
      </div>

      <style jsx>{`
        .nav-link {
          color: var(--color-text-muted);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9375rem;
          transition: color 0.2s ease;
          position: relative;
          padding: 1rem 0;
          display: flex;
          align-items: center;
          min-height: 44px;
        }

        .nav-link:hover,
        .nav-link.active {
          color: var(--color-text);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0.5rem;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-accent);
          transition: width 0.2s ease;
          border-radius: 1px;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .nav-link-mobile {
          color: var(--color-text-muted);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
          padding: 1rem 0;
          border-bottom: 1px solid var(--color-border);
          width: 100%;
          text-align: left;
          min-height: 48px;
          display: flex;
          align-items: center;
        }

        .nav-link-mobile:last-child {
          border-bottom: none;
        }

        .nav-link-mobile:hover {
          color: var(--color-accent);
        }
      `}</style>
    </nav>
  )
}
