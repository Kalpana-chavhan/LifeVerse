import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Quest from '@/models/Quest'
import User from '@/models/User'
import Creature from '@/models/Creature'
import { getSession } from '@/lib/auth'
import { calculateLevel, getStreakBonus } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const session = getSession(req)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectDB()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'active'
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    const query: Record<string, unknown> = { userId: session.userId }
    if (status !== 'all') query.status = status
    if (type) query.type = type
    if (category) query.category = category

    // Reset daily quests completed yesterday
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(23, 59, 59, 999)

    await Quest.updateMany(
      {
        userId: session.userId,
        type: 'daily',
        status: 'completed',
        isRecurring: true,
        completedAt: { $lte: yesterday },
      },
      { status: 'active', completedAt: null }
    )

    const quests = await Quest.find(query).sort({ createdAt: -1 })
    return NextResponse.json({ quests })
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

    const xpMap: Record<string, number> = { easy: 50, medium: 100, hard: 200, legendary: 500 }
    const coinMap: Record<string, number> = { easy: 10, medium: 25, hard: 50, legendary: 150 }
    const difficulty = body.difficulty || 'easy'

    const quest = await Quest.create({
      userId: session.userId,
      title: body.title,
      description: body.description || '',
      category: body.category || 'custom',
      type: body.type || 'daily',
      difficulty,
      xpReward: body.xpReward || xpMap[difficulty],
      coinReward: body.coinReward || coinMap[difficulty],
      icon: body.icon || '⛏️',
      tags: body.tags || [],
      isRecurring: body.type === 'daily' || body.type === 'weekly',
      dueDate: body.dueDate,
    })

    return NextResponse.json({ quest }, { status: 201 })
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
    const { questId, action } = body

    const quest = await Quest.findOne({ _id: questId, userId: session.userId })
    if (!quest) return NextResponse.json({ error: 'Quest not found' }, { status: 404 })

    if (action === 'complete') {
      const user = await User.findById(session.userId)
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

      const streakBonus = getStreakBonus(user.streak)
      const xpEarned = Math.floor(quest.xpReward * streakBonus)
      const coinsEarned = Math.floor(quest.coinReward * streakBonus)

      quest.status = 'completed'
      quest.completedAt = new Date()
      quest.lastCompletedAt = new Date()
      quest.totalCompletions += 1
      if (quest.type === 'daily') quest.streak += 1
      await quest.save()

      user.xp += xpEarned
      user.coins += coinsEarned
      user.stats.questsCompleted += 1
      user.stats.totalXpEarned += xpEarned
      const newLevel = calculateLevel(user.xp)
      const leveledUp = newLevel > user.level
      user.level = newLevel
      await user.save()

      // Feed matching creature
      const categoryMap: Record<string, string> = {
        fitness: 'fitness', learning: 'learning', finance: 'finance',
        health: 'health', social: 'social',
      }
      const creatureCategory = categoryMap[quest.category]
      if (creatureCategory) {
        await Creature.findOneAndUpdate(
          { userId: session.userId, category: creatureCategory },
          { $inc: { xp: 20, happiness: 10 }, lastFedAt: new Date() }
        )
      }

      return NextResponse.json({
        message: 'Quest completed!',
        xpEarned, coinsEarned, leveledUp,
        newLevel: user.level, totalXp: user.xp, totalCoins: user.coins,
        streakBonus,
      })
    }

    if (action === 'delete') {
      await Quest.findByIdAndDelete(questId)
      return NextResponse.json({ message: 'Quest deleted' })
    }

    // Update quest fields
    const allowed = ['title', 'description', 'category', 'difficulty', 'icon', 'tags', 'dueDate']
    for (const key of allowed) {
      if (body[key] !== undefined) (quest as unknown as Record<string, unknown>)[key] = body[key]
    }
    await quest.save()
    return NextResponse.json({ quest })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
