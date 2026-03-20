import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = getSession(req)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectDB()
    const user = await User.findById(session.userId).select('-password')
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({ user })
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
    const allowed = ['username', 'avatar', 'bio', 'settings']
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key]
    }

    const user = await User.findByIdAndUpdate(session.userId, updates, { new: true }).select('-password')
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
