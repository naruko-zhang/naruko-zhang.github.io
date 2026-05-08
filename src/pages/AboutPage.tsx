import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-[720px] mx-auto px-6 pt-16 pb-20">
        <h1 className="font-serif text-3xl md:text-4xl font-900 text-foreground tracking-tight">
          关于这个花园
        </h1>
        <div className="w-12 h-[3px] bg-primary mt-4 mb-8 rounded-full" />

        <div className="markdown-content">
          <p>
            我会不定期记录工作日常感悟，与你分享那些经过实践验证的理念和方法。
          </p>
          <p>
            这些记录可能包括对工作策略的思考、对团队管理的洞见、或是对个人成长的反思。
            每个人的生活经历和工作环境都是独特的，但我相信，无论我们身处何地，
            面对何种挑战，总有一些普遍的原则和规律是相通的。
          </p>
          <p>
            我希望通过我的分享，能够激发你的思考，帮助你在工作和生活中找到自己的方向和答案。
            如果你在我的记录中找到了共鸣，或者它们为你提供了一点点启发和帮助，我会非常开心 😄
          </p>

          <blockquote>
            "人是目的，事是手段。" — 这是我行动的指南。
          </blockquote>

          <p>
            这里记录的，不是流水账，而是那些经过沉淀的思考——关于产品、关于团队、关于在 AI 时代人如何自处。
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}