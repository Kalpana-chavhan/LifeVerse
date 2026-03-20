import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Creature from '@/models/Creature'
import City from '@/models/City'
import { hashPassword, generateToken } from '@/lib/auth'
import { CREATURE_SPECIES } from '@/models/Creature'

export async function POST(req: NextRequest) {
  try {
    // Step 1: Connect to DB
    await connectDB()
  } catch (dbError: unknown) {
    console.error('DB Connection failed:', dbError)
    const msg = dbError instanceof Error ? dbError.message : String(dbError)
    return NextResponse.json({
      error: '❌ Cannot connect to database. Check your MONGODB_URI in the .env file.\n\nDetails: ' + msg
    }, { status: 500 })
  }

  try {
    const { username, email, password } = await req.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (username.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    })
    if (existingUser) {
      return NextResponse.json({ error: 'Username or email already taken' }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    })

    // Create 5 starter creatures
    const categories: Array<'fitness' | 'learning' | 'finance' | 'health' | 'social'> = [
      'fitness', 'learning', 'finance', 'health', 'social',
    ]
    const names = ['Piglin', 'Enderman', 'Golem', 'Creeper', 'Villager']

    await Promise.all(
      categories.map((cat, i) => {
        const species = CREATURE_SPECIES[cat]
        return Creature.create({
          userId: user._id,
          name: names[i],
          species: species.name,
          category: cat,
          emoji: species.emojis[0],
          color: species.color,
          personality: ['Hostile', 'Teleporting', 'Iron-Willed', 'Explosive', 'Trading'][i],
        })
      })
    )

    // Create starter city
    await City.create({
      userId: user._id,
      buildings: [{ buildingType: 'town_hall', position: { x: 5, y: 5 }, level: 1 }],
    })

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    })

    const res = NextResponse.json({
      message: 'Account created!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        level: 1,
        xp: 0,
        coins: 100,
        gems: 10,
        streak: 0,
        title: user.title,
        stats: user.stats,
      },
    }, { status: 201 })

    res.cookies.set('lifeverse_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return res
  } catch (error: unknown) {
    console.error('Register error:', error)
    const msg = error instanceof Error ? error.message : String(error)
    if (msg.includes('E11000') || msg.includes('duplicate')) {
      return NextResponse.json({ error: 'Username or email already taken' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Registration failed: ' + msg }, { status: 500 })
  }
}
