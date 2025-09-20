'use client'

import { useState } from 'react'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    interestType: '',
    investmentSector: '',
    investmentCapacity: '',
    partnershipArea: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('https://formspree.io/f/xzzvkqpa', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: new FormData(e.target as HTMLFormElement)
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          company: '',
          interestType: '',
          investmentSector: '',
          investmentCapacity: '',
          partnershipArea: '',
          message: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const showInvestmentFields = formData.interestType === 'investment'
  const showPartnershipFields = formData.interestType === 'partnership' || formData.interestType === 'consultation'

  return (
    <section id="contact" className="py-24 bg-bg">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Get In Touch</span>
          <h2 className="section-title">Start a Conversation</h2>
          <p className="section-subtitle">
            Whether you're an entrepreneur with a vision, a technology innovator, 
            or a real estate professional, we'd love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-8">
          {/* Form header */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-text mb-2">Get in Touch</h3>
            <p className="text-text-muted">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-group">
              <label htmlFor="name" className="block font-semibold mb-2 text-text text-sm uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-bg-light border border-border rounded-lg text-text font-sans text-base transition-colors duration-200 focus:outline-none focus:border-accent"
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="block font-semibold mb-2 text-text text-sm uppercase tracking-wider">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-bg-light border border-border rounded-lg text-text font-sans text-base transition-colors duration-200 focus:outline-none focus:border-accent"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-group">
              <label htmlFor="company" className="block font-semibold mb-2 text-text text-sm uppercase tracking-wider">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-bg-light border border-border rounded-lg text-text font-sans text-base transition-colors duration-200 focus:outline-none focus:border-accent"
                placeholder="Your company name (optional)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="interestType" className="block font-semibold mb-2 text-text text-sm uppercase tracking-wider">
                Interest Type *
              </label>
              <select
                id="interestType"
                name="interestType"
                value={formData.interestType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-bg-light border border-border rounded-lg text-text font-sans text-base transition-colors duration-200 focus:outline-none focus:border-accent appearance-none cursor-pointer"
              >
                <option value="">Select your primary interest</option>
                <option value="investment">Investment Opportunities</option>
                <option value="partnership">Partnership/Strategic Alliance</option>
                <option value="consultation">Consultation/Advisory</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>
          </div>

          {/* Investment-specific fields */}
          {showInvestmentFields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="form-group">
                <label htmlFor="investmentSector" className="block font-semibold mb-2 text-text text-sm uppercase tracking-wider">
                  Investment Sector
                </label>
                <select
                  id="investmentSector"
                  name="investmentSector"
                  value={formData.investmentSector}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-bg-light border border-border rounded-lg text-text font-sans text-base transition-colors duration-200 focus:outline-none focus:border-accent appearance-none cursor-pointer"
                >
                  <option value="">Select preferred sector</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="technology">Technology & Innovation</option>
                  <option value="startups">Startups & Early Stage</option>
                  <option value="mixed">Mixed Portfolio</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="investmentCapacity" className="block font-semibold mb-2 text-text text-sm uppercase tracking-wider">
                  Investment Capacity
                </label>
                <select
                  id="investmentCapacity"
                  name="investmentCapacity"
                  value={formData.investmentCapacity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-bg-light border border-border rounded-lg text-text font-sans text-base transition-colors duration-200 focus:outline-none focus:border-accent appearance-none cursor-pointer"
                >
                  <option value="">Select investment range</option>
                  <option value="5000-10000">£5,000 - £10,000</option>
                  <option value="10000-25000">£10,000 - £25,000</option>
                  <option value="25000-75000">£25,000 - £75,000</option>
                  <option value="75000-200000">£75,000 - £200,000</option>
                  <option value="200000+">£200,000+</option>
                </select>
              </div>
            </div>
          )}

          {/* Partnership/Consultation fields */}
          {showPartnershipFields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="form-group">
                <label htmlFor="partnershipArea" className="block font-semibold mb-2 text-text text-sm uppercase tracking-wider">
                  Area of Interest
                </label>
                <select
                  id="partnershipArea"
                  name="partnershipArea"
                  value={formData.partnershipArea}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-bg-light border border-border rounded-lg text-text font-sans text-base transition-colors duration-200 focus:outline-none focus:border-accent appearance-none cursor-pointer"
                >
                  <option value="">Select area of interest</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="technology">Technology & Innovation</option>
                  <option value="entrepreneurship">Entrepreneurial Ventures</option>
                  <option value="general">General Business</option>
                </select>
              </div>
            </div>
          )}

          <div className="form-group mb-8">
            <label htmlFor="message" className="block font-semibold mb-2 text-text text-sm uppercase tracking-wider">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              required
              placeholder="Tell us about your interests, investment experience, or any questions..."
              className="w-full px-4 py-3 bg-bg-light border border-border rounded-lg text-text font-sans text-base transition-colors duration-200 focus:outline-none focus:border-accent resize-y"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-8 py-3 bg-accent text-white font-semibold rounded-lg transition-colors duration-200 hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
            
            {submitStatus === 'success' && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-500 text-sm font-medium">Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-500 text-sm font-medium">There was an error sending your message. Please try again.</p>
              </div>
            )}
            
            <p className="mt-6 text-text-muted text-sm text-center leading-relaxed">
              By submitting this form, you may receive updates about investment opportunities. 
              We respect your privacy and will never share your information.
            </p>
          </div>
        </form>

        <div className="text-center mt-12 max-w-lg mx-auto">
          <h3 className="text-lg font-medium text-text-muted mb-4 uppercase tracking-wider">
            Or alternatively, write to us.
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            <strong>Dias Global Limited</strong><br />
            Company No. 16594865<br />
            71–75 Shelton Street, Covent Garden<br />
            London WC2H 9JQ, United Kingdom
          </p>
        </div>
      </div>
    </section>
  )
}
