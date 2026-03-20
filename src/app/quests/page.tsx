'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppStore } from '@/store'

interface Quest { _id:string; title:string; description:string; category:string; type:string; difficulty:string; xpReward:number; coinReward:number; status:string; streak:number; totalCompletions:number; icon:string }

const CATS = ['all','fitness','learning','finance','health','social','creativity','mindfulness','custom']
const DIFF_COLOR: Record<string,string> = { easy:'var(--neon-green)', medium:'var(--neon-yellow)', hard:'var(--neon-orange)', legendary:'var(--neon-purple)' }
const CAT_ICON: Record<string,string> = { fitness:'⚒️', learning:'📖', finance:'🪙', health:'🍗', social:'🧑', creativity:'🖌️', mindfulness:'🧘', custom:'⛏️', all:'🌐' }
const ICONS = ['⛏️','⚒️','📖','🪙','🪣','🧘','🖌️','🧑','🎯','🏹','💎','🕯️']
const DEFAULT_FORM = { title:'', description:'', category:'custom', type:'daily', difficulty:'easy', icon:'⛏️' }

export default function QuestsPage() {
  const { addNotification, updateUser, user } = useAppStore()
  const [quests, setQuests] = useState<Quest[]>([])
  const [filter, setFilter] = useState({ status:'active', category:'all', type:'all' })
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<string|null>(null)

  const load = async () => {
    setLoading(true)
    const p = new URLSearchParams({ status:filter.status })
    if (filter.category !== 'all') p.set('category', filter.category)
    if (filter.type !== 'all') p.set('type', filter.type)
    const data = await fetch(`/api/quests?${p}`).then(r=>r.json())
    setQuests(data.quests||[])
    setLoading(false)
  }
  useEffect(()=>{ load() }, [filter])

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/quests', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
    const data = await res.json()
    if (res.ok) { addNotification({ type:'info', message:`Quest "${form.title}" created! ⛏️` }); setShowForm(false); setForm(DEFAULT_FORM); load() }
    else addNotification({ type:'error', message:data.error })
  }

  const complete = async (id: string) => {
    setCompleting(id)
    const res = await fetch('/api/quests', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ questId:id, action:'complete' }) })
    const data = await res.json()
    if (res.ok) {
      addNotification({ type:'xp', message:`+${data.xpEarned} XP! ${data.streakBonus>1?`(${data.streakBonus}x streak!)`:''}`})
      addNotification({ type:'coin', message:`+${data.coinsEarned} emeralds!` })
      if (data.leveledUp) addNotification({ type:'levelup', message:`🎉 LEVEL UP! Level ${data.newLevel}!` })
      updateUser({ xp:data.totalXp, coins:data.totalCoins, level:data.newLevel })
      load()
    } else addNotification({ type:'error', message:data.error })
    setCompleting(null)
  }

  const del = async (id: string) => {
    await fetch('/api/quests', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ questId:id, action:'delete' }) })
    load()
  }

  const F = ({ label, children }: any) => (
    <div>
      <label className="block text-xs font-body mb-1" style={{ color:'var(--text-muted)' }}>{label}</label>
      {children}
    </div>
  )

  return (
    <DashboardLayout title="⛏️ Quest Log">
      <div className="space-y-4 sm:space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl" style={{ color:'var(--text-primary)' }}>Quest Log</h2>
            <p className="text-sm font-body" style={{ color:'var(--text-muted)' }}>{quests.length} quest{quests.length!==1?'s':''}</p>
          </div>
          <button onClick={()=>setShowForm(true)} className="btn-neon-green text-sm px-3 py-2 flex-shrink-0">+ New Quest</button>
        </div>

        {/* Status filters */}
        <div className="card-dark p-3 sm:p-4 flex flex-wrap gap-2">
          {['active','completed','all'].map(s=>(
            <button key={s} onClick={()=>setFilter(f=>({...f,status:s}))}
              className="px-3 py-1.5 rounded-lg text-sm font-body transition-all capitalize"
              style={{ background: filter.status===s ? 'rgba(180,79,255,0.15)' : 'transparent', color: filter.status===s ? 'var(--neon-purple)' : 'var(--text-muted)', border:`1px solid ${filter.status===s?'var(--border-active)':'transparent'}` }}>
              {s}
            </button>
          ))}
          <div className="w-px self-stretch" style={{ background:'var(--border-color)' }} />
          {['all','daily','weekly','one-time'].map(t=>(
            <button key={t} onClick={()=>setFilter(f=>({...f,type:t}))}
              className="px-3 py-1.5 rounded-lg text-sm font-body transition-all"
              style={{ background: filter.type===t ? 'rgba(0,245,255,0.1)' : 'transparent', color: filter.type===t ? 'var(--neon-cyan)' : 'var(--text-muted)', border:`1px solid ${filter.type===t?'var(--neon-cyan)':'transparent'}` }}>
              {t}
            </button>
          ))}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap">
          {CATS.map(cat=>(
            <button key={cat} onClick={()=>setFilter(f=>({...f,category:cat}))}
              className="px-2.5 py-1 rounded-full text-xs font-body transition-all"
              style={{ background: filter.category===cat ? 'rgba(180,79,255,0.15)' : 'transparent', color: filter.category===cat ? 'var(--text-primary)' : 'var(--text-muted)', border:`1px solid ${filter.category===cat?'var(--border-active)':'var(--border-subtle)'}` }}>
              {CAT_ICON[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Quest list */}
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-20 rounded-xl skeleton-pulse"/>)}</div>
        ) : quests.length===0 ? (
          <div className="text-center py-14 card-dark">
            <div className="text-5xl mb-4">📜</div>
            <h3 className="font-display font-bold mb-2" style={{ color:'var(--text-primary)' }}>No Quests Found</h3>
            <p className="text-sm font-body mb-5" style={{ color:'var(--text-muted)' }}>Create your first quest!</p>
            <button onClick={()=>setShowForm(true)} className="btn-neon">Create Quest</button>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            <AnimatePresence>
              {quests.map((q,i)=>(
                <motion.div key={q._id} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:16 }} transition={{ delay:i*0.04 }}
                  className={`card-dark p-3 sm:p-4 flex items-center gap-3 ${q.status==='completed'?'opacity-55':''}`}>
                  <div className="text-xl sm:text-2xl flex-shrink-0">{q.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`font-display font-bold text-sm ${q.status==='completed'?'line-through':''}`} style={{ color: q.status==='completed'?'var(--text-muted)':'var(--text-primary)' }}>{q.title}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ color:DIFF_COLOR[q.difficulty], border:`1px solid ${DIFF_COLOR[q.difficulty]}`, background:`${DIFF_COLOR[q.difficulty]}18` }}>{q.difficulty}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ color:'var(--text-muted)', background:'var(--bg-hover)' }}>{CAT_ICON[q.category]} {q.category}</span>
                    </div>
                    {q.description && <p className="text-xs mt-0.5 truncate font-body" style={{ color:'var(--text-muted)' }}>{q.description}</p>}
                    <div className="flex gap-3 mt-1 text-xs font-body flex-wrap">
                      <span className="neon-text-cyan">+{q.xpReward} XP</span>
                      <span style={{ color:'var(--neon-yellow)' }}>+{q.coinReward} 🪙</span>
                      {q.streak>0 && <span style={{ color:'var(--neon-orange)' }}>🔥 {q.streak}</span>}
                      {q.totalCompletions>0 && <span style={{ color:'var(--text-muted)' }}>✓ {q.totalCompletions}x</span>}
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {q.status==='active' && (
                      <button onClick={()=>complete(q._id)} disabled={completing===q._id}
                        className="btn-neon-green text-xs px-2.5 py-1.5 disabled:opacity-50">
                        {completing===q._id?'...':'✓ Done'}
                      </button>
                    )}
                    <button onClick={()=>del(q._id)} className="text-lg px-1 transition-colors" style={{ color:'var(--text-muted)' }}>×</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
            style={{ background:'var(--modal-overlay)', backdropFilter:'blur(6px)' }}
            onClick={e=>{if(e.target===e.currentTarget)setShowForm(false)}}>
            <motion.div initial={{ scale:0.92 }} animate={{ scale:1 }} exit={{ scale:0.92 }}
              className="w-full max-w-md rounded-2xl p-4 sm:p-6 neon-border"
              style={{ background:'var(--modal-bg)' }}>
              <h3 className="font-pixel text-xs neon-text-purple mb-5">CREATE QUEST</h3>
              <form onSubmit={create} className="space-y-4">
                <F label="Quest Title *">
                  <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}
                    placeholder="Drink 8 glasses of water" className="w-full px-3 py-2 rounded-lg input-field text-sm font-body" />
                </F>
                <F label="Description">
                  <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                    rows={2} className="w-full px-3 py-2 rounded-lg input-field text-sm font-body resize-none" placeholder="Optional..." />
                </F>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Category">
                    <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
                      className="w-full px-3 py-2 rounded-lg input-field text-sm font-body">
                      {CATS.filter(c=>c!=='all').map(c=><option key={c} value={c}>{CAT_ICON[c]} {c}</option>)}
                    </select>
                  </F>
                  <F label="Type">
                    <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}
                      className="w-full px-3 py-2 rounded-lg input-field text-sm font-body">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="one-time">One-time</option>
                    </select>
                  </F>
                </div>
                <F label="Difficulty">
                  <div className="grid grid-cols-4 gap-2">
                    {['easy','medium','hard','legendary'].map(d=>(
                      <button type="button" key={d} onClick={()=>setForm({...form,difficulty:d})}
                        className="py-2 rounded-lg text-xs font-body transition-all capitalize"
                        style={{ border:`1px solid ${form.difficulty===d?DIFF_COLOR[d]:'var(--border-color)'}`, color:form.difficulty===d?DIFF_COLOR[d]:'var(--text-muted)', background:form.difficulty===d?`${DIFF_COLOR[d]}18`:'transparent' }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </F>
                <F label="Icon">
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map(ico=>(
                      <button type="button" key={ico} onClick={()=>setForm({...form,icon:ico})}
                        className="text-xl p-1.5 rounded-lg transition-all"
                        style={{ background:form.icon===ico?'var(--sidebar-active)':'transparent', transform:form.icon===ico?'scale(1.15)':'scale(1)' }}>
                        {ico}
                      </button>
                    ))}
                  </div>
                </F>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={()=>setShowForm(false)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-body"
                    style={{ border:'1px solid var(--border-color)', color:'var(--text-muted)' }}>Cancel</button>
                  <button type="submit"
                    className="flex-1 py-2.5 rounded-lg text-sm font-body font-semibold text-white"
                    style={{ background:'linear-gradient(135deg, var(--neon-purple), var(--neon-cyan))' }}>
                    Create Quest ⛏️
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
