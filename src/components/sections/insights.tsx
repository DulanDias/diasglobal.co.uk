import Link from 'next/link'

export default function InsightsSection() {
  const blogPosts = [
    {
      title: 'Strategic Real Estate Investment: The Renovation-to-Rental Model',
      excerpt: 'Discover Dias Global\'s innovative approach to real estate investment: purchasing undervalued properties, executing strategic renovations, and creating sustainable rental income streams.',
      category: 'Real Estate Investment',
      date: 'August 31, 2025',
      readTime: '8 min read',
      href: '/blog/real-estate-investment-strategy-2025',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      )
    },
    {
      title: 'The Future of AI Investment: Trends to Watch in 2025',
      excerpt: 'Explore the key AI investment opportunities and emerging trends that will define the artificial intelligence landscape in 2025 and beyond.',
      category: 'Technology',
      date: 'August 31, 2025',
      readTime: '5 min read',
      href: '/blog/ai-investment-trends-2024',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
          <path d="M21 9V7C21 5.9 20.1 5 19 5H17.8C17.4 3.8 16.3 3 15 3H13C11.7 3 10.6 3.8 10.2 5H9C7.9 5 7 5.9 7 7V9C5.9 9 5 9.9 5 11V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V11C19 9.9 18.1 9 17 9H21Z"/>
          <path d="M12 12C13.1 12 14 12.9 14 14C14 15.1 13.1 16 12 16C10.9 16 10 15.1 10 14C10 12.9 10.9 12 12 12Z"/>
          <path d="M8 14C8 13.4 8.4 13 9 13H15C15.6 13 16 13.4 16 14V17C16 17.6 15.6 18 15 18H9C8.4 18 8 17.6 8 17V14Z"/>
        </svg>
      )
    },
    {
      title: 'Building Entrepreneurial Ecosystems: The Foundation of Innovation',
      excerpt: 'Discover how Dias Global is creating and nurturing entrepreneurial ecosystems through strategic investments, mentorship programs, and collaborative partnerships.',
      category: 'Entrepreneurship',
      date: 'August 31, 2025',
      readTime: '6 min read',
      href: '/blog/building-entrepreneurial-ecosystem',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
          <circle cx="12" cy="12" r="3"/>
          <circle cx="6" cy="6" r="2"/>
          <circle cx="18" cy="6" r="2"/>
          <circle cx="6" cy="18" r="2"/>
          <circle cx="18" cy="18" r="2"/>
          <path d="M8 8L16 16" strokeWidth="2"/>
          <path d="M16 8L8 16" strokeWidth="2"/>
        </svg>
      )
    }
  ]

  return (
    <section id="insights" className="py-24 bg-bg-light">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Latest Insights</span>
          <h2 className="section-title">Thought Leadership</h2>
          <p className="section-subtitle">
            Explore our latest insights on investment trends, technology innovation, and market opportunities.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Link key={index} href={post.href} className="block group">
              <article className="card overflow-hidden h-full transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-accent to-accent-dark relative flex items-center justify-center group-hover:from-accent-dark group-hover:to-accent transition-all duration-300">
                  <div className="text-white text-4xl group-hover:scale-110 transition-transform duration-300">
                    {post.icon}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-accent px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex gap-4 mb-4 text-sm text-text-muted">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-text leading-tight group-hover:text-accent transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-text-muted mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="inline-flex items-center gap-2 text-accent font-medium group-hover:gap-3 transition-all duration-200">
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
