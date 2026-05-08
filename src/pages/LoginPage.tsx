import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { account, loginWithKuaishou } from '@/lib/appwrite'

export default function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const userId = params.get('userId')
    const secret = params.get('secret')

    if (userId && secret) {
      account
        .createSession({ userId, secret })
        .then(() => navigate('/', { replace: true }))
        .catch(() => setLoading(false))
      return
    }

    account
      .get()
      .then(() => navigate('/', { replace: true }))
      .catch(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">正在验证登录状态…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-3">小鸣的数字花园</h1>
        <div className="w-10 h-[3px] bg-primary mx-auto mb-6 rounded-full" />
        <p className="text-muted-foreground text-sm mb-8">使用快手账号登录，管理你的文章</p>
        <button
          onClick={loginWithKuaishou}
          className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer"
        >
          快手 SSO 登录
        </button>
      </div>
    </div>
  )
}