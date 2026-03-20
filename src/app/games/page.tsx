'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppStore } from '@/store'

/* ─── Memory Match ─────────────────────────────────── */
const MC_CARDS = ['⛏️','🗡️','🛡️','🏹','💎','🪓','🔥','💀']

function MemoryGame({ onWin }: { onWin:(s:number)=>void }) {
  const [cards, setCards] = useState<{id:number;e:string;flipped:boolean;matched:boolean}[]>([])
  const [picked, setPicked] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [start] = useState(Date.now())

  useEffect(()=>{
    const deck = [...MC_CARDS,...MC_CARDS].sort(()=>Math.random()-0.5).map((e,i)=>({id:i,e,flipped:false,matched:false}))
    setCards(deck)
  },[])

  const flip = (id:number)=>{
    if (picked.length===2) return
    const card = cards.find(c=>c.id===id)
    if (!card||card.flipped||card.matched) return
    const next = [...picked,id]
    setCards(c=>c.map(c=>c.id===id?{...c,flipped:true}:c))
    setPicked(next)
    if (next.length===2) {
      setMoves(m=>m+1)
      const [a,b] = next.map(i=>cards.find(c=>c.id===i)!)
      if (a.e===b.e) {
        const updated = cards.map(c=>next.includes(c.id)?{...c,matched:true,flipped:true}:c)
        updated.find(c=>c.id===id)!.flipped=true
        setCards(updated)
        setPicked([])
        if (updated.filter(c=>c.matched).length+2===updated.length) {
          const score = Math.max(100, 500-moves*10-Math.floor((Date.now()-start)/1000))
          setTimeout(()=>onWin(score),300)
        }
      } else {
        setTimeout(()=>{ setCards(c=>c.map(c=>next.includes(c.id)?{...c,flipped:false}:c)); setPicked([]) }, 800)
      }
    }
  }

  return (
    <div>
      <p className="text-sm font-body mb-4" style={{ color:'var(--text-secondary)' }}>Moves: {moves} — Match all Minecraft pairs!</p>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {cards.map(card=>(
          <motion.button key={card.id} onClick={()=>flip(card.id)} whileHover={{ scale:card.flipped||card.matched?1:1.05 }}
            className="h-11 sm:h-14 rounded-xl text-xl sm:text-2xl flex items-center justify-center transition-all"
            style={{
              background: card.matched?'rgba(57,255,20,0.12)' : card.flipped?'rgba(0,245,255,0.1)':'var(--bg-hover)',
              border: `1px solid ${card.matched?'var(--neon-green)':card.flipped?'var(--neon-cyan)':'var(--border-color)'}`,
            }}>
            {card.flipped||card.matched ? card.e : '❓'}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

/* ─── Math Rush ────────────────────────────────────── */
function MathGame({ onWin }: { onWin:(s:number)=>void }) {
  const [q, setQ] = useState({a:0,b:0,op:'+',ans:0})
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [time, setTime] = useState(30)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  const next = useCallback(()=>{
    const ops=['+','-','×']; const op=ops[Math.floor(Math.random()*3)]
    const a=Math.floor(Math.random()*20)+1; const b=Math.floor(Math.random()*20)+1
    const ans=op==='+'?a+b:op==='-'?a-b:a*b
    setQ({a,b,op,ans}); setInput('')
  },[])

  useEffect(()=>{ if(started) next() },[started])
  useEffect(()=>{
    if(!started||done) return
    const t=setInterval(()=>setTime(tl=>{ if(tl<=1){clearInterval(t);setDone(true);onWin(score);return 0} return tl-1 }),1000)
    return ()=>clearInterval(t)
  },[started,done,score])

  const check=(e:React.FormEvent)=>{
    e.preventDefault()
    if(parseInt(input)===q.ans){ setScore(s=>s+(streak>=3?20:streak>=1?15:10)); setStreak(s=>s+1) }
    else setStreak(0)
    next(); ref.current?.focus()
  }

  if (!started) return (
    <div className="text-center py-6">
      <p className="text-sm font-body mb-4" style={{ color:'var(--text-secondary)' }}>Craft the correct answer in 30 seconds. Streaks = bonus points!</p>
      <button onClick={()=>setStarted(true)} className="btn-neon px-8 py-3 text-lg font-display">⚒️ START CRAFTING!</button>
    </div>
  )

  return (
    <div className="text-center py-2">
      <div className="flex justify-between mb-6 font-body text-sm">
        <span style={{ color:'var(--neon-yellow)' }}>⏱️ {time}s</span>
        <span className="neon-text-cyan">Score: {score}</span>
        <span style={{ color:'var(--neon-orange)' }}>🔥 {streak}</span>
      </div>
      <div className="font-pixel text-3xl sm:text-4xl neon-text-purple mb-6">{q.a} {q.op} {q.b} = ?</div>
      <form onSubmit={check} className="flex gap-3 justify-center">
        <input ref={ref} type="number" value={input} onChange={e=>setInput(e.target.value)} autoFocus
          className="w-28 sm:w-32 rounded-xl px-4 py-3 font-pixel text-xl sm:text-2xl text-center input-field"
          style={{ border:'2px solid var(--neon-cyan)' }} />
        <button type="submit" className="btn-neon px-5 py-3 font-display font-bold">Go!</button>
      </form>
      {streak>=3 && <p className="mt-3 text-sm font-body animate-pulse" style={{ color:'var(--neon-orange)' }}>🔥 Hot streak! +{streak>=3?20:15} per answer</p>}
    </div>
  )
}

/* ─── Creeper Alert ────────────────────────────────── */
function ReactionGame({ onWin }: { onWin:(s:number)=>void }) {
  const [state, setState] = useState<'idle'|'waiting'|'ready'|'hit'|'done'>('idle')
  const [rt, setRt] = useState(0)
  const [attempts, setAttempts] = useState<number[]>([])
  const tRef = useRef<NodeJS.Timeout|null>(null)
  const startRef = useRef(0)

  const start=()=>{ setState('waiting'); tRef.current=setTimeout(()=>{ setState('ready'); startRef.current=Date.now() }, 1500+Math.random()*3000) }
  const click=()=>{
    if(state==='waiting'){ clearTimeout(tRef.current!); setState('idle'); return }
    if(state==='ready'){
      const r=Date.now()-startRef.current; setRt(r)
      const next=[...attempts,r]; setAttempts(next)
      if(next.length>=3){ const avg=next.reduce((a,b)=>a+b)/next.length; setState('done'); onWin(Math.max(50,Math.floor(500-avg/2))) }
      else { setState('hit'); setTimeout(()=>setState('idle'),800) }
    }
  }

  const bg = state==='ready' ? 'rgba(57,255,20,0.25)' : state==='waiting' ? 'rgba(255,80,80,0.15)' : 'var(--bg-hover)'
  const border = state==='ready' ? 'var(--neon-green)' : state==='waiting' ? '#ff5555' : 'var(--border-color)'

  return (
    <div className="text-center py-2">
      <p className="text-sm font-body mb-4" style={{ color:'var(--text-secondary)' }}>
        {attempts.length>0 ? `Attempt ${attempts.length}/3 · Last: ${rt}ms` : 'Click when the Creeper explodes!'}
      </p>
      <motion.button onClick={state==='idle'?start:click} whileTap={{ scale:0.97 }}
        className="w-full h-36 sm:h-40 rounded-2xl font-display font-bold text-xl sm:text-2xl transition-all cursor-pointer"
        style={{ background:bg, border:`2px solid ${border}`, color:'var(--text-primary)' }}>
        {state==='idle'&&'👆 Click to Start'}
        {state==='waiting'&&'⏳ Creeper incoming...'}
        {state==='ready'&&'💥 PUNCH IT NOW!'}
        {state==='hit'&&`⚡ ${rt}ms!`}
        {state==='done'&&'✅ Done!'}
      </motion.button>
      {attempts.length>0 && (
        <p className="text-xs font-body mt-2" style={{ color:'var(--text-muted)' }}>Times: {attempts.map(t=>`${t}ms`).join(' · ')}</p>
      )}
    </div>
  )
}

/* ─── Games Page ───────────────────────────────────── */
const GAMES = [
  { id:'memory',   name:'Memory Match',  emoji:'📖', desc:'Match Minecraft items! Tests your memory.', reward:30 },
  { id:'math',     name:'Crafting Math', emoji:'🔢', desc:'Craft the correct answer before time runs out!', reward:25 },
  { id:'reaction', name:'Creeper Alert!',emoji:'💚', desc:'Punch the Creeper when it appears!', reward:20 },
]

export default function GamesPage() {
  const { addNotification, updateUser, user } = useAppStore()
  const [active, setActive] = useState<string|null>(null)
  const [key, setKey] = useState(0)

  const win = async (gameId:string, score:number) => {
    const g = GAMES.find(g=>g.id===gameId)!
    const coins = g.reward + Math.floor(score/10)
    const xp = Math.floor(score/2)
    addNotification({ type:'coin', message:`🎮 +${coins} emeralds, +${xp} XP!` })
    updateUser({ coins:(user?.coins||0)+coins, xp:(user?.xp||0)+xp })
  }

  return (
    <DashboardLayout title="🎮 Mini Games">
      <div className="space-y-5">
        <div>
          <h2 className="font-display font-bold text-xl" style={{ color:'var(--text-primary)' }}>Minecraft Arcade</h2>
          <p className="text-sm font-body" style={{ color:'var(--text-muted)' }}>Earn emeralds and XP by playing!</p>
        </div>

        {!active ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {GAMES.map((g,i)=>(
              <motion.div key={g.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }}
                whileHover={{ scale:1.02 }} onClick={()=>{ setActive(g.id); setKey(k=>k+1) }}
                className="card-dark p-5 sm:p-6 text-center cursor-pointer hover:border-purple-400/50 transition-all">
                <div className="text-4xl sm:text-5xl mb-3 animate-float" style={{ animationDelay:`${i*0.3}s` }}>{g.emoji}</div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color:'var(--text-primary)' }}>{g.name}</h3>
                <p className="text-sm font-body mb-4" style={{ color:'var(--text-secondary)' }}>{g.desc}</p>
                <div className="flex justify-center gap-4 text-xs font-body mb-4">
                  <span style={{ color:'var(--neon-yellow)' }}>🪙 +{g.reward}+ emeralds</span>
                  <span className="neon-text-cyan">⚡ +XP</span>
                </div>
                <button className="btn-neon w-full py-2.5 font-display font-bold">PLAY</button>
              </motion.div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
              className="card-dark p-4 sm:p-6 max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-lg" style={{ color:'var(--text-primary)' }}>
                  {GAMES.find(g=>g.id===active)?.emoji} {GAMES.find(g=>g.id===active)?.name}
                </h3>
                <button onClick={()=>setActive(null)} className="text-sm font-body px-3 py-1 rounded-lg"
                  style={{ color:'var(--text-muted)', background:'var(--bg-hover)' }}>← Back</button>
              </div>
              {active==='memory'   && <MemoryGame   key={key} onWin={s=>win('memory',s)}   />}
              {active==='math'     && <MathGame     key={key} onWin={s=>win('math',s)}     />}
              {active==='reaction' && <ReactionGame key={key} onWin={s=>win('reaction',s)} />}
              <button onClick={()=>setKey(k=>k+1)}
                className="mt-4 w-full py-2.5 rounded-lg font-body text-sm transition-all"
                style={{ border:'1px solid var(--border-active)', color:'var(--neon-purple)', background:'transparent' }}>
                🔄 Play Again
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </DashboardLayout>
  )
}
