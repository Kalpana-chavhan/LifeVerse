import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import HealthLog from '@/models/Health'
import User from '@/models/User'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = getSession(req)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectDB()
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '7')
    const since = new Date(Date.now() - days * 86400000)

    const logs = await HealthLog.find({ userId: session.userId, date: { $gte: since } }).sort({ date: -1 })

    // Get or create today's log
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let todayLog = await HealthLog.findOne({ userId: session.userId, date: { $gte: today } })
    if (!todayLog) {
      todayLog = await HealthLog.create({ userId: session.userId, date: today })
    }

    return NextResponse.json({ logs, todayLog })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSession(req)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectDB()
    const body = await req.json()

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let log = await HealthLog.findOne({ userId: session.userId, date: { $gte: today } })
    if (!log) {
      log = await HealthLog.create({ userId: session.userId, date: today })
    }

    let xpEarned = 0
    const allowed = ['waterIntake', 'waterGoal', 'sleepHours', 'sleepQuality', 'steps', 'mood', 'moodNote']
    for (const key of allowed) {
      if (body[key] !== undefined) (log as Record<string, unknown>)[key] = body[key]
    }

    // Calculate XP for health actions
    if (body.waterIntake !== undefined) {
      const glasses = body.waterIntake
      xpEarned += glasses * 5
      await User.findByIdAndUpdate(session.userId, { $inc: { 'stats.waterDrank': 1 } })
    }
    if (body.sleepHours !== undefined && body.sleepHours >= 7) xpEarned += 50
    if (body.steps !== undefined && body.steps >= 10000) xpEarned += 100
    if (body.mood !== undefined) xpEarned += 10

    log.xpEarned = (log.xpEarned || 0) + xpEarned
    await log.save()

    if (xpEarned > 0) {
      await User.findByIdAndUpdate(session.userId, { $inc: { xp: xpEarned } })
    }

    return NextResponse.json({ log, xpEarned })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
