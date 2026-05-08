import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import type { Post } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export default function PostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/posts.json')
      .then(r => r.json())
      .then((data: Post[]) => {
        const found = data.find(p => p.slug === slug && p.is_published)
        setPost(found || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F2]">
        <Header />
        <div className="max-w-[680px] mx-auto px-8 pt-20 space-y-3">
          <div className="h-8 bg-muted rounded animate-pulse w-2/3" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAF8F2]">
        <Header />
        <div className="max-w-[680px] mx-auto px-8 pt-20 text-center">
          <p className="text-muted-foreground text-sm mb-6">文章未找到</p>
          <Link to="/" className="text-sm underline underline-offset-4 text-foreground">← 返回首页</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('zh-CN', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : ''

  return (
    <div className="min-h-screen bg-[#FAF8F2]">
      <Header />
      <article className="max-w-[680px] mx-auto px-8 pt-16 pb-24">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-5 text-xs text-muted-foreground">
            {formattedDate && <time>{formattedDate}</time>}
            {post.category && <span>· {post.category}</span>}
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
            {post.title}
          </h1>
        </header>
        <div className="prose-blog">
          <MarkdownRenderer content={post.content} />
        </div>
        <div className="mt-16 pt-8 border-t border-border">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
            ← 所有文章
          </Link>
        </div>
      </article>
      <Footer />
    </div>
  )
}
