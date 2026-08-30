export type NavLeaf = {
  label: string
  href: string
  description?: string
}

export type NavItem =
  | { kind: 'link'; label: string; href: string }
  | { kind: 'cta'; label: string; href: string }
  | { kind: 'group'; label: string; children: NavLeaf[] }

export type FooterColumn = {
  heading: string
  links: NavLeaf[]
}

export const PRIMARY_NAV: NavItem[] = [
  {
    kind: 'group',
    label: 'About',
    children: [
      { label: 'Who We Are', href: '/#about', description: 'The firm and its people' },
      { label: 'Our Approach', href: '/#approach', description: 'How we invest and operate' },
      { label: 'Dias Global Foundation', href: '/foundation', description: 'Our charitable work' },
    ],
  },
  {
    kind: 'group',
    label: 'What We Do',
    children: [
      { label: 'Investment Sectors', href: '/#sectors', description: 'Where we deploy capital' },
      {
        label: 'The Island Merchant',
        href: '/island-merchant',
        description: 'Sri Lankan products for the UK and Europe',
      },
    ],
  },
  {
    kind: 'group',
    label: 'Insights',
    children: [
      { label: 'Articles & Insights', href: '/blog', description: 'Commentary and analysis' },
      { label: 'Financial Tools', href: '/tools', description: 'Calculators and planners' },
    ],
  },
  { kind: 'link', label: 'Careers', href: '/careers' },
  { kind: 'cta', label: 'Contact', href: '/#contact' },
]

export const FOOTER_NAV: FooterColumn[] = [
  {
    heading: 'About',
    links: [
      { label: 'Who We Are', href: '/#about' },
      { label: 'Our Approach', href: '/#approach' },
      { label: 'Dias Global Foundation', href: '/foundation' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    heading: 'What We Do',
    links: [
      { label: 'Investment Sectors', href: '/#sectors' },
      { label: 'The Island Merchant', href: '/island-merchant' },
      { label: 'Contact Us', href: '/#contact' },
    ],
  },
  {
    heading: 'Insights',
    links: [
      { label: 'Articles & Insights', href: '/blog' },
      { label: 'Financial Tools', href: '/tools' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Use', href: '/terms-of-use' },
    ],
  },
]

/** trailingSlash:true means usePathname() returns '/careers/' - normalise before comparing.
 *  Hash hrefs never match: they are same-page anchors, not routes. */
export function isCurrentPath(pathname: string | null, href: string): boolean {
  if (!pathname || href.includes('#')) return false
  const norm = (s: string) => (s.length > 1 ? s.replace(/\/+$/, '') : s)
  return norm(pathname) === norm(href)
}

/** Index of the final kind:'group' item in PRIMARY_NAV. The desktop dropdown panel for
 *  this item anchors right-0 instead of left-0 so it cannot overflow the container
 *  (body has overflow-x:hidden, so an overflowing panel is clipped, not scrollable). */
export const LAST_GROUP_INDEX: number = PRIMARY_NAV.reduce(
  (last, item, index) => (item.kind === 'group' ? index : last),
  -1
)
