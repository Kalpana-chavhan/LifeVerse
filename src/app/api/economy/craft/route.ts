import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import connectDB from '@/lib/db';
import { User } from '@/models';

const CRAFTING_RECIPES = {
  xp_boost_small: {
    name: 'Small XP Boost',
    description: '+25% XP for 1 hour',
    ingredients: { coins: 100 },
    result: { type: 'xp_boost', power: 1.25, duration: 3600 }
  },
  xp_boost_large: {
    name: 'Large XP Boost',
    description: '+50% XP for 2 hours',
    ingredients: { coins: 250 },
    result: { type: 'xp_boost', power: 1.5, duration: 7200 }
  },
  coin_multiplier: {
    name: 'Coin Multiplier',
    description: '+2x coins for 1 hour',
    ingredients: { coins: 200 },
    result: { type: 'coin_boost', power: 2, duration: 3600 }
  },
  streak_shield: {
    name: 'Streak Shield',
    description: 'Protect one streak from breaking',
    ingredients: { coins: 150 },
    result: { type: 'streak_protection', uses: 1 }
  },
  legendary_item: {
    name: 'Legendary Item',
    description: 'A rare collectible item',
    ingredients: { coins: 500 },
    result: { type: 'legendary', rarity: 'legendary' }
  }
};

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

    const { recipeId } = await req.json();
    const recipe = CRAFTING_RECIPES[recipeId as keyof typeof CRAFTING_RECIPES];

    if (!recipe) {
      return NextResponse.json({ error: 'Invalid recipe' }, { status: 400 });
    }

    if (user.coins < recipe.ingredients.coins) {
      return NextResponse.json({ error: 'Not enough coins' }, { status: 400 });
    }

    user.coins -= recipe.ingredients.coins;

    if (!user.inventory) {
      user.inventory = [];
    }

    const newItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: recipe.name,
      description: recipe.description,
      type: recipe.result.type,
      rarity: recipe.result.rarity || 'common',
      power: recipe.result.power,
      duration: recipe.result.duration,
      uses: recipe.result.uses,
      craftedAt: new Date()
    };

    user.inventory.push(newItem);
    await user.save();

    return NextResponse.json({ 
      success: true, 
      item: newItem,
      remainingCoins: user.coins
    });

  } catch (error: any) {
    console.error('Craft error:', error);
    return NextResponse.json(
      { error: 'Failed to craft item', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ recipes: CRAFTING_RECIPES });
}
