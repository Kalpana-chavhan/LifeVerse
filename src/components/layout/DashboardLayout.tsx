'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { useAppStore } from '@/store'

export default function DashboardLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const { user, setUser, sidebarOpen } = useAppStore()
  const router = useRouter()
  const [isWide, setIsWide] = useState(false)

  useEffect(() => {
    const check = () => setIsWide(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!user) {
      fetch('/api/auth/me')
        .then(r => r.json())
        .then(data => { if (data.user) setUser(data.user); else router.push('/auth/login') })
        .catch(() => router.push('/auth/login'))
    }
  }, []) // eslint-disable-line

  return (
    <div className="min-h-screen pixel-grid" style={{ backgroundColor: 'var(--bg-base)' }}>
      <Sidebar />
      <div
        className="min-h-screen flex flex-col transition-all duration-300"
        style={{ marginLeft: isWide && sidebarOpen ? '256px' : '0' }}
      >
        <Topbar title={title} />
        <main className="flex-1 p-3 sm:p-4 md:p-6 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
