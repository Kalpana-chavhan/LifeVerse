import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

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

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const query: Record<string, unknown> = { userId };

    if (startDate || endDate) {
      query.sessionDate = {};
      if (startDate) {
        (query.sessionDate as Record<string, unknown>).$gte = startDate;
      }
      if (endDate) {
        (query.sessionDate as Record<string, unknown>).$lte = endDate;
      }
    }

    const sessions = await db.collection('studySessions')
      .find(query)
      .sort({ sessionDate: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    return NextResponse.json(sessions, { status: 200 });
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
    const { userId, durationMinutes, focusScore, xpEarned, sessionDate, bossDefeated } = body;

    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!durationMinutes) {
      return NextResponse.json({ 
        error: "durationMinutes is required",
        code: "MISSING_DURATION_MINUTES" 
      }, { status: 400 });
    }

    if (!focusScore && focusScore !== 0) {
      return NextResponse.json({ 
        error: "focusScore is required",
        code: "MISSING_FOCUS_SCORE" 
      }, { status: 400 });
    }

    if (!xpEarned && xpEarned !== 0) {
      return NextResponse.json({ 
        error: "xpEarned is required",
        code: "MISSING_XP_EARNED" 
      }, { status: 400 });
    }

    if (!sessionDate) {
      return NextResponse.json({ 
        error: "sessionDate is required",
        code: "MISSING_SESSION_DATE" 
      }, { status: 400 });
    }

    if (durationMinutes <= 0) {
      return NextResponse.json({ 
        error: "durationMinutes must be greater than 0",
        code: "INVALID_DURATION_MINUTES" 
      }, { status: 400 });
    }

    if (focusScore < 0 || focusScore > 100) {
      return NextResponse.json({ 
        error: "focusScore must be between 0 and 100",
        code: "INVALID_FOCUS_SCORE" 
      }, { status: 400 });
    }

    if (xpEarned < 0) {
      return NextResponse.json({ 
        error: "xpEarned must be greater than or equal to 0",
        code: "INVALID_XP_EARNED" 
      }, { status: 400 });
    }

    const newSession = {
      userId,
      durationMinutes: parseInt(durationMinutes),
      focusScore: parseInt(focusScore),
      xpEarned: parseInt(xpEarned),
      sessionDate,
      bossDefeated: bossDefeated ?? false,
      createdAt: new Date(),
    };

    const result = await db.collection('studySessions').insertOne(newSession);

    return NextResponse.json({ ...newSession, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
