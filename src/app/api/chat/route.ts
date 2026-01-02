import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ChatMessage } from '@/models';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const friendId = searchParams.get('friendId');
    
    if (!friendId) {
      return NextResponse.json({ 
        error: 'friendId query parameter is required',
        code: 'MISSING_FRIEND_ID' 
      }, { status: 400 });
    }

    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Get messages between user and friend
    const messages = await ChatMessage.find({
      $or: [
        { senderId: user.id, recipientId: friendId },
        { senderId: friendId, recipientId: user.id }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    return NextResponse.json(messages.reverse());
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
    
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { recipientId, message } = body;

    if (!recipientId) {
      return NextResponse.json({ 
        error: "recipientId is required",
        code: "MISSING_RECIPIENT_ID" 
      }, { status: 400 });
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ 
        error: "Message is required",
        code: "MISSING_MESSAGE" 
      }, { status: 400 });
    }

    const newMessage = await ChatMessage.create({
      senderId: user.id,
      recipientId,
      message: message.trim(),
      read: false,
    });

    return NextResponse.json(newMessage, { status: 201 });
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

    const body = await request.json();
    const { friendId } = body;

    if (!friendId) {
      return NextResponse.json({ 
        error: "friendId is required",
        code: "MISSING_FRIEND_ID" 
      }, { status: 400 });
    }

    // Mark all messages from friend as read
    await ChatMessage.updateMany(
      { senderId: friendId, recipientId: user.id, read: false },
      { $set: { read: true } }
    );

    return NextResponse.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
