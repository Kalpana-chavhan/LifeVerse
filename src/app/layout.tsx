import type { Metadata } from 'next'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'LifeVerse - Gamify Your Entire Reality',
  description: 'Turn your real life into an epic RPG adventure. Earn XP, evolve creatures, build your city!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `
          try{var s=localStorage.getItem('lifeverse-store');var t=s?JSON.parse(s)?.state?.theme:'dark';document.documentElement.setAttribute('data-theme',t||'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}
        `}} />
      </head>
      <body className="font-body antialiased overflow-x-hidden" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
