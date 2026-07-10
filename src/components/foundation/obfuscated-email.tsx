'use client'

import { useEffect, useState } from 'react'

interface ObfuscatedEmailProps {
  /** base64-encoded local part (before the @) */
  user: string
  /** base64-encoded domain (after the @) */
  domain: string
  /** Optional mailto subject line */
  subject?: string
  className?: string
  /**
   * Text shown before JavaScript assembles the link. Also used as the visible
   * label unless `showAddress` is set. Keep it free of the real address so
   * static HTML scrapers find nothing to harvest.
   */
  label?: string
  /** When true, the assembled address itself becomes the visible link text. */
  showAddress?: boolean
}

/**
 * Renders a mailto link whose address is assembled in the browser from
 * base64-encoded parts. The address and `mailto:` never appear in the
 * statically rendered HTML (or as a plaintext string in the JS bundle),
 * so email-harvesting bots that regex the page markup come up empty, while
 * real users get a fully working link after hydration.
 */
export default function ObfuscatedEmail({
  user,
  domain,
  subject,
  className,
  label = 'Email us',
  showAddress = false,
}: ObfuscatedEmailProps) {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    try {
      setEmail(`${atob(user)}@${atob(domain)}`)
    } catch {
      /* leave unresolved — falls back to the non-linked label */
    }
  }, [user, domain])

  // Server / pre-hydration render: a plain span, no address, no mailto.
  if (!email) {
    return <span className={className}>{label}</span>
  }

  const href = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`

  return (
    <a href={href} className={className}>
      {showAddress ? email : label}
    </a>
  )
}
