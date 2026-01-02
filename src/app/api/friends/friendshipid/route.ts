import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ friendshipId: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const friendshipId = params.friendshipId;

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(friendshipId);
    } catch {
      return NextResponse.json(
        { error: 'Valid friendship ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required', code: 'MISSING_STATUS' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'accepted', 'blocked'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status must be one of: pending, accepted, blocked', code: 'INVALID_STATUS' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("lifeverse");

    const existingFriendship = await db.collection('friends').findOne({ _id: objectId });

    if (!existingFriendship) {
      return NextResponse.json(
        { error: 'Friendship not found', code: 'FRIENDSHIP_NOT_FOUND' },
        { status: 404 }
      );
    }

    const isParticipant =
      existingFriendship.userId === user.id || existingFriendship.friendId === user.id;

    if (!isParticipant) {
      return NextResponse.json(
        { error: 'You are not authorized to modify this friendship', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    const updated = await db.collection('friends').findOneAndUpdate(
      { _id: objectId },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ friendshipId: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const friendshipId = params.friendshipId;

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(friendshipId);
    } catch {
      return NextResponse.json(
        { error: 'Valid friendship ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("lifeverse");

    const existingFriendship = await db.collection('friends').findOne({ _id: objectId });

    if (!existingFriendship) {
      return NextResponse.json(
        { error: 'Friendship not found', code: 'FRIENDSHIP_NOT_FOUND' },
        { status: 404 }
      );
    }

    const isParticipant =
      existingFriendship.userId === user.id || existingFriendship.friendId === user.id;

    if (!isParticipant) {
      return NextResponse.json(
        { error: 'You are not authorized to delete this friendship', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    await db.collection('friends').deleteOne({ _id: objectId });

    return NextResponse.json(
      { message: 'Friendship deleted successfully', friendship: existingFriendship },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
