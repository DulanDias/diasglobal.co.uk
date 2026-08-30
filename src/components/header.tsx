'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { FocusEvent as ReactFocusEvent, PointerEvent as ReactPointerEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { PRIMARY_NAV, LAST_GROUP_INDEX, isCurrentPath } from '@/lib/navigation'

/** Single source of truth for the desktop/mobile switch. This value MUST stay in step with the
 *  `lg:` Tailwind classes used on the desktop nav, the hamburger and the mobile drawer. */
const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)'

/** Grace period before a mouse leaving a group closes its panel. Long enough to cross the
 *  gap between a narrow trigger and a wider panel, short enough not to feel sticky. */
const CLOSE_DELAY_MS = 220

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Deterministic id fragment so server and client markup agree (no useId churn in aria-controls). */
const slugify = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export default function Header() {
  const pathname = usePathname()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  /** Slug of the desktop dropdown that is currently open, or null. Only one opens at a time. */
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  /** Slugs of the mobile accordion sections that are currently expanded. Several may be open. */
  const [openMobileGroups, setOpenMobileGroups] = useState<string[]>([])
  /** Post-commit focus request for a panel that has just been opened by the keyboard. */
  const [panelFocus, setPanelFocus] = useState<{ slug: string; edge: 'first' | 'last' } | null>(null)

  const desktopNavRef = useRef<HTMLElement | null>(null)
  const groupButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const panelRefs = useRef<Record<string, HTMLUListElement | null>>({})
  const hamburgerRef = useRef<HTMLButtonElement | null>(null)
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const closeTimer = useRef<number | null>(null)

  const cancelScheduledClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const closeAll = () => {
    cancelScheduledClose()
    setIsMenuOpen(false)
    setOpenGroup(null)
    setOpenMobileGroups([])
  }

  /* ---------------------------------------------------------------- desktop dropdown behaviour */

  // Click/tap outside closes, Escape closes and returns focus to the trigger.
  // Effect re-runs whenever `openGroup` changes, so the handlers never close over a stale value.
  useEffect(() => {
    if (!openGroup) return

    const handlePointerDown = (event: PointerEvent) => {
      const nav = desktopNavRef.current
      if (nav && event.target instanceof Node && nav.contains(event.target)) return
      setOpenGroup(null)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      cancelScheduledClose()
      groupButtonRefs.current[openGroup]?.focus()
      setOpenGroup(null)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openGroup, cancelScheduledClose])

  // Any pending hover-close is abandoned when the component goes away.
  useEffect(() => cancelScheduledClose, [cancelScheduledClose])

  // Keyboard opens ask for focus to land inside the panel, but only once React has
  // committed the open state — querying before that would find nothing focusable.
  useEffect(() => {
    if (!panelFocus) return
    const panel = panelRefs.current[panelFocus.slug]
    if (panel) {
      const links = Array.from(panel.querySelectorAll<HTMLAnchorElement>('a'))
      const target = panelFocus.edge === 'first' ? links[0] : links[links.length - 1]
      target?.focus()
    }
    setPanelFocus(null)
  }, [panelFocus])

  /* ------------------------------------------------------------------- mobile drawer behaviour */

  // Escape closes the drawer and returns focus to the hamburger.
  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  // The drawer covers the viewport, so lock the page behind it. Restores the previous value.
  useEffect(() => {
    if (!isMenuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMenuOpen])

  // The drawer is a modal surface: focus moves to the container on open (so a screen reader
  // announces the dialog label before its contents) and returns to the hamburger on close.
  // The restore lives in the cleanup so it also runs if the header itself unmounts.
  useEffect(() => {
    if (!isMenuOpen) return
    drawerRef.current?.focus()
    return () => {
      hamburgerRef.current?.focus()
    }
  }, [isMenuOpen])

  /* ------------------------------------------------------------------------ cross-cutting sync */

  // Crossing the breakpoint discards the state that belongs to the layout being left behind,
  // so nothing is stranded open (and the body scroll lock can never survive a resize).
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_MEDIA_QUERY)

    const sync = (isDesktop: boolean) => {
      if (isDesktop) {
        setIsMenuOpen(false)
        setOpenMobileGroups([])
      } else {
        setOpenGroup(null)
      }
    }

    sync(query.matches)
    const handleChange = (event: MediaQueryListEvent) => sync(event.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  // Navigating to a new route closes everything. Same-page hash links are handled by the
  // onClick handlers on the links themselves, since the pathname does not change for those.
  useEffect(() => {
    closeAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  /* -------------------------------------------------------------------------------- handlers */

  const toggleGroup = (slug: string) => {
    cancelScheduledClose()
    setOpenGroup((current) => (current === slug ? null : slug))
  }

  // Hover-open is deliberately gated on pointerType === 'mouse'. A touch tap also emits
  // pointerenter; opening on that would fight the click handler and close the panel again.
  const handleGroupPointerEnter = (event: ReactPointerEvent<HTMLLIElement>, slug: string) => {
    if (event.pointerType !== 'mouse') return
    cancelScheduledClose()
    setOpenGroup(slug)
  }

  // Closing on pointerleave is deferred: a mouse travelling from a narrow trigger to a wider
  // panel briefly leaves the <li>, and a keyboard user whose mouse happens to be parked over
  // the nav must never have the panel — and their focus with it — pulled out from under them.
  const handleGroupPointerLeave = (event: ReactPointerEvent<HTMLLIElement>, slug: string) => {
    if (event.pointerType !== 'mouse') return
    cancelScheduledClose()
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null
      const nav = desktopNavRef.current
      if (nav && document.activeElement && nav.contains(document.activeElement)) return
      setOpenGroup((current) => (current === slug ? null : current))
    }, CLOSE_DELAY_MS)
  }

  // Tabbing (or clicking) out of the group entirely closes it. React's onBlur is focusout,
  // so it fires for descendants too; relatedTarget tells us where focus actually went.
  const handleGroupBlur = (event: ReactFocusEvent<HTMLLIElement>, slug: string) => {
    const nextFocus = event.relatedTarget as Node | null
    if (nextFocus && event.currentTarget.contains(nextFocus)) return
    setOpenGroup((current) => (current === slug ? null : current))
  }

  /**
   * Arrow / Home / End support for the disclosure navigation. These are optional in the APG
   * and required here. They supplement Tab, never replace it. Up and Down are always
   * prevented while focus is in the nav, so the page cannot scroll out from under the user.
   */
  const handleNavKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const nav = desktopNavRef.current
    if (!nav) return

    const key = event.key
    if (
      key !== 'ArrowDown' &&
      key !== 'ArrowUp' &&
      key !== 'ArrowLeft' &&
      key !== 'ArrowRight' &&
      key !== 'Home' &&
      key !== 'End'
    ) {
      return
    }

    const target = event.target as HTMLElement
    const tops = Array.from(nav.querySelectorAll<HTMLElement>('[data-top-level]'))
    if (tops.length === 0) return

    const panel = target.closest('.nav-panel') as HTMLElement | null

    const focusTop = (index: number) => {
      const next = tops[(index + tops.length) % tops.length]
      cancelScheduledClose()
      setOpenGroup(null)
      next?.focus()
    }

    if (panel) {
      const links = Array.from(panel.querySelectorAll<HTMLAnchorElement>('a'))
      const index = links.indexOf(target as HTMLAnchorElement)
      const trigger = panel.parentElement?.querySelector<HTMLButtonElement>('[data-top-level]')

      if (key === 'ArrowDown') {
        event.preventDefault()
        links[(index + 1) % links.length]?.focus()
        return
      }
      if (key === 'ArrowUp') {
        event.preventDefault()
        if (index <= 0) trigger?.focus()
        else links[index - 1]?.focus()
        return
      }
      if (key === 'Home') {
        event.preventDefault()
        links[0]?.focus()
        return
      }
      if (key === 'End') {
        event.preventDefault()
        links[links.length - 1]?.focus()
        return
      }
      // Left / Right leave the panel and move along the top level.
      const triggerIndex = trigger ? tops.indexOf(trigger) : -1
      if (triggerIndex >= 0) {
        event.preventDefault()
        focusTop(triggerIndex + (key === 'ArrowRight' ? 1 : -1))
      }
      return
    }

    const topIndex = tops.indexOf(target)
    if (topIndex < 0) return

    if (key === 'ArrowRight') {
      event.preventDefault()
      focusTop(topIndex + 1)
      return
    }
    if (key === 'ArrowLeft') {
      event.preventDefault()
      focusTop(topIndex - 1)
      return
    }
    if (key === 'Home') {
      event.preventDefault()
      focusTop(0)
      return
    }
    if (key === 'End') {
      event.preventDefault()
      focusTop(tops.length - 1)
      return
    }

    // Up / Down: page scroll is suppressed whether or not this item is a disclosure.
    event.preventDefault()
    const slug = target.dataset.navSlug
    if (!slug) return
    if (key === 'ArrowDown') {
      cancelScheduledClose()
      setOpenGroup(slug)
      setPanelFocus({ slug, edge: 'first' })
    } else {
      setOpenGroup(null)
    }
  }

  const toggleMobileGroup = (slug: string) =>
    setOpenMobileGroups((current) =>
      current.includes(slug) ? current.filter((entry) => entry !== slug) : [...current, slug]
    )

  // The drawer is functionally modal, so Tab must cycle inside it. The focusable list is
  // recomputed on every keypress because expanding an accordion section changes it.
  const handleDrawerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return
    const node = drawerRef.current
    if (!node) return

    const focusables = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null
    )
    if (focusables.length === 0) {
      event.preventDefault()
      node.focus()
      return
    }

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement

    if (event.shiftKey) {
      if (active === first || active === node) {
        event.preventDefault()
        last.focus()
      }
      return
    }

    if (active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const chevron = (
    <svg
      className="nav-chevron"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2.5 4.25 6 7.75l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  return (
    <>
      {/* `bg-navbar/90` and `border-border/80` used to sit here. Every colour in the Tailwind
          config is a bare var() with no <alpha-value>, so an opacity modifier on one compiles
          to no CSS at all and the fixed bar shipped fully transparent. Literal rgba() and the
          solid token both compile. */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(255,255,255,0.92)] backdrop-blur-xl border-b border-border transition-all duration-300 shadow-xs">
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

            {/* ------------------------------------------------------------------ desktop nav */}
            <nav ref={desktopNavRef} aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-7 list-none m-0 p-0" onKeyDown={handleNavKeyDown}>
                {PRIMARY_NAV.map((item, index) => {
                  if (item.kind === 'cta') {
                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          data-top-level
                          className="nav-cta"
                          aria-current={isCurrentPath(pathname, item.href) ? 'page' : undefined}
                        >
                          {item.label}
                        </Link>
                      </li>
                    )
                  }

                  if (item.kind === 'link') {
                    const isActive = isCurrentPath(pathname, item.href)
                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          data-top-level
                          className={`nav-link${isActive ? ' active' : ''}`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {item.label}
                        </Link>
                      </li>
                    )
                  }

                  const slug = slugify(item.label)
                  const panelId = `nav-panel-${slug}`
                  const isOpen = openGroup === slug
                  const hasActiveChild = item.children.some((child) =>
                    isCurrentPath(pathname, child.href)
                  )

                  return (
                    <li
                      key={item.label}
                      className="nav-group"
                      onPointerEnter={(event) => handleGroupPointerEnter(event, slug)}
                      onPointerLeave={(event) => handleGroupPointerLeave(event, slug)}
                      onBlur={(event) => handleGroupBlur(event, slug)}
                    >
                      <button
                        type="button"
                        data-top-level
                        data-nav-slug={slug}
                        ref={(node) => {
                          groupButtonRefs.current[slug] = node
                        }}
                        className={`nav-link nav-disclosure${
                          isOpen || hasActiveChild ? ' active' : ''
                        }`}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggleGroup(slug)}
                      >
                        {item.label}
                        {chevron}
                      </button>

                      <ul
                        id={panelId}
                        ref={(node) => {
                          panelRefs.current[slug] = node
                        }}
                        className={`nav-panel${isOpen ? ' is-open' : ''}${
                          index === LAST_GROUP_INDEX ? ' nav-panel-end' : ''
                        }`}
                      >
                        {item.children.map((child) => {
                          const isChildActive = isCurrentPath(pathname, child.href)
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={`nav-panel-link${isChildActive ? ' active' : ''}`}
                                aria-current={isChildActive ? 'page' : undefined}
                                onClick={() => setOpenGroup(null)}
                              >
                                <span className="nav-panel-label">{child.label}</span>
                                {child.description ? (
                                  <span className="nav-panel-description">{child.description}</span>
                                ) : null}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* ------------------------------------------------------------ hamburger (mobile) */}
            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="lg:hidden flex h-11 w-11 flex-col items-center justify-center gap-1 bg-transparent border-none cursor-pointer z-50"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              <span
                aria-hidden="true"
                className={`w-6 h-0.5 bg-text transition-all duration-200 motion-reduce:transition-none ${
                  isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                aria-hidden="true"
                className={`w-6 h-0.5 bg-text transition-all duration-200 motion-reduce:transition-none ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                aria-hidden="true"
                className={`w-6 h-0.5 bg-text transition-all duration-200 motion-reduce:transition-none ${
                  isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------ mobile drawer (accordion)
          Rendered as a SIBLING of <header>, not a descendant. `backdrop-filter` on the
          header makes it a containing block for position:fixed descendants, which collapsed
          this drawer to the height of the header itself and made the whole mobile navigation
          unreachable. Outside the header its containing block is the viewport again.
          It is also conditionally mounted, so a closed drawer leaves no focusable duplicate
          of the navigation in the DOM. */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          tabIndex={-1}
          onKeyDown={handleDrawerKeyDown}
          className="nav-drawer lg:hidden fixed inset-x-0 top-[4.5rem] z-40 overflow-y-auto bg-navbar-mobile border-t border-border p-6 shadow-lg outline-none"
        >
          <nav aria-label="Primary mobile">
            <ul className="flex flex-col gap-1 list-none m-0 p-0">
              {PRIMARY_NAV.map((item) => {
                if (item.kind === 'cta') {
                  return (
                    <li key={item.label} className="pt-5">
                      <Link
                        href={item.href}
                        className="nav-cta nav-cta-mobile"
                        aria-current={isCurrentPath(pathname, item.href) ? 'page' : undefined}
                        onClick={closeAll}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                }

                if (item.kind === 'link') {
                  const isActive = isCurrentPath(pathname, item.href)
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`nav-link-mobile${isActive ? ' active' : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={closeAll}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                }

                const slug = slugify(item.label)
                const panelId = `mobile-nav-panel-${slug}`
                const isExpanded = openMobileGroups.includes(slug)

                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      className={`nav-link-mobile nav-disclosure-mobile${
                        isExpanded ? ' active' : ''
                      }`}
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      onClick={() => toggleMobileGroup(slug)}
                    >
                      {item.label}
                      {chevron}
                    </button>

                    <ul id={panelId} hidden={!isExpanded} className="nav-subnav-mobile">
                      {item.children.map((child) => {
                        const isChildActive = isCurrentPath(pathname, child.href)
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={`nav-sublink-mobile${isChildActive ? ' active' : ''}`}
                              aria-current={isChildActive ? 'page' : undefined}
                              onClick={closeAll}
                            >
                              {child.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      )}

      <style jsx global>{`
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

        .nav-disclosure {
          gap: 0.375rem;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .nav-chevron {
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .nav-disclosure[aria-expanded='true'] .nav-chevron,
        .nav-disclosure-mobile[aria-expanded='true'] .nav-chevron {
          transform: rotate(180deg);
        }

        .nav-group {
          position: relative;
        }

        /* Closed panels are hidden with visibility, never display and never opacity
           alone: visibility:hidden removes the links from the tab order AND from the
           accessibility tree, while leaving the element in the layout so a transition can
           run and so a focused link is not ripped out of the render tree mid-interaction. */
        .nav-panel {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 60;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          min-width: 16rem;
          margin-top: 0.375rem;
          list-style: none;
          padding: 0.5rem;
          background: var(--color-bg-card, #ffffff);
          border: 1px solid var(--color-border);
          border-radius: 0.75rem;
          box-shadow: 0 16px 48px rgba(12, 18, 34, 0.12);
          visibility: hidden;
          opacity: 0;
          transform: translateY(-0.25rem);
          pointer-events: none;
          transition: opacity 0.15s ease-out, transform 0.15s ease-out, visibility 0.15s;
        }

        .nav-panel.is-open {
          visibility: visible;
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        /* The dropdown for the last group anchors to the right edge so it cannot overflow
           the container (body has overflow-x:hidden, so an overflow would be clipped). */
        .nav-panel-end {
          left: auto;
          right: 0;
        }

        /* Bridges the 0.375rem gap under the trigger so a mouse can travel into the panel
           without a pointerleave firing on the way. */
        .nav-panel::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: -0.5rem;
          height: 0.5rem;
        }

        .nav-panel-link {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          padding: 0.625rem 0.75rem;
          border-radius: 0.5rem;
          text-decoration: none;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .nav-panel-link:hover,
        .nav-panel-link:focus-visible {
          background: var(--color-bg-light);
        }

        .nav-panel-link.active {
          background: var(--color-accent-soft);
        }

        .nav-panel-label {
          color: var(--color-text);
          font-size: 0.9375rem;
          font-weight: 500;
          line-height: 1.3;
        }

        .nav-panel-link:hover .nav-panel-label,
        .nav-panel-link.active .nav-panel-label {
          color: var(--color-accent);
        }

        .nav-panel-description {
          color: var(--color-text-muted);
          font-size: 0.8125rem;
          line-height: 1.35;
        }

        /* Two declarations, not one: the dvh line is dropped by browsers that do not know
           the unit, leaving the vh fallback in place. Never bottom:0 — that would make
           the height depend on the containing block rather than on the viewport. */
        .nav-drawer {
          height: calc(100vh - 4.5rem);
          height: calc(100dvh - 4.5rem);
          animation: navDrawerIn 0.16s ease-out;
        }

        /* Opacity only, no transform. A transform here would leave the whole drawer
           offset by the keyframe's start value in any environment where the animation
           does not run to completion, and transform motion is the vestibular problem
           anyway — a fade is not. */
        @keyframes navDrawerIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-panel {
            transition: opacity 0.075s linear, visibility 0.075s;
            transform: none;
          }

          .nav-panel.is-open {
            transform: none;
          }

          .nav-chevron {
            transition: none;
          }

          .nav-drawer {
            animation: navDrawerFade 0.075s linear;
          }
        }

        @keyframes navDrawerFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .nav-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0.625rem 1.25rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
          color: var(--color-text-on-accent);
          font-size: 0.9375rem;
          font-weight: 600;
          text-decoration: none;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .nav-cta-mobile {
          width: 100%;
          min-height: 48px;
        }

        .nav-link-mobile {
          color: var(--color-text-muted);
          text-decoration: none;
          font-weight: 500;
          font-size: 1rem;
          transition: color 0.2s ease;
          padding: 1rem 0;
          border-bottom: 1px solid var(--color-border);
          width: 100%;
          text-align: left;
          min-height: 48px;
          display: flex;
          align-items: center;
        }

        .nav-link-mobile:hover,
        .nav-link-mobile.active {
          color: var(--color-accent);
        }

        .nav-disclosure-mobile {
          justify-content: space-between;
          gap: 0.5rem;
          background: transparent;
          border-top: none;
          border-left: none;
          border-right: none;
          cursor: pointer;
          font-family: inherit;
        }

        .nav-subnav-mobile {
          display: flex;
          flex-direction: column;
          list-style: none;
          padding: 0.25rem 0 0.5rem 0.75rem;
          border-left: 2px solid var(--color-border);
          margin: 0.5rem 0 0.5rem 0.25rem;
        }

        .nav-subnav-mobile[hidden] {
          display: none;
        }

        .nav-sublink-mobile {
          display: flex;
          align-items: center;
          min-height: 44px;
          padding: 0.5rem 0;
          color: var(--color-text-muted);
          font-size: 0.9375rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .nav-sublink-mobile:hover,
        .nav-sublink-mobile.active {
          color: var(--color-accent);
        }
      `}</style>
    </>
  )
}
