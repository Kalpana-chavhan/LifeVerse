import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const VALID_ITEM_TYPES = ['buff', 'xp_boost', 'time_boost', 'mood_boost'];

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("lifeverse");
    
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'userId query parameter is required',
        code: 'MISSING_USER_ID' 
      }, { status: 400 });
    }

    const itemType = searchParams.get('itemType');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    if (itemType && !VALID_ITEM_TYPES.includes(itemType)) {
      return NextResponse.json({ 
        error: `Invalid itemType. Must be one of: ${VALID_ITEM_TYPES.join(', ')}`,
        code: 'INVALID_ITEM_TYPE'
      }, { status: 400 });
    }

    const query: Record<string, unknown> = { userId };
    
    if (itemType) {
      query.itemType = itemType;
    }

    const results = await db.collection('inventory')
      .find(query)
      .skip(offset)
      .limit(limit)
      .toArray();

    return NextResponse.json(results, { status: 200 });
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
    const { userId, itemName, itemType, quantity } = body;

    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID"
      }, { status: 400 });
    }

    if (!itemName || typeof itemName !== 'string' || itemName.trim() === '') {
      return NextResponse.json({ 
        error: "itemName is required and must be a non-empty string",
        code: "MISSING_ITEM_NAME"
      }, { status: 400 });
    }

    if (!itemType || !VALID_ITEM_TYPES.includes(itemType)) {
      return NextResponse.json({ 
        error: `itemType is required and must be one of: ${VALID_ITEM_TYPES.join(', ')}`,
        code: "INVALID_ITEM_TYPE"
      }, { status: 400 });
    }

    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json({ 
        error: "quantity is required and must be a positive number",
        code: "INVALID_QUANTITY"
      }, { status: 400 });
    }

    const existingItem = await db.collection('inventory').findOne({
      userId,
      itemName: itemName.trim()
    });

    if (existingItem) {
      const updated = await db.collection('inventory').findOneAndUpdate(
        { _id: existingItem._id },
        { $inc: { quantity } },
        { returnDocument: 'after' }
      );
      return NextResponse.json(updated, { status: 200 });
    } else {
      const newItem = {
        userId,
        itemName: itemName.trim(),
        itemType,
        quantity,
        createdAt: new Date()
      };
      const result = await db.collection('inventory').insertOne(newItem);
      return NextResponse.json({ ...newItem, _id: result.insertedId }, { status: 201 });
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
