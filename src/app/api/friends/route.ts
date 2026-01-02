import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Friend, User } from '@/models';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const authUser = await getCurrentUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    if (statusParam && !['pending', 'accepted', 'rejected'].includes(statusParam)) {
      return NextResponse.json({ 
        error: "Invalid status. Must be one of: 'pending', 'accepted', 'rejected'",
        code: 'INVALID_STATUS'
      }, { status: 400 });
    }

    const filter: any = {
      $or: [
        { userId: authUser.id },
        { friendId: authUser.id }
      ]
    };

    if (statusParam) {
      filter.status = statusParam;
    }

    const results = await Friend.find(filter)
      .limit(limit)
      .skip(offset);

    const friendshipsWithDetails = await Promise.all(results.map(async (friendship) => {
      const friendUserId = friendship.userId === authUser.id ? friendship.friendId : friendship.userId;
      
      const friendUser = await User.findById(friendUserId);

      return {
        id: friendship._id,
        userId: friendship.userId,
        friendId: friendship.friendId,
        status: friendship.status,
        createdAt: friendship.createdAt,
        updatedAt: friendship.updatedAt,
        friendName: friendUser?.name || null,
        friendEmail: friendUser?.email || null,
        friendImage: friendUser?.image || null,
      };
    }));

    return NextResponse.json(friendshipsWithDetails, { status: 200 });

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
    
    const authUser = await getCurrentUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { friendId } = body;

    if (!friendId) {
      return NextResponse.json({ 
        error: "friendId is required",
        code: "MISSING_FRIEND_ID" 
      }, { status: 400 });
    }

    if (friendId === authUser.id) {
      return NextResponse.json({ 
        error: "Cannot send friend request to yourself",
        code: "SELF_FRIEND_REQUEST" 
      }, { status: 400 });
    }

    const existingFriendship = await Friend.findOne({
      $or: [
        { userId: authUser.id, friendId },
        { userId: friendId, friendId: authUser.id }
      ]
    });

    if (existingFriendship) {
      return NextResponse.json({ 
        error: "Friendship already exists",
        code: "FRIENDSHIP_ALREADY_EXISTS" 
      }, { status: 400 });
    }

    const newFriendship = await Friend.create({
      userId: authUser.id,
      friendId,
      status: 'pending',
    });

    return NextResponse.json(newFriendship, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}