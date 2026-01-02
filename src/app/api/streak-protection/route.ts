import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import User from '@/models/User';
import Quest from '@/models/Quest';
import { connectDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const streakShields = user.streakShields || 0;
    const protectedStreaks = user.protectedStreaks || [];

    const quests = await Quest.find({ userId: user._id, streak: { $gt: 0 } }).select('title streak');

    return NextResponse.json({
      streakShields,
      protectedStreaks,
      activeStreaks: quests,
      shieldCost: 50,
      maxShields: 10,
    });
  } catch (error: any) {
    console.error('Get streak protection error:', error);
    return NextResponse.json({ error: 'Failed to fetch streak protection' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { action, questId } = await request.json();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'buy_shield') {
      const shieldCost = 50;
      const maxShields = 10;

      if (user.coins < shieldCost) {
        return NextResponse.json({ error: 'Not enough coins' }, { status: 400 });
      }

      const currentShields = user.streakShields || 0;
      if (currentShields >= maxShields) {
        return NextResponse.json({ error: 'Maximum shields reached' }, { status: 400 });
      }

      user.coins -= shieldCost;
      user.streakShields = currentShields + 1;
      await user.save();

      return NextResponse.json({
        message: 'Streak shield purchased!',
        streakShields: user.streakShields,
        coins: user.coins,
      });
    }

    if (action === 'protect_streak') {
      if (!questId) {
        return NextResponse.json({ error: 'Quest ID required' }, { status: 400 });
      }

      const currentShields = user.streakShields || 0;
      if (currentShields <= 0) {
        return NextResponse.json({ error: 'No shields available' }, { status: 400 });
      }

      const quest = await Quest.findById(questId);
      if (!quest) {
        return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
      }

      if (String(quest.userId) !== String(user._id)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      user.protectedStreaks = user.protectedStreaks || [];
      if (user.protectedStreaks.includes(questId)) {
        return NextResponse.json({ error: 'Quest already protected' }, { status: 400 });
      }

      user.streakShields = currentShields - 1;
      user.protectedStreaks.push(questId);
      await user.save();

      return NextResponse.json({
        message: `Streak protection activated for ${quest.title}!`,
        streakShields: user.streakShields,
        protectedStreaks: user.protectedStreaks,
      });
    }

    if (action === 'use_protection') {
      if (!questId) {
        return NextResponse.json({ error: 'Quest ID required' }, { status: 400 });
      }

      user.protectedStreaks = user.protectedStreaks || [];
      const protectionIndex = user.protectedStreaks.indexOf(questId);

      if (protectionIndex === -1) {
        return NextResponse.json({ error: 'No protection active for this quest' }, { status: 400 });
      }

      user.protectedStreaks.splice(protectionIndex, 1);
      await user.save();

      const quest = await Quest.findById(questId);
      if (quest) {
        return NextResponse.json({
          message: `Streak protection used! Your ${quest.title} streak is safe!`,
          protectedStreaks: user.protectedStreaks,
        });
      }

      return NextResponse.json({
        message: 'Streak protection used!',
        protectedStreaks: user.protectedStreaks,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Streak protection error:', error);
    return NextResponse.json({ error: 'Failed to process streak protection' }, { status: 500 });
  }
}
