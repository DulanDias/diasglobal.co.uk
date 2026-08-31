import { ChevronIcon } from '@/components/island-merchant/icons'

/**
 * Expanding section built on native `<details>` / `<summary>`.
 *
 * Deliberately not a React state component: the browser gives us keyboard
 * operability, the correct expanded/collapsed semantics for assistive
 * technology, and in-page find that can open a collapsed panel, for no
 * JavaScript at all. That also means the content is present in the static HTML,
 * so the FAQ answers still match the FAQPage structured data.
 */
export default function Disclosure({
  summary,
  icon,
  defaultOpen = false,
  tone = 'light',
  children,
}: {
  summary: string
  icon?: React.ReactNode
  defaultOpen?: boolean
  tone?: 'light' | 'dark'
  children: React.ReactNode
}) {
  const isDark = tone === 'dark'

  return (
    <details
      className={`im-disclosure group rounded-xl border ${
        isDark
          ? 'border-[#b08848]/50 bg-[#faf7f0]/5'
          : 'border-[#b08848]/40 bg-[#faf7f0]'
      }`}
      open={defaultOpen}
    >
      <summary
        className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3.5 text-left text-[0.9375rem] font-semibold transition-colors duration-200 ${
          isDark
            ? 'text-[#faf7f0] hover:bg-[#faf7f0]/10'
            : 'text-[#3b2a14] hover:bg-[#f2ebdd]'
        }`}
      >
        {icon ? (
          <span className={isDark ? 'shrink-0 text-[#f2ebdd]' : 'shrink-0 text-[#8b6b39]'}>
            {icon}
          </span>
        ) : null}
        <span className="flex-1">{summary}</span>
        <ChevronIcon
          className={`im-chevron h-5 w-5 shrink-0 transition-transform duration-200 ${
            isDark ? 'text-[#f2ebdd]' : 'text-[#8b6b39]'
          }`}
        />
      </summary>
      <div className={`px-4 pb-4 pt-1 ${isDark ? 'text-[#f2ebdd]' : 'text-[#6d563a]'}`}>
        {children}
      </div>
    </details>
  )
}
