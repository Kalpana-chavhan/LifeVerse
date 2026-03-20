'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppStore } from '@/store'
import { xpProgress, formatNumber } from '@/lib/utils'
import Link from 'next/link'

interface DashStats {
  quests: { active: number; completed: number }
  creature: { name: string; emoji: string; happiness: number } | null
  health: { water: number; mood: number }
  recentQuests: Array<{ _id: string; title: string; xpReward: number }>
}

const MOODS = ['','😵','😟','😶','🙂','💎']

const QUICK = [
  { href:'/quests',   icon:'⛏️', label:'Add Quest',      color:'rgba(180,79,255,0.12)',  border:'rgba(180,79,255,0.35)' },
  { href:'/health',   icon:'🪣', label:'Log Water',      color:'rgba(0,245,255,0.1)',    border:'rgba(0,245,255,0.3)'   },
  { href:'/finance',  icon:'🪙', label:'Track Expense',  color:'rgba(255,215,0,0.1)',    border:'rgba(255,215,0,0.3)'   },
  { href:'/study',    icon:'📖', label:'Start Study',    color:'rgba(57,255,20,0.08)',   border:'rgba(57,255,20,0.25)'  },
  { href:'/games',    icon:'🎮', label:'Play Game',      color:'rgba(255,0,144,0.08)',   border:'rgba(255,0,144,0.25)'  },
  { href:'/creatures',icon:'🐲', label:'Feed Mobs',      color:'rgba(255,107,0,0.08)',   border:'rgba(255,107,0,0.25)'  },
]

export default function DashboardPage() {
  const { user, updateUser } = useAppStore()
  const [stats, setStats] = useState<DashStats | null>(null)
  const [loading, setLoading] = useState(true)
  const prog = user ? xpProgress(user.xp) : { level:1, current:0, needed:100, percent:0 }

  useEffect(() => {
    if (!user) return
    const go = async () => {
      try {
        const [qA, qD, cr, hl] = await Promise.all([
          fetch('/api/quests?status=active').then(r=>r.json()),
          fetch('/api/quests?status=completed').then(r=>r.json()),
          fetch('/api/creatures').then(r=>r.json()),
          fetch('/api/health').then(r=>r.json()),
        ])
        setStats({
          quests: { active: qA.quests?.length||0, completed: qD.quests?.length||0 },
          creature: cr.creatures?.[0] ? { name:cr.creatures[0].name, emoji:cr.creatures[0].emoji, happiness:cr.creatures[0].happiness } : null,
          health: { water: hl.todayLog?.waterIntake||0, mood: hl.todayLog?.mood||3 },
          recentQuests: qD.quests?.slice(0,5)||[],
        })
      } catch(e){ console.error(e) }
      finally { setLoading(false) }
    }
    go()
  }, [user])

  const Stat = ({ icon, label, value, color }: any) => (
    <div className="card-dark p-3 sm:p-4 text-center">
      <div className="text-xl sm:text-2xl mb-1">{icon}</div>
      <div className="font-display font-bold text-lg sm:text-xl" style={{ color }}>{value}</div>
      <div className="text-xs font-body mt-0.5" style={{ color:'var(--text-muted)' }}>{label}</div>
    </div>
  )

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-4 sm:space-y-6">

        {/* Welcome banner */}
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
          className="card-dark p-4 sm:p-6 relative overflow-hidden"
          style={{ background:'linear-gradient(135deg, rgba(180,79,255,0.08), rgba(0,245,255,0.04))' }}>
          <div className="absolute top-0 right-0 text-7xl sm:text-8xl opacity-5 select-none">⛏️</div>
          <h2 className="font-pixel text-xs sm:text-sm neon-text-purple mb-1">
            WELCOME BACK, {user?.username?.toUpperCase()}!
          </h2>
          <p className="font-body text-sm mb-4" style={{ color:'var(--text-secondary)' }}>
            {user?.streak ? `🔥 ${user.streak} day streak! Keep mining!` : 'Start your streak today!'}
          </p>
          <div className="max-w-sm">
            <div className="flex justify-between text-xs font-body mb-1" style={{ color:'var(--text-secondary)' }}>
              <span>Level {prog.level}</span><span>{prog.current} / {prog.needed} XP</span>
            </div>
            <div className="xp-bar">
              <motion.div className="xp-bar-fill" initial={{ width:0 }} animate={{ width:`${prog.percent}%` }} transition={{ duration:1, delay:0.3 }} />
            </div>
            <p className="text-xs mt-1 font-body" style={{ color:'var(--text-muted)' }}>{prog.percent}% to Level {prog.level+1}</p>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat icon="⛏️" label="Active Quests"  value={stats?.quests.active   ?? '—'} color="var(--neon-purple)" />
          <Stat icon="✅" label="Quests Done"    value={stats?.quests.completed ?? '—'} color="var(--neon-green)"  />
          <Stat icon="🪣" label="Water Today"    value={stats ? `${stats.health.water}/8` : '—'} color="var(--neon-cyan)" />
          <Stat icon="📖" label="Mood"           value={stats ? MOODS[stats.health.mood] : '—'} color="var(--neon-yellow)" />
        </div>

        {/* Currency row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label:'Emeralds', value:user?.coins, icon:'🪙', color:'var(--neon-yellow)', border:'rgba(255,215,0,0.25)' },
            { label:'Gems',     value:user?.gems,  icon:'💎', color:'var(--neon-cyan)',   border:'rgba(0,245,255,0.25)'  },
            { label:'Streak',   value:user?.streak,icon:'🔥', color:'var(--neon-orange)', border:'rgba(255,107,0,0.25)'  },
          ].map(it => (
            <div key={it.label} className="card-dark p-3 sm:p-4 text-center" style={{ borderColor:it.border }}>
              <div className="text-xl sm:text-2xl">{it.icon}</div>
              <div className="font-display font-bold text-xl sm:text-2xl" style={{ color:it.color }}>{formatNumber(it.value||0)}</div>
              <div className="text-xs font-body" style={{ color:'var(--text-muted)' }}>{it.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="font-display font-bold text-base mb-3" style={{ color:'var(--text-primary)' }}>Quick Actions</h3>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {QUICK.map((a,i) => (
              <motion.div key={a.href} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}>
                <Link href={a.href}>
                  <div className="card-dark p-2.5 sm:p-4 text-center cursor-pointer hover:scale-105 transition-all rounded-xl"
                    style={{ background:a.color, borderColor:a.border }}>
                    <div className="text-xl sm:text-2xl mb-1">{a.icon}</div>
                    <div className="text-[10px] sm:text-xs font-body" style={{ color:'var(--text-secondary)' }}>{a.label}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Recent quests */}
          <div className="card-dark p-4 sm:p-5">
            <h3 className="font-display font-bold mb-4" style={{ color:'var(--text-primary)' }}>⚡ Recent Completions</h3>
            {loading ? (
              <div className="space-y-2">{[1,2,3].map(i=><div key={i} className="h-8 rounded skeleton-pulse"/>)}</div>
            ) : stats?.recentQuests.length ? (
              <div className="space-y-2">
                {stats.recentQuests.map(q=>(
                  <div key={q._id} className="flex items-center justify-between py-1.5" style={{ borderBottom:'1px solid var(--border-subtle)' }}>
                    <span className="text-sm font-body truncate flex-1" style={{ color:'var(--text-secondary)' }}>{q.title}</span>
                    <span className="text-xs neon-text-cyan font-body ml-2 flex-shrink-0">+{q.xpReward} XP</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-body" style={{ color:'var(--text-muted)' }}>No quests completed yet. Start mining!</p>
            )}
          </div>

          {/* Creature */}
          <div className="card-dark p-4 sm:p-5">
            <h3 className="font-display font-bold mb-4" style={{ color:'var(--text-primary)' }}>🐲 Mob Status</h3>
            {stats?.creature ? (
              <div className="text-center py-2">
                <div className="text-5xl mb-2 animate-float">{stats.creature.emoji}</div>
                <p className="font-display font-bold" style={{ color:'var(--text-primary)' }}>{stats.creature.name}</p>
                <p className="text-sm font-body mt-1" style={{ color:'var(--text-secondary)' }}>Happiness: {stats.creature.happiness}%</p>
                <div className="xp-bar mt-2">
                  <div className="xp-bar-fill" style={{ width:`${stats.creature.happiness}%`, background:'linear-gradient(90deg, var(--neon-green), var(--neon-cyan))' }}/>
                </div>
                <Link href="/creatures" className="inline-block mt-3 text-xs font-body underline" style={{ color:'var(--neon-purple)' }}>
                  View all mobs →
                </Link>
              </div>
            ) : (
              <p className="text-sm font-body" style={{ color:'var(--text-muted)' }}>{loading ? 'Loading...' : 'No creature data'}</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
