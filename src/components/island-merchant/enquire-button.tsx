'use client'

import type { ReactNode } from 'react'
import {
  ENQUIRE_EVENT,
  type EnquireEventDetail,
  type EnquiryMode,
  type ProductSlug,
} from '@/lib/island-merchant'

type Variant = 'primary' | 'secondary' | 'onDark'

interface EnquireButtonProps {
  /** Which audience the form should switch to. */
  mode: EnquiryMode
  /** Optional product to pre-select a quantity for. */
  product?: ProductSlug
  children: ReactNode
  variant?: Variant
  className?: string
}

/**
 * Scrolls to the register-interest section and tells InterestForm which mode
 * (and optionally which product) the visitor arrived with. The form listens for
 * ENQUIRE_EVENT on `window`.
 */
const VARIANT_CLASSES: Record<Variant, string> = {
  // accent #8b6b39 with cream text = 4.61:1
  primary: 'bg-[#8b6b39] text-[#faf7f0] border border-transparent hover:bg-[#765b30]',
  // ink on cream = 12.85:1, gold rule is decorative only
  secondary: 'bg-[#faf7f0] text-[#3b2a14] border border-[#b08848] hover:bg-[#f2ebdd]',
  // cream plate on the deep brown panel = 12.85:1
  onDark: 'bg-[#faf7f0] text-[#3b2a14] border border-transparent hover:bg-[#f2ebdd]',
}

export default function EnquireButton({
  mode,
  product,
  children,
  variant = 'primary',
  className = '',
}: EnquireButtonProps) {
  function handleClick() {
    const detail: EnquireEventDetail = product ? { mode, product } : { mode }
    window.dispatchEvent(new CustomEvent<EnquireEventDetail>(ENQUIRE_EVENT, { detail }))

    const target = document.getElementById('im-enquire')
    if (!target) return

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Focus first, scroll second. Without the focus move, a screen-reader or keyboard user
    // was left on a button several screens above a form whose entire field set had just been
    // rewritten underneath them, with nothing announced. The section carries tabIndex={-1}
    // so it can receive focus; preventScroll leaves the smooth scroll below in charge, and
    // the section's scroll-margin clears the fixed header and the sticky sub-nav.
    target.focus({ preventScroll: true })
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold transition-colors duration-200 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
