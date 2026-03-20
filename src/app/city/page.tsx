'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppStore } from '@/store'

interface Building { type:string; name:string; emoji:string; description:string; unlockLevel:number; category:string }
interface CityData { cityName:string; population:number; buildings:Array<{buildingType:string;position:{x:number;y:number};level:number}> }

export default function CityPage() {
  const { user, addNotification } = useAppStore()
  const [city, setCity] = useState<CityData|null>(null)
  const [allBuildings, setAllBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState<string|null>(null)
  const [editingName, setEditingName] = useState(false)
  const [cityName, setCityName] = useState('')

  const load = async () => {
    setLoading(true)
    const data = await fetch('/api/city').then(r=>r.json())
    setCity(data.city); setAllBuildings(data.buildings||[]); setCityName(data.city?.cityName||'')
    setLoading(false)
  }
  useEffect(()=>{ load() },[])

  const addBuilding = async (type:string) => {
    setAdding(type)
    const res = await fetch('/api/city',{ method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action:'addBuilding', buildingType:type, position:{x:Math.random()*8,y:Math.random()*8} }) })
    const data = await res.json()
    if (res.ok) { addNotification({ type:'info', message:data.message||'Building placed!' }); load() }
    else addNotification({ type:'error', message:data.error })
    setAdding(null)
  }

  const saveName = async () => {
    await fetch('/api/city',{ method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action:'rename', cityName }) })
    setEditingName(false); load()
  }

  const builtTypes = city?.buildings.map(b=>b.buildingType)||[]
  const level = user?.level||1

  return (
    <DashboardLayout title="🏘️ FocusCity">
      <div className="space-y-4 sm:space-y-6">

        {/* City header */}
        <div className="card-dark p-4 sm:p-5" style={{ background:'linear-gradient(135deg, rgba(0,245,255,0.06), rgba(180,79,255,0.06))' }}>
          <div className="flex items-start sm:items-center justify-between flex-wrap gap-3">
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex gap-2 items-center">
                  <input value={cityName} onChange={e=>setCityName(e.target.value)}
                    className="rounded px-3 py-1 font-display font-bold text-lg focus:outline-none input-field min-w-0 flex-1" />
                  <button onClick={saveName} className="btn-neon text-xs px-3 py-1.5 flex-shrink-0">Save</button>
                  <button onClick={()=>setEditingName(false)} className="text-xl flex-shrink-0" style={{ color:'var(--text-muted)' }}>×</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-lg sm:text-xl truncate" style={{ color:'var(--text-primary)' }}>{city?.cityName||'My City'}</h2>
                  <button onClick={()=>setEditingName(true)} className="text-sm flex-shrink-0" style={{ color:'var(--text-muted)' }}>✏️</button>
                </div>
              )}
              <p className="font-body text-sm mt-1" style={{ color:'var(--text-secondary)' }}>
                👥 Pop: {city?.population||0} · 🔨 {builtTypes.length} buildings
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-body" style={{ color:'var(--text-muted)' }}>Your Level</p>
              <p className="font-pixel text-xl neon-text-cyan">{level}</p>
            </div>
          </div>
        </div>

        {/* City map */}
        <div className="card-dark p-4 sm:p-5">
          <h3 className="font-display font-bold mb-4" style={{ color:'var(--text-primary)' }}>🗺️ City Map</h3>
          {loading ? (
            <div className="h-44 sm:h-56 rounded-xl skeleton-pulse" />
          ) : (
            <div className="relative rounded-xl overflow-hidden" style={{ height:'200px', background:'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-base) 50%, var(--bg-surface) 100%)', border:'1px solid var(--border-color)' }}>
              <div className="absolute inset-0" style={{ backgroundImage:'linear-gradient(var(--grid-line) 1px, transparent 1px),linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)', backgroundSize:'40px 40px' }} />
              {builtTypes.map((type,i)=>{
                const b = allBuildings.find(ab=>ab.type===type)
                if (!b) return null
                const angle = (i/Math.max(builtTypes.length,1))*Math.PI*2
                const r = 70+(i%3)*28
                const x = 50+Math.cos(angle)*r*0.32
                const y = 50+Math.sin(angle)*r*0.32
                return (
                  <motion.div key={type} initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:i*0.1 }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 text-center cursor-pointer group"
                    style={{ left:`${x}%`, top:`${y}%` }}>
                    <div className="text-xl sm:text-2xl hover:scale-125 transition-transform">{b.emoji}</div>
                    <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-body whitespace-nowrap z-10 card-dark" style={{ color:'var(--text-primary)' }}>
                      {b.name}
                    </div>
                  </motion.div>
                )
              })}
              {builtTypes.length===0 && (
                <div className="absolute inset-0 flex items-center justify-center text-sm font-body" style={{ color:'var(--text-muted)' }}>
                  Build your first structure!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buildings grid */}
        <div>
          <h3 className="font-display font-bold mb-4" style={{ color:'var(--text-primary)' }}>🔨 Available Buildings</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {allBuildings.map((b,i)=>{
              const built = builtTypes.includes(b.type)
              const locked = level < b.unlockLevel
              return (
                <motion.div key={b.type} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                  className="card-dark p-3 sm:p-4 text-center transition-all"
                  style={{ opacity:locked?0.4:1, borderColor:built?'rgba(57,255,20,0.4)':locked?'var(--border-subtle)':'var(--border-color)', cursor:locked||built?'default':'pointer' }}>
                  <div className="text-2xl sm:text-3xl mb-2">{b.emoji}</div>
                  <h4 className="font-display font-bold text-sm" style={{ color:'var(--text-primary)' }}>{b.name}</h4>
                  <p className="text-xs font-body mt-1 leading-relaxed" style={{ color:'var(--text-muted)' }}>{b.description}</p>
                  {locked && <p className="text-xs mt-2" style={{ color:'#f87171' }}>Level {b.unlockLevel} required</p>}
                  {!locked && !built && (
                    <button onClick={()=>addBuilding(b.type)} disabled={adding===b.type}
                      className="mt-3 btn-neon text-xs px-3 py-1.5 w-full disabled:opacity-50">
                      {adding===b.type ? '⏳' : '🔨 Build'}
                    </button>
                  )}
                  {built && <p className="text-xs mt-2 font-body" style={{ color:'var(--neon-green)' }}>✅ Built!</p>}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
