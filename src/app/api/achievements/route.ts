import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { UserProfile, Quest } from '@/models';

const ACHIEVEMENTS = [
  { id: 'first_quest', name: 'First Steps', description: 'Complete your first quest', icon: '🎯', category: 'quests', rarity: 'common', secret: false, coinReward: 50, trigger: { type: 'quests_completed', count: 1 } },
  { id: 'quest_master_10', name: 'Quest Apprentice', description: 'Complete 10 quests', icon: '⚔️', category: 'quests', rarity: 'common', secret: false, coinReward: 100, trigger: { type: 'quests_completed', count: 10 } },
  { id: 'quest_master_50', name: 'Quest Knight', description: 'Complete 50 quests', icon: '🛡️', category: 'quests', rarity: 'rare', secret: false, coinReward: 250, trigger: { type: 'quests_completed', count: 50 } },
  { id: 'quest_master_100', name: 'Quest Champion', description: 'Complete 100 quests', icon: '👑', category: 'quests', rarity: 'epic', secret: false, coinReward: 500, trigger: { type: 'quests_completed', count: 100 } },
  { id: 'quest_master_500', name: 'Quest Legend', description: 'Complete 500 quests', icon: '⭐', category: 'quests', rarity: 'legendary', secret: false, coinReward: 2000, trigger: { type: 'quests_completed', count: 500 } },
  
  { id: 'level_5', name: 'Rising Hero', description: 'Reach level 5', icon: '📈', category: 'general', rarity: 'common', secret: false, coinReward: 75, trigger: { type: 'level', count: 5 } },
  { id: 'level_10', name: 'Experienced Adventurer', description: 'Reach level 10', icon: '🎖️', category: 'general', rarity: 'common', secret: false, coinReward: 150, trigger: { type: 'level', count: 10 } },
  { id: 'level_25', name: 'Elite Warrior', description: 'Reach level 25', icon: '💎', category: 'general', rarity: 'rare', secret: false, coinReward: 300, trigger: { type: 'level', count: 25 } },
  { id: 'level_50', name: 'Master of Life', description: 'Reach level 50', icon: '🌟', category: 'general', rarity: 'epic', secret: false, coinReward: 750, trigger: { type: 'level', count: 50 } },
  { id: 'level_100', name: 'Legendary Hero', description: 'Reach level 100', icon: '🏆', category: 'general', rarity: 'legendary', secret: false, coinReward: 2500, trigger: { type: 'level', count: 100 } },
  
  { id: 'coins_1000', name: 'Getting Rich', description: 'Earn 1,000 total coins', icon: '💰', category: 'finance', rarity: 'common', secret: false, coinReward: 100, trigger: { type: 'coins_earned', count: 1000 } },
  { id: 'coins_5000', name: 'Money Maker', description: 'Earn 5,000 total coins', icon: '💵', category: 'finance', rarity: 'rare', secret: false, coinReward: 250, trigger: { type: 'coins_earned', count: 5000 } },
  { id: 'coins_10000', name: 'Wealthy Merchant', description: 'Earn 10,000 total coins', icon: '💸', category: 'finance', rarity: 'epic', secret: false, coinReward: 500, trigger: { type: 'coins_earned', count: 10000 } },
  { id: 'coins_50000', name: 'Fortune Tycoon', description: 'Earn 50,000 total coins', icon: '🤑', category: 'finance', rarity: 'legendary', secret: false, coinReward: 2000, trigger: { type: 'coins_earned', count: 50000 } },
  
  { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day quest streak', icon: '🔥', category: 'quests', rarity: 'rare', secret: false, coinReward: 200, trigger: { type: 'streak', count: 7 } },
  { id: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day quest streak', icon: '🌙', category: 'quests', rarity: 'epic', secret: false, coinReward: 500, trigger: { type: 'streak', count: 30 } },
  { id: 'streak_100', name: 'Centurion', description: 'Maintain a 100-day quest streak', icon: '🏅', category: 'quests', rarity: 'legendary', secret: false, coinReward: 1500, trigger: { type: 'streak', count: 100 } },
  
  { id: 'first_creature', name: 'Monster Tamer', description: 'Obtain your first creature', icon: '🐾', category: 'creatures', rarity: 'common', secret: false, coinReward: 75, trigger: { type: 'creatures', count: 1 } },
  { id: 'creature_collection', name: 'Creature Collector', description: 'Collect all 5 creature types', icon: '🦄', category: 'creatures', rarity: 'rare', secret: false, coinReward: 300, trigger: { type: 'creatures', count: 5 } },
  { id: 'creature_max_level', name: 'Creature Master', description: 'Level a creature to max level', icon: '🌈', category: 'creatures', rarity: 'epic', secret: false, coinReward: 500, trigger: { type: 'creature_level', count: 10 } },
  
  { id: 'study_10h', name: 'Dedicated Student', description: 'Study for 10 total hours', icon: '📚', category: 'study', rarity: 'common', secret: false, coinReward: 100, trigger: { type: 'study_hours', count: 10 } },
  { id: 'study_50h', name: 'Scholar', description: 'Study for 50 total hours', icon: '🎓', category: 'study', rarity: 'rare', secret: false, coinReward: 250, trigger: { type: 'study_hours', count: 50 } },
  { id: 'study_100h', name: 'Academic Master', description: 'Study for 100 total hours', icon: '📖', category: 'study', rarity: 'epic', secret: false, coinReward: 500, trigger: { type: 'study_hours', count: 100 } },
  { id: 'study_500h', name: 'PhD Level', description: 'Study for 500 total hours', icon: '🧠', category: 'study', rarity: 'legendary', secret: false, coinReward: 2000, trigger: { type: 'study_hours', count: 500 } },
  
  { id: 'join_clan', name: 'Team Player', description: 'Join your first clan', icon: '🛡️', category: 'social', rarity: 'common', secret: false, coinReward: 100, trigger: { type: 'clan_joined', count: 1 } },
  { id: 'clan_contribution', name: 'Clan Hero', description: 'Contribute 1000 XP to your clan', icon: '⚔️', category: 'social', rarity: 'rare', secret: false, coinReward: 250, trigger: { type: 'clan_xp', count: 1000 } },
  
  { id: 'city_first_building', name: 'City Founder', description: 'Build your first building', icon: '🏗️', category: 'general', rarity: 'common', secret: false, coinReward: 75, trigger: { type: 'buildings', count: 1 } },
  { id: 'city_10_buildings', name: 'Urban Planner', description: 'Build 10 buildings', icon: '🌆', category: 'general', rarity: 'rare', secret: false, coinReward: 300, trigger: { type: 'buildings', count: 10 } },
  { id: 'city_metropolis', name: 'Metropolis Creator', description: 'Build all available buildings', icon: '🏙️', category: 'general', rarity: 'legendary', secret: false, coinReward: 1000, trigger: { type: 'buildings', count: 20 } },
  
  { id: 'budget_tracking', name: 'Money Manager', description: 'Track expenses for 7 consecutive days', icon: '💳', category: 'finance', rarity: 'common', secret: false, coinReward: 100, trigger: { type: 'expense_days', count: 7 } },
  { id: 'savings_goal', name: 'Goal Achiever', description: 'Complete your first savings goal', icon: '🎯', category: 'finance', rarity: 'rare', secret: false, coinReward: 250, trigger: { type: 'savings_goals', count: 1 } },
  
  { id: 'health_water', name: 'Hydration Hero', description: 'Log 8 glasses of water in a day', icon: '💧', category: 'general', rarity: 'common', secret: false, coinReward: 50, trigger: { type: 'water_intake', count: 8 } },
  { id: 'health_sleep', name: 'Sleep Champion', description: 'Log 7+ hours of sleep for 7 days', icon: '😴', category: 'general', rarity: 'rare', secret: false, coinReward: 200, trigger: { type: 'sleep_days', count: 7 } },
  { id: 'health_steps', name: '10K Walker', description: 'Walk 10,000 steps in a day', icon: '👟', category: 'general', rarity: 'common', secret: false, coinReward: 100, trigger: { type: 'steps', count: 10000 } },
  
  { id: 'game_master', name: 'Mini Game Master', description: 'Play 10 mini games', icon: '🎮', category: 'general', rarity: 'common', secret: false, coinReward: 100, trigger: { type: 'games_played', count: 10 } },
  { id: 'game_champion', name: 'Gaming Champion', description: 'Win 50 mini games', icon: '🏆', category: 'general', rarity: 'epic', secret: false, coinReward: 500, trigger: { type: 'games_won', count: 50 } },
  
  { id: 'profession_chosen', name: 'Path Chosen', description: 'Select your life profession', icon: '👔', category: 'general', rarity: 'common', secret: false, coinReward: 100, trigger: { type: 'profession_selected', count: 1 } },
  { id: 'profession_level_5', name: 'Professional Growth', description: 'Reach profession level 5', icon: '📊', category: 'general', rarity: 'rare', secret: false, coinReward: 250, trigger: { type: 'profession_level', count: 5 } },
  
  { id: 'secret_midnight', name: '???', description: 'Complete a quest at exactly midnight', icon: '🌙', category: 'general', rarity: 'epic', secret: true, coinReward: 500, trigger: { type: 'midnight_quest', count: 1 } },
  { id: 'secret_perfect_week', name: '???', description: 'Complete all daily quests for 7 consecutive days', icon: '✨', category: 'quests', rarity: 'legendary', secret: true, coinReward: 1000, trigger: { type: 'perfect_week', count: 1 } },
  { id: 'secret_speed_demon', name: '???', description: 'Complete 10 quests in one hour', icon: '⚡', category: 'quests', rarity: 'epic', secret: true, coinReward: 750, trigger: { type: 'speed_quests', count: 10 } },
  { id: 'secret_all_creatures_happy', name: '???', description: 'Keep all creatures at 100% happiness for 24 hours', icon: '😊', category: 'creatures', rarity: 'legendary', secret: true, coinReward: 1000, trigger: { type: 'perfect_creatures', count: 1 } },
  { id: 'secret_early_bird', name: '???', description: 'Complete a quest before 6 AM', icon: '🌅', category: 'quests', rarity: 'rare', secret: true, coinReward: 300, trigger: { type: 'early_quest', count: 1 } },
  { id: 'secret_night_owl', name: '???', description: 'Study for 2 hours after 10 PM', icon: '🦉', category: 'study', rarity: 'rare', secret: true, coinReward: 300, trigger: { type: 'night_study', count: 2 } },
  { id: 'secret_balanced', name: '???', description: 'Complete quests in all 5 categories in one day', icon: '⚖️', category: 'quests', rarity: 'epic', secret: true, coinReward: 750, trigger: { type: 'balanced_day', count: 1 } },
  { id: 'secret_marathon', name: '???', description: 'Study for 6 hours in a single session', icon: '🏃', category: 'study', rarity: 'legendary', secret: true, coinReward: 1000, trigger: { type: 'marathon_study', count: 6 } },
  { id: 'secret_lucky_7', name: '???', description: 'Earn exactly 777 coins in one day', icon: '🎰', category: 'general', rarity: 'epic', secret: true, coinReward: 777, trigger: { type: 'lucky_coins', count: 777 } },
  { id: 'secret_zero_to_hero', name: '???', description: 'Level up twice in one day', icon: '🚀', category: 'general', rarity: 'legendary', secret: true, coinReward: 1500, trigger: { type: 'double_level', count: 2 } },
  { id: 'secret_collector', name: '???', description: 'Unlock 25 other achievements', icon: '📜', category: 'general', rarity: 'legendary', secret: true, coinReward: 2000, trigger: { type: 'achievement_count', count: 25 } },
];

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = session.user.id;

    const userProfile = await UserProfile.findOne({ userId });
    const unlockedAchievements = userProfile?.achievements || [];

    const questsCompleted = await Quest.countDocuments({ 
      userId, 
      status: 'completed' 
    });

    const achievementsWithProgress = ACHIEVEMENTS.map(achievement => {
      const unlocked = unlockedAchievements.some((a: any) => a.id === achievement.id);
      const unlockedData = unlockedAchievements.find((a: any) => a.id === achievement.id);
      
      let progress = 0;
      let maxProgress = achievement.trigger.count;

      if (!unlocked) {
        switch (achievement.trigger.type) {
          case 'quests_completed':
            progress = Math.min(questsCompleted, maxProgress);
            break;
          case 'level':
            progress = Math.min(userProfile?.level || 0, maxProgress);
            break;
          case 'coins_earned':
            progress = Math.min(userProfile?.coinsEarned || 0, maxProgress);
            break;
          case 'creatures':
            progress = Math.min(userProfile?.creatures?.length || 0, maxProgress);
            break;
          default:
            progress = 0;
        }
      }

      return {
        ...achievement,
        unlocked,
        unlockedAt: unlockedData?.unlockedAt,
        progress: unlocked ? maxProgress : progress,
        maxProgress
      };
    });

    const totalUnlocked = achievementsWithProgress.filter(a => a.unlocked).length;

    return NextResponse.json({
      totalUnlocked,
      totalAchievements: ACHIEVEMENTS.length,
      achievements: achievementsWithProgress
    });

  } catch (error) {
    console.error('Achievements fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { achievementId } = body;

    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) {
      return NextResponse.json({ error: 'Invalid achievement' }, { status: 400 });
    }

    await connectDB();
    const userId = session.user.id;

    const userProfile = await UserProfile.findOne({ userId });
    const alreadyUnlocked = userProfile?.achievements?.some((a: any) => a.id === achievementId);

    if (alreadyUnlocked) {
      return NextResponse.json({ error: 'Achievement already unlocked' }, { status: 400 });
    }

    await UserProfile.findOneAndUpdate(
      { userId },
      {
        $push: {
          achievements: {
            id: achievementId,
            unlockedAt: new Date()
          }
        },
        $inc: {
          coins: achievement.coinReward
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: `Achievement unlocked: ${achievement.name}! +${achievement.coinReward} coins!`,
      achievement
    });

  } catch (error) {
    console.error('Achievement unlock error:', error);
    return NextResponse.json({ error: 'Failed to unlock achievement' }, { status: 500 });
  }
}
