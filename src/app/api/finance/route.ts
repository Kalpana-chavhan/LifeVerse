import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Transaction, SavingsGoal } from '@/models/Finance'
import User from '@/models/User'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = getSession(req)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectDB()
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') // 'transactions' | 'goals' | 'summary'

    if (type === 'goals') {
      const goals = await SavingsGoal.find({ userId: session.userId, status: { $ne: 'completed' } })
      return NextResponse.json({ goals })
    }

    if (type === 'summary') {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const txs = await Transaction.find({ userId: session.userId, date: { $gte: startOfMonth } })
      const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
      const expenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
      const byCategory = txs.reduce((acc, t) => {
        if (!acc[t.category]) acc[t.category] = 0
        acc[t.category] += t.amount
        return acc
      }, {} as Record<string, number>)
      return NextResponse.json({ income, expenses, balance: income - expenses, byCategory })
    }

    const limit = parseInt(searchParams.get('limit') || '50')
    const transactions = await Transaction.find({ userId: session.userId })
      .sort({ date: -1 }).limit(limit)
    return NextResponse.json({ transactions })
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

    if (body.goalAction === 'create') {
      const goal = await SavingsGoal.create({
        userId: session.userId,
        title: body.title,
        targetAmount: body.targetAmount,
        currentAmount: body.currentAmount || 0,
        deadline: body.deadline,
        icon: body.icon || '🪙',
        color: body.color || '#ffd700',
      })
      return NextResponse.json({ goal }, { status: 201 })
    }

    if (body.goalAction === 'contribute') {
      const goal = await SavingsGoal.findOne({ _id: body.goalId, userId: session.userId })
      if (!goal) return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
      goal.currentAmount += body.amount
      if (goal.currentAmount >= goal.targetAmount) {
        goal.status = 'completed'
        // Reward user
        await User.findByIdAndUpdate(session.userId, {
          $inc: { coins: 200, xp: 500 },
        })
      }
      await goal.save()
      return NextResponse.json({ goal })
    }

    // Create transaction
    const tx = await Transaction.create({
      userId: session.userId,
      type: body.type,
      amount: body.amount,
      category: body.category,
      description: body.description || '',
      date: body.date || new Date(),
      coinReward: body.type === 'expense' ? 5 : 2,
    })

    // Reward coins for tracking (single atomic update)
    await User.findByIdAndUpdate(session.userId, {
      $inc: {
        coins: tx.coinReward,
        'stats.moneySaved': body.type === 'income' ? Number(body.amount) : 0,
      },
    })

    return NextResponse.json({ transaction: tx }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = getSession(req)
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    await Transaction.findOneAndDelete({ _id: id, userId: session.userId })
    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
