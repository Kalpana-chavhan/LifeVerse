import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const VALID_TYPES = ['academy', 'gym', 'bank', 'temple', 'hall'];
const VALID_CATEGORIES = ['learning', 'health', 'finance', 'mental', 'social'];

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("lifeverse");
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'userId query parameter is required',
        code: 'MISSING_USER_ID' 
      }, { status: 400 });
    }

    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const category = searchParams.get('category');
    const type = searchParams.get('type');

    const query: Record<string, unknown> = { userId };

    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        return NextResponse.json({ 
          error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
          code: 'INVALID_CATEGORY'
        }, { status: 400 });
      }
      query.category = category;
    }

    if (type) {
      if (!VALID_TYPES.includes(type)) {
        return NextResponse.json({ 
          error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`,
          code: 'INVALID_TYPE'
        }, { status: 400 });
      }
      query.type = type;
    }

    const results = await db.collection('buildings')
      .find(query)
      .skip(offset)
      .limit(limit)
      .toArray();

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
    const client = await clientPromise;
    const db = client.db("lifeverse");
    
    const body = await request.json();
    const { userId, type, category } = body;

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

    if (!category) {
      return NextResponse.json({ 
        error: "Category is required",
        code: "MISSING_CATEGORY" 
      }, { status: 400 });
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ 
        error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`,
        code: 'INVALID_TYPE'
      }, { status: 400 });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ 
        error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
        code: 'INVALID_CATEGORY'
      }, { status: 400 });
    }

    const now = new Date();

    const newBuilding = {
      userId,
      type: type.trim(),
      category: category.trim(),
      level: 1,
      unlockedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('buildings').insertOne(newBuilding);

    return NextResponse.json({ ...newBuilding, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("lifeverse");
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();

    const existingBuilding = await db.collection('buildings').findOne({
      _id: new ObjectId(id),
      userId
    });

    if (!existingBuilding) {
      return NextResponse.json({ 
        error: 'Building not found',
        code: 'BUILDING_NOT_FOUND'
      }, { status: 404 });
    }

    let newLevel = existingBuilding.level + 1;
    if (body.level !== undefined) {
      newLevel = parseInt(body.level);
      if (isNaN(newLevel) || newLevel < 1) {
        return NextResponse.json({ 
          error: "Level must be a positive integer",
          code: "INVALID_LEVEL" 
        }, { status: 400 });
      }
    }

    const result = await db.collection('buildings').findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      { $set: { level: newLevel, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
