import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Creature } from '@/models';
import { getCurrentUser } from '@/lib/auth';

const VALID_TYPES = ['fitness', 'finance', 'study', 'mental', 'social'] as const;

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

    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const results = await Creature.find({ userId })
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
    const { userId, type, name } = body;

    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ 
        error: "Type is required",
        code: "MISSING_TYPE" 
      }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ 
        error: "Name is required",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ 
        error: `Type must be one of: ${VALID_TYPES.join(', ')}`,
        code: "INVALID_TYPE" 
      }, { status: 400 });
    }

    const newCreature = await Creature.create({
      userId,
      type: type.trim(),
      name: name.trim(),
      level: 1,
      happiness: 50,
      evolutionStage: 1,
      lastFedAt: new Date(),
    });

    return NextResponse.json(newCreature, { status: 201 });
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

    const existingCreature = await Creature.findOne({ _id: id, userId: user.id });

    if (!existingCreature) {
      return NextResponse.json({ 
        error: 'Creature not found',
        code: 'CREATURE_NOT_FOUND' 
      }, { status: 404 });
    }

    const { name, level, happiness, evolutionStage, lastFedAt } = body;

    if (level !== undefined && level < 1) {
      return NextResponse.json({ 
        error: "Level must be >= 1",
        code: "INVALID_LEVEL" 
      }, { status: 400 });
    }

    if (happiness !== undefined && (happiness < 0 || happiness > 100)) {
      return NextResponse.json({ 
        error: "Happiness must be between 0 and 100",
        code: "INVALID_HAPPINESS" 
      }, { status: 400 });
    }

    if (evolutionStage !== undefined && evolutionStage < 1) {
      return NextResponse.json({ 
        error: "Evolution stage must be >= 1",
        code: "INVALID_EVOLUTION_STAGE" 
      }, { status: 400 });
    }

    const updates: Record<string, any> = {};

    if (name !== undefined) updates.name = name.trim();
    if (level !== undefined) updates.level = level;
    if (happiness !== undefined) updates.happiness = happiness;
    if (evolutionStage !== undefined) updates.evolutionStage = evolutionStage;
    if (lastFedAt !== undefined) updates.lastFedAt = lastFedAt;

    const updated = await Creature.findOneAndUpdate(
      { _id: id, userId: user.id },
      { $set: updates },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ 
        error: 'Creature not found',
        code: 'CREATURE_NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}