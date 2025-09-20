export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-bg">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">About Us</span>
          <h2 className="section-title">A Family Global Holding Company</h2>
          <p className="section-subtitle">
            We deploy patient capital with rigorous operational discipline and a long-term 
            owner's mindset to build enduring value across multiple sectors.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-5xl mb-6">🌍</div>
            <h3 className="text-2xl font-semibold mb-4 text-text">Global Perspective</h3>
            <p className="text-text-muted leading-relaxed">
              London-based with a truly global outlook, we identify opportunities across markets and geographies.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-5xl mb-6">🎯</div>
            <h3 className="text-2xl font-semibold mb-4 text-text">Selective Approach</h3>
            <p className="text-text-muted leading-relaxed">
              We focus on quality over quantity, investing only in ventures that align with our long-term vision.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-5xl mb-6">⚡</div>
            <h3 className="text-2xl font-semibold mb-4 text-text">Operational Excellence</h3>
            <p className="text-text-muted leading-relaxed">
              Beyond capital, we provide strategic guidance and operational support to maximize value creation.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
