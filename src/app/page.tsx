'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const FEATURES = [
  { icon: '⛏️', title: 'LifeQuest Engine', desc: 'Turn any habit into an RPG quest with XP rewards', color: 'from-purple-500/20 to-purple-900/20', border: 'border-purple-500/40' },
  { icon: '🐲', title: 'HabitMon Creatures', desc: '5 adorable creatures that evolve based on your habits', color: 'from-cyan-500/20 to-cyan-900/20', border: 'border-cyan-500/40' },
  { icon: '🏘️', title: 'FocusCity Builder', desc: 'Build a 3D city that grows as you do in real life', color: 'from-green-500/20 to-green-900/20', border: 'border-green-500/40' },
  { icon: '📖', title: 'Study Arena', desc: 'Pomodoro + boss battles = studying that doesnt suck', color: 'from-yellow-500/20 to-yellow-900/20', border: 'border-yellow-500/40' },
  { icon: '🪙', title: 'BudgetQuest', desc: 'Finance tracking with progress bars and coin rewards', color: 'from-orange-500/20 to-orange-900/20', border: 'border-orange-500/40' },
  { icon: '🛡️', title: 'LifeClans', desc: 'Team up with friends for mega boss battles', color: 'from-pink-500/20 to-pink-900/20', border: 'border-pink-500/40' },
]

// Fixed values to prevent hydration mismatch (no Math.random at module level)
const PARTICLES = [
  { id:0,  left:'5%',  delay:'0s',   duration:'8s',  size:'6px',  emoji:'💠' },
  { id:1,  left:'12%', delay:'1s',   duration:'10s', size:'8px',  emoji:'✴️' },
  { id:2,  left:'20%', delay:'2s',   duration:'7s',  size:'5px',  emoji:'🔹' },
  { id:3,  left:'28%', delay:'0.5s', duration:'9s',  size:'7px',  emoji:'💎' },
  { id:4,  left:'35%', delay:'3s',   duration:'11s', size:'4px',  emoji:'⚡' },
  { id:5,  left:'42%', delay:'1.5s', duration:'8s',  size:'6px',  emoji:'🧿' },
  { id:6,  left:'50%', delay:'4s',   duration:'10s', size:'8px',  emoji:'💠' },
  { id:7,  left:'58%', delay:'2.5s', duration:'7s',  size:'5px',  emoji:'✴️' },
  { id:8,  left:'65%', delay:'0.8s', duration:'12s', size:'7px',  emoji:'🔹' },
  { id:9,  left:'72%', delay:'3.5s', duration:'9s',  size:'4px',  emoji:'💎' },
  { id:10, left:'80%', delay:'1.2s', duration:'8s',  size:'6px',  emoji:'⚡' },
  { id:11, left:'87%', delay:'4.5s', duration:'11s', size:'8px',  emoji:'🧿' },
  { id:12, left:'93%', delay:'2.2s', duration:'10s', size:'5px',  emoji:'💠' },
  { id:13, left:'8%',  delay:'5s',   duration:'7s',  size:'7px',  emoji:'✴️' },
  { id:14, left:'16%', delay:'3.8s', duration:'9s',  size:'4px',  emoji:'🔹' },
  { id:15, left:'32%', delay:'6s',   duration:'8s',  size:'6px',  emoji:'💎' },
  { id:16, left:'48%', delay:'1.8s', duration:'10s', size:'8px',  emoji:'⚡' },
  { id:17, left:'63%', delay:'5.5s', duration:'11s', size:'5px',  emoji:'🧿' },
  { id:18, left:'76%', delay:'0.3s', duration:'7s',  size:'7px',  emoji:'💠' },
  { id:19, left:'90%', delay:'7s',   duration:'9s',  size:'4px',  emoji:'✴️' },
]

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Particle background */}
      <div className="particle-container">
        {mounted && PARTICLES.map(p => (
          <div
            key={p.id}
            className="absolute text-lg opacity-0 animate-particle"
            style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, fontSize: p.size }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Grid background */}
      <div className="fixed inset-0 pixel-grid pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-4 md:px-6 py-4 border-b backdrop-blur-lg" style={{borderColor: "var(--border-color)", backgroundColor: "var(--topbar-bg)"}}>
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-float">🧱</span>
          <span className="font-pixel text-sm neon-text-purple hidden sm:block">LIFEVERSE</span>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login" className="btn-neon text-sm">Login</Link>
          <Link href="/auth/register" className="btn-neon-green text-sm">Start Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-4 sm:px-6 py-12 sm:py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="text-6xl md:text-8xl mb-6 animate-float">⛏️</div>
          <h1 className="font-pixel text-lg sm:text-2xl md:text-4xl lg:text-5xl mb-6 leading-tight">
            <span className="neon-text-purple">GAMIFY</span>
            <br />
            <span className="text-[var(--text-primary)]">YOUR ENTIRE</span>
            <br />
            <span className="neon-text-cyan">REALITY</span>
          </h1>
          <p className="font-body text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-4 leading-relaxed">
            Every habit, every quest, every achievement — your real life turned into an epic MMORPG.
            Earn XP for doing laundry. Evolve creatures by studying. Build cities by saving money.
          </p>
          <p className="text-[var(--text-muted)] mb-10 font-body">Made with 🐲 by Kalpana</p>
          <div className="flex flex-col xs:flex-row gap-3 justify-center">
            <Link href="/auth/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 font-display font-bold text-lg rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_30px_rgba(180,79,255,0.5)] hover:shadow-[0_0_50px_rgba(180,79,255,0.7)] transition-all"
              >
                🏹 START YOUR ADVENTURE
              </motion.button>
            </Link>
            <Link href="/auth/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 font-display font-bold text-lg rounded-lg border-2 border-purple-500/60 text-purple-300 hover:bg-purple-500/10 transition-all"
              >
                Continue Journey
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex justify-center gap-5 sm:gap-8 mt-8 sm:mt-14 flex-wrap"
        >
          {[['∞', 'Quests'], ['5', 'Creatures'], ['12+', 'Buildings'], ['5+', 'Mini Games']].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="font-pixel text-2xl neon-text-cyan">{val}</div>
              <div className="font-body text-[var(--text-secondary)] text-sm mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features grid */}
      <section className="relative z-10 px-4 sm:px-6 py-10 sm:py-16 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          className="font-pixel text-lg md:text-2xl text-center mb-12 neon-text-purple"
        >
          THE FULL RPG EXPERIENCE
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`card-dark p-6 bg-gradient-to-br ${f.color} border ${f.border} hover:scale-105 transition-all cursor-default`}
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2">{f.title}</h3>
              <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="relative z-10 px-6 py-12 text-center">
        <p className="font-body text-[var(--text-muted)] mb-4">Built with</p>
        <div className="flex flex-wrap justify-center gap-3">
          {['Next.js 15', 'React 19', 'TypeScript', 'MongoDB', 'Tailwind CSS', 'Framer Motion'].map(tech => (
            <span key={tech} className="px-3 py-1 rounded-full border border-purple-500/30 text-purple-300 text-sm font-body bg-purple-500/5">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 sm:px-6 py-12 sm:py-20 text-center">
        <div className="max-w-2xl mx-auto card-dark p-10 neon-border">
          <div className="text-5xl mb-4">⚡</div>
          <h2 className="font-pixel text-xl md:text-2xl mb-4 neon-text-cyan">READY TO LEVEL UP?</h2>
          <p className="text-[var(--text-secondary)] font-body mb-8">Join the adventure. Your quest log awaits.</p>
          <Link href="/auth/register">
            <button className="px-10 py-4 font-display font-bold text-xl rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_30px_rgba(180,79,255,0.5)] hover:shadow-[0_0_60px_rgba(180,79,255,0.8)] transition-all">
              CREATE FREE ACCOUNT
            </button>
          </Link>
        </div>
      </section>

      <footer className="relative z-10 text-center py-8 border-t border-purple-500/10 text-[var(--text-muted)] font-body text-sm">
        Made with 🐲 by Kalpana · LifeVerse © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
