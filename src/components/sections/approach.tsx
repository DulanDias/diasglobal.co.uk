export default function ApproachSection() {
  return (
    <section id="approach" className="py-24 bg-bg">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Our Approach</span>
          <h2 className="section-title">Patient Capital, Long-term Vision</h2>
          <p className="section-subtitle">
            We believe in the power of patient capital and strategic partnerships to create 
            sustainable, long-term value for all stakeholders.
          </p>
        </div>
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-12">
            <div className="flex items-start gap-8 opacity-0 translate-x-[-30px] animate-slide-in-left">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center flex-shrink-0 relative z-10 shadow-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-white">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3 text-text">Discovery & Due Diligence</h3>
                <p className="text-text-muted leading-relaxed">
                  Comprehensive analysis of opportunities, market dynamics, and growth potential.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-8 opacity-0 translate-x-[-30px] animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center flex-shrink-0 relative z-10 shadow-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-white">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3 text-text">Strategic Investment</h3>
                <p className="text-text-muted leading-relaxed">
                  Patient capital deployment with clear value creation strategies and milestones.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-8 opacity-0 translate-x-[-30px] animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center flex-shrink-0 relative z-10 shadow-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-white">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3 text-text">Operational Support</h3>
                <p className="text-text-muted leading-relaxed">
                  Active partnership providing strategic guidance, operational expertise, and network access.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-8 opacity-0 translate-x-[-30px] animate-slide-in-left" style={{ animationDelay: '0.6s' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center flex-shrink-0 relative z-10 shadow-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-white">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3 text-text">Value Realization</h3>
                <p className="text-text-muted leading-relaxed">
                  Long-term value creation through sustainable growth and strategic exits when appropriate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
