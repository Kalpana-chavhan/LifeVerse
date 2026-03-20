'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppStore } from '@/store'

const EXP_CATS = ['Food','Transport','Entertainment','Shopping','Bills','Health','Education','Other']
const INC_CATS = ['Salary','Freelance','Investment','Gift','Other']
const GOAL_ICONS = ['🪙','🏠','🛤️','🖥️','🪂','📡','🎓','❤️']

export default function FinancePage() {
  const { addNotification } = useAppStore()
  const [transactions, setTx] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview'|'transactions'|'goals'>('overview')
  const [modal, setModal] = useState<'expense'|'income'|'goal'|null>(null)
  const [form, setForm] = useState({ type:'expense', amount:'', category:'Food', description:'' })
  const [goalForm, setGoalForm] = useState({ title:'', targetAmount:'', icon:'🪙', deadline:'' })

  const load = async () => {
    setLoading(true)
    const [txData, goalData, sumData] = await Promise.all([
      fetch('/api/finance?limit=50').then(r=>r.json()),
      fetch('/api/finance?type=goals').then(r=>r.json()),
      fetch('/api/finance?type=summary').then(r=>r.json()),
    ])
    setTx(txData.transactions||[]); setGoals(goalData.goals||[]); setSummary(sumData)
    setLoading(false)
  }
  useEffect(()=>{ load() },[])

  const addTx = async (e:React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/finance',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ ...form, type:modal, amount:parseFloat(form.amount) }) })
    const data = await res.json()
    if (res.ok) { addNotification({ type:'coin', message:`Logged! +${data.transaction.coinReward} 🪙` }); setModal(null); setForm({ type:'expense', amount:'', category:'Food', description:'' }); load() }
    else addNotification({ type:'error', message:data.error })
  }

  const addGoal = async (e:React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/finance',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ goalAction:'create', ...goalForm, targetAmount:parseFloat(goalForm.targetAmount) }) })
    if (res.ok) { addNotification({ type:'info', message:'Savings goal created! 🎯' }); setModal(null); load() }
  }

  const contribute = async (goalId:string, amount:number) => {
    const res = await fetch('/api/finance',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ goalAction:'contribute', goalId, amount }) })
    const data = await res.json()
    if (res.ok) {
      if (data.goal.status==='completed') addNotification({ type:'levelup', message:'🎉 Goal completed! +500 XP!' })
      else addNotification({ type:'coin', message:`Added ₹${amount} to savings!` })
      load()
    }
  }

  const TabBtn = ({ id, label }: { id:typeof tab; label:string }) => (
    <button onClick={()=>setTab(id)}
      className="px-3 sm:px-4 py-2 rounded-lg font-body text-sm transition-all capitalize"
      style={{ background:tab===id?'rgba(255,215,0,0.1)':'transparent', color:tab===id?'var(--neon-yellow)':'var(--text-muted)', border:`1px solid ${tab===id?'var(--neon-yellow)':'transparent'}` }}>
      {label}
    </button>
  )

  const F = ({ label, children }:any) => (
    <div>
      <label className="text-xs font-body mb-1 block" style={{ color:'var(--text-muted)' }}>{label}</label>
      {children}
    </div>
  )

  return (
    <DashboardLayout title="🪙 BudgetQuest">
      <div className="space-y-4 sm:space-y-5">
        {/* Header + action buttons */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-display font-bold text-xl" style={{ color:'var(--text-primary)' }}>Budget Quest</h2>
            <p className="text-sm font-body" style={{ color:'var(--text-muted)' }}>Track spending, earn emeralds!</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={()=>{ setModal('income'); setForm(f=>({...f,type:'income',category:'Salary'})) }} className="btn-neon-green text-xs sm:text-sm px-3 py-2">+ Income</button>
            <button onClick={()=>{ setModal('expense'); setForm(f=>({...f,type:'expense',category:'Food'})) }} className="btn-neon text-xs sm:text-sm px-3 py-2">+ Expense</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          <TabBtn id="overview" label="📊 Overview" />
          <TabBtn id="transactions" label="💳 Transactions" />
          <TabBtn id="goals" label="🎯 Goals" />
        </div>

        {/* Overview */}
        {tab==='overview' && summary && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label:'Monthly Income',   val:summary.income,   icon:'📈', color:'var(--neon-green)', border:'rgba(57,255,20,0.25)'  },
                { label:'Monthly Expenses', val:summary.expenses, icon:'📉', color:'#f87171',           border:'rgba(248,113,113,0.25)' },
                { label:'Balance',          val:summary.balance,  icon:'🪙', color:summary.balance>=0?'var(--neon-cyan)':'#f87171', border:summary.balance>=0?'rgba(0,245,255,0.25)':'rgba(248,113,113,0.25)' },
              ].map(it=>(
                <div key={it.label} className="card-dark p-4 sm:p-5" style={{ borderColor:it.border }}>
                  <div className="text-2xl mb-2">{it.icon}</div>
                  <p className="font-display font-bold text-xl sm:text-2xl" style={{ color:it.color }}>₹{Math.abs(it.val).toLocaleString()}</p>
                  <p className="text-sm font-body" style={{ color:'var(--text-muted)' }}>{it.label}</p>
                </div>
              ))}
            </div>
            {summary.byCategory && Object.keys(summary.byCategory).length>0 && (
              <div className="card-dark p-4 sm:p-5">
                <h3 className="font-display font-bold mb-4" style={{ color:'var(--text-primary)' }}>Spending by Category</h3>
                <div className="space-y-2.5">
                  {Object.entries(summary.byCategory).sort(([,a],[,b])=>(b as number)-(a as number)).map(([cat,amt])=>{
                    const pct = Math.min(100,Math.floor(((amt as number)/Math.max(summary.expenses,1))*100))
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm font-body mb-1">
                          <span style={{ color:'var(--text-secondary)' }}>{cat}</span>
                          <span style={{ color:'var(--neon-yellow)' }}>₹{(amt as number).toLocaleString()} ({pct}%)</span>
                        </div>
                        <div className="xp-bar h-2">
                          <div className="xp-bar-fill h-full" style={{ width:`${pct}%`, background:'linear-gradient(90deg, var(--neon-yellow), var(--neon-orange))' }}/>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Transactions */}
        {tab==='transactions' && (
          <div className="space-y-2">
            {loading ? Array(5).fill(0).map((_,i)=><div key={i} className="h-14 rounded-xl skeleton-pulse"/>) :
            transactions.length===0 ? (
              <div className="text-center py-12 card-dark">
                <div className="text-4xl mb-3">💳</div>
                <p className="font-body text-sm" style={{ color:'var(--text-muted)' }}>No transactions yet. Start tracking!</p>
              </div>
            ) : transactions.map((tx,i)=>(
              <motion.div key={tx._id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.03 }}
                className="card-dark p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background:tx.type==='income'?'rgba(57,255,20,0.1)':'rgba(248,113,113,0.1)' }}>
                  {tx.type==='income'?'📈':'📉'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body truncate" style={{ color:'var(--text-primary)' }}>{tx.description||tx.category}</p>
                  <p className="text-xs font-body" style={{ color:'var(--text-muted)' }}>{tx.category} · {new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <p className="font-display font-bold flex-shrink-0" style={{ color:tx.type==='income'?'var(--neon-green)':'#f87171' }}>
                  {tx.type==='income'?'+':'-'}₹{tx.amount.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Goals */}
        {tab==='goals' && (
          <div className="space-y-4">
            <button onClick={()=>setModal('goal')} className="btn-neon text-sm px-4 py-2">+ New Goal</button>
            {goals.length===0 ? (
              <div className="text-center py-12 card-dark">
                <div className="text-4xl mb-3">🎯</div>
                <p className="font-body text-sm" style={{ color:'var(--text-muted)' }}>No savings goals yet. Set a target!</p>
              </div>
            ) : goals.map(g=>{
              const pct = Math.min(100,Math.floor((g.currentAmount/g.targetAmount)*100))
              return (
                <div key={g._id} className="card-dark p-4 sm:p-5" style={{ borderColor:'rgba(255,215,0,0.3)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{g.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold" style={{ color:'var(--text-primary)' }}>{g.title}</h4>
                      <p className="text-xs font-body" style={{ color:'var(--text-secondary)' }}>₹{g.currentAmount.toLocaleString()} / ₹{g.targetAmount.toLocaleString()}</p>
                    </div>
                    <span className="font-pixel text-lg" style={{ color:'var(--neon-yellow)' }}>{pct}%</span>
                  </div>
                  <div className="xp-bar h-3 mb-3">
                    <div className="xp-bar-fill h-full" style={{ width:`${pct}%`, background:'linear-gradient(90deg, var(--neon-yellow), var(--neon-green))' }}/>
                  </div>
                  {g.deadline && <p className="text-xs font-body mb-2" style={{ color:'var(--text-muted)' }}>🗓️ By {new Date(g.deadline).toLocaleDateString()}</p>}
                  <div className="flex gap-2 flex-wrap">
                    {[100,500,1000].map(amt=>(
                      <button key={amt} onClick={()=>contribute(g._id,amt)}
                        className="px-3 py-1.5 rounded-lg text-xs font-body transition-all"
                        style={{ border:'1px solid var(--neon-yellow)', color:'var(--neon-yellow)', background:'rgba(255,215,0,0.08)' }}>
                        +₹{amt}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Transaction modal */}
      {(modal==='expense'||modal==='income') && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          style={{ background:'var(--modal-overlay)', backdropFilter:'blur(6px)' }}
          onClick={e=>{ if(e.target===e.currentTarget) setModal(null) }}>
          <motion.div initial={{ scale:0.92 }} animate={{ scale:1 }} onClick={e=>e.stopPropagation()}
            className="w-full max-w-md rounded-2xl p-4 sm:p-6 neon-border-yellow"
            style={{ background:'var(--modal-bg)' }}>
            <h3 className="font-pixel text-xs neon-text-yellow mb-5">{modal==='income'?'LOG INCOME':'LOG EXPENSE'}</h3>
            <form onSubmit={addTx} className="space-y-4">
              <F label="Amount (₹)">
                <input type="number" required min="1" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}
                  className="w-full px-3 py-2 rounded-lg text-sm font-body input-field" placeholder="0" />
              </F>
              <F label="Category">
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
                  className="w-full px-3 py-2 rounded-lg text-sm font-body input-field">
                  {(modal==='income'?INC_CATS:EXP_CATS).map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </F>
              <F label="Description (optional)">
                <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                  className="w-full px-3 py-2 rounded-lg text-sm font-body input-field" placeholder="What was this for?" />
              </F>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={()=>setModal(null)} className="flex-1 py-2.5 rounded-lg text-sm font-body" style={{ border:'1px solid var(--border-color)', color:'var(--text-muted)' }}>Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg text-sm font-body font-semibold text-white" style={{ background:'linear-gradient(135deg, var(--neon-yellow), var(--neon-orange))' }}>
                  Log {modal==='income'?'Income':'Expense'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Goal modal */}
      {modal==='goal' && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          style={{ background:'var(--modal-overlay)', backdropFilter:'blur(6px)' }}
          onClick={e=>{ if(e.target===e.currentTarget) setModal(null) }}>
          <motion.div initial={{ scale:0.92 }} animate={{ scale:1 }} onClick={e=>e.stopPropagation()}
            className="w-full max-w-md rounded-2xl p-4 sm:p-6 neon-border-yellow"
            style={{ background:'var(--modal-bg)' }}>
            <h3 className="font-pixel text-xs neon-text-yellow mb-5">NEW SAVINGS GOAL</h3>
            <form onSubmit={addGoal} className="space-y-4">
              <F label="Goal Name">
                <input required value={goalForm.title} onChange={e=>setGoalForm({...goalForm,title:e.target.value})}
                  className="w-full px-3 py-2 rounded-lg text-sm font-body input-field" placeholder="Emergency Fund, New Laptop..." />
              </F>
              <F label="Target Amount (₹)">
                <input type="number" required min="1" value={goalForm.targetAmount} onChange={e=>setGoalForm({...goalForm,targetAmount:e.target.value})}
                  className="w-full px-3 py-2 rounded-lg text-sm font-body input-field" placeholder="10000" />
              </F>
              <F label="Icon">
                <div className="flex gap-2 flex-wrap">
                  {GOAL_ICONS.map(ic=>(
                    <button type="button" key={ic} onClick={()=>setGoalForm({...goalForm,icon:ic})}
                      className="text-xl p-1.5 rounded-lg transition-all"
                      style={{ background:goalForm.icon===ic?'var(--sidebar-active)':'transparent', transform:goalForm.icon===ic?'scale(1.15)':'scale(1)' }}>{ic}</button>
                  ))}
                </div>
              </F>
              <F label="Deadline (optional)">
                <input type="date" value={goalForm.deadline} onChange={e=>setGoalForm({...goalForm,deadline:e.target.value})}
                  className="w-full px-3 py-2 rounded-lg text-sm font-body input-field" />
              </F>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={()=>setModal(null)} className="flex-1 py-2.5 rounded-lg text-sm font-body" style={{ border:'1px solid var(--border-color)', color:'var(--text-muted)' }}>Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg text-sm font-body font-semibold text-white" style={{ background:'linear-gradient(135deg, var(--neon-yellow), var(--neon-green))' }}>
                  Create Goal 🎯
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </DashboardLayout>
  )
}
