import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateLevel(xp: number): number {
  // XP formula: level = floor(sqrt(xp / 100))
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export function xpForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100
}

export function xpProgress(xp: number): { level: number; current: number; needed: number; percent: number } {
  const level = calculateLevel(xp)
  const currentLevelXP = Math.pow(level - 1, 2) * 100
  const nextLevelXP = Math.pow(level, 2) * 100
  const current = xp - currentLevelXP
  const needed = nextLevelXP - currentLevelXP
  return { level, current, needed, percent: Math.floor((current / needed) * 100) }
}

export function getRarity(value: number): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
  if (value >= 95) return 'legendary'
  if (value >= 80) return 'epic'
  if (value >= 60) return 'rare'
  if (value >= 30) return 'uncommon'
  return 'common'
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function getStreakBonus(streak: number): number {
  if (streak >= 30) return 3.0
  if (streak >= 14) return 2.0
  if (streak >= 7) return 1.5
  if (streak >= 3) return 1.25
  return 1.0
}

export function timeAgo(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}
