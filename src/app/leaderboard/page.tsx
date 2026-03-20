'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppStore } from '@/store'
import { formatNumber } from '@/lib/utils'

type SortType = 'xp' | 'streak' | 'quests'

export default function LeaderboardPage() {
  const { user } = useAppStore()
  const [lb, setLb] = useState<any[]>([])
  const [sort, setSort] = useState<SortType>('xp')
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    setLoading(true)
    fetch(`/api/user/leaderboard?type=${sort}`).then(r=>r.json()).then(d=>{ setLb(d.leaderboard||[]); setLoading(false) })
  },[sort])

  const val = (p:any) => sort==='xp' ? p.xp : sort==='streak' ? p.streak : p.questsCompleted
  const MEDALS = ['🥇','🥈','🥉']
  const SORTS: {k:SortType; label:string}[] = [{k:'xp',label:'⚡ XP'},{k:'streak',label:'🔥 Streak'},{k:'quests',label:'✅ Quests'}]

  return (
    <DashboardLayout title="🏆 Leaderboard">
      <div className="space-y-4 sm:space-y-5">
        <div>
          <h2 className="font-display font-bold text-xl" style={{ color:'var(--text-primary)' }}>Global Rankings</h2>
          <p className="text-sm font-body" style={{ color:'var(--text-muted)' }}>Compete with adventurers worldwide!</p>
        </div>

        {/* Sort tabs */}
        <div className="flex gap-2">
          {SORTS.map(s=>(
            <button key={s.k} onClick={()=>setSort(s.k)}
              className="px-3 sm:px-4 py-2 rounded-lg font-body text-sm transition-all"
              style={{ background:sort===s.k?'rgba(255,215,0,0.12)':'transparent', color:sort===s.k?'var(--neon-yellow)':'var(--text-muted)', border:`1px solid ${sort===s.k?'var(--neon-yellow)':'transparent'}` }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Podium */}
        {!loading && lb.length>=3 && (
          <div className="flex items-end justify-center gap-2 sm:gap-4 py-4">
            {[lb[1],lb[0],lb[2]].map((p,pi)=>{
              const heights=['64px','88px','52px']
              const isFirst=pi===1
              return (
                <motion.div key={p?.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:pi*0.1 }}
                  className="flex flex-col items-center">
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-lg sm:text-2xl mb-1 sm:mb-2 ${isFirst?'ring-2 sm:ring-4 ring-yellow-500/60':''}`}
                    style={isFirst?{boxShadow:'0 0 20px rgba(255,215,0,0.4)'}:{}}>
                    {p?.avatar||'⛏️'}
                  </div>
                  <p className="font-display font-bold text-xs sm:text-sm" style={{ color:'var(--text-primary)' }}>{p?.username}</p>
                  <p className="text-xs font-body" style={{ color:isFirst?'var(--neon-yellow)':'var(--text-muted)' }}>
                    {formatNumber(val(p))}
                  </p>
                  <div className="w-16 sm:w-20 mt-1.5 sm:mt-2 rounded-t-lg flex items-center justify-center font-pixel text-base sm:text-lg"
                    style={{ height:heights[pi], background:isFirst?'rgba(255,215,0,0.12)':'rgba(180,79,255,0.1)', border:`1px solid ${isFirst?'rgba(255,215,0,0.5)':'var(--border-color)'}` }}>
                    {MEDALS[pi===0?1:pi===1?0:2]}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Full list */}
        <div className="space-y-2">
          {loading ? Array(10).fill(0).map((_,i)=><div key={i} className="h-14 rounded-xl skeleton-pulse"/>)
          : lb.map((p,i)=>(
            <motion.div key={p.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.02 }}
              className="card-dark p-3 flex items-center gap-2 sm:gap-3"
              style={p.isCurrentUser?{borderColor:'var(--neon-cyan)',background:'rgba(0,245,255,0.04)'}:{}}>
              <div className="w-7 sm:w-8 text-center font-pixel text-xs sm:text-sm flex-shrink-0"
                style={{ color:i===0?'var(--neon-yellow)':i===1?'#e0e0e0':i===2?'var(--neon-orange)':'var(--text-muted)' }}>
                {i<3 ? MEDALS[i] : `#${p.rank}`}
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-base sm:text-lg flex-shrink-0">
                {p.avatar||'⛏️'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-bold text-sm" style={{ color:p.isCurrentUser?'var(--neon-cyan)':'var(--text-primary)' }}>{p.username}</span>
                  {p.isCurrentUser && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ color:'var(--neon-cyan)', background:'rgba(0,245,255,0.12)', border:'1px solid var(--neon-cyan)' }}>You</span>}
                </div>
                <p className="text-xs font-body" style={{ color:'var(--text-muted)' }}>Lv.{p.level} · {p.title}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-display font-bold text-sm sm:text-base" style={{ color:i===0?'var(--neon-yellow)':'var(--text-primary)' }}>
                  {formatNumber(val(p))}
                </p>
                <p className="text-xs font-body" style={{ color:'var(--text-muted)' }}>{sort}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
