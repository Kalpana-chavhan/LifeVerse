import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { GameScore, UserProfile } from '@/models';
import { getCurrentUser } from '@/lib/auth';

const VALID_GAME_TYPES = ['memory', 'sudoku', 'chess', 'word', 'pattern', 'trivia', 'reflex', 'math'];
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'];

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const gameType = searchParams.get('gameType');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);

    const filter: any = { userId: user.id };
    if (gameType) filter.gameType = gameType;

    const scores = await GameScore.find(filter)
      .sort({ playedAt: -1 })
      .limit(limit);

    return NextResponse.json(scores);
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
    const { gameType, score, difficulty } = body;

    if (!gameType) {
      return NextResponse.json({ 
        error: "gameType is required",
        code: "MISSING_GAME_TYPE" 
      }, { status: 400 });
    }

    if (!VALID_GAME_TYPES.includes(gameType)) {
      return NextResponse.json({ 
        error: `gameType must be one of: ${VALID_GAME_TYPES.join(', ')}`,
        code: "INVALID_GAME_TYPE" 
      }, { status: 400 });
    }

    if (score === undefined || score === null) {
      return NextResponse.json({ 
        error: "score is required",
        code: "MISSING_SCORE" 
      }, { status: 400 });
    }

    if (!difficulty || !VALID_DIFFICULTIES.includes(difficulty)) {
      return NextResponse.json({ 
        error: `difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`,
        code: "INVALID_DIFFICULTY" 
      }, { status: 400 });
    }

    // Calculate rewards based on difficulty and score
    const difficultyMultiplier = {
      easy: 1,
      medium: 1.5,
      hard: 2,
      expert: 3
    };

    const baseCoins = Math.floor(score / 10);
    const baseXP = Math.floor(score / 5);
    
    const coinsEarned = Math.floor(baseCoins * difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier]);
    const xpEarned = Math.floor(baseXP * difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier]);

    // Save game score
    const newScore = await GameScore.create({
      userId: user.id,
      gameType,
      score,
      coinsEarned,
      xpEarned,
      difficulty,
    });

    // Update user profile with rewards
    const profile = await UserProfile.findOne({ userId: user.id });
    if (profile) {
      profile.coins += coinsEarned;
      profile.xp += xpEarned;
      
      // Level up logic
      const xpForNextLevel = profile.level * 1000;
      while (profile.xp >= xpForNextLevel) {
        profile.level += 1;
        profile.xp -= xpForNextLevel;
      }
      
      await profile.save();
    }

    return NextResponse.json({
      score: newScore,
      rewards: { coinsEarned, xpEarned },
      profile
    }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
