'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppStore } from '@/store'

interface HLog { waterIntake:number; waterGoal:number; sleepHours:number; sleepQuality:number; steps:number; mood:number; moodNote:string; xpEarned:number }

const MOODS = [
  { val:1, emoji:'🖤', label:'Empty Hearts' },
  { val:2, emoji:'💔', label:'Half Heart'   },
  { val:3, emoji:'🧡', label:'Three Hearts' },
  { val:4, emoji:'❤️', label:'Full Hearts'  },
  { val:5, emoji:'💎', label:'Golden Heart' },
]

export default function HealthPage() {
  const { addNotification, awardXP } = useAppStore()
  const [log, setLog] = useState<HLog|null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetch('/api/health?days=7').then(r=>r.json()).then(d=>{ setLog(d.todayLog); setLoading(false) })
  },[])

  const save = async (updates: Partial<HLog>) => {
    const res = await fetch('/api/health',{ method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(updates) })
    const data = await res.json()
    if (res.ok) {
      setLog(data.log)
      if (data.xpEarned>0) awardXP(data.xpEarned, 'Health tracking')
      addNotification({ type:'info', message:'Health log updated! 🍗' })
    }
  }

  const waterPct = log ? Math.min(100,(log.waterIntake/log.waterGoal)*100) : 0
  const waterColor = waterPct>=100 ? 'var(--neon-green)' : waterPct>=50 ? 'var(--neon-cyan)' : 'var(--neon-purple)'

  const Card = ({ title, children, accent }: any) => (
    <div className="card-dark p-4 sm:p-5" style={{ borderColor:`${accent}40` }}>
      <h3 className="font-display font-bold mb-4" style={{ color:'var(--text-primary)' }}>{title}</h3>
      {children}
    </div>
  )

  if (loading) return (
    <DashboardLayout title="🍗 HealthHero">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1,2,3,4].map(i=><div key={i} className="h-48 rounded-xl skeleton-pulse"/>)}
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="🍗 HealthHero">
      <div className="space-y-4 sm:space-y-5">
        <div>
          <h2 className="font-display font-bold text-xl" style={{ color:'var(--text-primary)' }}>Today's Stats</h2>
          <p className="text-sm font-body" style={{ color:'var(--text-muted)' }}>Track health to earn XP and level up!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Water */}
          <Card title="🪣 Water Intake" accent="var(--neon-cyan)">
            {waterPct>=100 && <span className="text-xs px-2 py-0.5 rounded-full mb-3 inline-block" style={{ color:'var(--neon-green)', background:'rgba(57,255,20,0.1)', border:'1px solid var(--neon-green)' }}>✅ Goal Met!</span>}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8" stroke="var(--border-subtle)" />
                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8" stroke={waterColor}
                  strokeDasharray={`${waterPct*2.51} 251`} strokeLinecap="round"
                  style={{ filter:`drop-shadow(0 0 6px ${waterColor})`, transition:'stroke-dasharray 0.5s' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-bold text-2xl" style={{ color:'var(--text-primary)' }}>{log?.waterIntake||0}</span>
                <span className="text-xs font-body" style={{ color:'var(--text-muted)' }}>/{log?.waterGoal||8}</span>
              </div>
            </div>
            <div className="flex gap-2 justify-center flex-wrap">
              <button onClick={()=>save({waterIntake:Math.max(0,(log?.waterIntake||0)-1)})}
                className="w-8 h-8 rounded-full font-bold text-lg" style={{ border:'1px solid var(--border-active)', color:'var(--neon-cyan)', background:'transparent' }}>−</button>
              {[1,2,3].map(n=>(
                <button key={n} onClick={()=>save({waterIntake:(log?.waterIntake||0)+n})}
                  className="px-3 py-1 rounded-lg text-sm font-body transition-all"
                  style={{ border:'1px solid var(--neon-cyan)', color:'var(--neon-cyan)', background:'rgba(0,245,255,0.08)' }}>+{n}</button>
              ))}
            </div>
            <p className="text-center text-xs font-body mt-2" style={{ color:'var(--text-muted)' }}>+5 XP per glass</p>
          </Card>

          {/* Sleep */}
          <Card title="🌙 Sleep Quality" accent="var(--neon-purple)">
            <div className="mb-4">
              <label className="text-xs font-body mb-2 block" style={{ color:'var(--text-muted)' }}>Hours Slept</label>
              <input type="range" min="0" max="12" step="0.5" value={log?.sleepHours||0}
                onChange={e=>save({sleepHours:parseFloat(e.target.value)})}
                className="w-full" style={{ accentColor:'var(--neon-purple)' }} />
              <div className="flex justify-between text-xs font-body mt-1" style={{ color:'var(--text-muted)' }}>
                <span>0h</span>
                <span className="font-bold" style={{ color:'var(--neon-purple)' }}>{log?.sleepHours||0}h</span>
                <span>12h</span>
              </div>
            </div>
            <label className="text-xs font-body mb-2 block" style={{ color:'var(--text-muted)' }}>Quality</label>
            <div className="flex gap-2 justify-center">
              {[1,2,3,4,5].map(q=>(
                <button key={q} onClick={()=>save({sleepQuality:q})}
                  className="w-9 h-9 rounded-full text-sm transition-all"
                  style={{ background:(log?.sleepQuality||0)>=q?'rgba(180,79,255,0.25)':'transparent', border:`1px solid ${(log?.sleepQuality||0)>=q?'var(--neon-purple)':'var(--border-color)'}`, transform:(log?.sleepQuality||0)>=q?'scale(1.1)':'scale(1)' }}>
                  ⭐
                </button>
              ))}
            </div>
            {(log?.sleepHours||0)>=7 && <p className="text-center text-xs font-body mt-3" style={{ color:'var(--neon-green)' }}>+50 XP for 7+ hours!</p>}
          </Card>

          {/* Steps */}
          <Card title="👞 Steps Walked" accent="var(--neon-green)">
            <div className="text-center mb-4">
              <p className="font-pixel text-2xl sm:text-3xl neon-text-green">{(log?.steps||0).toLocaleString()}</p>
              <p className="text-xs font-body mt-1" style={{ color:'var(--text-muted)' }}>steps today</p>
              <div className="xp-bar mt-3">
                <div className="xp-bar-fill" style={{ width:`${Math.min(100,((log?.steps||0)/10000)*100)}%`, background:'linear-gradient(90deg, var(--neon-green), var(--neon-cyan))' }}/>
              </div>
              <p className="text-xs font-body mt-1" style={{ color:'var(--text-muted)' }}>{Math.min(100,Math.floor(((log?.steps||0)/10000)*100))}% to 10k goal</p>
            </div>
            <div className="flex gap-2 justify-center flex-wrap">
              {[1000,2000,5000].map(n=>(
                <button key={n} onClick={()=>save({steps:(log?.steps||0)+n})}
                  className="px-3 py-1.5 rounded-lg text-xs font-body transition-all"
                  style={{ border:'1px solid var(--neon-green)', color:'var(--neon-green)', background:'rgba(57,255,20,0.08)' }}>
                  +{n.toLocaleString()}
                </button>
              ))}
            </div>
          </Card>

          {/* Mood */}
          <Card title="📖 Mood Journal" accent="var(--neon-yellow)">
            <div className="flex justify-center gap-2 sm:gap-3 mb-4">
              {MOODS.map(m=>(
                <button key={m.val} onClick={()=>save({mood:m.val as 1|2|3|4|5})} title={m.label}
                  className="text-xl sm:text-2xl p-1.5 rounded-lg transition-all"
                  style={{ background:(log?.mood||3)===m.val?'rgba(255,215,0,0.15)':'transparent', transform:(log?.mood||3)===m.val?'scale(1.2)':'scale(1)', opacity:(log?.mood||3)===m.val?1:0.55 }}>
                  {m.emoji}
                </button>
              ))}
            </div>
            <textarea value={log?.moodNote||''} rows={3}
              onChange={e=>setLog(l=>l?{...l,moodNote:e.target.value}:null)}
              onBlur={()=>log&&save({moodNote:log.moodNote})}
              placeholder="How are you feeling today?"
              className="w-full px-3 py-2 rounded-lg text-sm font-body resize-none input-field"
              style={{ borderColor:'rgba(255,215,0,0.2)' }} />
            <p className="text-xs font-body mt-2" style={{ color:'var(--text-muted)' }}>+10 XP for logging your mood</p>
          </Card>
        </div>

        {/* XP summary */}
        {log && (
          <div className="card-dark p-4 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-display font-bold" style={{ color:'var(--text-primary)' }}>Today's Health XP</p>
              <p className="text-sm font-body" style={{ color:'var(--text-muted)' }}>Keep tracking to earn more!</p>
            </div>
            <div className="text-right">
              <p className="font-pixel text-xl neon-text-cyan">+{log.xpEarned}</p>
              <p className="text-xs font-body" style={{ color:'var(--text-muted)' }}>XP today</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
