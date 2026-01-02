import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import connectDB from '@/lib/db';
import { User } from '@/models';

const MARKETPLACE_ITEMS = [
  {
    id: 'cosmetic_avatar_1',
    name: 'Knight Avatar',
    description: 'Epic knight avatar frame',
    type: 'cosmetic',
    rarity: 'epic',
    price: 500,
    image: '⚔️'
  },
  {
    id: 'cosmetic_avatar_2',
    name: 'Wizard Avatar',
    description: 'Mystical wizard avatar frame',
    type: 'cosmetic',
    rarity: 'epic',
    price: 500,
    image: '🧙'
  },
  {
    id: 'cosmetic_avatar_3',
    name: 'Dragon Avatar',
    description: 'Legendary dragon avatar frame',
    type: 'cosmetic',
    rarity: 'legendary',
    price: 1000,
    image: '🐉'
  },
  {
    id: 'cosmetic_theme_1',
    name: 'Dark Theme',
    description: 'Sleek dark mode theme',
    type: 'theme',
    rarity: 'rare',
    price: 300,
    image: '🌙'
  },
  {
    id: 'cosmetic_theme_2',
    name: 'Rainbow Theme',
    description: 'Vibrant rainbow theme',
    type: 'theme',
    rarity: 'epic',
    price: 600,
    image: '🌈'
  },
  {
    id: 'boost_mega_xp',
    name: 'Mega XP Boost',
    description: '+100% XP for 4 hours',
    type: 'boost',
    rarity: 'legendary',
    price: 800,
    power: 2,
    duration: 14400,
    image: '⚡'
  },
  {
    id: 'boost_coin_rain',
    name: 'Coin Rain',
    description: '+3x coins for 2 hours',
    type: 'boost',
    rarity: 'epic',
    price: 600,
    power: 3,
    duration: 7200,
    image: '💰'
  }
];

export async function GET() {
  return NextResponse.json({ items: MARKETPLACE_ITEMS });
}

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

    const { itemId } = await req.json();
    const item = MARKETPLACE_ITEMS.find(i => i.id === itemId);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (user.coins < item.price) {
      return NextResponse.json({ error: 'Not enough coins' }, { status: 400 });
    }

    user.coins -= item.price;

    if (!user.inventory) {
      user.inventory = [];
    }

    const purchasedItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...item,
      purchasedAt: new Date()
    };

    user.inventory.push(purchasedItem);
    await user.save();

    return NextResponse.json({ 
      success: true, 
      item: purchasedItem,
      remainingCoins: user.coins
    });

  } catch (error: any) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to purchase item', details: error.message },
      { status: 500 }
    );
  }
}
