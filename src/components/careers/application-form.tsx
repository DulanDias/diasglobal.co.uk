'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import ObfuscatedEmail from '@/components/foundation/obfuscated-email'
import { ORGANIZATION } from '@/lib/site'
import {
  APPLICATION_REFERENCE_ALPHABET,
  APPLICATION_REFERENCE_LENGTH,
  APPLICATION_REFERENCE_PREFIX,
  APPLICATION_SUBJECT,
  CAREERS_EMAIL_DOMAIN,
  CAREERS_EMAIL_USER,
  FORMSPREE_ENDPOINT,
  type Vacancy,
} from '@/lib/careers'

type Status = 'idle' | 'submitting' | 'success' | 'error'

type FieldName =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'location'
  | 'rightToWork'
  | 'qualifications'
  | 'experience'
  | 'cvLink'
  | 'earliestStart'
  | 'hearAbout'
  | 'coveringNote'
  | 'adjustments'
  | 'consent'

type Values = Record<Exclude<FieldName, 'consent'>, string> & { consent: boolean }

const EMPTY: Values = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  rightToWork: '',
  qualifications: '',
  experience: '',
  cvLink: '',
  earliestStart: '',
  hearAbout: '',
  coveringNote: '',
  adjustments: '',
  consent: false,
}

/**
 * Application reference, assembled in the browser. Formspree's free plan cannot
 * accept file uploads, so the CV never travels with the form: the applicant is
 * given this reference on success and emails the CV separately quoting it, which
 * is what lets the two halves be matched up on arrival.
 */
function makeReference(): string {
  const alphabet = APPLICATION_REFERENCE_ALPHABET
  const length = APPLICATION_REFERENCE_LENGTH
  let out = ''

  const webCrypto = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined
  if (webCrypto && typeof webCrypto.getRandomValues === 'function') {
    const values = new Uint32Array(length)
    webCrypto.getRandomValues(values)
    for (let i = 0; i < length; i += 1) {
      out += alphabet.charAt(values[i] % alphabet.length)
    }
  } else {
    for (let i = 0; i < length; i += 1) {
      out += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    }
  }

  return `${APPLICATION_REFERENCE_PREFIX}${out}`
}

/** Only ids that are actually rendered may appear in aria-describedby. */
function describedBy(id: string, hasHint: boolean, hasError: boolean): string | undefined {
  const ids: string[] = []
  if (hasHint) ids.push(`${id}-hint`)
  if (hasError) ids.push(`${id}-error`)
  return ids.length > 0 ? ids.join(' ') : undefined
}

const inputClass =
  'w-full px-4 py-3 bg-bg-light border border-border rounded-lg text-text font-sans text-base transition-colors duration-200 focus:outline-none focus:border-accent'

const inputErrorClass =
  'w-full px-4 py-3 bg-bg-light border border-red-600 rounded-lg text-text font-sans text-base transition-colors duration-200 focus:outline-none focus:border-accent'

const labelClass = 'block font-semibold mb-2 text-text text-sm uppercase tracking-wider'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={`${id}-error`} className="mt-2 text-sm font-medium text-red-700">
      {message}
    </p>
  )
}

function FieldHint({ id, hint }: { id: string; hint?: string }) {
  if (!hint) return null
  return (
    <p id={`${id}-hint`} className="mt-2 text-sm text-text-muted">
      {hint}
    </p>
  )
}

export default function ApplicationForm({ vacancy }: { vacancy: Vacancy }) {
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [reference, setReference] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const statusRef = useRef<HTMLDivElement | null>(null)
  const submittingRef = useRef(false)

  // Generated after mount so the server and client markup agree on first paint.
  useEffect(() => {
    setReference(makeReference())
  }, [])

  const setValue = (name: Exclude<FieldName, 'consent'>, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const setConsent = (checked: boolean) => {
    setValues((prev) => ({ ...prev, consent: checked }))
    setErrors((prev) => {
      if (!prev.consent) return prev
      const next = { ...prev }
      delete next.consent
      return next
    })
  }

  function validate(v: Values): Partial<Record<FieldName, string>> {
    const next: Partial<Record<FieldName, string>> = {}

    if (!v.fullName.trim()) next.fullName = 'Enter the name we should address you by.'
    if (!v.email.trim()) {
      next.email = 'Enter an email address we can reply to.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) {
      next.email = 'Enter an email address in the format name@example.com.'
    }
    if (!v.location.trim()) next.location = 'Tell us where you are based.'
    if (!v.rightToWork) next.rightToWork = 'Choose an answer.'
    if (!v.qualifications.trim()) {
      next.qualifications = 'Tell us about your qualifications or equivalent experience.'
    }
    if (!v.experience.trim()) next.experience = 'Tell us about your relevant experience.'
    if (v.cvLink.trim() && !/^https?:\/\/\S+$/i.test(v.cvLink.trim())) {
      next.cvLink = 'Enter a full web address starting with http:// or https://, or leave this blank.'
    }
    if (!v.coveringNote.trim()) next.coveringNote = 'Tell us why you are interested in this role.'
    if (!v.consent) next.consent = 'Tick the box to confirm you have read how we use your information.'

    return next
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Double-submission guard: the ref is set synchronously, so a second submit
    // fired before React re-renders the disabled button is still rejected.
    if (submittingRef.current) return

    const found = validate(values)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      setStatus('idle')
      const firstInvalid = (Object.keys(found) as FieldName[])[0]
      const el = document.getElementById(firstInvalid)
      if (el) el.focus()
      return
    }

    submittingRef.current = true
    setErrors({})
    setStatus('submitting')

    const ref = reference || makeReference()
    if (!reference) setReference(ref)

    const body = new FormData()
    body.append('_subject', APPLICATION_SUBJECT)
    // Formspree's own server-side spam trap. The value is forwarded rather than
    // acted on here: a client-side short-circuit that reports success without
    // POSTing would silently bin a real application whose password manager or
    // form-filler extension had filled the hidden field.
    body.append('_gotcha', honeypot)
    body.append('reference', ref)
    body.append('role', `${vacancy.title}, ${vacancy.location}`)
    body.append('roleId', vacancy.identifier)
    body.append('fullName', values.fullName.trim())
    body.append('email', values.email.trim())
    body.append('phone', values.phone.trim())
    body.append('location', values.location.trim())
    body.append('rightToWork', values.rightToWork)
    body.append('qualifications', values.qualifications.trim())
    body.append('experience', values.experience.trim())
    body.append('cvLink', values.cvLink.trim())
    body.append('earliestStart', values.earliestStart.trim())
    body.append('hearAbout', values.hearAbout.trim())
    body.append('coveringNote', values.coveringNote.trim())
    body.append('adjustments', values.adjustments.trim())
    body.append('consent', values.consent ? 'yes' : 'no')

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      })

      if (response.ok) {
        setStatus('success')
        setValues(EMPTY)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      submittingRef.current = false
    }
  }

  // Move focus to the result region so the outcome is announced and reachable.
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      statusRef.current?.focus()
    }
  }, [status])

  const isSubmitting = status === 'submitting'
  const cvSubject = reference
    ? `${APPLICATION_SUBJECT}: CV ${reference}`
    : `${APPLICATION_SUBJECT}: CV`

  return (
    <div className="max-w-3xl mx-auto">
      <div
        ref={statusRef}
        tabIndex={-1}
        role="alert"
        className={status === 'success' || status === 'error' ? 'mb-8 scroll-mt-28' : 'sr-only'}
      >
        {status === 'success' && (
          <div className="bg-card border border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-semibold text-text mb-3">
              Thank you. Your application has been sent.
            </h3>
            <p className="text-text-muted leading-relaxed mb-4">
              Your application reference is{' '}
              <strong className="font-mono text-text">{reference}</strong>. Please keep it.
            </p>
            <p className="text-text-muted leading-relaxed mb-4">
              One thing is still outstanding: this form cannot carry attachments, so your CV has
              not come with it. Email your CV to us quoting the reference above and we will match
              it to what you have just sent.
            </p>
            {/* The address and the subject line are both printed as selectable text, not only
                encoded into a mailto: href. A browser with no mail handler registered — Chrome
                on a managed Windows or ChromeOS device — does nothing at all when a mailto is
                clicked, and the CV is the mandatory second half of the application. */}
            <dl className="mb-6 rounded-xl border border-border bg-bg-light p-4 text-sm">
              <dt className="font-semibold text-text">Send it to</dt>
              <dd className="mt-1 mb-3 font-mono text-text break-all">
                <ObfuscatedEmail
                  user={CAREERS_EMAIL_USER}
                  domain={CAREERS_EMAIL_DOMAIN}
                  subject={cvSubject}
                  label="careers address"
                  className="text-accent underline underline-offset-2"
                  showAddress
                />
              </dd>
              <dt className="font-semibold text-text">With this subject line</dt>
              <dd className="mt-1 font-mono text-text break-words">{cvSubject}</dd>
            </dl>
            <ObfuscatedEmail
              user={CAREERS_EMAIL_USER}
              domain={CAREERS_EMAIL_DOMAIN}
              subject={cvSubject}
              label={reference ? `Open an email with the subject filled in` : 'Email your CV'}
              className="btn btn-primary"
            />
          </div>
        )}

        {status === 'error' && (
          <div className="bg-card border border-red-600/40 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-semibold text-text mb-3">
              Sorry, your application could not be sent.
            </h3>
            <p className="text-text-muted leading-relaxed mb-4">
              Something went wrong on the way to us. Nothing you typed has been lost. Press
              &quot;Send application&quot; again to retry, or send your application and CV by email
              instead, which reaches exactly the same place.
            </p>
            <p className="mb-6 rounded-xl border border-border bg-bg-light p-4 text-sm text-text">
              <span className="font-semibold">Email us at</span>{' '}
              <span className="font-mono break-all">
                <ObfuscatedEmail
                  user={CAREERS_EMAIL_USER}
                  domain={CAREERS_EMAIL_DOMAIN}
                  subject={APPLICATION_SUBJECT}
                  label="careers address"
                  className="text-accent underline underline-offset-2"
                  showAddress
                />
              </span>
              {reference ? (
                <>
                  {' '}
                  <span className="font-semibold">quoting reference</span>{' '}
                  <span className="font-mono">{reference}</span>.
                </>
              ) : (
                '.'
              )}
            </p>
            <ObfuscatedEmail
              user={CAREERS_EMAIL_USER}
              domain={CAREERS_EMAIL_DOMAIN}
              subject={APPLICATION_SUBJECT}
              label="Email your application instead"
              className="btn btn-primary"
            />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-card border border-border rounded-2xl p-6 md:p-8"
      >
{/* Honeypot. `display:none` rather than `sr-only`: an sr-only input is a live,
            fillable control that a password manager's "fill every field" will happily
            populate. No <label>, aria-hidden, out of the tab order, and named so autofill
            heuristics have nothing to match. Its value is forwarded to Formspree, which
            decides; nothing here rejects a submission on its own. */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <input
            type="text"
            id="_gotcha"
            name="_gotcha"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="fullName" className={labelClass}>
              Your name <span aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={values.fullName}
              onChange={(e) => setValue('fullName', e.target.value)}
              required
              autoComplete="name"
              aria-invalid={errors.fullName ? true : undefined}
              aria-describedby={describedBy('fullName', false, Boolean(errors.fullName))}
              className={errors.fullName ? inputErrorClass : inputClass}
            />
            <FieldError id="fullName" message={errors.fullName} />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email address <span aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
              required
              autoComplete="email"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy('email', true, Boolean(errors.email))}
              className={errors.email ? inputErrorClass : inputClass}
            />
            <FieldHint id="email" hint="We reply to this address, so please check it." />
            <FieldError id="email" message={errors.email} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={values.phone}
              onChange={(e) => setValue('phone', e.target.value)}
              autoComplete="tel"
              aria-describedby={describedBy('phone', true, false)}
              className={inputClass}
            />
            <FieldHint id="phone" hint="Optional. Include the country code." />
          </div>

          <div>
            <label htmlFor="location" className={labelClass}>
              Where you are based <span aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={values.location}
              onChange={(e) => setValue('location', e.target.value)}
              required
              aria-invalid={errors.location ? true : undefined}
              aria-describedby={describedBy('location', true, Boolean(errors.location))}
              className={errors.location ? inputErrorClass : inputClass}
            />
            <FieldHint
              id="location"
              hint="The town or district you would be working from. This role is performed from Sri Lanka."
            />
            <FieldError id="location" message={errors.location} />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="rightToWork" className={labelClass}>
            Are you legally able to work in Sri Lanka? <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <select
            id="rightToWork"
            name="rightToWork"
            value={values.rightToWork}
            onChange={(e) => setValue('rightToWork', e.target.value)}
            required
            aria-invalid={errors.rightToWork ? true : undefined}
            aria-describedby={describedBy('rightToWork', true, Boolean(errors.rightToWork))}
            className={`${errors.rightToWork ? inputErrorClass : inputClass} appearance-none cursor-pointer`}
          >
            <option value="">Please choose</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="unsure">I am not sure</option>
          </select>
          <FieldHint
            id="rightToWork"
            hint="We ask about the right to work in the country the role is performed from, not about nationality."
          />
          <FieldError id="rightToWork" message={errors.rightToWork} />
        </div>

        <div className="mb-6">
          <label htmlFor="qualifications" className={labelClass}>
            Qualifications and studies <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <textarea
            id="qualifications"
            name="qualifications"
            rows={3}
            value={values.qualifications}
            onChange={(e) => setValue('qualifications', e.target.value)}
            required
            aria-invalid={errors.qualifications ? true : undefined}
            aria-describedby={describedBy('qualifications', true, Boolean(errors.qualifications))}
            className={`${errors.qualifications ? inputErrorClass : inputClass} resize-y`}
          />
          <FieldHint
            id="qualifications"
            hint="Accounting, business, finance or a related field, including anything you are part-qualified in or currently studying. Equivalent practical experience counts, so say so if that is your route."
          />
          <FieldError id="qualifications" message={errors.qualifications} />
        </div>

        <div className="mb-6">
          <label htmlFor="experience" className={labelClass}>
            Relevant experience <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <textarea
            id="experience"
            name="experience"
            rows={4}
            value={values.experience}
            onChange={(e) => setValue('experience', e.target.value)}
            required
            aria-invalid={errors.experience ? true : undefined}
            aria-describedby={describedBy('experience', true, Boolean(errors.experience))}
            className={`${errors.experience ? inputErrorClass : inputClass} resize-y`}
          />
          <FieldHint
            id="experience"
            hint="Bookkeeping, reconciliations, tax or VAT filings, HR or payroll administration, operations, research: whatever of this you have done, and where."
          />
          <FieldError id="experience" message={errors.experience} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="cvLink" className={labelClass}>
              Link to your CV or profile
            </label>
            <input
              type="url"
              id="cvLink"
              name="cvLink"
              inputMode="url"
              placeholder="https://"
              value={values.cvLink}
              onChange={(e) => setValue('cvLink', e.target.value)}
              aria-invalid={errors.cvLink ? true : undefined}
              aria-describedby={describedBy('cvLink', true, Boolean(errors.cvLink))}
              className={errors.cvLink ? inputErrorClass : inputClass}
            />
            <FieldHint
              id="cvLink"
              hint="Optional. This form cannot take attachments, so a link is the quickest route. Otherwise email the CV using the reference you get on the next step."
            />
            <FieldError id="cvLink" message={errors.cvLink} />
          </div>

          <div>
            <label htmlFor="earliestStart" className={labelClass}>
              Earliest you could start
            </label>
            <input
              type="text"
              id="earliestStart"
              name="earliestStart"
              value={values.earliestStart}
              onChange={(e) => setValue('earliestStart', e.target.value)}
              aria-describedby={describedBy('earliestStart', true, false)}
              className={inputClass}
            />
            <FieldHint id="earliestStart" hint="Optional. An approximate date or month is fine." />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="coveringNote" className={labelClass}>
            Why this role <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <textarea
            id="coveringNote"
            name="coveringNote"
            rows={5}
            value={values.coveringNote}
            onChange={(e) => setValue('coveringNote', e.target.value)}
            required
            aria-invalid={errors.coveringNote ? true : undefined}
            aria-describedby={describedBy('coveringNote', true, Boolean(errors.coveringNote))}
            className={`${errors.coveringNote ? inputErrorClass : inputClass} resize-y`}
          />
          <FieldHint
            id="coveringNote"
            hint="Your covering note. What draws you to a broad role like this one, and what you would want to get out of it."
          />
          <FieldError id="coveringNote" message={errors.coveringNote} />
        </div>

        {/* Selection process only. Equality Act 2010 s.60 prohibits asking about health or
            disability before work is offered, so this asks what the candidate needs from the
            process and nothing about them. Optional, and never a filter. */}
        <div className="mb-6">
          <label htmlFor="adjustments" className={labelClass}>
            Do you need any adjustment to take part in our selection process?
          </label>
          <textarea
            id="adjustments"
            name="adjustments"
            rows={3}
            value={values.adjustments}
            onChange={(e) => setValue('adjustments', e.target.value)}
            aria-describedby={describedBy('adjustments', true, false)}
            className={`${inputClass} resize-y`}
          />
          <FieldHint
            id="adjustments"
            hint="Optional. Captions or a written alternative to a video call, extra time, a different format: tell us what would help and we will arrange it. This has no bearing on how your application is assessed."
          />
        </div>

        <div className="mb-8">
          <label htmlFor="hearAbout" className={labelClass}>
            How you heard about this role
          </label>
          <input
            type="text"
            id="hearAbout"
            name="hearAbout"
            value={values.hearAbout}
            onChange={(e) => setValue('hearAbout', e.target.value)}
            aria-describedby={describedBy('hearAbout', true, false)}
            className={inputClass}
          />
          <FieldHint id="hearAbout" hint="Optional." />
        </div>

        <div className="mb-8 rounded-xl border border-border bg-bg-light p-5">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={values.consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={describedBy('consent', true, Boolean(errors.consent))}
              className="mt-1 h-5 w-5 shrink-0 accent-accent cursor-pointer"
            />
            <label htmlFor="consent" className="text-text text-sm leading-relaxed cursor-pointer">
              I have read how my information will be used.{' '}
              <span aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
          </div>
          {/* Deliberately an acknowledgement, NOT consent. The lawful basis for handling a job
              application is Art. 6(1)(b) — steps taken at the applicant's request before
              entering a contract — and making consent the basis while also making it a
              condition of applying would be invalid under Art. 7(4) and would give a live
              right of withdrawal mid-shortlist. */}
          <p id="consent-hint" className="mt-3 text-sm text-text-muted leading-relaxed">
            <strong className="font-semibold text-text">How we use your information.</strong>{' '}
            {ORGANIZATION.legalName} (company no. {ORGANIZATION.companyNumber}) is the controller
            of the information you submit here. We use it only to assess your application for this
            role, on the basis that doing so is necessary to take steps at your request before
            entering into a contract, not on the basis of your consent, so you are not asked to
            give any. Your submission is delivered to us by our form provider, Formspree, which is
            based in the United States, and by email, so your information is transferred outside
            the UK under appropriate safeguards. We keep applications for six months after the
            vacancy closes and then delete them. You can ask us for a copy of your information, or
            ask us to correct or delete it, at any time by emailing{' '}
            <ObfuscatedEmail
              user={CAREERS_EMAIL_USER}
              domain={CAREERS_EMAIL_DOMAIN}
              subject="Data protection request: job application"
              label="our careers address"
              className="text-accent underline underline-offset-2"
              showAddress
            />
            , and you can complain to the UK Information Commissioner&apos;s Office at ico.org.uk.
            Full details are in our{' '}
            <Link href="/privacy-policy" className="text-accent underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
          <FieldError id="consent" message={errors.consent} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            className="inline-flex items-center justify-center px-8 py-3 bg-accent-dark text-white font-semibold rounded-lg transition duration-200 hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending your application…
              </>
            ) : (
              'Send application'
            )}
          </button>

          <p className="text-sm text-text-muted leading-relaxed">
            Prefer email? Send your CV and a short covering note to our careers address instead:{' '}
            <ObfuscatedEmail
              user={CAREERS_EMAIL_USER}
              domain={CAREERS_EMAIL_DOMAIN}
              subject={APPLICATION_SUBJECT}
              label="write to us directly"
              className="text-accent underline underline-offset-2"
            />
            .
          </p>
        </div>
      </form>
    </div>
  )
}
