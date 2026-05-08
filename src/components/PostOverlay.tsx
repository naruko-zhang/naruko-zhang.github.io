import { useEffect } from 'react'
import type { Post } from '@/types'
import MarkdownRenderer from '@/components/MarkdownRenderer'

interface PostOverlayProps {
  post: Post
  onClose: () => void
}

export default function PostOverlay({ post, onClose }: PostOverlayProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const { title, content, category, published_at } = post
  const formattedDate = published_at
    ? new Date(published_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-start justify-center"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative w-full max-w-[860px] h-[92vh] mt-[4vh] bg-[#FAF8F2] rounded-lg shadow-2xl overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-foreground hover:text-white text-muted-foreground transition-colors cursor-pointer z-10"
          aria-label="关闭"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="1" y1="1" x2="13" y2="13" /><line x1="13" y1="1" x2="1" y2="13" />
          </svg>
        </button>
        <div className="px-12 pt-16 pb-20">
          <div className="flex items-center gap-2 mb-5 text-xs text-muted-foreground">
            {formattedDate && <time>{formattedDate}</time>}
            {category && <><span className="opacity-40">·</span><span>{category}</span></>}
          </div>
          <h1 className="font-serif text-2xl md:text-[1.65rem] font-bold tracking-tight text-foreground leading-tight mb-10">
            {title}
          </h1>
          <div className="prose-blog">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </div>
    </div>
  )
}
