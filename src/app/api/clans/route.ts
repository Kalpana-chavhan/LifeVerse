import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("lifeverse");
    
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    if (userId) {
      const userClanMembership = await db.collection('clanMembers').findOne({ userId });

      if (!userClanMembership) {
        return NextResponse.json({ error: 'User is not a member of any clan' }, { status: 404 });
      }

      const clan = await db.collection('clans').findOne({ _id: userClanMembership.clanId });
      return NextResponse.json(clan);
    }

    const query: Record<string, unknown> = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const results = await db.collection('clans')
      .find(query)
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    return NextResponse.json(results);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("lifeverse");
    
    const body = await request.json();
    const { name, leaderId, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!leaderId) {
      return NextResponse.json(
        { error: 'Leader ID is required', code: 'MISSING_LEADER_ID' },
        { status: 400 }
      );
    }

    const sanitizedName = name.trim();
    const sanitizedDescription = description?.trim();

    if (!sanitizedName) {
      return NextResponse.json(
        { error: 'Name cannot be empty', code: 'INVALID_NAME' },
        { status: 400 }
      );
    }

    const existingClan = await db.collection('clans').findOne({ name: sanitizedName });

    if (existingClan) {
      return NextResponse.json(
        { error: 'Clan name already exists', code: 'DUPLICATE_CLAN_NAME' },
        { status: 400 }
      );
    }

    const timestamp = new Date();

    const newClan = {
      name: sanitizedName,
      description: sanitizedDescription || null,
      leaderId,
      totalXp: 0,
      memberCount: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const result = await db.collection('clans').insertOne(newClan);

    await db.collection('clanMembers').insertOne({
      clanId: result.insertedId,
      userId: leaderId,
      role: 'leader',
      joinedAt: timestamp,
      contributionXp: 0,
    });

    return NextResponse.json({ ...newClan, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
