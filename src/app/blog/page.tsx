import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Breadcrumb from '@/components/breadcrumb'
import { blogPosts, blogIndexMetadata } from '@/lib/blog-posts'
import { BlogCollectionSchema } from '@/components/seo/schema-markup'

export const metadata: Metadata = blogIndexMetadata()

export default function BlogPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog' },
  ]

  return (
    <>
      <BlogCollectionSchema posts={blogPosts} />
      <Header />
      <main>
        <header className="bg-bg-light py-24">
          <div className="container">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-text">
                Dias Global Blog
              </h1>
              <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
                Insights and perspectives on investment, technology, and entrepreneurial ventures
              </p>
            </div>
          </div>
        </header>

        <Breadcrumb items={breadcrumbItems} />

        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article key={post.slug} className="card overflow-hidden group p-0">
                  <Link href={post.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-2xl">
                    <div className="relative aspect-[40/21] w-full overflow-hidden bg-bg-light">
                      <Image
                        src={post.cardImage}
                        alt={post.imageAlt}
                        width={800}
                        height={420}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/95 text-accent px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex gap-4 mb-4 text-sm text-text-muted">
                        <time dateTime={post.publishedTime.split('T')[0]}>{post.date}</time>
                        <span>{post.readTime}</span>
                      </div>
                      <h2 className="text-xl font-semibold mb-4 text-text leading-tight group-hover:text-accent transition-colors duration-200">
                        {post.title}
                      </h2>
                      <p className="text-text-muted mb-6 leading-relaxed text-[0.9375rem]">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-stone-100 text-text-muted px-2 py-1 rounded text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-2 text-accent font-medium group-hover:gap-3 transition-all duration-200">
                        Read More
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
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
