import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { GameRoom } from '@/models';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'waiting';
    const gameType = searchParams.get('gameType');

    const filter: any = { status };
    if (gameType) filter.gameType = gameType;

    const rooms = await GameRoom.find(filter)
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json(rooms);
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
    const { gameType, maxPlayers = 2 } = body;

    if (!gameType) {
      return NextResponse.json({ 
        error: "gameType is required",
        code: "MISSING_GAME_TYPE" 
      }, { status: 400 });
    }

    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newRoom = await GameRoom.create({
      roomId,
      gameType,
      hostId: user.id,
      players: [user.id],
      maxPlayers,
      status: 'waiting',
    });

    return NextResponse.json(newRoom, { status: 201 });
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
    const { roomId, action } = body;

    if (!roomId) {
      return NextResponse.json({ 
        error: "roomId is required",
        code: "MISSING_ROOM_ID" 
      }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({ 
        error: "action is required",
        code: "MISSING_ACTION" 
      }, { status: 400 });
    }

    const room = await GameRoom.findOne({ roomId });

    if (!room) {
      return NextResponse.json({ 
        error: "Room not found",
        code: "ROOM_NOT_FOUND" 
      }, { status: 404 });
    }

    if (action === 'join') {
      if (room.players.length >= room.maxPlayers) {
        return NextResponse.json({ 
          error: "Room is full",
          code: "ROOM_FULL" 
        }, { status: 400 });
      }

      if (room.players.includes(user.id)) {
        return NextResponse.json({ 
          error: "Already in room",
          code: "ALREADY_IN_ROOM" 
        }, { status: 400 });
      }

      room.players.push(user.id);
      
      if (room.players.length === room.maxPlayers) {
        room.status = 'playing';
        room.startedAt = new Date();
      }

      await room.save();
    } else if (action === 'leave') {
      room.players = room.players.filter((p: string) => p !== user.id);
      
      if (room.players.length === 0) {
        await GameRoom.deleteOne({ roomId });
        return NextResponse.json({ message: 'Room deleted' });
      }
      
      if (room.hostId === user.id && room.players.length > 0) {
        room.hostId = room.players[0];
      }
      
      await room.save();
    } else if (action === 'finish') {
      if (room.hostId !== user.id) {
        return NextResponse.json({ 
          error: "Only host can finish game",
          code: "NOT_HOST" 
        }, { status: 403 });
      }

      room.status = 'finished';
      room.finishedAt = new Date();
      room.winner = body.winner;
      await room.save();
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
