'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppStore } from '@/store'
import { xpProgress, formatNumber } from '@/lib/utils'

const AVATARS = ['⛏️','🗡️','🏹','🪖','🛡️','💎','🧱','🪓','🔥','💀','🐲','🧟']
const TITLES  = ['Dirt Digger','Stone Miner','Iron Forger','Gold Seeker','Diamond Legend','Netherite God']

export default function ProfilePage() {
  const { user, updateUser, addNotification } = useAppStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ avatar: user?.avatar||'⛏️', bio: user?.bio||'' })
  const [saving, setSaving] = useState(false)
  const prog = user ? xpProgress(user.xp) : { level:1, current:0, needed:100, percent:0 }

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/auth/me',{ method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
    if (res.ok) { updateUser(form); addNotification({ type:'info', message:'Profile updated!' }); setEditing(false) }
    setSaving(false)
  }

  if (!user) return null

  const STATS = [
    { label:'Total XP',  value:formatNumber(user.xp),                    icon:'⚡', color:'var(--neon-cyan)'    },
    { label:'Level',     value:user.level,                                icon:'⭐', color:'var(--neon-purple)'  },
    { label:'Emeralds',  value:formatNumber(user.coins),                  icon:'🪙', color:'var(--neon-yellow)'  },
    { label:'Gems',      value:user.gems,                                 icon:'💎', color:'var(--neon-cyan)'    },
    { label:'Best Streak',value:`${user.stats?.highestStreak||0}d`,      icon:'🔥', color:'var(--neon-orange)'  },
    { label:'Quests Done',value:user.stats?.questsCompleted||0,          icon:'✅', color:'var(--neon-green)'   },
  ]

  return (
    <DashboardLayout title="🪖 Profile">
      <div className="space-y-4 sm:space-y-5 max-w-xl mx-auto">

        {/* Profile card */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="card-dark p-6 sm:p-8 text-center neon-border">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-4xl sm:text-5xl"
              style={{ boxShadow:'0 0 24px rgba(180,79,255,0.45)' }}>
              {editing ? form.avatar : user.avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background:'var(--bg-surface)', border:'2px solid var(--border-active)' }}>
              <span className="font-pixel text-[9px]" style={{ color:'var(--neon-purple)' }}>{user.level}</span>
            </div>
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-1" style={{ color:'var(--text-primary)' }}>{user.username}</h2>
          <p className="font-body text-sm mb-1" style={{ color:'var(--neon-purple)' }}>{user.title}</p>
          <p className="font-body text-sm mb-4" style={{ color:'var(--text-muted)' }}>{user.bio||'No bio yet...'}</p>

          <div className="max-w-xs mx-auto mb-5">
            <div className="flex justify-between text-xs font-body mb-1" style={{ color:'var(--text-secondary)' }}>
              <span>Level {prog.level}</span><span>{prog.current}/{prog.needed} XP</span>
            </div>
            <div className="xp-bar">
              <motion.div className="xp-bar-fill" initial={{ width:0 }} animate={{ width:`${prog.percent}%` }} transition={{ duration:1 }}/>
            </div>
          </div>

          {editing ? (
            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs font-body mb-2 block" style={{ color:'var(--text-muted)' }}>Choose Avatar</label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {AVATARS.map(a=>(
                    <button key={a} type="button" onClick={()=>setForm({...form,avatar:a})}
                      className="text-2xl p-2 rounded-lg transition-all"
                      style={{ background:form.avatar===a?'var(--sidebar-active)':'transparent', transform:form.avatar===a?'scale(1.15)':'scale(1)' }}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-body mb-1 block" style={{ color:'var(--text-muted)' }}>Bio</label>
                <textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}
                  maxLength={200} rows={2} placeholder="Tell your story..."
                  className="w-full px-3 py-2 rounded-lg text-sm font-body resize-none input-field" />
              </div>
              <div className="flex gap-3">
                <button onClick={()=>setEditing(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-body"
                  style={{ border:'1px solid var(--border-color)', color:'var(--text-muted)' }}>Cancel</button>
                <button onClick={save} disabled={saving}
                  className="flex-1 py-2.5 rounded-lg text-sm font-body font-semibold text-white"
                  style={{ background:'linear-gradient(135deg, var(--neon-purple), var(--neon-cyan))', opacity:saving?0.6:1 }}>
                  {saving?'Saving...':'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={()=>{ setEditing(true); setForm({ avatar:user.avatar, bio:user.bio||'' }) }}
              className="btn-neon px-6 py-2">✏️ Edit Profile</button>
          )}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {STATS.map((s,i)=>(
            <motion.div key={s.label} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.08 }}
              className="card-dark p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl mb-1">{s.icon}</div>
              <div className="font-display font-bold text-base sm:text-lg" style={{ color:s.color }}>{s.value}</div>
              <div className="text-[10px] sm:text-xs font-body mt-0.5" style={{ color:'var(--text-muted)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <div className="card-dark p-4 sm:p-5">
          <h3 className="font-display font-bold mb-3" style={{ color:'var(--text-primary)' }}>🏅 Achievements</h3>
          <div className="flex gap-2 flex-wrap">
            {(user.badges?.length ? user.badges : ['First Quest','Streak Starter']).map(b=>(
              <span key={b} className="px-3 py-1.5 rounded-full text-xs font-body"
                style={{ color:'var(--neon-yellow)', background:'rgba(255,215,0,0.1)', border:'1px solid rgba(255,215,0,0.35)' }}>
                🏅 {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
