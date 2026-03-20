'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser, addNotification } = useAppStore()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setUser(data.user)
      addNotification({ type: 'xp', message: '⛏️ Welcome! Your world has been created!' })
      router.push('/dashboard')
    } catch { setError('Something went wrong.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pixel-grid" style={{ background: 'var(--bg-base)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3 animate-float">🧱</div>
          <h1 className="font-pixel text-base neon-text-purple">JOIN LIFEVERSE</h1>
          <p className="text-sm mt-2 font-body" style={{ color: 'var(--text-secondary)' }}>Start your adventure</p>
        </div>

        <div className="card-dark p-5 sm:p-7 neon-border">
          {error && <div className="mb-4 px-3 py-2.5 rounded-lg text-sm font-body" style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.4)', color: '#ff5555' }}>{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            {[
              { label: 'Username', type: 'text', key: 'username', ph: 'DiamondMiner99', min: 3 },
              { label: 'Email', type: 'email', key: 'email', ph: 'hero@lifeverse.com' },
              { label: 'Password', type: 'password', key: 'password', ph: '••••••••', min: 6 },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-body mb-1.5" style={{ color: 'var(--text-muted)' }}>{f.label}</label>
                <input type={f.type} required minLength={f.min} value={(form as any)[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.ph} className="w-full px-4 py-3 rounded-lg font-body input-field" />
              </div>
            ))}
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-lg font-display font-bold text-lg text-white"
              style={{ background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-cyan))', opacity: loading ? 0.6 : 1 }}>
              {loading ? '⏳ Building World...' : '🚀 BEGIN ADVENTURE'}
            </motion.button>
          </form>
          <p className="text-center text-xs font-body mt-4" style={{ color: 'var(--text-muted)' }}>
            💎 Free: 5 starter mobs + 100 emeralds
          </p>
          <p className="text-center text-sm font-body mt-3" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/auth/login" className="underline" style={{ color: 'var(--neon-purple)' }}>Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
