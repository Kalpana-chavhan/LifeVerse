import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import User from '@/models/User';
import { connectDB } from '@/lib/db';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const NPCS = [
  {
    id: 'sage_mentor',
    name: 'Sage Mentor',
    role: 'Wisdom Guide',
    personality: 'Wise, patient, philosophical. Speaks in thoughtful, inspiring tones.',
    appearance: '🧙‍♂️',
    color: 'purple',
    specialty: 'Gives life advice and philosophical insights',
  },
  {
    id: 'warrior_coach',
    name: 'Warrior Coach',
    role: 'Fitness Trainer',
    personality: 'Energetic, motivating, tough but caring. Uses fitness metaphors.',
    appearance: '💪',
    color: 'red',
    specialty: 'Motivates physical activities and challenges',
  },
  {
    id: 'merchant_advisor',
    name: 'Merchant Advisor',
    role: 'Financial Guide',
    personality: 'Shrewd, practical, business-minded. Speaks in financial terms.',
    appearance: '💰',
    color: 'green',
    specialty: 'Offers budgeting and financial advice',
  },
  {
    id: 'artist_muse',
    name: 'Artist Muse',
    role: 'Creative Catalyst',
    personality: 'Dreamy, imaginative, expressive. Uses artistic analogies.',
    appearance: '🎨',
    color: 'pink',
    specialty: 'Inspires creativity and artistic pursuits',
  },
  {
    id: 'zen_guardian',
    name: 'Zen Guardian',
    role: 'Wellness Keeper',
    personality: 'Calm, mindful, compassionate. Speaks in soothing, peaceful tones.',
    appearance: '🧘',
    color: 'blue',
    specialty: 'Promotes mental health and mindfulness',
  },
];

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const npcRelationships = user.npcRelationships || {};
    const unlockedNPCs = user.unlockedNPCs || [];

    return NextResponse.json({
      npcs: NPCS,
      unlockedNPCs,
      relationships: npcRelationships,
    });
  } catch (error: any) {
    console.error('Get NPCs error:', error);
    return NextResponse.json({ error: 'Failed to fetch NPCs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { npcId, message, action } = await request.json();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const npc = NPCS.find((n) => n.id === npcId);
    if (!npc) {
      return NextResponse.json({ error: 'NPC not found' }, { status: 404 });
    }

    if (action === 'unlock') {
      const unlockCost = 200;
      if (user.coins < unlockCost) {
        return NextResponse.json({ error: 'Not enough coins' }, { status: 400 });
      }

      user.unlockedNPCs = user.unlockedNPCs || [];
      if (user.unlockedNPCs.includes(npcId)) {
        return NextResponse.json({ error: 'NPC already unlocked' }, { status: 400 });
      }

      user.coins -= unlockCost;
      user.unlockedNPCs.push(npcId);
      user.npcRelationships = user.npcRelationships || {};
      user.npcRelationships[npcId] = { level: 1, lastInteraction: new Date() };

      await user.save();

      return NextResponse.json({
        message: `${npc.name} has joined your journey!`,
        npc,
        coins: user.coins,
      });
    }

    if (action === 'chat') {
      user.unlockedNPCs = user.unlockedNPCs || [];
      if (!user.unlockedNPCs.includes(npcId)) {
        return NextResponse.json({ error: 'NPC not unlocked' }, { status: 403 });
      }

      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({
          response: `[AI unavailable] ${npc.name} says: "Add your OPENAI_API_KEY to enable dynamic conversations!"`,
          mockData: true,
        });
      }

      const systemPrompt = `You are ${npc.name}, a ${npc.role} in LifeVerse, a gamified life app. 
Personality: ${npc.personality}
Specialty: ${npc.specialty}

User stats:
- Level: ${user.level}
- XP: ${user.xp}
- Coins: ${user.coins}
- Profession: ${user.profession || 'None'}

Stay in character. Be helpful, motivating, and reference their stats when relevant. Keep responses under 100 words.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.8,
        max_tokens: 150,
      });

      const aiResponse = completion.choices[0].message.content;

      user.npcRelationships = user.npcRelationships || {};
      if (!user.npcRelationships[npcId]) {
        user.npcRelationships[npcId] = { level: 1, lastInteraction: new Date() };
      } else {
        user.npcRelationships[npcId].lastInteraction = new Date();
      }

      await user.save();

      return NextResponse.json({ response: aiResponse });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('NPC action error:', error);
    return NextResponse.json({ error: 'Failed to process NPC action' }, { status: 500 });
  }
}
