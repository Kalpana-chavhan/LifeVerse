'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppStore } from '@/store'

interface Creature { _id:string; name:string; species:string; category:string; level:number; xp:number; happiness:number; energy:number; evolutionStage:number; emoji:string; color:string; personality:string }

const EVO_NAMES  = ['Egg','Baby','Adult','Legendary']
const EVO_XP     = [0, 200, 1000, 5000]
const EVO_EMOJIS = ['🥚','🐣','🐤','🦅']

export default function CreaturesPage() {
  const { addNotification } = useAppStore()
  const [creatures, setCreatures] = useState<Creature[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Creature|null>(null)
  const [renaming, setRenaming] = useState(false)
  const [newName, setNewName] = useState('')
  const [acting, setActing] = useState(false)

  const load = async () => {
    setLoading(true)
    const data = await fetch('/api/creatures').then(r=>r.json())
    setCreatures(data.creatures||[])
    setLoading(false)
  }
  useEffect(()=>{ load() },[])

  const act = async (id:string, action:string, name?:string) => {
    setActing(true)
    const res = await fetch('/api/creatures',{ method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ creatureId:id, action, name }) })
    const data = await res.json()
    if (res.ok) {
      addNotification({ type:'info', message:data.message })
      load()
      if (selected?._id===id) setSelected(data.creature)
      setRenaming(false)
    } else addNotification({ type:'error', message:data.error })
    setActing(false)
  }

  const evoPct = (c:Creature) => {
    const next = EVO_XP[c.evolutionStage+1]
    if (!next) return 100
    const prev = EVO_XP[c.evolutionStage]
    return Math.min(100, Math.floor(((c.xp-prev)/(next-prev))*100))
  }

  return (
    <DashboardLayout title="🐲 HabitMon">
      <div className="space-y-5 sm:space-y-6">
        <div>
          <h2 className="font-display font-bold text-xl" style={{ color:'var(--text-primary)' }}>Your Mobs</h2>
          <p className="text-sm font-body" style={{ color:'var(--text-muted)' }}>Complete quests to evolve them. Neglect them and they despawn!</p>
        </div>

        {/* Creature cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[1,2,3,4,5].map(i=><div key={i} className="h-52 rounded-xl skeleton-pulse"/>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {creatures.map((c,i)=>(
              <motion.div key={c._id}
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
                whileHover={{ scale:1.03 }}
                onClick={()=>setSelected(c)}
                className="card-dark p-4 text-center cursor-pointer transition-all"
                style={{ borderColor:`${c.color}55` }}>
                {/* Emoji + evo badge */}
                <div className="relative inline-block mb-2">
                  <div className="text-4xl sm:text-5xl animate-float" style={{ animationDelay:`${i*0.4}s` }}>{c.emoji}</div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-pixel text-[8px]"
                    style={{ background:'var(--neon-purple)', color:'white' }}>{c.evolutionStage}</div>
                </div>
                <h3 className="font-display font-bold text-sm" style={{ color:'var(--text-primary)' }}>{c.name}</h3>
                <p className="text-xs font-body mt-0.5" style={{ color:c.color }}>{c.species}</p>
                <p className="text-xs font-body" style={{ color:'var(--text-muted)' }}>{EVO_NAMES[c.evolutionStage]}</p>
                {/* Bars */}
                <div className="mt-3 space-y-1.5">
                  {[
                    { label:'😊', val:c.happiness },
                    { label:'⚡', val:evoPct(c) },
                  ].map(bar=>(
                    <div key={bar.label}>
                      <div className="flex justify-between text-[10px] font-body mb-0.5" style={{ color:'var(--text-muted)' }}>
                        <span>{bar.label}</span><span>{bar.val}%</span>
                      </div>
                      <div className="xp-bar h-1.5">
                        <div className="xp-bar-fill h-full" style={{ width:`${bar.val}%`, background:`linear-gradient(90deg, ${c.color}, var(--neon-cyan))` }}/>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Quick actions */}
                <div className="mt-3 flex gap-1.5 justify-center">
                  <button onClick={e=>{e.stopPropagation();act(c._id,'feed')}} disabled={acting}
                    className="text-xs px-2 py-1 rounded-lg transition-all" style={{ color:'var(--neon-green)', border:'1px solid var(--neon-green)', background:'rgba(57,255,20,0.08)' }}>
                    🍗 Feed
                  </button>
                  <button onClick={e=>{e.stopPropagation();act(c._id,'play')}} disabled={acting}
                    className="text-xs px-2 py-1 rounded-lg transition-all" style={{ color:'var(--neon-cyan)', border:'1px solid var(--neon-cyan)', background:'rgba(0,245,255,0.08)' }}>
                    ⚔️ Duel
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Evolution guide */}
        <div className="card-dark p-4 sm:p-5">
          <h3 className="font-display font-bold mb-3" style={{ color:'var(--text-primary)' }}>📈 Evolution Guide</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {EVO_NAMES.map((stage,i)=>(
              <div key={stage} className="text-center p-3 rounded-xl" style={{ background:'var(--bg-hover)' }}>
                <div className="text-2xl mb-1">{EVO_EMOJIS[i]}</div>
                <div className="font-display text-sm" style={{ color:'var(--text-primary)' }}>{stage}</div>
                <div className="text-xs font-body" style={{ color:'var(--text-muted)' }}>{i<3?`${EVO_XP[i]} XP`:'Max'}</div>
              </div>
            ))}
          </div>
          <p className="text-xs font-body mt-3" style={{ color:'var(--text-muted)' }}>
            💡 Complete fitness quests → Piglin gains XP! Each category feeds its matching mob.
          </p>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          style={{ background:'var(--modal-overlay)', backdropFilter:'blur(6px)' }}
          onClick={()=>{ setSelected(null); setRenaming(false) }}>
          <motion.div initial={{ scale:0.9 }} animate={{ scale:1 }} onClick={e=>e.stopPropagation()}
            className="w-full max-w-xs rounded-2xl p-5 sm:p-6 text-center"
            style={{ background:'var(--modal-bg)', border:`2px solid ${selected.color}60` }}>
            <div className="text-6xl mb-2 animate-float">{selected.emoji}</div>

            {renaming ? (
              <div className="flex gap-2 mb-3">
                <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder={selected.name}
                  className="flex-1 px-3 py-1.5 rounded-lg text-sm font-body input-field" />
                <button onClick={()=>act(selected._id,'rename',newName)} className="btn-neon text-xs px-3">Save</button>
                <button onClick={()=>setRenaming(false)} className="text-xl" style={{ color:'var(--text-muted)' }}>×</button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 mb-1">
                <h3 className="font-display font-bold text-xl" style={{ color:'var(--text-primary)' }}>{selected.name}</h3>
                <button onClick={()=>{ setRenaming(true); setNewName(selected.name) }} className="text-sm" style={{ color:'var(--text-muted)' }}>✏️</button>
              </div>
            )}

            <p className="font-body text-sm mb-0.5" style={{ color:selected.color }}>{selected.species} · {EVO_NAMES[selected.evolutionStage]}</p>
            <p className="text-xs font-body mb-5" style={{ color:'var(--text-muted)' }}>{selected.personality} personality</p>

            {[
              { label:'😊 Happiness', val:selected.happiness },
              { label:'⚡ Energy',    val:selected.energy    },
            ].map(bar=>(
              <div key={bar.label} className="mb-3">
                <div className="flex justify-between text-xs font-body mb-1" style={{ color:'var(--text-secondary)' }}>
                  <span>{bar.label}</span><span>{bar.val}%</span>
                </div>
                <div className="xp-bar">
                  <div className="xp-bar-fill" style={{ width:`${bar.val}%`, background:`linear-gradient(90deg, ${selected.color}, var(--neon-cyan))` }}/>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button onClick={()=>act(selected._id,'feed')} disabled={acting} className="btn-neon-green text-sm py-2.5 disabled:opacity-50">
                🍗 Feed <span className="text-xs">(-10 🪙)</span>
              </button>
              <button onClick={()=>act(selected._id,'play')} disabled={acting} className="btn-neon text-sm py-2.5 disabled:opacity-50">
                ⚔️ Duel <span className="text-xs">(-5 🪙)</span>
              </button>
            </div>
            <button onClick={()=>setSelected(null)} className="mt-3 text-xs font-body" style={{ color:'var(--text-muted)' }}>Close</button>
          </motion.div>
        </motion.div>
      )}
    </DashboardLayout>
  )
}
