'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store'

export default function LoginPage() {
  const router = useRouter()
  const { setUser, addNotification } = useAppStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setUser(data.user)
      addNotification({ type: 'info', message: `Welcome back, ${data.user.username}! ⛏️` })
      router.push('/dashboard')
    } catch { setError('Something went wrong.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pixel-grid" style={{ background: 'var(--bg-base)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3 animate-float">⛏️</div>
          <h1 className="font-pixel text-base neon-text-cyan">CONTINUE QUEST</h1>
          <p className="text-sm mt-2 font-body" style={{ color: 'var(--text-secondary)' }}>Your world awaits, Steve</p>
        </div>

        <div className="card-dark p-5 sm:p-7 neon-border-cyan">
          {error && <div className="mb-4 px-3 py-2.5 rounded-lg text-sm font-body" style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.4)', color: '#ff5555' }}>{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-body mb-1.5" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="hero@lifeverse.com"
                className="w-full px-4 py-3 rounded-lg font-body input-field" />
            </div>
            <div>
              <label className="block text-xs font-body mb-1.5" style={{ color: 'var(--text-muted)' }}>Password</label>
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg font-body input-field" />
            </div>
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-lg font-display font-bold text-lg text-white"
              style={{ background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))', opacity: loading ? 0.6 : 1 }}>
              {loading ? '⏳ Loading...' : '⚡ ENTER LIFEVERSE'}
            </motion.button>
          </form>
          <p className="text-center text-sm font-body mt-5" style={{ color: 'var(--text-muted)' }}>
            New adventurer?{' '}
            <Link href="/auth/register" className="underline" style={{ color: 'var(--neon-cyan)' }}>Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
