import type { Post } from '@/types'

interface PostCardProps {
  post: Post
  onOpen?: () => void
}

export default function PostCard({ post, onOpen }: PostCardProps) {
  const { title, excerpt, category, published_at } = post

  const formattedDate = published_at
    ? new Date(published_at).toLocaleDateString('zh-CN', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : ''

  return (
    <button onClick={onOpen} className="group block w-full text-left cursor-pointer">
      <article className="py-6 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          {formattedDate && <time className="text-xs text-muted-foreground">{formattedDate}</time>}
          {category && (
            <>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <span className="text-xs text-muted-foreground">{category}</span>
            </>
          )}
        </div>
        <h2 className="font-serif text-base font-semibold text-foreground leading-snug mb-2 group-hover:opacity-60 transition-opacity">
          {title}
        </h2>
        {excerpt && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{excerpt}</p>
        )}
      </article>
    </button>
  )
}
