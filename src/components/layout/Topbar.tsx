'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/store'

const COLORS: Record<string, string> = {
  xp: 'var(--neon-cyan)', coin: 'var(--neon-yellow)',
  levelup: 'var(--neon-purple)', achievement: 'var(--neon-green)',
  info: '#6699ff', error: '#ff5555',
}

export default function Topbar({ title }: { title?: string }) {
  const { toggleSidebar, notifications, removeNotification } = useAppStore()

  return (
    <>
      <header className="h-14 flex items-center justify-between px-3 sm:px-5 sticky top-0 z-10"
        style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--topbar-bg)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button onClick={toggleSidebar} className="p-2 rounded-lg flex-shrink-0" style={{ color: 'var(--text-secondary)' }} aria-label="Menu">
            <div className="w-4 space-y-[4px]">
              {[0,1,2].map(i => <div key={i} className="h-[2px] rounded-full" style={{ background: 'currentColor' }} />)}
            </div>
          </button>
          {title && <h1 className="font-display font-bold text-sm sm:text-base md:text-lg truncate" style={{ color: 'var(--text-primary)' }}>{title}</h1>}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: '0 0 5px #39ff14' }} />
          <span className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>Online</span>
        </div>
      </header>

      {/* Notifications */}
      <div className="fixed bottom-4 right-3 sm:right-5 z-50 flex flex-col gap-2 pointer-events-none w-[calc(100vw-24px)] sm:w-80 max-w-xs sm:max-w-sm">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id}
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              className="px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl text-sm shadow-xl pointer-events-auto cursor-pointer backdrop-blur-lg font-body"
              style={{ background: 'var(--bg-card)', border: `1px solid ${COLORS[n.type] || COLORS.info}`, color: COLORS[n.type] || COLORS.info }}
              onClick={() => removeNotification(n.id)}>
              {n.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
