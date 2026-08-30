'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import ObfuscatedEmail from '@/components/foundation/obfuscated-email'
import { ORGANIZATION } from '@/lib/site'
import {
  AUDIENCES,
  ENQUIRE_EVENT,
  FORMSPREE_ENDPOINT,
  IM_EMAIL_DOMAIN,
  IM_EMAIL_USER,
  IM_PAGE_URL,
  PRODUCTS,
  formatWeight,
  totalWeightGrams,
  type EnquireEventDetail,
  type EnquiryMode,
  type ProductSlug,
} from '@/lib/island-merchant'

/* ------------------------------------------------------------------ *
 * Form state
 * ------------------------------------------------------------------ */

type QuantityMap = Record<ProductSlug, string>

type FormState = {
  mode: EnquiryMode
  // common to every mode
  name: string
  email: string
  phone: string
  message: string
  consent: boolean
  marketingConsent: boolean
  // retail + wholesale
  quantities: QuantityMap
  otherProducts: string
  country: string
  // wholesale only
  company: string
  jobTitle: string
  businessType: string
  website: string
  orderFrequency: string
  // producer only
  producerLocation: string
  productDescription: string
  monthlyCapacity: string
  exportExperience: string
  certifications: string
}

const EMPTY_QUANTITIES: QuantityMap = PRODUCTS.reduce((acc, p) => {
  acc[p.slug] = ''
  return acc
}, {} as QuantityMap)

const EMPTY_STATE: FormState = {
  mode: 'retail',
  name: '',
  email: '',
  phone: '',
  message: '',
  consent: false,
  marketingConsent: false,
  quantities: EMPTY_QUANTITIES,
  otherProducts: '',
  country: '',
  company: '',
  jobTitle: '',
  businessType: '',
  website: '',
  orderFrequency: '',
  producerLocation: '',
  productDescription: '',
  monthlyCapacity: '',
  exportExperience: '',
  certifications: '',
}

/**
 * Switch mode WITHOUT destroying anything the visitor has already typed.
 *
 * An earlier version rebuilt state from EMPTY_STATE and copied forward only the
 * keys the incoming mode renders. That silently wiped six packs of cinnamon and
 * a paragraph of free text the moment somebody clicked the third radio to read
 * what it asked, with no warning and no way back.
 *
 * Nothing leaks into the payload as a result: fields the current mode does not
 * render are absent from the DOM, so `new FormData(formEl)` cannot pick them up,
 * and both `buildSummary` and the explicit `fd.set` calls at submit time are
 * already gated on `state.mode`. Filtering happens at serialisation, not in
 * state. Pure — returns a new object.
 */
function applyMode(prev: FormState, mode: EnquiryMode): FormState {
  if (prev.mode === mode) return prev
  return { ...prev, mode }
}

/* ------------------------------------------------------------------ *
 * Quantities
 * ------------------------------------------------------------------ */

const MAX_PACKS = 9999

/**
 * Digits only. Rejects '-', '.', 'e' and leading zeros. Never yields NaN.
 *
 * The NUMBER is clamped to MAX_PACKS, never the digit string. Truncating the
 * string instead turned a pasted 12000 into 1200 — an internally consistent
 * enquiry wrong by a factor of ten, with nothing on screen to show that a digit
 * had gone. The `slice(0, 12)` below only stops an absurdly long paste
 * overflowing Number(); it can never change a value below the ceiling.
 */
function sanitiseQuantity(raw: string): string {
  // A leading minus is a rejection, not a value to coerce.
  if (raw.trim().startsWith('-')) return ''
  const match = raw.match(/\d+/)
  if (!match) return ''
  const digits = match[0].replace(/^0+(?=\d)/, '').slice(0, 12)
  const n = Number(digits)
  if (!Number.isFinite(n)) return ''
  return String(Math.min(MAX_PACKS, Math.max(0, Math.floor(n))))
}

/** Always a safe non-negative integer. */
function quantityValue(raw: string | undefined): number {
  if (!raw) return 0
  const n = Number(raw)
  if (!Number.isFinite(n) || n <= 0) return 0
  return Math.min(MAX_PACKS, Math.floor(n))
}

function numericQuantities(q: QuantityMap): Record<ProductSlug, number> {
  return PRODUCTS.reduce((acc, p) => {
    acc[p.slug] = quantityValue(q[p.slug])
    return acc
  }, {} as Record<ProductSlug, number>)
}

const quantityFieldName = (slug: ProductSlug) => `qty_${slug}`

/* ------------------------------------------------------------------ *
 * Enquiry summary — the block the owner actually reads
 * ------------------------------------------------------------------ */

const NOT_GIVEN = '(not given)'
const val = (s: string) => (s.trim() === '' ? NOT_GIVEN : s.trim())

const BUSINESS_TYPES = [
  { value: 'retailer', label: 'Retail shop, deli or farm shop' },
  { value: 'online', label: 'Online retailer' },
  { value: 'wholesaler', label: 'Wholesaler or distributor' },
  { value: 'hospitality', label: 'Restaurant, café or hotel' },
  { value: 'manufacturer', label: 'Food manufacturer or brand' },
  { value: 'other', label: 'Something else' },
] as const

const ORDER_FREQUENCIES = [
  { value: 'one-off', label: 'A one-off order to start' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'unsure', label: 'Not sure yet' },
] as const

const EXPORT_EXPERIENCE = [
  { value: 'none', label: 'We have not exported before' },
  { value: 'some', label: 'We have exported occasionally' },
  { value: 'established', label: 'We export regularly' },
] as const

const labelFor = (
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string
) => options.find((o) => o.value === value)?.label ?? (value || NOT_GIVEN)

function buildSummary(state: FormState): string {
  const audience = AUDIENCES.find((a) => a.mode === state.mode)
  const lines: string[] = []

  lines.push('ISLAND MERCHANT — ENQUIRY')
  lines.push(`Type: ${audience?.summaryType ?? state.mode}`)
  lines.push(`Page: ${IM_PAGE_URL}`)
  lines.push('')

  lines.push('CONTACT')
  lines.push(`Name: ${val(state.name)}`)
  lines.push(`Email: ${val(state.email)}`)
  lines.push(`Phone: ${val(state.phone)}`)

  if (state.mode === 'wholesale') {
    lines.push(`Business: ${val(state.company)}`)
    lines.push(`Role: ${val(state.jobTitle)}`)
    lines.push(`Business type: ${state.businessType ? labelFor(BUSINESS_TYPES, state.businessType) : NOT_GIVEN}`)
    lines.push(`Website: ${val(state.website)}`)
    lines.push(`Country / trading region: ${val(state.country)}`)
  } else if (state.mode === 'retail') {
    lines.push(`Country / delivery region: ${val(state.country)}`)
  } else {
    lines.push(`Business or farm name: ${val(state.company)}`)
    lines.push(`Location in Sri Lanka: ${val(state.producerLocation)}`)
  }
  lines.push('')

  if (state.mode === 'retail' || state.mode === 'wholesale') {
    const nums = numericQuantities(state.quantities)
    const total = totalWeightGrams(nums)
    const packs = PRODUCTS.reduce((sum, p) => sum + nums[p.slug], 0)

    lines.push('PACKS REQUESTED')
    const chosen = PRODUCTS.filter((p) => nums[p.slug] > 0)
    if (chosen.length === 0) {
      lines.push('No packs selected.')
    } else {
      for (const p of chosen) {
        const n = nums[p.slug]
        lines.push(
          `${p.summaryLabel} — ${n} pack${n === 1 ? '' : 's'} — ${formatWeight(n * p.packWeightGrams)}`
        )
      }
    }
    lines.push(`Total: ${packs} pack${packs === 1 ? '' : 's'}, ${formatWeight(total)}`)
    if (state.mode === 'wholesale') {
      lines.push(
        `Expected order frequency: ${state.orderFrequency ? labelFor(ORDER_FREQUENCIES, state.orderFrequency) : NOT_GIVEN}`
      )
    }
    lines.push('')

    lines.push('OTHER PRODUCTS THEY WANT IMPORTED')
    lines.push(val(state.otherProducts))
    lines.push('')
  } else {
    lines.push('WHAT THEY PRODUCE')
    lines.push(val(state.productDescription))
    lines.push('')
    lines.push('SUPPLY')
    lines.push(`Monthly capacity: ${val(state.monthlyCapacity)}`)
    lines.push(
      `Export experience: ${state.exportExperience ? labelFor(EXPORT_EXPERIENCE, state.exportExperience) : NOT_GIVEN}`
    )
    lines.push(`Certifications / documentation held: ${val(state.certifications)}`)
    lines.push('')
  }

  lines.push('MESSAGE')
  lines.push(val(state.message))
  lines.push('')
  lines.push(`Acknowledged how their details will be used: ${state.consent ? 'yes' : 'no'}`)
  lines.push(`Marketing opt-in (launch updates): ${state.marketingConsent ? 'Yes' : 'No'}`)

  return lines.join('\n')
}

/* ------------------------------------------------------------------ *
 * mailto fallback (address assembled in the browser, never in the HTML)
 * ------------------------------------------------------------------ */

const MAILTO_MAX = 1900
const TRUNCATION_NOTE =
  '\n\n[This message was shortened so it would fit in an email link. Please send the rest separately.]'

function buildMailto(address: string, subject: string, body: string) {
  const base = `mailto:${address}?subject=${encodeURIComponent(subject)}&body=`
  const budget = Math.max(0, MAILTO_MAX - base.length)

  if (encodeURIComponent(body).length <= budget) {
    return { href: base + encodeURIComponent(body), truncated: false }
  }

  let text = body
  while (text.length > 0 && encodeURIComponent(text + TRUNCATION_NOTE).length > budget) {
    text = text.slice(0, Math.max(0, Math.floor(text.length * 0.9) - 1))
  }
  return { href: base + encodeURIComponent(text + TRUNCATION_NOTE), truncated: true }
}

/* ------------------------------------------------------------------ *
 * Validation
 * ------------------------------------------------------------------ */

type Errors = Partial<Record<string, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(state: FormState): Errors {
  const e: Errors = {}

  if (state.name.trim() === '') e.name = 'Please tell us your name.'
  if (state.email.trim() === '') e.email = 'Please give us an email address so we can reply.'
  else if (!EMAIL_RE.test(state.email.trim())) e.email = 'That does not look like an email address.'

  if (state.mode === 'retail' || state.mode === 'wholesale') {
    const nums = numericQuantities(state.quantities)
    const packs = PRODUCTS.reduce((sum, p) => sum + nums[p.slug], 0)
    if (packs === 0 && state.otherProducts.trim() === '') {
      e.quantities =
        'Tell us how many packs you are interested in, or name another product you would like us to import.'
    }
  }

  if (state.mode === 'wholesale') {
    if (state.company.trim() === '') e.company = 'Please give us your business name.'
    if (state.businessType === '') e.businessType = 'Please choose the closest description.'
    if (state.country.trim() === '') e.country = 'Please tell us where you trade.'
  }

  if (state.mode === 'producer') {
    if (state.company.trim() === '') e.company = 'Please give us your business or farm name.'
    if (state.producerLocation.trim() === '')
      e.producerLocation = 'Please tell us where in Sri Lanka you are based.'
    if (state.productDescription.trim() === '')
      e.productDescription = 'Please describe what you produce.'
    if (state.exportExperience === '') e.exportExperience = 'Please choose one.'
  }

  if (!state.consent) e.consent = 'Please tick this so we know we may reply to you.'

  return e
}

/* ------------------------------------------------------------------ *
 * Styling — scoped Island Merchant palette.
 * Every colour reads a --im-* token with the sampled packaging colour as the
 * fallback, so the component is correct with or without the scoped theme
 * stylesheet. No Dias Global brand colour is referenced anywhere.
 * ------------------------------------------------------------------ */

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--im-accent,#8b6b39)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--im-cream,#faf7f0)]'

/**
 * NOTE ON OPACITY MODIFIERS. Every themed colour here is an arbitrary value
 * containing `var()`, and Tailwind 3 emits NO CSS AT ALL for an opacity modifier
 * on one of those (`border-[var(--im-gold)]/45` compiles to nothing). Fields
 * then fell back to preflight's #e5e7eb — 1.24:1 against their own white fill,
 * so a low-vision user saw no field boundaries whatsoever. Every colour below is
 * therefore a solid value. Do not reintroduce a `/nn` modifier on a var().
 */
const fieldBase =
  'w-full rounded-lg border bg-white px-4 py-3 text-base text-[var(--im-ink,#3b2a14)] placeholder:text-[var(--im-muted,#6d563a)] transition-colors ' +
  focusRing

// accent #8b6b39 is 4.62:1 on white and 4.61:1 on cream — well clear of the 3:1
// that WCAG 1.4.11 requires for the visual boundary of a form control.
const fieldOk = 'border-[var(--im-accent,#8b6b39)] hover:border-[var(--im-accent-dark,#765b30)]'
const fieldBad = 'border-[var(--im-error,#8f2f18)] border-2'

const fieldClass = (invalid: boolean) => `${fieldBase} ${invalid ? fieldBad : fieldOk}`

const labelClass =
  'block text-sm font-semibold uppercase tracking-wider text-[var(--im-ink,#3b2a14)] mb-2'

const hintClass = 'mt-1.5 text-sm text-[var(--im-muted,#6d563a)]'

const errorClass = 'mt-1.5 text-sm font-medium text-[var(--im-error,#8f2f18)]'

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export default function InterestForm() {
  const [state, setState] = useState<FormState>(EMPTY_STATE)
  const [errors, setErrors] = useState<Errors>({})
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [sentSummary, setSentSummary] = useState<string>('')
  const [sentSubject, setSentSubject] = useState<string>('')
  const [contactAddress, setContactAddress] = useState<string | null>(null)
  /** Announcement for a mode change that came from an EnquireButton elsewhere on the page,
   *  so a screen-reader user is told the form's field set has just been rewritten. */
  const [modeNotice, setModeNotice] = useState('')

  // Focus tokens: bumped to request a focus move AFTER React has committed the
  // DOM, so we never query for an element that has not rendered yet.
  const [errorFocusToken, setErrorFocusToken] = useState(0)
  const [statusFocusToken, setStatusFocusToken] = useState(0)

  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  // Synchronous re-entrancy guard. React state is async; this is not.
  const submittingRef = useRef(false)

  const audience = useMemo(
    () => AUDIENCES.find((a) => a.mode === state.mode) ?? AUDIENCES[0],
    [state.mode]
  )

  const nums = useMemo(() => numericQuantities(state.quantities), [state.quantities])
  const totalGrams = useMemo(() => totalWeightGrams(nums), [nums])
  const totalPacks = useMemo(
    () => PRODUCTS.reduce((sum, p) => sum + nums[p.slug], 0),
    [nums]
  )
  const summary = useMemo(() => buildSummary(state), [state])

  const showProducts = state.mode === 'retail' || state.mode === 'wholesale'

  /* --- email address, assembled client-side from base64 parts --------- */
  useEffect(() => {
    try {
      setContactAddress(`${atob(IM_EMAIL_USER)}@${atob(IM_EMAIL_DOMAIN)}`)
    } catch {
      /* leave null — the fallback link simply is not offered */
    }
  }, [])

  /* --- cross-component "Enquire" buttons ----------------------------- */
  useEffect(() => {
    const onEnquire = (event: Event) => {
      const detail = (event as CustomEvent<EnquireEventDetail>).detail
      if (!detail) return
      const mode = detail.mode
      if (mode !== 'retail' && mode !== 'wholesale' && mode !== 'producer') return
      // Never interrupt an in-flight submission.
      if (submittingRef.current) return

      // Functional update: reads the latest state, so this handler can be
      // registered once with an empty dep list and never goes stale.
      setState((prev) => {
        const next = applyMode(prev, mode)
        if (detail.product && (mode === 'retail' || mode === 'wholesale')) {
          const current = quantityValue(next.quantities[detail.product])
          if (current === 0) {
            next.quantities = { ...next.quantities, [detail.product]: '1' }
          }
        }
        return next
      })
      setErrors({})
      const changed = AUDIENCES.find((a) => a.mode === mode)
      setModeNotice(
        changed
          ? `Enquiry type set to ${changed.summaryType}. The form below has been updated.`
          : ''
      )
      // Deliberate user gesture: return to the form so they can enquire again.
      setSubmitState((prev) => (prev === 'submitting' ? prev : 'idle'))

      // No scroll here. EnquireButton already scrolls to the #im-enquire
      // section, which carries the .im-theme scroll-margin-top that clears the
      // fixed header + sticky sub-nav (and honours prefers-reduced-motion).
      // A second scrollIntoView on this root would win the race and park the
      // form's first field underneath both bars.
    }

    window.addEventListener(ENQUIRE_EVENT, onEnquire)
    return () => window.removeEventListener(ENQUIRE_EVENT, onEnquire)
  }, [])

  /* --- post-commit focus moves --------------------------------------- */
  useEffect(() => {
    if (errorFocusToken === 0) return
    const el = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
    el?.focus()
  }, [errorFocusToken])

  useEffect(() => {
    if (statusFocusToken === 0) return
    statusRef.current?.focus()
  }, [statusFocusToken])

  /* --- change handlers ------------------------------------------------ */

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key as string]) return prev
      const next = { ...prev }
      delete next[key as string]
      return next
    })
  }

  const changeMode = (mode: EnquiryMode) => {
    setState((prev) => applyMode(prev, mode))
    // Errors are per-field and the fields have changed; start clean.
    setErrors({})
    // The radio itself announces its own change; only a remote switch needs narrating.
    setModeNotice('')
  }

  const setQuantity = (slug: ProductSlug, raw: string) => {
    const clean = sanitiseQuantity(raw)
    setState((prev) => ({ ...prev, quantities: { ...prev.quantities, [slug]: clean } }))
    setErrors((prev) => {
      if (!prev.quantities) return prev
      const next = { ...prev }
      delete next.quantities
      return next
    })
  }

  /* --- submit --------------------------------------------------------- */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Capture the form element up front: React nulls currentTarget once the
    // synchronous part of the handler returns, and this handler awaits.
    const formEl = event.currentTarget

    // Guard 1: synchronous, immune to React batching and double-clicks.
    if (submittingRef.current) return

    const nextErrors = validate(state)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSubmitState('idle')
      setErrorFocusToken((n) => n + 1)
      return
    }
    setErrors({})

    submittingRef.current = true
    setSubmitState('submitting')

    // Build the payload from the live form, then OVERWRITE the derived fields
    // from current React state. FormData is only a starting point; the values
    // the owner reads are set here, at submit time, from state.
    const fd = new FormData(formEl)
    const summaryNow = buildSummary(state)
    const subjectNow = audience.subject

    fd.set('_subject', subjectNow)
    fd.set('_replyto', state.email.trim())
    fd.set('enquiryType', state.mode)
    fd.set('summary', summaryNow)
    fd.set('page', IM_PAGE_URL)
    if (showProducts) {
      fd.set('totalPacks', String(totalPacks))
      fd.set('totalWeight', formatWeight(totalGrams))
      for (const p of PRODUCTS) {
        fd.set(quantityFieldName(p.slug), String(nums[p.slug]))
      }
    }
    fd.set('consent', state.consent ? 'yes' : 'no')
    fd.set('marketing_consent', state.marketingConsent ? 'Yes' : 'No')

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd,
      })

      if (response.ok) {
        setSentSummary(summaryNow)
        setSentSubject(subjectNow)
        setSubmitState('success')
      } else {
        setSentSummary(summaryNow)
        setSentSubject(subjectNow)
        setSubmitState('error')
      }
    } catch {
      setSentSummary(summaryNow)
      setSentSubject(subjectNow)
      setSubmitState('error')
    } finally {
      submittingRef.current = false
      setStatusFocusToken((n) => n + 1)
    }
  }

  const startAnother = () => {
    setState((prev) => applyMode({ ...EMPTY_STATE, mode: prev.mode }, prev.mode))
    setErrors({})
    setSentSummary('')
    setSentSubject('')
    setSubmitState('idle')
  }

  /* --- success view: rendered INSTEAD of the form, so nothing that the
         user is reading can be re-rendered away underneath them. -------- */

  if (submitState === 'success') {
    return (
      <div ref={rootRef} className="im-theme">
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className={`im-on-dark rounded-2xl border border-[var(--im-gold,#b08848)] bg-[var(--im-brown,#3b2a14)] p-8 text-[var(--im-cream,#faf7f0)] ${focusRing}`}
        >
          <h3 className="text-2xl font-semibold text-[var(--im-gold,#b08848)]">
            Thank you — your enquiry is with us.
          </h3>
          <p className="mt-3 max-w-prose leading-relaxed">
            We have your {audience.summaryType.toLowerCase()} enquiry and will reply by email. The
            Island Merchant is pre-launch, so we will come back to you when we can be specific about
            stock, pricing and how to order.
          </p>

          <details className="mt-6">
            {/* Cream, not gold: #b08848 on #3b2a14 is 4.23:1, which clears the 3:1 large-text
                bar but not the 4.5:1 this 14px run needs. Cream is 12.85:1. */}
            <summary
              className={`cursor-pointer text-sm font-semibold uppercase tracking-wider text-[var(--im-cream,#faf7f0)] ${focusRing} rounded`}
            >
              What we received
            </summary>
            <pre
              tabIndex={0}
              role="region"
              aria-label="Enquiry summary"
              className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-black/25 p-4 text-sm leading-relaxed"
            >
              {sentSummary}
            </pre>
          </details>

          <button
            type="button"
            onClick={startAnother}
            className={`mt-6 inline-flex items-center justify-center rounded-lg border border-[var(--im-gold,#b08848)] px-6 py-3 font-semibold text-[var(--im-cream,#faf7f0)] transition-colors hover:bg-[var(--im-gold,#b08848)] hover:text-[var(--im-brown,#3b2a14)] ${focusRing} focus-visible:ring-[var(--im-cream,#faf7f0)] focus-visible:ring-offset-[var(--im-brown,#3b2a14)]`}
          >
            Send another enquiry
          </button>
        </div>
      </div>
    )
  }

  /* --- form ----------------------------------------------------------- */

  const describedBy = (...ids: Array<string | false | undefined>) => {
    const list = ids.filter(Boolean) as string[]
    return list.length > 0 ? list.join(' ') : undefined
  }

  const mailto =
    contactAddress && sentSummary
      ? buildMailto(contactAddress, sentSubject || audience.subject, sentSummary)
      : null

  const errorCount = Object.keys(errors).length

  return (
    <div ref={rootRef} className="im-theme">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-[var(--im-gold,#b08848)] bg-[var(--im-cream,#faf7f0)] p-6 sm:p-8"
      >
        {/* Formspree control fields. Always rendered, always named. */}
        <input type="hidden" name="_subject" value={audience.subject} readOnly />
        <input type="hidden" name="page" value={IM_PAGE_URL} readOnly />
        <input type="hidden" name="_replyto" value={state.email.trim()} readOnly />
        <input type="hidden" name="summary" value={summary} readOnly />

        {/* Honeypot. Rendered (so it is serialised) but off-screen, out of the
            tab order, hidden from assistive tech — and never `required`. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
          }}
        >
          <label htmlFor="im-gotcha">Leave this field empty</label>
          <input
            type="text"
            id="im-gotcha"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        {/* Only ever populated by a remote EnquireButton, so it stays silent for the radios. */}
        <p role="status" aria-live="polite" className="sr-only">
          {modeNotice}
        </p>

        {/* ---------------- enquiry type ---------------- */}
        <fieldset className="mb-8">
          <legend className="text-sm font-semibold uppercase tracking-wider text-[var(--im-ink,#3b2a14)] mb-3">
            What kind of enquiry is this?
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {AUDIENCES.map((a) => {
              const id = `im-mode-${a.mode}`
              const selected = state.mode === a.mode
              return (
                <label
                  key={a.mode}
                  htmlFor={id}
                  className={`flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-colors ${
                    selected
                      ? 'border-[var(--im-accent,#8b6b39)] bg-[var(--im-kraft,#f2ebdd)]'
                      : 'border-[var(--im-gold,#b08848)] bg-white hover:border-[var(--im-accent,#8b6b39)]'
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <input
                      type="radio"
                      id={id}
                      name="enquiryType"
                      value={a.mode}
                      checked={selected}
                      onChange={() => changeMode(a.mode)}
                      className={`mt-1 h-4 w-4 shrink-0 accent-[var(--im-accent,#8b6b39)] ${focusRing}`}
                    />
                    <span className="font-semibold text-[var(--im-ink,#3b2a14)]">{a.label}</span>
                  </span>
                  <span className="mt-2 pl-7 text-sm text-[var(--im-muted,#6d563a)]">{a.blurb}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        {/* ---------------- contact ---------------- */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="im-name" className={labelClass}>
              Your name <span aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="im-name"
              name="name"
              value={state.name}
              onChange={(e) => setField('name', e.target.value)}
              required
              autoComplete="name"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describedBy(errors.name && 'im-name-error')}
              className={fieldClass(Boolean(errors.name))}
            />
            {errors.name && (
              <p id="im-name-error" className={errorClass}>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="im-email" className={labelClass}>
              Email <span aria-hidden="true">*</span>
            </label>
            <input
              type="email"
              id="im-email"
              name="email"
              value={state.email}
              onChange={(e) => setField('email', e.target.value)}
              required
              autoComplete="email"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy('im-email-hint', errors.email && 'im-email-error')}
              className={fieldClass(Boolean(errors.email))}
            />
            <p id="im-email-hint" className={hintClass}>
              This is how we will reply.
            </p>
            {errors.email && (
              <p id="im-email-error" className={errorClass}>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="im-phone" className={labelClass}>
              Phone
            </label>
            <input
              type="tel"
              id="im-phone"
              name="phone"
              value={state.phone}
              onChange={(e) => setField('phone', e.target.value)}
              autoComplete="tel"
              aria-describedby="im-phone-hint"
              className={fieldClass(false)}
            />
            <p id="im-phone-hint" className={hintClass}>
              Optional. Include the country code.
            </p>
          </div>

          {/* Retail + wholesale: country. Producer uses producerLocation instead. */}
          {(state.mode === 'retail' || state.mode === 'wholesale') && (
            <div>
              <label htmlFor="im-country" className={labelClass}>
                {state.mode === 'retail' ? 'Country' : 'Country or trading region'}{' '}
                {state.mode === 'wholesale' && <span aria-hidden="true">*</span>}
              </label>
              <input
                type="text"
                id="im-country"
                name="country"
                value={state.country}
                onChange={(e) => setField('country', e.target.value)}
                required={state.mode === 'wholesale'}
                autoComplete="country-name"
                aria-invalid={errors.country ? true : undefined}
                aria-describedby={describedBy(
                  'im-country-hint',
                  errors.country && 'im-country-error'
                )}
                className={fieldClass(Boolean(errors.country))}
              />
              <p id="im-country-hint" className={hintClass}>
                We ship into the UK and Europe.
              </p>
              {errors.country && (
                <p id="im-country-error" className={errorClass}>
                  {errors.country}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ---------------- wholesale-only business block ---------------- */}
        {state.mode === 'wholesale' && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="im-company" className={labelClass}>
                Business name <span aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                id="im-company"
                name="company"
                value={state.company}
                onChange={(e) => setField('company', e.target.value)}
                required
                autoComplete="organization"
                aria-invalid={errors.company ? true : undefined}
                aria-describedby={describedBy(errors.company && 'im-company-error')}
                className={fieldClass(Boolean(errors.company))}
              />
              {errors.company && (
                <p id="im-company-error" className={errorClass}>
                  {errors.company}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="im-jobTitle" className={labelClass}>
                Your role
              </label>
              <input
                type="text"
                id="im-jobTitle"
                name="jobTitle"
                value={state.jobTitle}
                onChange={(e) => setField('jobTitle', e.target.value)}
                autoComplete="organization-title"
                className={fieldClass(false)}
              />
            </div>

            <div>
              <label htmlFor="im-businessType" className={labelClass}>
                Type of business <span aria-hidden="true">*</span>
              </label>
              <select
                id="im-businessType"
                name="businessType"
                value={state.businessType}
                onChange={(e) => setField('businessType', e.target.value)}
                required
                aria-invalid={errors.businessType ? true : undefined}
                aria-describedby={describedBy(errors.businessType && 'im-businessType-error')}
                className={`${fieldClass(Boolean(errors.businessType))} cursor-pointer`}
              >
                <option value="">Please choose…</option>
                {BUSINESS_TYPES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {errors.businessType && (
                <p id="im-businessType-error" className={errorClass}>
                  {errors.businessType}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="im-website" className={labelClass}>
                Website
              </label>
              <input
                type="text"
                id="im-website"
                name="website"
                value={state.website}
                onChange={(e) => setField('website', e.target.value)}
                autoComplete="url"
                inputMode="url"
                className={fieldClass(false)}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="im-orderFrequency" className={labelClass}>
                How often would you expect to order?
              </label>
              <select
                id="im-orderFrequency"
                name="orderFrequency"
                value={state.orderFrequency}
                onChange={(e) => setField('orderFrequency', e.target.value)}
                aria-describedby="im-orderFrequency-hint"
                className={`${fieldClass(false)} cursor-pointer`}
              >
                <option value="">Please choose…</option>
                {ORDER_FREQUENCIES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <p id="im-orderFrequency-hint" className={hintClass}>
                A rough answer is fine — nothing here commits you to anything.
              </p>
            </div>
          </div>
        )}

        {/* ---------------- retail + wholesale: packs ---------------- */}
        {showProducts && (
          <fieldset className="mt-8 rounded-xl border border-[var(--im-gold,#b08848)] bg-[var(--im-kraft,#f2ebdd)] p-5">
            <legend className="px-2 text-sm font-semibold uppercase tracking-wider text-[var(--im-ink,#3b2a14)]">
              How many packs?
            </legend>
            <p id="im-quantities-hint" className={`${hintClass} mb-4 mt-0`}>
              {state.mode === 'wholesale'
                ? 'Trade orders are in the same sealed retail packs — not cases, not bulk kilos. Give us an indicative number.'
                : 'Indicative only. Nothing is charged and nothing is ordered yet.'}
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              {PRODUCTS.map((p) => {
                const id = `im-qty-${p.slug}`
                const n = nums[p.slug]
                return (
                  <div key={p.slug}>
                    <label htmlFor={id} className={labelClass}>
                      {p.name}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        id={id}
                        name={quantityFieldName(p.slug)}
                        value={state.quantities[p.slug] ?? ''}
                        onChange={(e) => setQuantity(p.slug, e.target.value)}
                        min={0}
                        max={MAX_PACKS}
                        step={1}
                        inputMode="numeric"
                        placeholder="0"
                        aria-invalid={errors.quantities ? true : undefined}
                        aria-describedby={describedBy(
                          'im-quantities-hint',
                          `${id}-unit`,
                          errors.quantities && 'im-quantities-error'
                        )}
                        className={`${fieldClass(Boolean(errors.quantities))} max-w-[8rem]`}
                      />
                      <span id={`${id}-unit`} className="text-sm text-[var(--im-muted,#6d563a)]">
                        × {p.netWeight} pack{n === 1 ? '' : 's'}
                        {n > 0 ? ` = ${formatWeight(n * p.packWeightGrams)}` : ''}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <p
              role="status"
              aria-live="polite"
              className="mt-5 border-t border-[var(--im-gold,#b08848)] pt-4 text-base font-semibold text-[var(--im-ink,#3b2a14)]"
            >
              Total: {totalPacks} pack{totalPacks === 1 ? '' : 's'} — {formatWeight(totalGrams)}
            </p>

            {/* Rendered so the totals are in the payload even if fd.set is bypassed. */}
            <input type="hidden" name="totalPacks" value={String(totalPacks)} readOnly />
            <input type="hidden" name="totalWeight" value={formatWeight(totalGrams)} readOnly />

            {errors.quantities && (
              <p id="im-quantities-error" className={errorClass}>
                {errors.quantities}
              </p>
            )}
          </fieldset>
        )}

        {/* ---------------- retail + wholesale: other products ---------------- */}
        {showProducts && (
          <div className="mt-6">
            <label htmlFor="im-otherProducts" className={labelClass}>
              Anything else you would like us to import?
            </label>
            <textarea
              id="im-otherProducts"
              name="otherProducts"
              rows={3}
              value={state.otherProducts}
              onChange={(e) => setField('otherProducts', e.target.value)}
              aria-describedby="im-otherProducts-hint"
              className={`${fieldClass(false)} resize-y`}
            />
            <p id="im-otherProducts-hint" className={hintClass}>
              Sri Lankan products you cannot get here — spices, coconut products, teas, preserves.
              This genuinely shapes what we bring in.
            </p>
          </div>
        )}

        {/* ---------------- producer-only block ---------------- */}
        {state.mode === 'producer' && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="im-company" className={labelClass}>
                Business or farm name <span aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                id="im-company"
                name="company"
                value={state.company}
                onChange={(e) => setField('company', e.target.value)}
                required
                autoComplete="organization"
                aria-invalid={errors.company ? true : undefined}
                aria-describedby={describedBy(errors.company && 'im-company-error')}
                className={fieldClass(Boolean(errors.company))}
              />
              {errors.company && (
                <p id="im-company-error" className={errorClass}>
                  {errors.company}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="im-producerLocation" className={labelClass}>
                Where in Sri Lanka <span aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                id="im-producerLocation"
                name="producerLocation"
                value={state.producerLocation}
                onChange={(e) => setField('producerLocation', e.target.value)}
                required
                aria-invalid={errors.producerLocation ? true : undefined}
                aria-describedby={describedBy(
                  'im-producerLocation-hint',
                  errors.producerLocation && 'im-producerLocation-error'
                )}
                className={fieldClass(Boolean(errors.producerLocation))}
              />
              <p id="im-producerLocation-hint" className={hintClass}>
                District or town is enough.
              </p>
              {errors.producerLocation && (
                <p id="im-producerLocation-error" className={errorClass}>
                  {errors.producerLocation}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="im-productDescription" className={labelClass}>
                What do you produce? <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="im-productDescription"
                name="productDescription"
                rows={4}
                value={state.productDescription}
                onChange={(e) => setField('productDescription', e.target.value)}
                required
                aria-invalid={errors.productDescription ? true : undefined}
                aria-describedby={describedBy(
                  'im-productDescription-hint',
                  errors.productDescription && 'im-productDescription-error'
                )}
                className={`${fieldClass(Boolean(errors.productDescription))} resize-y`}
              />
              <p id="im-productDescription-hint" className={hintClass}>
                The product, how it is made or grown, and how it is packed today.
              </p>
              {errors.productDescription && (
                <p id="im-productDescription-error" className={errorClass}>
                  {errors.productDescription}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="im-monthlyCapacity" className={labelClass}>
                Monthly capacity
              </label>
              <input
                type="text"
                id="im-monthlyCapacity"
                name="monthlyCapacity"
                value={state.monthlyCapacity}
                onChange={(e) => setField('monthlyCapacity', e.target.value)}
                aria-describedby="im-monthlyCapacity-hint"
                className={fieldClass(false)}
              />
              <p id="im-monthlyCapacity-hint" className={hintClass}>
                In whatever unit you work in — kilos, packs, litres.
              </p>
            </div>

            <div>
              <label htmlFor="im-exportExperience" className={labelClass}>
                Export experience <span aria-hidden="true">*</span>
              </label>
              <select
                id="im-exportExperience"
                name="exportExperience"
                value={state.exportExperience}
                onChange={(e) => setField('exportExperience', e.target.value)}
                required
                aria-invalid={errors.exportExperience ? true : undefined}
                aria-describedby={describedBy(errors.exportExperience && 'im-exportExperience-error')}
                className={`${fieldClass(Boolean(errors.exportExperience))} cursor-pointer`}
              >
                <option value="">Please choose…</option>
                {EXPORT_EXPERIENCE.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {errors.exportExperience && (
                <p id="im-exportExperience-error" className={errorClass}>
                  {errors.exportExperience}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="im-certifications" className={labelClass}>
                Certifications or documentation you already hold
              </label>
              <textarea
                id="im-certifications"
                name="certifications"
                rows={2}
                value={state.certifications}
                onChange={(e) => setField('certifications', e.target.value)}
                aria-describedby="im-certifications-hint"
                className={`${fieldClass(false)} resize-y`}
              />
              <p id="im-certifications-hint" className={hintClass}>
                Any food-safety, phytosanitary or export-registration documentation you already
                hold — or none yet, which is a perfectly normal answer.
              </p>
            </div>
          </div>
        )}

        {/* ---------------- message ---------------- */}
        <div className="mt-6">
          <label htmlFor="im-message" className={labelClass}>
            Anything else we should know?
          </label>
          <textarea
            id="im-message"
            name="message"
            rows={4}
            value={state.message}
            onChange={(e) => setField('message', e.target.value)}
            className={`${fieldClass(false)} resize-y`}
          />
        </div>

        {/* ---------------- how we use your details, then the two separate tick boxes ----------------

            Answering the enquiry and marketing the launch are DIFFERENT purposes and are kept in
            separate controls. Bundling them into one required box made the marketing consent
            invalid under UK GDPR Art. 4(11)/7(4) (not freely given, a condition of using the form)
            and under PECR reg. 22, which needs a specific opt-in — so every later launch email
            would have rested on consent that did not exist. The first box is an acknowledgement of
            the notice, not the lawful basis; the second is the opt-in, unticked and never
            required. */}
        <div className="mt-8 rounded-xl border border-[var(--im-gold,#b08848)] bg-[var(--im-kraft,#f2ebdd)] p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--im-ink,#3b2a14)]">
            How we use your details
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--im-ink,#3b2a14)]">
            {ORGANIZATION.legalName} (company no. {ORGANIZATION.companyNumber}) is the controller of
            what you send here. We use it to respond to your enquiry and, if we go on to do business
            together, to manage that relationship. We will not sell it, and we will not pass it to
            anyone else for their own marketing. This form is delivered through Formspree, a service
            based in the United States, so your details are transferred outside the UK under
            appropriate safeguards. We keep enquiries for up to 24 months unless we are working
            together. You can ask to see, correct or delete your details at any time — see our{' '}
            <Link
              href="/privacy-policy"
              className="font-semibold text-[var(--im-accent,#8b6b39)] underline underline-offset-2"
            >
              Privacy Policy
            </Link>{' '}
            or write to{' '}
            <span className="font-mono break-all">
              <ObfuscatedEmail
                user={IM_EMAIL_USER}
                domain={IM_EMAIL_DOMAIN}
                subject="Data protection request — Island Merchant"
                label="the Island Merchant address"
                className="font-semibold text-[var(--im-accent,#8b6b39)] underline underline-offset-2"
                showAddress
              />
            </span>
            .
          </p>

          <label
            htmlFor="im-consent"
            className="mt-5 flex cursor-pointer items-start gap-3 text-[var(--im-ink,#3b2a14)]"
          >
            <input
              type="checkbox"
              id="im-consent"
              name="consent"
              value="yes"
              checked={state.consent}
              onChange={(e) => setField('consent', e.target.checked)}
              required
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={describedBy(errors.consent && 'im-consent-error')}
              className={`mt-1 h-5 w-5 shrink-0 accent-[var(--im-accent,#8b6b39)] ${focusRing}`}
            />
            <span className="text-sm leading-relaxed">
              I have read the above and would like {ORGANIZATION.legalName} to reply to this
              enquiry. <span aria-hidden="true">*</span>
            </span>
          </label>
          {errors.consent && (
            <p id="im-consent-error" className={errorClass}>
              {errors.consent}
            </p>
          )}

          <label
            htmlFor="im-marketing-consent"
            className="mt-4 flex cursor-pointer items-start gap-3 text-[var(--im-ink,#3b2a14)]"
          >
            <input
              type="checkbox"
              id="im-marketing-consent"
              name="marketing_consent"
              value="Yes"
              checked={state.marketingConsent}
              onChange={(e) => setField('marketingConsent', e.target.checked)}
              className={`mt-1 h-5 w-5 shrink-0 accent-[var(--im-accent,#8b6b39)] ${focusRing}`}
            />
            <span className="text-sm leading-relaxed">
              Optional: send me occasional updates about Island Merchant products and availability.
              You can unsubscribe at any time, and leaving this unticked has no effect on your
              enquiry.
            </span>
          </label>
        </div>

        {/* ---------------- status region ---------------- */}
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className={`mt-6 ${focusRing} rounded-lg`}
        >
          {submitState === 'error' && (
            <div className="rounded-lg border-2 border-[var(--im-error,#8f2f18)] bg-white p-4">
              <p className="font-semibold text-[var(--im-error,#8f2f18)]">
                We could not send that. Nothing has been lost.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--im-ink,#3b2a14)]">
                Your answers are still in the form — press “Send my enquiry” again to retry.
                {mailto ? ' Or send it as an email instead:' : ''}
              </p>
              {/* The address as selectable text, not only inside a mailto: href. A browser with
                  no mail handler registered does nothing at all when a mailto is clicked, which
                  would leave the enquiry with no route to us. */}
              <p className="mt-2 text-sm leading-relaxed text-[var(--im-ink,#3b2a14)]">
                Our address is{' '}
                <span className="font-mono break-all">
                  <ObfuscatedEmail
                    user={IM_EMAIL_USER}
                    domain={IM_EMAIL_DOMAIN}
                    subject={sentSubject || audience.subject}
                    label="the Island Merchant address"
                    className="font-semibold text-[var(--im-accent,#8b6b39)] underline underline-offset-2"
                    showAddress
                  />
                </span>
                .
              </p>
              {mailto && (
                <>
                  <a
                    href={mailto.href}
                    className={`mt-3 inline-flex items-center justify-center rounded-lg border-2 border-[var(--im-accent,#8b6b39)] px-5 py-2.5 font-semibold text-[var(--im-accent,#8b6b39)] transition-colors hover:bg-[var(--im-accent,#8b6b39)] hover:text-[var(--im-cream,#faf7f0)] ${focusRing}`}
                  >
                    Email this enquiry instead
                  </a>
                  {mailto.truncated && (
                    <p className="mt-2 text-sm text-[var(--im-muted,#6d563a)]">
                      Your enquiry is longer than an email link can carry, so the email will open
                      shortened. Please paste the full text below into it before sending.
                    </p>
                  )}
                  <details className="mt-3">
                    <summary
                      className={`cursor-pointer rounded text-sm font-semibold text-[var(--im-accent,#8b6b39)] ${focusRing}`}
                    >
                      Copy the full enquiry text
                    </summary>
                    <pre
                      tabIndex={0}
                      role="region"
                      aria-label="Full enquiry text"
                      className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[var(--im-kraft,#f2ebdd)] p-3 text-sm leading-relaxed text-[var(--im-ink,#3b2a14)]"
                    >
                      {sentSummary}
                    </pre>
                  </details>
                </>
              )}
            </div>
          )}

          {errorCount > 0 && submitState !== 'error' && (
            <p className="rounded-lg border-2 border-[var(--im-error,#8f2f18)] bg-white p-4 font-semibold text-[var(--im-error,#8f2f18)]">
              {errorCount === 1
                ? 'One field needs your attention before we can send this.'
                : `${errorCount} fields need your attention before we can send this.`}
            </p>
          )}
        </div>

        {/* ---------------- submit ---------------- */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={submitState === 'submitting'}
            className={`inline-flex w-full items-center justify-center rounded-lg bg-[var(--im-accent,#8b6b39)] px-8 py-3.5 text-base font-semibold text-[var(--im-cream,#faf7f0)] transition-colors hover:bg-[var(--im-accent-dark,#765b30)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${focusRing}`}
          >
            {submitState === 'submitting' ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending…
              </>
            ) : (
              'Send my enquiry'
            )}
          </button>

          <p className="mt-4 max-w-prose text-sm leading-relaxed text-[var(--im-muted,#6d563a)]">
            The Island Merchant is pre-launch. Registering interest places no order and commits you
            to nothing. What you tell us is used to answer you and to size our first shipment; how
            it is handled, and where it goes, is set out above the tick boxes.
          </p>
        </div>
      </form>
    </div>
  )
}
