import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import User from '@/models/User';
import { connectDB } from '@/lib/db';

const SKILL_TREES = {
  focus: {
    name: 'Focus Mastery',
    description: 'Enhance productivity and concentration',
    icon: 'brain',
    color: 'blue',
    skills: [
      { id: 'focus_1', name: 'Deep Work', description: '+10% XP from study sessions', levelReq: 1, cost: 100, bonus: { studyXP: 1.1 } },
      { id: 'focus_2', name: 'Flow State', description: '+15% XP from focus activities', levelReq: 5, cost: 200, requires: ['focus_1'], bonus: { focusXP: 1.15 } },
      { id: 'focus_3', name: 'Hyper Focus', description: '+20% XP from all quests', levelReq: 10, cost: 300, requires: ['focus_2'], bonus: { questXP: 1.2 } },
      { id: 'focus_4', name: 'Zen Master', description: '+30% XP from meditation & study', levelReq: 15, cost: 500, requires: ['focus_3'], bonus: { studyXP: 1.3 } },
      { id: 'focus_5', name: 'Mind Palace', description: 'Double streak protection', levelReq: 20, cost: 800, requires: ['focus_4'], bonus: { streakProtection: 2 } },
    ],
  },
  fitness: {
    name: 'Physical Power',
    description: 'Boost health and fitness rewards',
    icon: 'activity',
    color: 'red',
    skills: [
      { id: 'fitness_1', name: 'Workout Warrior', description: '+10% XP from fitness quests', levelReq: 1, cost: 100, bonus: { fitnessXP: 1.1 } },
      { id: 'fitness_2', name: 'Endurance', description: '+15% health tracking rewards', levelReq: 5, cost: 200, requires: ['fitness_1'], bonus: { healthXP: 1.15 } },
      { id: 'fitness_3', name: 'Athletic Beast', description: '+20% coins from fitness', levelReq: 10, cost: 300, requires: ['fitness_2'], bonus: { fitnessCoins: 1.2 } },
      { id: 'fitness_4', name: 'Peak Performance', description: '+25% all physical rewards', levelReq: 15, cost: 500, requires: ['fitness_3'], bonus: { physicalRewards: 1.25 } },
      { id: 'fitness_5', name: 'Superhuman', description: 'Unlock ultimate fitness quests', levelReq: 20, cost: 800, requires: ['fitness_4'], bonus: { ultimateQuests: true } },
    ],
  },
  finance: {
    name: 'Wealth Builder',
    description: 'Master budgeting and earning',
    icon: 'wallet',
    color: 'green',
    skills: [
      { id: 'finance_1', name: 'Coin Collector', description: '+10% coins from all sources', levelReq: 1, cost: 100, bonus: { coinMultiplier: 1.1 } },
      { id: 'finance_2', name: 'Investor', description: '+15% budget quest rewards', levelReq: 5, cost: 200, requires: ['finance_1'], bonus: { budgetXP: 1.15 } },
      { id: 'finance_3', name: 'Money Manager', description: '+20% savings goal bonuses', levelReq: 10, cost: 300, requires: ['finance_2'], bonus: { savingsBonus: 1.2 } },
      { id: 'finance_4', name: 'Wealthy Tycoon', description: '+25% all financial rewards', levelReq: 15, cost: 500, requires: ['finance_3'], bonus: { financeRewards: 1.25 } },
      { id: 'finance_5', name: 'Gold Hoarder', description: 'Daily coin bonus: 100/day', levelReq: 20, cost: 800, requires: ['finance_4'], bonus: { dailyCoins: 100 } },
    ],
  },
  creativity: {
    name: 'Creative Genius',
    description: 'Unlock artistic potential',
    icon: 'sparkles',
    color: 'purple',
    skills: [
      { id: 'creativity_1', name: 'Idea Machine', description: '+10% XP from creative tasks', levelReq: 1, cost: 100, bonus: { creativeXP: 1.1 } },
      { id: 'creativity_2', name: 'Inspiration', description: '+15% rewards from projects', levelReq: 5, cost: 200, requires: ['creativity_1'], bonus: { projectXP: 1.15 } },
      { id: 'creativity_3', name: 'Master Craftsman', description: 'Unlock crafting recipes', levelReq: 10, cost: 300, requires: ['creativity_2'], bonus: { craftingUnlock: true } },
      { id: 'creativity_4', name: 'Visionary', description: '+25% creative quest rewards', levelReq: 15, cost: 500, requires: ['creativity_3'], bonus: { creativeRewards: 1.25 } },
      { id: 'creativity_5', name: 'Renaissance Soul', description: 'Unlock all creative quests', levelReq: 20, cost: 800, requires: ['creativity_4'], bonus: { allCreativeQuests: true } },
    ],
  },
  wellness: {
    name: 'Life Balance',
    description: 'Enhance mental and emotional health',
    icon: 'heart',
    color: 'pink',
    skills: [
      { id: 'wellness_1', name: 'Self Care', description: '+10% XP from wellness activities', levelReq: 1, cost: 100, bonus: { wellnessXP: 1.1 } },
      { id: 'wellness_2', name: 'Mindfulness', description: '+15% meditation rewards', levelReq: 5, cost: 200, requires: ['wellness_1'], bonus: { meditationXP: 1.15 } },
      { id: 'wellness_3', name: 'Emotional Intelligence', description: 'Mood tracking bonus rewards', levelReq: 10, cost: 300, requires: ['wellness_2'], bonus: { moodBonus: 1.2 } },
      { id: 'wellness_4', name: 'Inner Peace', description: '+25% all wellness rewards', levelReq: 15, cost: 500, requires: ['wellness_3'], bonus: { wellnessRewards: 1.25 } },
      { id: 'wellness_5', name: 'Life Sage', description: 'Unlock secret wellness quests', levelReq: 20, cost: 800, requires: ['wellness_4'], bonus: { secretQuests: true } },
    ],
  },
};

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

    const userSkills = user.unlockedSkills || [];

    return NextResponse.json({
      skillTrees: SKILL_TREES,
      unlockedSkills: userSkills,
      userLevel: user.level,
      userCoins: user.coins,
    });
  } catch (error: any) {
    console.error('Get skills error:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
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
    const { skillId, treeId } = await request.json();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const tree = SKILL_TREES[treeId as keyof typeof SKILL_TREES];
    if (!tree) {
      return NextResponse.json({ error: 'Invalid skill tree' }, { status: 400 });
    }

    const skill = tree.skills.find((s) => s.id === skillId);
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    if (user.unlockedSkills?.includes(skillId)) {
      return NextResponse.json({ error: 'Skill already unlocked' }, { status: 400 });
    }

    if (user.level < skill.levelReq) {
      return NextResponse.json({ error: `Level ${skill.levelReq} required` }, { status: 400 });
    }

    if (user.coins < skill.cost) {
      return NextResponse.json({ error: 'Not enough coins' }, { status: 400 });
    }

    if (skill.requires) {
      const hasPrerequisites = skill.requires.every((req) => user.unlockedSkills?.includes(req));
      if (!hasPrerequisites) {
        return NextResponse.json({ error: 'Prerequisites not met' }, { status: 400 });
      }
    }

    user.coins -= skill.cost;
    user.unlockedSkills = user.unlockedSkills || [];
    user.unlockedSkills.push(skillId);

    if (!user.skillBonuses) {
      user.skillBonuses = {};
    }
    Object.assign(user.skillBonuses, skill.bonus);

    await user.save();

    return NextResponse.json({
      message: `Unlocked ${skill.name}!`,
      skill,
      newCoins: user.coins,
      unlockedSkills: user.unlockedSkills,
    });
  } catch (error: any) {
    console.error('Unlock skill error:', error);
    return NextResponse.json({ error: 'Failed to unlock skill' }, { status: 500 });
  }
}
