'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store'
import { logout } from '@/hooks/useAuth'
import { xpProgress } from '@/lib/utils'

const NAV = [
  { href: '/dashboard',   icon: '🧱', label: 'Dashboard' },
  { href: '/quests',      icon: '⛏️', label: 'Quests' },
  { href: '/creatures',   icon: '🐲', label: 'HabitMon' },
  { href: '/city',        icon: '🏘️', label: 'FocusCity' },
  { href: '/study',       icon: '📖', label: 'Study Arena' },
  { href: '/finance',     icon: '🪙', label: 'BudgetQuest' },
  { href: '/health',      icon: '🍗', label: 'HealthHero' },
  { href: '/games',       icon: '🎮', label: 'Mini Games' },
  { href: '/clan',        icon: '🛡️', label: 'Clans' },
  { href: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
  { href: '/profile',     icon: '🪖', label: 'Profile' },
]

export default function Sidebar() {
  const path = usePathname()
  const { user, sidebarOpen, toggleSidebar, theme, toggleTheme } = useAppStore()
  const p = user ? xpProgress(user.xp) : { level: 1, current: 0, needed: 100, percent: 0 }

  const closeMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) toggleSidebar()
  }

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 md:hidden"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -260 }}
        transition={{ type: 'spring', stiffness: 340, damping: 34 }}
        className="fixed left-0 top-0 h-full w-64 z-30 flex flex-col"
        style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border-color)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-float">⛏️</span>
            <span className="font-pixel text-[10px] neon-text-purple tracking-wide">LIFEVERSE</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden w-7 h-7 flex items-center justify-center rounded text-lg" style={{ color: 'var(--text-muted)' }}>✕</button>
        </div>

        {/* User */}
        {user && (
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-lg flex-shrink-0">{user.avatar}</div>
              <div className="min-w-0">
                <p className="font-display font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{user.username}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.title}</p>
              </div>
            </div>
            <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              <span>Lv {p.level}</span><span>{p.current}/{p.needed} XP</span>
            </div>
            <div className="xp-bar"><div className="xp-bar-fill" style={{ width: `${p.percent}%` }} /></div>
            <div className="flex gap-3 mt-1.5 text-xs">
              <span style={{ color: 'var(--neon-yellow)' }}>🪙 {user.coins}</span>
              <span style={{ color: 'var(--neon-cyan)' }}>💎 {user.gems}</span>
              <span style={{ color: 'var(--neon-orange)' }}>🔥 {user.streak}</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-1.5">
          {NAV.map(item => {
            const active = path === item.href || path.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href} onClick={closeMobile}>
                <div className="flex items-center gap-3 mx-2 my-0.5 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer"
                  style={{
                    background: active ? 'var(--sidebar-active,rgba(124,34,192,0.12))' : 'transparent',
                    color: active ? 'var(--neon-purple)' : 'var(--text-secondary)',
                    border: `1px solid ${active ? 'var(--border-active)' : 'transparent'}`,
                    fontWeight: active ? 600 : 400,
                  }}>
                  <span className="w-5 text-center text-base">{item.icon}</span>
                  <span className="font-body">{item.label}</span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'var(--neon-purple)', boxShadow: '0 0 6px var(--neon-purple)' }} />}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-2 space-y-0.5" style={{ borderTop: '1px solid var(--border-color)' }}>
          {/* Theme toggle */}
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body transition-all" style={{ color: 'var(--text-secondary)' }}>
            <span className="text-base">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            <div className="ml-auto relative w-9 h-5 rounded-full" style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-active)' }}>
              <div className="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all duration-200"
                style={{ background: 'var(--neon-purple)', left: theme === 'dark' ? '2px' : 'calc(100% - 16px)' }} />
            </div>
          </button>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body transition-all" style={{ color: 'var(--text-muted)' }}>
            <span className="text-base">🚪</span><span>Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  )
}
