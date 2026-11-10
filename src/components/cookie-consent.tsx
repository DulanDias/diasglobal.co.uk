'use client'

import { useState, useEffect } from 'react'
import { X, Cookie, Settings, Shield, BarChart3 } from 'lucide-react'
import {
  ALL_ACCEPTED,
  NECESSARY_ONLY,
  OPEN_COOKIE_SETTINGS_EVENT,
  applyConsent,
  readStoredConsent,
  storeConsent,
  type CookiePreferences,
} from '@/lib/analytics'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(NECESSARY_ONLY)

  useEffect(() => {
    const stored = readStoredConsent()
    let timer: ReturnType<typeof setTimeout> | undefined
    if (stored) {
      // Returning visitor: honour their earlier choice without asking again.
      setPreferences(stored)
      applyConsent(stored)
    } else {
      // No choice yet: analytics stays off. Show the popup after a short delay.
      timer = setTimeout(() => setIsVisible(true), 2000)
    }

    // The footer's "Cookie Settings" link reopens the settings so consent can
    // be withdrawn as easily as it was given.
    const openSettings = () => {
      setPreferences(readStoredConsent() ?? NECESSARY_ONLY)
      setShowPreferences(true)
      setIsVisible(true)
    }
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings)

    return () => {
      if (timer) clearTimeout(timer)
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings)
    }
  }, [])

  const commit = (prefs: CookiePreferences) => {
    storeConsent(prefs)
    setPreferences(prefs)
    applyConsent(prefs)
    setIsVisible(false)
    setShowPreferences(false)
  }

  const acceptAll = () => commit(ALL_ACCEPTED)
  const acceptNecessary = () => commit(NECESSARY_ONLY)
  const savePreferences = () => commit(preferences)

  const togglePreference = (type: keyof CookiePreferences) => {
    if (type === 'necessary') return // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Cookie Popup */}
      <div className="relative w-full max-w-2xl bg-bg border border-border rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <Cookie className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text">Cookie Preferences</h2>
              <p className="text-sm text-text-muted">We use cookies to enhance your experience</p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-text-muted hover:text-text transition-colors duration-200"
            aria-label="Close cookie popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!showPreferences ? (
          /* Main Cookie Notice */
          <div className="space-y-6">
            <div className="prose prose-sm max-w-none text-text-muted">
              <p>
                We use cookies to improve your browsing experience, serve personalized content, 
                and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
              </p>
              <p>
                <strong>Necessary cookies</strong> are required for the website to function properly. <strong>Analytics cookies</strong> help us understand how visitors interact with our website. <strong>Marketing cookies</strong> are used to track visitors across websites for advertising purposes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptAll}
                className="flex-1 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Accept All
              </button>
              <button
                onClick={acceptNecessary}
                className="flex-1 bg-bg-light hover:bg-bg-card text-text px-6 py-3 rounded-lg font-medium border border-border transition-colors duration-200"
              >
                Necessary Only
              </button>
              <button
                onClick={() => setShowPreferences(true)}
                className="flex-1 bg-transparent hover:bg-bg-light text-text px-6 py-3 rounded-lg font-medium border border-border transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Customize
              </button>
            </div>
          </div>
        ) : (
          /* Cookie Preferences */
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setShowPreferences(false)}
                className="text-accent hover:text-accent-dark transition-colors duration-200"
              >
                ← Back
              </button>
              <h3 className="text-lg font-semibold text-text">Cookie Settings</h3>
            </div>

            <div className="space-y-6">
              {/* Necessary Cookies */}
              <div className="flex items-center justify-between p-4 bg-bg-light rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-accent" />
                  <div>
                    <h4 className="font-medium text-text">Necessary Cookies</h4>
                    <p className="text-sm text-text-muted">Required for the website to function properly</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">Always Active</span>
                  <div className="w-12 h-6 bg-accent rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between p-4 bg-bg-light rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  <div>
                    <h4 className="font-medium text-text">Analytics Cookies</h4>
                    <p className="text-sm text-text-muted">Help us understand how visitors use our website</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePreference('analytics')}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ${
                    preferences.analytics ? 'bg-accent justify-end' : 'bg-border justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full mx-1" />
                </button>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between p-4 bg-bg-light rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Cookie className="w-5 h-5 text-accent" />
                  <div>
                    <h4 className="font-medium text-text">Marketing Cookies</h4>
                    <p className="text-sm text-text-muted">Used to track visitors for advertising purposes</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePreference('marketing')}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ${
                    preferences.marketing ? 'bg-accent justify-end' : 'bg-border justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full mx-1" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              <button
                onClick={savePreferences}
                className="flex-1 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Save Preferences
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 bg-bg-light hover:bg-bg-card text-text px-6 py-3 rounded-lg font-medium border border-border transition-colors duration-200"
              >
                Accept All
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-text-muted text-center">
            For more information, please read our{' '}
            <a href="/privacy-policy" className="text-accent hover:text-accent-dark transition-colors duration-200">
              Privacy Policy
            </a>
            {' '}and{' '}
            <a href="/terms-of-use" className="text-accent hover:text-accent-dark transition-colors duration-200">
              Terms of Use
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
