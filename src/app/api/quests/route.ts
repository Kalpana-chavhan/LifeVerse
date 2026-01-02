import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Quest } from '@/models';
import { getCurrentUser } from '@/lib/auth';

const VALID_TYPES = ['daily', 'weekly', 'challenge'];
const VALID_CATEGORIES = ['health', 'mind', 'finance', 'learning', 'social'];
const VALID_STATUSES = ['active', 'completed', 'failed'];

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'userId query parameter is required',
        code: 'MISSING_USER_ID' 
      }, { status: 400 });
    }

    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    if (type && !VALID_TYPES.includes(type)) {
      return NextResponse.json({ 
        error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`,
        code: 'INVALID_TYPE' 
      }, { status: 400 });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        code: 'INVALID_STATUS' 
      }, { status: 400 });
    }

    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ 
        error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
        code: 'INVALID_CATEGORY' 
      }, { status: 400 });
    }

    const filter: any = { userId };
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (category) filter.category = category;

    const results = await Quest.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    return NextResponse.json(results);
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
    const { userId, title, description, type, category, xpReward, coinReward, dueDate } = body;

    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ 
        error: "Title is required",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ 
        error: "Type is required",
        code: "MISSING_TYPE" 
      }, { status: 400 });
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ 
        error: `Type must be one of: ${VALID_TYPES.join(', ')}`,
        code: "INVALID_TYPE" 
      }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ 
        error: "Category is required",
        code: "MISSING_CATEGORY" 
      }, { status: 400 });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ 
        error: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
        code: "INVALID_CATEGORY" 
      }, { status: 400 });
    }

    if (xpReward === undefined || xpReward === null) {
      return NextResponse.json({ 
        error: "XP reward is required",
        code: "MISSING_XP_REWARD" 
      }, { status: 400 });
    }

    if (typeof xpReward !== 'number' || xpReward < 0) {
      return NextResponse.json({ 
        error: "XP reward must be a non-negative number",
        code: "INVALID_XP_REWARD" 
      }, { status: 400 });
    }

    if (coinReward === undefined || coinReward === null) {
      return NextResponse.json({ 
        error: "Coin reward is required",
        code: "MISSING_COIN_REWARD" 
      }, { status: 400 });
    }

    if (typeof coinReward !== 'number' || coinReward < 0) {
      return NextResponse.json({ 
        error: "Coin reward must be a non-negative number",
        code: "INVALID_COIN_REWARD" 
      }, { status: 400 });
    }

    if (!dueDate) {
      return NextResponse.json({ 
        error: "Due date is required",
        code: "MISSING_DUE_DATE" 
      }, { status: 400 });
    }

    const newQuest = await Quest.create({
      userId,
      title: title.trim(),
      description: description ? description.trim() : undefined,
      type,
      category,
      xpReward,
      coinReward,
      dueDate,
      status: 'active',
      streakCount: 0,
    });

    return NextResponse.json(newQuest, { status: 201 });
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
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const existingQuest = await Quest.findOne({ _id: id, userId: user.id });

    if (!existingQuest) {
      return NextResponse.json({ 
        error: 'Quest not found',
        code: 'QUEST_NOT_FOUND' 
      }, { status: 404 });
    }

    const { title, description, status, streakCount, completedAt } = body;

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ 
        error: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    if (streakCount !== undefined && (typeof streakCount !== 'number' || streakCount < 0)) {
      return NextResponse.json({ 
        error: "Streak count must be a non-negative number",
        code: "INVALID_STREAK_COUNT" 
      }, { status: 400 });
    }

    const updates: any = {};

    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description ? description.trim() : null;
    if (status !== undefined) {
      updates.status = status;
      if (status === 'completed' && !completedAt) {
        updates.completedAt = new Date();
      }
    }
    if (streakCount !== undefined) updates.streakCount = streakCount;
    if (completedAt !== undefined) updates.completedAt = completedAt;

    const updatedQuest = await Quest.findOneAndUpdate(
      { _id: id, userId: user.id },
      { $set: updates },
      { new: true }
    );

    if (!updatedQuest) {
      return NextResponse.json({ 
        error: 'Quest not found',
        code: 'QUEST_NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json(updatedQuest);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const deletedQuest = await Quest.findOneAndDelete({ _id: id, userId: user.id });

    if (!deletedQuest) {
      return NextResponse.json({ 
        error: 'Quest not found',
        code: 'QUEST_NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Quest deleted successfully',
      quest: deletedQuest 
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}