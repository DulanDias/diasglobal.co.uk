import Image from 'next/image'
import type { BlogPost } from '@/lib/blog-posts'
import { CARD_IMAGE_SIZE } from '@/lib/blog-posts'

export default function BlogArticleHeroImage({ post }: { post: BlogPost }) {
  return (
    <figure className="mb-10 -mx-4 md:mx-0 rounded-2xl overflow-hidden shadow-md border border-border bg-bg-light">
      <Image
        src={post.cardImage}
        alt={post.imageAlt}
        width={CARD_IMAGE_SIZE.width}
        height={CARD_IMAGE_SIZE.height}
        className="w-full h-auto object-cover aspect-[40/21]"
        priority
        sizes="(max-width: 896px) 100vw, 896px"
      />
    </figure>
  )
}
