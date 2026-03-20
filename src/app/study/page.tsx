'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppStore } from '@/store'

const BOSSES = [
  { name:'Ender Dragon',    hp:100, emoji:'🐲', reward:200, weakness:'25min focus'  },
  { name:'Cave Spider Boss',hp:150, emoji:'🕷️', reward:350, weakness:'3 sessions'   },
  { name:'Iron Golem',      hp:80,  emoji:'🤖', reward:150, weakness:'15min sprint' },
  { name:'Wither',          hp:300, emoji:'💀', reward:600, weakness:'5 sessions'   },
]
const MODES = { pomodoro:25*60, short:5*60, long:15*60 }
const MODE_LABELS = { pomodoro:'⛏️ Focus', short:'🍵 Rest', long:'🌿 Long Rest' }

export default function StudyPage() {
  const { awardXP, addNotification } = useAppStore()
  const [mode, setMode] = useState<'pomodoro'|'short'|'long'>('pomodoro')
  const [running, setRunning] = useState(false)
  const [time, setTime] = useState(25*60)
  const [sessions, setSessions] = useState(0)
  const [boss, setBoss] = useState(BOSSES[0])
  const [bossHp, setBossHp] = useState(100)
  const [totalMin, setTotalMin] = useState(0)
  const [showVictory, setShowVictory] = useState(false)
  const iRef = useRef<NodeJS.Timeout|null>(null)

  useEffect(()=>{ setTime(MODES[mode]); setRunning(false) },[mode])

  const complete = useCallback(()=>{
    if (mode!=='pomodoro') return
    setSessions(s=>s+1); setTotalMin(t=>t+25)
    awardXP(25*4,'Study session')
    const dmg = Math.floor(20+Math.random()*30)
    setBossHp(hp=>{ const n=Math.max(0,hp-dmg); if(n===0) setTimeout(()=>setShowVictory(true),400); return n })
    addNotification({ type:'xp', message:`Focus complete! ⚔️ ${dmg} damage dealt!` })
  },[mode, awardXP, addNotification])

  useEffect(()=>{
    if (running) {
      iRef.current = setInterval(()=>{
        setTime(t=>{ if(t<=1){ clearInterval(iRef.current!); setRunning(false); complete(); return 0 } return t-1 })
      },1000)
    } else clearInterval(iRef.current!)
    return ()=>clearInterval(iRef.current!)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[running, complete])

  const nextBoss = () => {
    awardXP(boss.reward, `Defeated ${boss.name}!`)
    setShowVictory(false)
    const next = BOSSES[(BOSSES.indexOf(boss)+1)%BOSSES.length]
    setBoss(next); setBossHp(next.hp)
  }

  const pct = Math.floor((time/MODES[mode])*100)
  const mm = Math.floor(time/60)
  const ss = time%60
  const bossPct = Math.floor((bossHp/boss.hp)*100)

  return (
    <DashboardLayout title="📖 Study Arena">
      <div className="space-y-4 sm:space-y-5 max-w-2xl mx-auto">
        <div>
          <h2 className="font-display font-bold text-xl" style={{ color:'var(--text-primary)' }}>Study Arena</h2>
          <p className="text-sm font-body" style={{ color:'var(--text-muted)' }}>Focus to damage bosses and earn massive XP!</p>
        </div>

        {/* Boss */}
        <div className="card-dark p-4 sm:p-5" style={{ borderColor:'rgba(255,80,80,0.3)', background:'rgba(255,80,80,0.03)' }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl sm:text-4xl">{boss.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold" style={{ color:'var(--text-primary)' }}>{boss.name}</p>
              <p className="text-xs font-body" style={{ color:'var(--text-muted)' }}>Weakness: {boss.weakness}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-pixel text-sm" style={{ color:'#f87171' }}>{bossHp}/{boss.hp} HP</p>
              <p className="text-xs font-body" style={{ color:'var(--text-muted)' }}>+{boss.reward} XP reward</p>
            </div>
          </div>
          <div className="xp-bar h-3">
            <motion.div className="xp-bar-fill h-full" animate={{ width:`${bossPct}%` }} transition={{ duration:0.5 }}
              style={{ background:'linear-gradient(90deg, var(--neon-pink), var(--neon-orange))' }}/>
          </div>
        </div>

        {/* Timer */}
        <div className="card-dark p-5 sm:p-8 text-center">
          {/* Mode selector */}
          <div className="flex justify-center gap-2 mb-6 sm:mb-8 flex-wrap">
            {(Object.keys(MODES) as (keyof typeof MODES)[]).map(m=>(
              <button key={m} onClick={()=>setMode(m)}
                className="px-3 sm:px-4 py-2 rounded-lg font-body text-sm transition-all"
                style={{ background:mode===m?'var(--sidebar-active)':'transparent', color:mode===m?'var(--neon-purple)':'var(--text-muted)', border:`1px solid ${mode===m?'var(--border-active)':'transparent'}` }}>
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>

          {/* Circle timer */}
          <div className="relative w-36 h-36 sm:w-48 sm:h-48 mx-auto mb-6 sm:mb-8">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" stroke="var(--border-subtle)" />
              <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6"
                stroke={running?'var(--neon-cyan)':'var(--neon-purple)'}
                strokeDasharray={`${pct*2.64} 264`} strokeLinecap="round"
                style={{ filter:`drop-shadow(0 0 8px ${running?'var(--neon-cyan)':'var(--neon-purple)'})`, transition:'stroke-dasharray 1s linear' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-pixel text-xl sm:text-3xl" style={{ color:'var(--text-primary)' }}>
                {String(mm).padStart(2,'0')}:{String(ss).padStart(2,'0')}
              </span>
              <span className="text-xs font-body mt-1" style={{ color:'var(--text-muted)' }}>
                {running?'🔥 Focused':'Ready'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <motion.button whileTap={{ scale:0.96 }} onClick={()=>setRunning(r=>!r)}
              className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-display font-bold text-lg sm:text-xl transition-all"
              style={running
                ? { background:'rgba(255,80,80,0.12)', border:'1px solid #f87171', color:'#f87171' }
                : { background:'linear-gradient(135deg, var(--neon-purple), var(--neon-cyan))', color:'white', boxShadow:'0 0 24px rgba(180,79,255,0.4)' }}>
              {running?'⏸ Pause':'▶ Start'}
            </motion.button>
            <button onClick={()=>{ setRunning(false); setTime(MODES[mode]) }}
              className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-display font-bold transition-all"
              style={{ border:'1px solid var(--border-color)', color:'var(--text-secondary)' }}>
              ↺
            </button>
          </div>
        </div>

        {/* Session stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon:'⛏️', label:'Sessions',  val:sessions      },
            { icon:'⏱️', label:'Minutes',   val:totalMin      },
            { icon:'⚡', label:'XP Earned', val:totalMin*4    },
          ].map(s=>(
            <div key={s.label} className="card-dark p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl mb-1">{s.icon}</div>
              <div className="font-display font-bold text-lg sm:text-xl neon-text-cyan">{s.val}</div>
              <div className="text-xs font-body" style={{ color:'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Boss selector */}
        <div className="card-dark p-4 sm:p-5">
          <h3 className="font-display font-bold mb-3" style={{ color:'var(--text-primary)' }}>Select Challenge</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {BOSSES.map(b=>(
              <button key={b.name} onClick={()=>{ setBoss(b); setBossHp(b.hp) }}
                className="p-2.5 sm:p-3 rounded-xl text-center transition-all"
                style={{ border:`1px solid ${boss.name===b.name?'var(--border-active)':'var(--border-subtle)'}`, background:boss.name===b.name?'var(--sidebar-active)':'transparent' }}>
                <div className="text-xl sm:text-2xl mb-1">{b.emoji}</div>
                <div className="text-xs font-body truncate" style={{ color:'var(--text-secondary)' }}>{b.name.split(' ')[0]}</div>
                <div className="text-xs font-body" style={{ color:'var(--neon-purple)' }}>+{b.reward} XP</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Victory modal */}
      <AnimatePresence>
        {showVictory && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:'var(--modal-overlay)', backdropFilter:'blur(8px)' }}>
            <motion.div initial={{ scale:0.5, rotate:-8 }} animate={{ scale:1, rotate:0 }}
              className="text-center p-6 sm:p-8 rounded-2xl max-w-xs w-full"
              style={{ background:'var(--modal-bg)', border:'2px solid var(--neon-yellow)', boxShadow:'0 0 40px rgba(255,215,0,0.3)' }}>
              <div className="text-6xl mb-4 animate-bounce">🏆</div>
              <h2 className="font-pixel text-base neon-text-yellow mb-2">BOSS DEFEATED!</h2>
              <p className="font-display font-bold text-xl mb-1" style={{ color:'var(--text-primary)' }}>{boss.name}</p>
              <p className="font-body mb-6" style={{ color:'var(--text-secondary)' }}>+{boss.reward} XP Earned!</p>
              <button onClick={nextBoss} className="btn-neon px-8 py-3 text-lg font-display font-bold w-full">
                ⚔️ Next Challenge
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
