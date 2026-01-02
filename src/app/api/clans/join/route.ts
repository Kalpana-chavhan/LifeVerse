import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("lifeverse");

    const body = await request.json();
    const { clanId } = body;

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        { error: 'User ID cannot be provided in request body', code: 'USER_ID_NOT_ALLOWED' },
        { status: 400 }
      );
    }

    if (!clanId) {
      return NextResponse.json(
        { error: 'Clan ID is required', code: 'MISSING_CLAN_ID' },
        { status: 400 }
      );
    }

    let clanObjectId: ObjectId;
    try {
      clanObjectId = new ObjectId(clanId);
    } catch {
      return NextResponse.json(
        { error: 'Clan ID must be a valid ObjectId', code: 'INVALID_CLAN_ID' },
        { status: 400 }
      );
    }

    const clan = await db.collection('clans').findOne({ _id: clanObjectId });

    if (!clan) {
      return NextResponse.json(
        { error: 'Clan not found', code: 'CLAN_NOT_FOUND' },
        { status: 404 }
      );
    }

    const existingMembership = await db.collection('clanMembers').findOne({
      clanId: clanObjectId,
      userId: user.id
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: 'User is already a member of this clan', code: 'ALREADY_MEMBER' },
        { status: 400 }
      );
    }

    const newMembership = {
      clanId: clanObjectId,
      userId: user.id,
      role: 'member',
      joinedAt: new Date(),
      contributionXp: 0
    };

    const result = await db.collection('clanMembers').insertOne(newMembership);

    await db.collection('clans').updateOne(
      { _id: clanObjectId },
      { $inc: { memberCount: 1 }, $set: { updatedAt: new Date() } }
    );

    return NextResponse.json({ ...newMembership, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
