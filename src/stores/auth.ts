import { create } from 'zustand'
import { account, client } from '@/lib/appwrite'
import { handleOAuth2Token } from '@codeflicker/appwrite'
import type { Models } from '@codeflicker/appwrite'

interface AuthState {
  user: Models.User<Models.Preferences> | null
  loading: boolean
  initialized: boolean
  checkAuth: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  checkAuth: async () => {
    try {
      // 处理 OAuth2 token 兑换（SSO 回调后 URL 携带 userId/secret）
      try {
        await handleOAuth2Token(client)
      } catch (_) {}

      const user = await account.get()
      set({ user, loading: false, initialized: true })
    } catch (_) {
      set({ user: null, loading: false, initialized: true })
    }
  },

  logout: async () => {
    try {
      await account.deleteSession('current')
      set({ user: null })
    } catch (_) {
      set({ user: null })
    }
  },
}))