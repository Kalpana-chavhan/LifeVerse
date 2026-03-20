import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Creature from '@/models/Creature'
import User from '@/models/User'
import { getSession } from '@/lib/auth'
import { CREATURE_SPECIES } from '@/models/Creature'

function getEvolutionStage(xp: number): 0 | 1 | 2 | 3 {
  if (xp >= 5000) return 3
  if (xp >= 1000) return 2
  if (xp >= 200) return 1
  return 0
}

export async function GET(req: NextRequest) {
  try {
    const session = getSession(req)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectDB()

    // Decay happiness for neglected creatures
    const oneDayAgo = new Date(Date.now() - 86400000)
    await Creature.updateMany(
      { userId: session.userId, lastFedAt: { $lt: oneDayAgo } },
      { $inc: { happiness: -5 } }
    )

    const creatures = await Creature.find({ userId: session.userId })

    // Update evolution stages
    for (const creature of creatures) {
      const stage = getEvolutionStage(creature.xp)
      if (stage !== creature.evolutionStage) {
        const species = CREATURE_SPECIES[creature.category as keyof typeof CREATURE_SPECIES]
        creature.evolutionStage = stage
        creature.emoji = species.emojis[stage]
        await creature.save()
      }
    }

    return NextResponse.json({ creatures })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSession(req)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectDB()
    const { creatureId, action, name } = await req.json()

    const creature = await Creature.findOne({ _id: creatureId, userId: session.userId })
    if (!creature) return NextResponse.json({ error: 'Creature not found' }, { status: 404 })

    if (action === 'rename' && name) {
      creature.name = name
      await creature.save()
      return NextResponse.json({ creature, message: 'Renamed!' })
    }

    if (action === 'feed') {
      const user = await User.findById(session.userId)
      if (!user || user.coins < 10) {
        return NextResponse.json({ error: 'Not enough coins (costs 10)' }, { status: 400 })
      }
      user.coins -= 10
      await user.save()
      creature.happiness = Math.min(100, creature.happiness + 20)
      creature.energy = Math.min(100, creature.energy + 15)
      creature.xp += 10
      creature.lastFedAt = new Date()
      await creature.save()
      return NextResponse.json({ creature, message: 'Fed! +20 happiness, -10 coins' })
    }

    if (action === 'play') {
      const user = await User.findById(session.userId)
      if (!user || user.coins < 5) {
        return NextResponse.json({ error: 'Not enough coins (costs 5)' }, { status: 400 })
      }
      user.coins -= 5
      await user.save()
      creature.happiness = Math.min(100, creature.happiness + 15)
      creature.xp += 5
      await creature.save()
      return NextResponse.json({ creature, message: 'Played! +15 happiness' })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
