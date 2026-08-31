import { IM_SECTION_NAV, MARK } from '@/lib/island-merchant'

/**
 * Sticky sub-brand bar for The Island Merchant.
 *
 * The Dias Global header is `position: fixed` and 4.5rem tall, so this bar
 * sticks directly underneath it at `top: 4.5rem`. The bar itself is 3.5rem
 * tall, which is why `.im-theme section[id]` overrides the global
 * `scroll-margin-top` to 8.5rem (4.5 + 3.5 + 0.5 of breathing room) —
 * see the theme block in island-merchant-content.tsx.
 */
export default function IslandNav() {
  return (
    <div className="sticky top-[4.5rem] z-30 border-b border-[#b08848]/40 bg-[#faf7f0]/95 backdrop-blur">
      <div className="container">
        <div className="flex h-14 items-center gap-3">
          <a
            href="#im-story"
            className="flex shrink-0 items-center gap-2 rounded-lg px-1 py-1 text-[#3b2a14] transition-colors duration-200 hover:text-[#765b30]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MARK.light.png}
              alt={MARK.light.alt}
              width={MARK.light.width}
              height={MARK.light.height}
              sizes="26px"
              className="h-7 w-auto"
              decoding="async"
            />
            <span className="sr-only text-sm font-semibold tracking-wide sm:not-sr-only sm:inline">
              The Island Merchant
            </span>
          </a>

          <span aria-hidden="true" className="hidden h-6 w-px shrink-0 bg-[#b08848]/50 sm:block" />

          {/* The trailing fade is the only affordance that the strip scrolls, since the
              scrollbar itself is hidden (.im-navbar-scroll in island-merchant-content).
              It is masked out once everything fits, so it never sits over a full row. */}
          <nav
            aria-label="The Island Merchant sections"
            className="relative min-w-0 flex-1 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-10 after:bg-gradient-to-l after:from-[#faf7f0] after:to-transparent after:content-[''] lg:after:hidden"
          >
            <ul className="im-navbar-scroll flex items-center gap-1 overflow-x-auto whitespace-nowrap py-1 pr-10 lg:pr-0">
              {IM_SECTION_NAV.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="block rounded-lg px-3 py-1.5 text-sm font-medium text-[#6d563a] transition-colors duration-200 hover:bg-[#f2ebdd] hover:text-[#3b2a14]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
