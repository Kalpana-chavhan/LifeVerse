import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import connectDB from '@/lib/db';
import { User } from '@/models';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { targetUserId, itemId, requestedCoins } = await req.json();

    if (!user.inventory) {
      return NextResponse.json({ error: 'No items to trade' }, { status: 400 });
    }

    const itemIndex = user.inventory.findIndex((item: any) => item.id === itemId);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found in inventory' }, { status: 404 });
    }

    const item = user.inventory[itemIndex];

    if (!user.tradeOffers) {
      user.tradeOffers = [];
    }

    const tradeOffer = {
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUserId: user._id.toString(),
      toUserId: targetUserId,
      itemId,
      itemName: item.name,
      itemType: item.type,
      requestedCoins,
      status: 'pending',
      createdAt: new Date()
    };

    user.tradeOffers.push(tradeOffer);
    await user.save();

    return NextResponse.json({ 
      success: true, 
      trade: tradeOffer
    });

  } catch (error: any) {
    console.error('Trade creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create trade', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const myOffers = user.tradeOffers || [];
    
    const receivedOffers = await User.find({
      'tradeOffers.toUserId': user._id.toString()
    }).select('tradeOffers name');

    const allReceivedOffers = receivedOffers.flatMap((u: any) => 
      u.tradeOffers
        .filter((offer: any) => offer.toUserId === user._id.toString())
        .map((offer: any) => ({ ...offer, fromUserName: u.name }))
    );

    return NextResponse.json({ 
      myOffers,
      receivedOffers: allReceivedOffers
    });

  } catch (error: any) {
    console.error('Get trades error:', error);
    return NextResponse.json(
      { error: 'Failed to get trades', details: error.message },
      { status: 500 }
    );
  }
}
