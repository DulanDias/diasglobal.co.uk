/**
 * Inline icon set for The Island Merchant.
 *
 * All are 24x24 stroke icons that inherit `currentColor`, so they take the
 * surrounding text colour on both the cream and the deep brown panels. Every
 * icon here is decorative and sits beside a real text label, so each carries
 * `aria-hidden` and adds nothing to the accessibility tree.
 */

type IconProps = { className?: string }

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  )
}

/** Origin / provenance. */
export function LeafIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 10-4 14-9 14Z" />
      <path d="M4 20c2-4 5-6 9-7" />
    </Svg>
  )
}

/** Net weight / measured packs. */
export function ScaleIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 4v16" />
      <path d="M7 20h10" />
      <path d="M5 8h14" />
      <path d="M5 8 2 14h6Z" />
      <path d="M19 8l-3 6h6Z" />
    </Svg>
  )
}

/** Grade / certification. */
export function AwardIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="9" r="5" />
      <path d="m8.5 13.5-1 7L12 18l4.5 2.5-1-7" />
    </Svg>
  )
}

/**
 * Import, shipping, distribution. A sailing boat rather than a cargo ship, to
 * echo the vessel in the Island Merchant crest.
 */
export function ShipIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3.5 15.5h17l-2.2 4.5H5.7z" />
      <path d="M12 15.5V3" />
      <path d="M12 5.2 17.5 11H12" />
      <path d="M12 8.5 7.5 11H12" />
    </Svg>
  )
}

/** Retail shopfront: awning over a unit with a door. */
export function StoreIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4.5 10.5V20h15v-9.5" />
      <path d="M3 5h18l1.2 4.2a2.6 2.6 0 0 1-5 .3 2.6 2.6 0 0 1-5 0 2.6 2.6 0 0 1-5 0 2.6 2.6 0 0 1-5-.3Z" />
      <path d="M10 20v-5.5h4V20" />
    </Svg>
  )
}

/** Trade and wholesale. */
export function BoxIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m12 3 8 4v10l-8 4-8-4V7Z" />
      <path d="m4 7 8 4 8-4" />
      <path d="M12 11v10" />
    </Svg>
  )
}

/** Producers and growers. */
export function SproutIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 21v-8" />
      <path d="M12 13C12 9 9 7 5 7c0 4 3 6 7 6Z" />
      <path d="M12 13c0-3.5 2.5-5.5 6-5.5 0 3.5-2.5 5.5-6 5.5Z" />
    </Svg>
  )
}

/** Compliance, paperwork, documentation. */
export function ShieldIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6Z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  )
}

/** Specification tables and documents. */
export function DocumentIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </Svg>
  )
}

/** Tasting and usage. */
export function SpoonIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M14 4c2 2 2 5 0 7s-5 2-7 0" />
      <path d="M10.5 12.5 4 19a1.5 1.5 0 0 0 2 2l6.5-6.5" />
    </Svg>
  )
}

/** Pack label / back of pack. */
export function TagIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9Z" />
      <circle cx="7.5" cy="7.5" r="1.3" />
    </Svg>
  )
}

/** Disclosure chevron. */
export function ChevronIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  )
}

/** Ticked list items. */
export function CheckIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m4 12 5 5L20 6" />
    </Svg>
  )
}
