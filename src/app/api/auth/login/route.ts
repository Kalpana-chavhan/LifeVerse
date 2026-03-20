import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { comparePassword, generateToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  // Step 1: Connect to DB separately so we get a clear error
  try {
    await connectDB()
  } catch (dbError: unknown) {
    console.error('DB Connection failed:', dbError)
    const msg = dbError instanceof Error ? dbError.message : String(dbError)
    return NextResponse.json({
      error: '❌ Cannot connect to database. Check your MONGODB_URI in the .env file.\n\nDetails: ' + msg
    }, { status: 500 })
  }

  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const valid = await comparePassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Update streak
    const now = new Date()
    const last = new Date(user.lastActiveDate)
    const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000)
    if (diffDays === 1) {
      user.streak += 1
      if (user.stats && user.streak > user.stats.highestStreak) user.stats.highestStreak = user.streak
    } else if (diffDays > 1) {
      user.streak = 0
    }
    user.lastActiveDate = now
    await user.save()

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    })

    const res = NextResponse.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        level: user.level,
        xp: user.xp,
        coins: user.coins,
        gems: user.gems,
        streak: user.streak,
        title: user.title,
        stats: user.stats,
      },
    })

    res.cookies.set('lifeverse_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return res
  } catch (error: unknown) {
    console.error('Login error:', error)
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: 'Login failed: ' + msg }, { status: 500 })
  }
}
