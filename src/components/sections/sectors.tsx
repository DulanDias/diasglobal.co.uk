export default function SectorsSection() {
  return (
    <section id="sectors" className="py-24 bg-bg-light">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Investment Sectors</span>
          <h2 className="section-title">Where We Invest</h2>
          <p className="section-subtitle">
            Our diversified portfolio spans three core sectors, each carefully selected 
            for long-term growth potential and value creation.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-dark transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl flex items-center justify-center border border-accent/20 group-hover:border-accent/40 transition-all duration-300 group-hover:scale-105">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-accent">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-text">Real Estate</h3>
            <p className="text-text-muted mb-6 leading-relaxed">
              Strategic investments in prime real estate assets across residential, commercial, and hospitality sectors.
            </p>
            <ul className="space-y-2">
              <li className="text-text-muted flex items-center">
                <span className="text-accent mr-3">→</span>
                Prime location acquisitions
              </li>
              <li className="text-text-muted flex items-center">
                <span className="text-accent mr-3">→</span>
                Value-add development
              </li>
              <li className="text-text-muted flex items-center">
                <span className="text-accent mr-3">→</span>
                Hospitality management
              </li>
              <li className="text-text-muted flex items-center">
                <span className="text-accent mr-3">→</span>
                Portfolio optimization
              </li>
            </ul>
          </div>
          
          <div className="card relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-dark transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl flex items-center justify-center border border-accent/20 group-hover:border-accent/40 transition-all duration-300 group-hover:scale-105">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-accent">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-text">Technology & Innovation</h3>
            <p className="text-text-muted mb-6 leading-relaxed">
              Cutting-edge technology investments and R&D initiatives focused on breakthrough innovations.
            </p>
            <ul className="space-y-2">
              <li className="text-text-muted flex items-center">
                <span className="text-accent mr-3">→</span>
                Applied research & development
              </li>
              <li className="text-text-muted flex items-center">
                <span className="text-accent mr-3">→</span>
                Product incubation
              </li>
              <li className="text-text-muted flex items-center">
                <span className="text-accent mr-3">→</span>
                Strategic partnerships
              </li>
              <li className="text-text-muted flex items-center">
                <span className="text-accent mr-3">→</span>
                Emerging tech focus
              </li>
            </ul>
          </div>
          
          <div className="card relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-dark transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl flex items-center justify-center border border-accent/20 group-hover:border-accent/40 transition-all duration-300 group-hover:scale-105">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-accent">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-text">Entrepreneurial Ventures</h3>
            <p className="text-text-muted mb-6 leading-relaxed">
              Angel investing and venture support for promising entrepreneurs, startups, and early-stage businesses.
            </p>
            <ul className="space-y-2">
              <li className="text-text-muted flex items-center">
                <span className="text-accent mr-3">→</span>
                Angel investment capital
              </li>
              <li className="text-text-muted flex items-center">
                <span className="text-accent mr-3">→</span>
                Startup mentorship
              </li>
              <li className="text-text-muted flex items-center">
                <span className="text-accent mr-3">→</span>
                Business development
              </li>
              <li className="text-text-muted flex items-center">
                <span className="text-accent mr-3">→</span>
                Growth acceleration
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
