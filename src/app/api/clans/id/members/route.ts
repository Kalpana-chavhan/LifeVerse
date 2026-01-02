import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clanIdParam } = await context.params;

    let clanObjectId: ObjectId;
    try {
      clanObjectId = new ObjectId(clanIdParam);
    } catch {
      return NextResponse.json(
        { error: 'Valid clan ID is required', code: 'INVALID_CLAN_ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("lifeverse");

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const members = await db.collection('clanMembers')
      .aggregate([
        { $match: { clanId: clanObjectId } },
        {
          $lookup: {
            from: 'user',
            localField: 'userId',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            clanId: 1,
            userId: 1,
            role: 1,
            joinedAt: 1,
            contributionXp: 1,
            userName: '$userInfo.name',
            userEmail: '$userInfo.email',
            userImage: '$userInfo.image'
          }
        },
        { $sort: { contributionXp: -1 } },
        { $skip: offset },
        { $limit: limit }
      ])
      .toArray();

    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    console.error('GET clan members error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
