import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import City from '@/models/City'
import User from '@/models/User'
import { getSession } from '@/lib/auth'

export const BUILDINGS = [
  { type: 'town_hall', name: 'Town Hall', emoji: '🏛️', unlockLevel: 1, category: 'civic', description: 'The heart of your city' },
  { type: 'library', name: 'Library', emoji: '📖', unlockLevel: 3, category: 'learning', description: 'Unlock with learning quests' },
  { type: 'gym', name: 'Gym', emoji: '⚒️', unlockLevel: 5, category: 'fitness', description: 'Built by completing fitness quests' },
  { type: 'bank', name: 'Bank', emoji: '🏦', unlockLevel: 7, category: 'finance', description: 'Reward for saving money' },
  { type: 'hospital', name: 'Hospital', emoji: '🏥', unlockLevel: 10, category: 'health', description: 'Reward for health tracking' },
  { type: 'park', name: 'Park', emoji: '🌳', unlockLevel: 4, category: 'wellness', description: 'Peace and serenity' },
  { type: 'market', name: 'Market', emoji: '🏪', unlockLevel: 6, category: 'finance', description: 'Track your expenses' },
  { type: 'school', name: 'School', emoji: '🏫', unlockLevel: 8, category: 'learning', description: 'Master of knowledge' },
  { type: 'stadium', name: 'Stadium', emoji: '🏟️', unlockLevel: 15, category: 'fitness', description: 'Fitness champion' },
  { type: 'castle', name: 'Castle', emoji: '🏰', unlockLevel: 20, category: 'legendary', description: 'Legendary achievement' },
  { type: 'temple', name: 'Temple', emoji: '⛩️', unlockLevel: 12, category: 'mindfulness', description: 'Inner peace master' },
  { type: 'tower', name: 'Tech Tower', emoji: '🗼', unlockLevel: 18, category: 'learning', description: 'Knowledge is power' },
]

export async function GET(req: NextRequest) {
  try {
    const session = getSession(req)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectDB()
    const user = await User.findById(session.userId)
    let city = await City.findOne({ userId: session.userId })
    if (!city) {
      city = await City.create({
        userId: session.userId,
        buildings: [{ buildingType: 'town_hall', position: { x: 5, y: 5 }, level: 1 }],
      })
    }

    // Compute unlocked buildings based on user level
    const unlockedTypes = BUILDINGS.filter(b => (user?.level || 1) >= b.unlockLevel).map(b => b.type)

    return NextResponse.json({ city, buildings: BUILDINGS, unlockedTypes })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSession(req)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectDB()
    const { action, buildingType, position, cityName } = await req.json()

    const user = await User.findById(session.userId)
    const city = await City.findOne({ userId: session.userId })
    if (!city) return NextResponse.json({ error: 'City not found' }, { status: 404 })

    if (action === 'addBuilding') {
      const building = BUILDINGS.find(b => b.type === buildingType)
      if (!building) return NextResponse.json({ error: 'Unknown building' }, { status: 400 })
      if ((user?.level || 1) < building.unlockLevel) {
        return NextResponse.json({ error: `Need level ${building.unlockLevel} to unlock` }, { status: 403 })
      }
      const alreadyBuilt = city.buildings.find(b => b.buildingType === buildingType)
      if (alreadyBuilt) return NextResponse.json({ error: 'Already built' }, { status: 409 })

      city.buildings.push({ buildingType, position: position || { x: 0, y: 0 }, unlockedAt: new Date(), level: 1 })
      city.population += 50
      await city.save()
      return NextResponse.json({ city, message: `${building.name} built!` })
    }

    if (action === 'rename') {
      city.cityName = cityName
      await city.save()
      return NextResponse.json({ city })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
