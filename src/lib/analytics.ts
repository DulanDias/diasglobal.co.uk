/**
 * Google Analytics 4, loaded only with the visitor's consent.
 *
 * Nothing Google-related is in the static HTML. gtag.js is injected the first
 * time analytics consent is present, either from the cookie banner or from a
 * choice stored on an earlier visit. A visitor who never accepts analytics makes
 * no request to Google and gets no _ga cookies (UK PECR needs consent first).
 * Consent Mode v2 signals are still sent, so GA records the consent state.
 *
 * Withdrawing consent disables the tag for the rest of the page view and
 * deletes the GA cookies it had set.
 */

export const GA_MEASUREMENT_ID = 'G-FH5W6ETZKR' as const

const CONSENT_STORAGE_KEY = 'cookie-consent'

/** Dispatched on window to reopen the cookie banner, e.g. from the footer link. */
export const OPEN_COOKIE_SETTINGS_EVENT = 'dgl:open-cookie-settings'

export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export const NECESSARY_ONLY: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
}

export const ALL_ACCEPTED: CookiePreferences = {
  necessary: true,
  analytics: true,
  marketing: true,
}

type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
    // GA4 stops sending hits while window['ga-disable-<measurement id>'] is true.
    [key: `ga-disable-${string}`]: boolean | undefined
  }
}

const GA_DISABLE_KEY = `ga-disable-${GA_MEASUREMENT_ID}` as const

let gtagRequested = false

/** The visitor's stored choice, or null if they have not made one (or storage is blocked). */
export function readStoredConsent(): CookiePreferences | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const record = parsed as Record<string, unknown>
    return {
      necessary: true,
      analytics: record.analytics === true,
      marketing: record.marketing === true,
    }
  } catch {
    return null
  }
}

export function storeConsent(prefs: CookiePreferences): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // Storage blocked (private mode, site data disabled): the choice still
    // applies to this page view; the banner will ask again next time.
  }
}

function getGtag(): Gtag {
  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    window.gtag = function gtag() {
      // gtag.js expects the Arguments object itself, not an array copy.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
  }
  return window.gtag
}

function consentState(prefs: CookiePreferences) {
  const ads = prefs.marketing ? 'granted' : 'denied'
  return {
    analytics_storage: prefs.analytics ? 'granted' : 'denied',
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  }
}

/** Delete GA cookies on the current host and every parent domain GA may have used. */
function clearAnalyticsCookies(): void {
  const names = document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((n) => n === '_ga' || n.startsWith('_ga_') || n === '_gid' || n.startsWith('_gat'))
  if (names.length === 0) return

  const labels = window.location.hostname.split('.')
  const domains = ['']
  for (let i = 0; i < labels.length - 1; i++) {
    domains.push(`; domain=.${labels.slice(i).join('.')}`)
  }
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}`
    }
  }
}

/** Make the page match the visitor's choice. Safe to call repeatedly. */
export function applyConsent(prefs: CookiePreferences): void {
  if (typeof window === 'undefined') return

  if (!prefs.analytics) {
    window[GA_DISABLE_KEY] = true
    window.gtag?.('consent', 'update', consentState(prefs))
    clearAnalyticsCookies()
    return
  }

  window[GA_DISABLE_KEY] = false
  const gtag = getGtag()
  gtag('consent', 'update', consentState(prefs))

  if (!gtagRequested) {
    gtagRequested = true
    gtag('js', new Date())
    gtag('config', GA_MEASUREMENT_ID)
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)
  }
}
