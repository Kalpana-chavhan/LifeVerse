import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
  id: string
  username: string
  email: string
  avatar: string
  level: number
  xp: number
  coins: number
  gems: number
  streak: number
  title: string
  bio?: string
  badges?: string[]
  stats: Record<string, number>
  settings: Record<string, unknown>
}

interface Notification {
  id: string
  type: 'xp' | 'coin' | 'levelup' | 'achievement' | 'info' | 'error'
  message: string
  value?: number
  timestamp: number
}

interface AppState {
  user: User | null
  isLoading: boolean
  notifications: Notification[]
  sidebarOpen: boolean
  theme: 'dark' | 'light'
  _hasHydrated: boolean

  setUser: (user: User | null) => void
  updateUser: (updates: Partial<User>) => void
  setLoading: (loading: boolean) => void
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  toggleSidebar: () => void
  toggleTheme: () => void
  setTheme: (theme: 'dark' | 'light') => void
  awardXP: (amount: number, source?: string) => void
  awardCoins: (amount: number) => void
  setHasHydrated: (state: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      notifications: [],
      sidebarOpen: true,
      theme: 'dark',
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setUser: (user) => set({ user }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setLoading: (isLoading) => set({ isLoading }),

      addNotification: (notif) => {
        const id = Math.random().toString(36).slice(2)
        set((state) => ({
          notifications: [
            ...state.notifications.slice(-4),
            { ...notif, id, timestamp: Date.now() },
          ],
        }))
        setTimeout(() => get().removeNotification(id), 4000)
      },

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'dark' ? 'light' : 'dark'
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', next)
          }
          return { theme: next }
        }),

      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme)
        }
        set({ theme })
      },

      awardXP: (amount, source) => {
        const state = get()
        if (!state.user) return
        const newXP = state.user.xp + amount
        const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1
        const leveledUp = newLevel > state.user.level
        set((s) => ({
          user: s.user ? { ...s.user, xp: newXP, level: newLevel } : null,
        }))
        get().addNotification({
          type: 'xp',
          message: source ? `+${amount} XP from ${source}` : `+${amount} XP`,
          value: amount,
        })
        if (leveledUp) {
          get().addNotification({
            type: 'levelup',
            message: `🎊 LEVEL UP! You're now level ${newLevel}!`,
          })
        }
      },

      awardCoins: (amount) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, coins: state.user.coins + amount }
            : null,
        }))
        get().addNotification({
          type: 'coin',
          message: `+${amount} coins`,
          value: amount,
        })
      },
    }),
    {
      name: 'lifeverse-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

