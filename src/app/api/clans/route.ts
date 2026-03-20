import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Clan from '@/models/Clan'
import User from '@/models/User'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = getSession(req)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectDB()
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')

    if (action === 'search') {
      const q = searchParams.get('q') || ''
      const clans = await Clan.find({
        isPublic: true,
        name: { $regex: q, $options: 'i' }
      }).limit(20)
      return NextResponse.json({ clans })
    }

    if (action === 'leaderboard') {
      const clans = await Clan.find({ isPublic: true }).sort({ totalXp: -1 }).limit(10)
      return NextResponse.json({ clans })
    }

    // Get user's clan
    const user = await User.findById(session.userId)
    if (!user?.clanId) return NextResponse.json({ clan: null })

    const clan = await Clan.findById(user.clanId).populate('members.userId', 'username avatar level xp')
    return NextResponse.json({ clan })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSession(req)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectDB()
    const body = await req.json()

    if (body.action === 'create') {
      const user = await User.findById(session.userId)
      if (user?.clanId) return NextResponse.json({ error: 'Already in a clan' }, { status: 400 })

      const existing = await Clan.findOne({ name: body.name })
      if (existing) return NextResponse.json({ error: 'Clan name taken' }, { status: 409 })

      const clan = await Clan.create({
        name: body.name,
        description: body.description || '',
        emoji: body.emoji || '🪓',
        color: body.color || '#b44fff',
        leaderId: session.userId,
        members: [{ userId: session.userId, role: 'leader', contribution: 0 }],
        isPublic: body.isPublic !== false,
      })

      await User.findByIdAndUpdate(session.userId, { clanId: clan._id })
      return NextResponse.json({ clan }, { status: 201 })
    }

    if (body.action === 'join') {
      const user = await User.findById(session.userId)
      if (user?.clanId) return NextResponse.json({ error: 'Already in a clan' }, { status: 400 })

      const clan = await Clan.findById(body.clanId)
      if (!clan) return NextResponse.json({ error: 'Clan not found' }, { status: 404 })
      if (clan.members.length >= clan.maxMembers) return NextResponse.json({ error: 'Clan is full' }, { status: 400 })

      clan.members.push({ userId: session.userId as any, role: 'member', joinedAt: new Date(), contribution: 0 })
      await clan.save()
      await User.findByIdAndUpdate(session.userId, { clanId: clan._id })
      return NextResponse.json({ clan })
    }

    if (body.action === 'leave') {
      const user = await User.findById(session.userId)
      if (!user?.clanId) return NextResponse.json({ error: 'Not in a clan' }, { status: 400 })

      const clan = await Clan.findById(user.clanId)
      if (clan) {
        clan.members = clan.members.filter(m => m.userId.toString() !== session.userId)
        await clan.save()
      }
      await User.findByIdAndUpdate(session.userId, { $unset: { clanId: '' } })
      return NextResponse.json({ message: 'Left clan' })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
