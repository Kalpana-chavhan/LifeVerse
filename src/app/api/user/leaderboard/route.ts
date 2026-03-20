import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = getSession(req)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectDB()
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'xp'

    const sortField = type === 'streak' ? 'streak' : type === 'quests' ? 'stats.questsCompleted' : 'xp'
    const users = await User.find({})
      .select('username avatar level xp streak stats title')
      .sort({ [sortField]: -1 })
      .limit(100)

    const ranked = users.map((u, i) => ({
      rank: i + 1,
      id: u._id,
      username: u.username,
      avatar: u.avatar,
      level: u.level,
      xp: u.xp,
      streak: u.streak,
      questsCompleted: u.stats.questsCompleted,
      title: u.title,
      isCurrentUser: u._id.toString() === session.userId,
    }))

    return NextResponse.json({ leaderboard: ranked })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
