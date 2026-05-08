import { useState, useEffect, useRef, useCallback } from 'react'
import type { Post } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PostCard from '@/components/PostCard'
import PostOverlay from '@/components/PostOverlay'

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeYear, setActiveYear] = useState<string>('')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const yearRefs = useRef<Record<string, HTMLElement | null>>({})
  const isScrollingTo = useRef(false)

  useEffect(() => {
    fetch('/posts.json')
      .then(r => r.json())
      .then(data => {
        setPosts(data.filter((p: Post) => p.is_published))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const years = Array.from(
    new Set(posts.map(p => p.published_at ? new Date(p.published_at).getFullYear().toString() : null).filter(Boolean) as string[])
  ).sort((a, b) => Number(b) - Number(a))

  const postsByYear: Record<string, Post[]> = {}
  for (const year of years) {
    postsByYear[year] = posts.filter(p => p.published_at && new Date(p.published_at).getFullYear().toString() === year)
  }

  useEffect(() => {
    if (years.length > 0) setActiveYear(years[0])
  }, [years.length])

  const HEADER_OFFSET = 128 + 16

  const scrollToYear = useCallback((year: string) => {
    const el = yearRefs.current[year]
    if (!el) return
    isScrollingTo.current = true
    setActiveYear(year)
    const offset = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top: offset, behavior: 'smooth' })
    setTimeout(() => { isScrollingTo.current = false }, 900)
  }, [])

  useEffect(() => {
    if (years.length === 0) return
    const handleScroll = () => {
      if (isScrollingTo.current) return
      let current = years[0]
      for (const year of years) {
        const el = yearRefs.current[year]
        if (!el) continue
        if (el.getBoundingClientRect().top <= HEADER_OFFSET + 8) current = year
      }
      setActiveYear(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [years])

  const openPost = (post: Post) => {
    setSelectedPost(post)
    document.body.style.overflow = 'hidden'
  }

  const closePost = () => {
    setSelectedPost(null)
    document.body.style.overflow = ''
  }

  return (
    <div className="min-h-screen bg-[#FAF8F2]">
      <Header />

      <div className="sticky top-20 z-40 bg-[#FAF8F2] border-b border-border">
        <div className="max-w-[1100px] mx-auto px-8 flex items-center gap-8 h-12">
          {loading
            ? <div className="h-3 w-40 bg-muted rounded animate-pulse" />
            : years.map(year => (
              <button
                key={year}
                onClick={() => scrollToYear(year)}
                className={`text-sm transition-colors duration-150 cursor-pointer flex items-center gap-1.5 h-full border-b-2 ${
                  activeYear === year
                    ? 'border-foreground text-foreground font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {year}年
                <span className="text-xs opacity-40">{postsByYear[year]?.length ?? 0}篇</span>
              </button>
            ))
          }
        </div>
      </div>

      <main className="max-w-[1100px] mx-auto px-8">
        <section className="pt-12 pb-10 border-b border-border">
          <p className="font-serif text-sm text-muted-foreground leading-loose">
            我会不定期记录工作日常感悟，与你分享那些经过实践验证的理念和方法。这些记录可能包括对工作策略的思考、对团队管理的洞见、或是对个人成长的反思。每个人的生活经历和工作环境都是独特的，但我相信，无论我们身处何地，面对何种挑战，总有一些普遍的原则和规律是相通的。我希望通过我的分享，能够激发你的思考，帮助你在工作和生活中找到自己的方向和答案。如果你在我的记录中找到了共鸣，或者它们为你提供了一点点启发和帮助，我会非常开心 😄
          </p>
        </section>

        {loading ? (
          <div className="space-y-3 pt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div>
            {years.map(year => (
              <section key={year} id={`year-${year}`} ref={el => { yearRefs.current[year] = el }}>
                <div className="pt-10 pb-1 flex items-baseline gap-3">
                  <span className="font-serif text-xl font-bold text-foreground">{year}年</span>
                  <span className="text-xs text-muted-foreground">{postsByYear[year].length} 篇</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                  {postsByYear[year].map(post => (
                    <PostCard key={post.id} post={post} onOpen={() => openPost(post)} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <Footer />
      {selectedPost && <PostOverlay post={selectedPost} onClose={closePost} />}
    </div>
  )
}
