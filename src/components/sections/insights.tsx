import Link from 'next/link'
import Image from 'next/image'
import { blogPosts } from '@/lib/blog-posts'

const insightPosts = blogPosts.slice(0, 4)

export default function InsightsSection() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {insightPosts.map((post) => (
            <Link key={post.slug} href={post.href} className="block group">
              <article className="card overflow-hidden h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer p-0">
                <div className="relative aspect-[40/21] w-full overflow-hidden bg-bg-light">
                  <Image
                    src={post.cardImage}
                    alt={post.imageAlt}
                    width={800}
                    height={420}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 text-accent px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex gap-4 mb-4 text-sm text-text-muted">
                    <time dateTime={post.publishedTime.split('T')[0]}>{post.date}</time>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-text leading-tight group-hover:text-accent transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-text-muted mb-6 leading-relaxed text-[0.9375rem]">{post.excerpt}</p>
                  <div className="inline-flex items-center gap-2 text-accent font-medium group-hover:gap-3 transition-all duration-200">
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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
