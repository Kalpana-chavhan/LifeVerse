import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { UserProfile } from '@/models';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const profile = await UserProfile.findOne({ userId: user.id });

    if (!profile) {
      return NextResponse.json({ 
        error: 'User profile not found',
        code: "PROFILE_NOT_FOUND" 
      }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    const existingProfile = await UserProfile.findOne({ userId });

    if (existingProfile) {
      return NextResponse.json({ 
        error: "User profile already exists",
        code: "PROFILE_EXISTS" 
      }, { status: 400 });
    }

    const newProfile = await UserProfile.create({
      userId,
      level: 1,
      xp: 0,
      coins: 0,
      healthSkill: 0,
      mindSkill: 0,
      financeSkill: 0,
      learningSkill: 0,
    });

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { level, xp, coins, healthSkill, mindSkill, financeSkill, learningSkill, bio, status, avatarUrl, username } = body;

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED'
        },
        { status: 400 }
      );
    }

    const existingProfile = await UserProfile.findOne({ userId: user.id });

    if (!existingProfile) {
      return NextResponse.json({ 
        error: 'User profile not found',
        code: "PROFILE_NOT_FOUND" 
      }, { status: 404 });
    }

    if (level !== undefined && (typeof level !== 'number' || level < 1)) {
      return NextResponse.json({ 
        error: "Level must be a number >= 1",
        code: "INVALID_LEVEL" 
      }, { status: 400 });
    }

    if (xp !== undefined && (typeof xp !== 'number' || xp < 0)) {
      return NextResponse.json({ 
        error: "XP must be a number >= 0",
        code: "INVALID_XP" 
      }, { status: 400 });
    }

    if (coins !== undefined && (typeof coins !== 'number' || coins < 0)) {
      return NextResponse.json({ 
        error: "Coins must be a number >= 0",
        code: "INVALID_COINS" 
      }, { status: 400 });
    }

    const skillFields = [
      { name: 'healthSkill', value: healthSkill },
      { name: 'mindSkill', value: mindSkill },
      { name: 'financeSkill', value: financeSkill },
      { name: 'learningSkill', value: learningSkill }
    ];

    for (const field of skillFields) {
      if (field.value !== undefined && (typeof field.value !== 'number' || field.value < 0)) {
        return NextResponse.json({ 
          error: `${field.name} must be a number >= 0`,
          code: "INVALID_SKILL_VALUE" 
        }, { status: 400 });
      }
    }

    const updates: Record<string, any> = {};

    if (level !== undefined) updates.level = level;
    if (xp !== undefined) updates.xp = xp;
    if (coins !== undefined) updates.coins = coins;
    if (healthSkill !== undefined) updates.healthSkill = healthSkill;
    if (mindSkill !== undefined) updates.mindSkill = mindSkill;
    if (financeSkill !== undefined) updates.financeSkill = financeSkill;
    if (learningSkill !== undefined) updates.learningSkill = learningSkill;
    if (bio !== undefined) updates.bio = bio ? bio.trim() : null;
    if (status !== undefined) updates.status = status ? status.trim() : 'Ready for adventure!';
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl ? avatarUrl.trim() : null;
    if (username !== undefined) updates.username = username ? username.trim() : null;

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: user.id },
      { $set: updates },
      { new: true }
    );

    if (!updatedProfile) {
      return NextResponse.json({ 
        error: 'Failed to update user profile',
        code: "UPDATE_FAILED" 
      }, { status: 500 });
    }

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}