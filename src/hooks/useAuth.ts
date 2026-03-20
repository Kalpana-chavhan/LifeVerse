'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store'

export function useAuth(redirectTo?: string) {
  const { user, setUser } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      fetch('/api/auth/me')
        .then((r) => r.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user)
          } else if (redirectTo) {
            router.push(redirectTo)
          }
        })
        .catch(() => {
          if (redirectTo) router.push(redirectTo)
        })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { user }
}

export async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' })
  useAppStore.getState().setUser(null)
  // Clear persisted store
  if (typeof window !== 'undefined') {
    localStorage.removeItem('lifeverse-store')
  }
  window.location.href = '/'
}
