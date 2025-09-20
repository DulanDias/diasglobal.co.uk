import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Breadcrumb from '@/components/breadcrumb'

export const metadata: Metadata = {
  title: 'Investment Blog & Insights | Dias Global Limited | Real Estate, Technology & Entrepreneurship',
  description: 'Expert insights on investment strategies, technology trends, and entrepreneurial ventures. Discover thought leadership content from Dias Global Limited on real estate investment, AI trends, and building successful business ecosystems.',
  keywords: [
    'investment blog',
    'real estate investment',
    'technology investment',
    'entrepreneurial ventures',
    'investment insights',
    'business strategy',
    'AI investment trends',
    'UK investment blog'
  ],
  openGraph: {
    title: 'Investment Blog & Insights | Dias Global Limited',
    description: 'Expert insights on investment strategies, technology trends, and entrepreneurial ventures from Dias Global Limited.',
    images: ['/logo.png'],
  },
}

const blogPosts = [
  {
    title: 'The Future of AI Investment: Trends to Watch in 2025',
    excerpt: 'As artificial intelligence continues to reshape industries, we explore the key investment opportunities and emerging trends that will define the AI landscape in 2025 and beyond.',
    category: 'Technology',
    date: 'August 31, 2025',
    readTime: '5 min read',
    href: '/blog/ai-investment-trends-2024',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
        <path d="M21 9V7C21 5.9 20.1 5 19 5H17.8C17.4 3.8 16.3 3 15 3H13C11.7 3 10.6 3.8 10.2 5H9C7.9 5 7 5.9 7 7V9C5.9 9 5 9.9 5 11V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V11C19 9.9 18.1 9 17 9H21Z"/>
        <path d="M12 12C13.1 12 14 12.9 14 14C14 15.1 13.1 16 12 16C10.9 16 10 15.1 10 14C10 12.9 10.9 12 12 12Z"/>
        <path d="M8 14C8 13.4 8.4 13 9 13H15C15.6 13 16 13.4 16 14V17C16 17.6 15.6 18 15 18H9C8.4 18 8 17.6 8 17V14Z"/>
      </svg>
    ),
    tags: ['AI', 'Investment', 'Technology']
  },
  {
    title: 'Strategic Real Estate Investment: The Renovation-to-Rental Model',
    excerpt: 'Discover Dias Global\'s innovative approach to real estate investment: purchasing undervalued properties, executing strategic renovations, and creating sustainable rental income streams.',
    category: 'Real Estate Investment',
    date: 'August 31, 2025',
    readTime: '8 min read',
    href: '/blog/real-estate-investment-strategy-2025',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
    tags: ['Real Estate', 'Investment', 'Renovation']
  },
  {
    title: 'Real Estate Innovation: How Technology is Disrupting Traditional Markets',
    excerpt: 'From proptech startups to sustainable development, discover how innovation is transforming the real estate sector and creating new investment opportunities.',
    category: 'Real Estate',
    date: 'August 31, 2025',
    readTime: '7 min read',
    href: '/blog/real-estate-innovation-disruption',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16">
        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
        <path d="M19 15L19.74 17.74L22.5 18.5L19.74 19.26L19 22L18.26 19.26L15.5 18.5L18.26 17.74L19 15Z"/>
        <path d="M5 15L5.74 17.74L8.5 18.5L5.74 19.26L5 22L4.26 19.26L1.5 18.5L4.26 17.74L5 15Z"/>
      </svg>
    ),
    tags: ['Real Estate', 'Proptech', 'Innovation']
  },
  {
    title: 'Building Entrepreneurial Ecosystems: The Foundation of Innovation',
    excerpt: 'Discover how Dias Global is creating and nurturing entrepreneurial ecosystems through strategic investments, mentorship programs, and collaborative partnerships.',
    category: 'Entrepreneurship',
    date: 'August 31, 2025',
    readTime: '6 min read',
    href: '/blog/building-entrepreneurial-ecosystem',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16">
        <circle cx="12" cy="12" r="3"/>
        <circle cx="6" cy="6" r="2"/>
        <circle cx="18" cy="6" r="2"/>
        <circle cx="6" cy="18" r="2"/>
        <circle cx="18" cy="18" r="2"/>
        <path d="M8 8L16 16" strokeWidth="2"/>
        <path d="M16 8L8 16" strokeWidth="2"/>
      </svg>
    ),
    tags: ['Entrepreneurship', 'Ecosystem', 'Innovation']
  }
]

export default function BlogPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog' }
  ]

  return (
    <>
      <Header />
      <main>
        {/* Blog Header */}
        <header className="bg-bg-light py-24">
          <div className="container">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-text to-accent bg-clip-text text-transparent">
                  Dias Global Blog
                </span>
              </h1>
              <p className="text-xl text-text-muted max-w-2xl mx-auto">
                Insights and perspectives on investment, technology, and entrepreneurial ventures
              </p>
            </div>
          </div>
        </header>

        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Blog Content */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <article key={index} className="card overflow-hidden group">
                  <div className="h-48 bg-gradient-to-br from-accent to-accent-dark relative flex items-center justify-center">
                    <div className="text-white">
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
                    <h2 className="text-xl font-semibold mb-4 text-text leading-tight">
                      <Link href={post.href} className="hover:text-accent transition-colors duration-200">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-text-muted mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="bg-blue-100 text-accent px-2 py-1 rounded text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link 
                      href={post.href} 
                      className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-200"
                    >
                      Read More
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
