'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppStore } from '@/store'

const CLAN_EMOJIS = ['⚔️','🛡️','🏰','🐲','💎','⛏️','🔥','💀','🧱','🏹']
const DEFAULT_FORM = { name:'', description:'', emoji:'⚔️', isPublic:true }

export default function ClanPage() {
  const { addNotification } = useAppStore()
  const [myClan, setMyClan] = useState<any>(null)
  const [publicClans, setPublicClans] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'my'|'browse'|'leaderboard'>('my')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    const [myData, lbData] = await Promise.all([
      fetch('/api/clans').then(r=>r.json()),
      fetch('/api/clans?action=leaderboard').then(r=>r.json()),
    ])
    setMyClan(myData.clan); setLeaderboard(lbData.clans||[])
    setLoading(false)
  }
  useEffect(()=>{ load() },[])

  const searchClans = async () => {
    const data = await fetch(`/api/clans?action=search&q=${search}`).then(r=>r.json())
    setPublicClans(data.clans||[])
  }
  useEffect(()=>{ if(tab==='browse') searchClans() },[tab])

  const createClan = async (e:React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/clans',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action:'create', ...form }) })
    const data = await res.json()
    if (res.ok) { addNotification({ type:'info', message:`Clan "${form.name}" created! ⚔️` }); setShowCreate(false); load() }
    else addNotification({ type:'error', message:data.error })
  }

  const join = async (clanId:string) => {
    const res = await fetch('/api/clans',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action:'join', clanId }) })
    const data = await res.json()
    if (res.ok) { addNotification({ type:'info', message:'Joined clan!' }); load(); setTab('my') }
    else addNotification({ type:'error', message:data.error })
  }

  const leave = async () => {
    if (!confirm('Leave your clan?')) return
    await fetch('/api/clans',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action:'leave' }) })
    addNotification({ type:'info', message:'Left clan.' }); load()
  }

  const TabBtn = ({ id, label }: { id:typeof tab; label:string }) => (
    <button onClick={()=>setTab(id)}
      className="px-3 sm:px-4 py-2 rounded-lg font-body text-sm transition-all"
      style={{ background:tab===id?'rgba(180,79,255,0.12)':'transparent', color:tab===id?'var(--neon-purple)':'var(--text-muted)', border:`1px solid ${tab===id?'var(--border-active)':'transparent'}` }}>
      {label}
    </button>
  )

  return (
    <DashboardLayout title="🛡️ LifeClans">
      <div className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-display font-bold text-xl" style={{ color:'var(--text-primary)' }}>Clans</h2>
            <p className="text-sm font-body" style={{ color:'var(--text-muted)' }}>Team up for epic group challenges!</p>
          </div>
          {!myClan && <button onClick={()=>setShowCreate(true)} className="btn-neon-green text-sm px-4 py-2">+ Create Clan</button>}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          <TabBtn id="my" label="🛡️ My Clan" />
          <TabBtn id="browse" label="🔭 Browse" />
          <TabBtn id="leaderboard" label="🏆 Rankings" />
        </div>

        {/* My Clan */}
        {tab==='my' && (
          loading ? <div className="h-40 rounded-xl skeleton-pulse"/> :
          myClan ? (
            <div className="card-dark p-5 sm:p-6" style={{ borderColor:`${myClan.color}60` }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0"
                  style={{ background:'var(--bg-hover)', border:`2px solid ${myClan.color}` }}>{myClan.emoji}</div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-xl" style={{ color:'var(--text-primary)' }}>{myClan.name}</h3>
                  <p className="text-sm font-body" style={{ color:'var(--text-secondary)' }}>{myClan.description}</p>
                  <p className="text-xs font-body mt-0.5" style={{ color:myClan.color }}>
                    Level {myClan.level} · {myClan.members?.length}/{myClan.maxMembers} members
                  </p>
                </div>
              </div>
              <h4 className="font-display font-bold mb-3" style={{ color:'var(--text-primary)' }}>Members</h4>
              <div className="space-y-2">
                {myClan.members?.map((m:any)=>(
                  <div key={m._id} className="flex items-center gap-3 py-2" style={{ borderBottom:'1px solid var(--border-subtle)' }}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm flex-shrink-0">
                      {m.userId?.avatar||'⛏️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-body text-sm" style={{ color:'var(--text-primary)' }}>{m.userId?.username||'Member'}</span>
                      <span className="text-xs font-body ml-2" style={{ color:'var(--text-muted)' }}>Lv.{m.userId?.level||1}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-body flex-shrink-0"
                      style={{ color:m.role==='leader'?'var(--neon-yellow)':m.role==='officer'?'var(--neon-cyan)':'var(--text-muted)', background:`${m.role==='leader'?'rgba(255,215,0,0.1)':m.role==='officer'?'rgba(0,245,255,0.1)':'var(--bg-hover)'}`, border:`1px solid ${m.role==='leader'?'rgba(255,215,0,0.4)':m.role==='officer'?'rgba(0,245,255,0.4)':'var(--border-color)'}` }}>
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
              <button onClick={leave} className="mt-4 text-xs font-body transition-colors" style={{ color:'var(--text-muted)' }}>Leave Clan</button>
            </div>
          ) : (
            <div className="text-center py-14 card-dark">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="font-display font-bold mb-2" style={{ color:'var(--text-primary)' }}>No Clan Yet</h3>
              <p className="text-sm font-body mb-6" style={{ color:'var(--text-muted)' }}>Create or join a clan to start co-op quests!</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button onClick={()=>setShowCreate(true)} className="btn-neon-green px-5 py-2.5">Create Clan</button>
                <button onClick={()=>setTab('browse')} className="btn-neon px-5 py-2.5">Browse Clans</button>
              </div>
            </div>
          )
        )}

        {/* Browse */}
        {tab==='browse' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&searchClans()}
                placeholder="Search clans..." className="flex-1 px-4 py-2 rounded-lg input-field text-sm font-body" />
              <button onClick={searchClans} className="btn-neon px-4 py-2 text-sm">🔭 Search</button>
            </div>
            {publicClans.length===0
              ? <p className="text-center py-8 font-body text-sm" style={{ color:'var(--text-muted)' }}>No clans found. Create the first one!</p>
              : publicClans.map(c=>(
                <div key={c._id} className="card-dark p-4 flex items-center gap-3 sm:gap-4">
                  <div className="text-3xl flex-shrink-0">{c.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold" style={{ color:'var(--text-primary)' }}>{c.name}</h4>
                    <p className="text-xs font-body" style={{ color:'var(--text-muted)' }}>{c.description}</p>
                    <p className="text-xs font-body mt-0.5" style={{ color:'var(--text-secondary)' }}>{c.members?.length}/{c.maxMembers} members · Lv.{c.level}</p>
                  </div>
                  {!myClan && <button onClick={()=>join(c._id)} className="btn-neon text-xs px-4 py-2 flex-shrink-0">Join</button>}
                </div>
              ))
            }
          </div>
        )}

        {/* Leaderboard */}
        {tab==='leaderboard' && (
          <div className="space-y-2">
            {leaderboard.map((c,i)=>(
              <motion.div key={c._id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.04 }}
                className="card-dark p-3 sm:p-4 flex items-center gap-3">
                <div className="w-7 text-center font-pixel text-xs flex-shrink-0"
                  style={{ color:i===0?'var(--neon-yellow)':i===1?'#d0d0d0':i===2?'var(--neon-orange)':'var(--text-muted)' }}>
                  #{i+1}
                </div>
                <div className="text-2xl flex-shrink-0">{c.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-sm" style={{ color:'var(--text-primary)' }}>{c.name}</h4>
                  <p className="text-xs font-body" style={{ color:'var(--text-muted)' }}>{c.members?.length} members</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="neon-text-cyan font-display font-bold">{c.totalXp?.toLocaleString()||0}</p>
                  <p className="text-xs font-body" style={{ color:'var(--text-muted)' }}>total XP</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create clan modal */}
      {showCreate && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          style={{ background:'var(--modal-overlay)', backdropFilter:'blur(6px)' }}
          onClick={e=>{ if(e.target===e.currentTarget) setShowCreate(false) }}>
          <motion.div initial={{ scale:0.92 }} animate={{ scale:1 }} onClick={e=>e.stopPropagation()}
            className="w-full max-w-md rounded-2xl p-4 sm:p-6 neon-border"
            style={{ background:'var(--modal-bg)' }}>
            <h3 className="font-pixel text-xs neon-text-purple mb-5">CREATE CLAN</h3>
            <form onSubmit={createClan} className="space-y-4">
              <div>
                <label className="text-xs font-body mb-1 block" style={{ color:'var(--text-muted)' }}>Clan Name *</label>
                <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                  placeholder="The Diamond Raiders" className="w-full px-3 py-2 rounded-lg text-sm font-body input-field" />
              </div>
              <div>
                <label className="text-xs font-body mb-1 block" style={{ color:'var(--text-muted)' }}>Description</label>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                  rows={2} placeholder="What is your clan about?" className="w-full px-3 py-2 rounded-lg text-sm font-body resize-none input-field" />
              </div>
              <div>
                <label className="text-xs font-body mb-2 block" style={{ color:'var(--text-muted)' }}>Clan Emoji</label>
                <div className="flex gap-2 flex-wrap">
                  {CLAN_EMOJIS.map(e=>(
                    <button type="button" key={e} onClick={()=>setForm({...form,emoji:e})}
                      className="text-2xl p-1.5 rounded-lg transition-all"
                      style={{ background:form.emoji===e?'var(--sidebar-active)':'transparent', transform:form.emoji===e?'scale(1.15)':'scale(1)' }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-body" style={{ color:'var(--text-muted)' }}>Public clan?</label>
                <button type="button" onClick={()=>setForm({...form,isPublic:!form.isPublic})}
                  className="relative w-10 h-5 rounded-full transition-all"
                  style={{ background:form.isPublic?'rgba(180,79,255,0.3)':'var(--bg-hover)', border:'1px solid var(--border-active)' }}>
                  <div className="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all"
                    style={{ background:'var(--neon-purple)', left:form.isPublic?'calc(100% - 16px)':'2px' }}/>
                </button>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={()=>setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-body"
                  style={{ border:'1px solid var(--border-color)', color:'var(--text-muted)' }}>Cancel</button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-lg text-sm font-body font-semibold text-white"
                  style={{ background:'linear-gradient(135deg, var(--neon-purple), var(--neon-cyan))' }}>
                  Create Clan ⚔️
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </DashboardLayout>
  )
}
