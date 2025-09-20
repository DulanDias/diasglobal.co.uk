'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Menu, X, Moon, Sun } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return null
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navbar backdrop-blur-xl border-b border-border transition-all duration-300">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="block transition-transform duration-200 hover:scale-105">
              <Image
                src={theme === 'light' ? '/dias-global-light.png' : '/dias-global-dark.png'}
                alt="Dias Global"
                width={120}
                height={40}
                className="h-10 w-auto rounded-sm"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
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

          {/* Desktop Theme Toggle */}
          <div className="hidden md:flex items-center ml-6">
            <button
              onClick={toggleTheme}
              className="relative w-16 h-8 bg-bg-light border-2 border-border rounded-full cursor-pointer transition-all duration-300 flex items-center justify-between px-1 overflow-hidden hover:border-accent hover:scale-105 active:scale-95 group"
              aria-label="Toggle theme"
              title="Toggle dark/light mode"
            >
              <div className="flex items-center justify-center w-6 h-6 relative z-10">
                <Moon className={`w-4 h-4 transition-all duration-300 ${
                  theme === 'dark' ? 'text-white opacity-100 scale-100' : 'text-text-muted opacity-40 scale-75'
                }`} />
              </div>
              <div className="flex items-center justify-center w-6 h-6 relative z-10">
                <Sun className={`w-4 h-4 transition-all duration-300 ${
                  theme === 'light' ? 'text-white opacity-100 scale-100' : 'text-text-muted opacity-40 scale-75'
                }`} />
              </div>
              <span className={`absolute left-1 w-6 h-6 bg-gradient-to-r from-accent to-accent-dark rounded-full transition-all duration-300 shadow-lg group-hover:shadow-xl ${
                theme === 'light' ? 'translate-x-7' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Mobile Theme Toggle (in header) */}
          <div className="md:hidden absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <button
              onClick={toggleTheme}
              className="relative w-16 h-8 bg-bg-light border-2 border-border rounded-full cursor-pointer transition-all duration-300 flex items-center justify-between px-1 overflow-hidden hover:border-accent hover:scale-105 active:scale-95 group"
              aria-label="Toggle theme"
              title="Toggle dark/light mode"
            >
              <div className="flex items-center justify-center w-6 h-6 relative z-10">
                <Moon className={`w-4 h-4 transition-all duration-300 ${
                  theme === 'dark' ? 'text-white opacity-100 scale-100' : 'text-text-muted opacity-40 scale-75'
                }`} />
              </div>
              <div className="flex items-center justify-center w-6 h-6 relative z-10">
                <Sun className={`w-4 h-4 transition-all duration-300 ${
                  theme === 'light' ? 'text-white opacity-100 scale-100' : 'text-text-muted opacity-40 scale-75'
                }`} />
              </div>
              <span className={`absolute left-1 w-6 h-6 bg-gradient-to-r from-accent to-accent-dark rounded-full transition-all duration-300 shadow-lg group-hover:shadow-xl ${
                theme === 'light' ? 'translate-x-7' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col gap-1 bg-transparent border-none cursor-pointer p-2 z-50"
            aria-label="Toggle navigation"
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

        {/* Mobile Menu */}
        <div className={`md:hidden fixed top-20 left-0 right-0 bg-bg-light backdrop-blur-xl border-b border-border flex flex-col p-6 gap-4 transform transition-all duration-300 z-40 min-h-[calc(100vh-5rem)] shadow-2xl ${
          isMenuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
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
          transition: color 0.2s ease;
          position: relative;
          padding: 1rem 0;
          display: block;
          min-height: 44px;
          display: flex;
          align-items: center;
        }

        .nav-link:hover,
        .nav-link.active {
          color: var(--color-text);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-accent);
          transition: width 0.2s ease;
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
