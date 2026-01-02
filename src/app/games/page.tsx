"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Brain, Trophy, Zap, Target, Grid3x3, Dices, MessageSquare, Calculator, Sparkles, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Game {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  estimatedTime: string;
  rewards: {
    easy: { coins: number; xp: number };
    medium: { coins: number; xp: number };
    hard: { coins: number; xp: number };
    expert: { coins: number; xp: number };
  };
}

const games: Game[] = [
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Test your memory by matching pairs of cards',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    difficulty: 'easy',
    estimatedTime: '3-5 min',
    rewards: {
      easy: { coins: 50, xp: 25 },
      medium: { coins: 100, xp: 50 },
      hard: { coins: 200, xp: 100 },
      expert: { coins: 400, xp: 200 }
    }
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    description: 'Solve number puzzles using logic',
    icon: Grid3x3,
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'medium',
    estimatedTime: '10-15 min',
    rewards: {
      easy: { coins: 75, xp: 40 },
      medium: { coins: 150, xp: 75 },
      hard: { coins: 300, xp: 150 },
      expert: { coins: 600, xp: 300 }
    }
  },
  {
    id: 'pattern',
    name: 'Pattern Recognition',
    description: 'Identify and complete visual patterns',
    icon: Target,
    color: 'from-green-500 to-emerald-500',
    difficulty: 'medium',
    estimatedTime: '5-8 min',
    rewards: {
      easy: { coins: 60, xp: 30 },
      medium: { coins: 120, xp: 60 },
      hard: { coins: 240, xp: 120 },
      expert: { coins: 480, xp: 240 }
    }
  },
  {
    id: 'word',
    name: 'Word Puzzle',
    description: 'Find hidden words and build vocabulary',
    icon: MessageSquare,
    color: 'from-orange-500 to-red-500',
    difficulty: 'easy',
    estimatedTime: '5-10 min',
    rewards: {
      easy: { coins: 55, xp: 28 },
      medium: { coins: 110, xp: 55 },
      hard: { coins: 220, xp: 110 },
      expert: { coins: 440, xp: 220 }
    }
  },
  {
    id: 'trivia',
    name: 'Trivia Challenge',
    description: 'Answer questions across multiple categories',
    icon: Sparkles,
    color: 'from-yellow-500 to-amber-500',
    difficulty: 'medium',
    estimatedTime: '5-7 min',
    rewards: {
      easy: { coins: 70, xp: 35 },
      medium: { coins: 140, xp: 70 },
      hard: { coins: 280, xp: 140 },
      expert: { coins: 560, xp: 280 }
    }
  },
  {
    id: 'reflex',
    name: 'Reflex Test',
    description: 'Test your reaction speed and accuracy',
    icon: Zap,
    color: 'from-pink-500 to-rose-500',
    difficulty: 'easy',
    estimatedTime: '2-3 min',
    rewards: {
      easy: { coins: 40, xp: 20 },
      medium: { coins: 80, xp: 40 },
      hard: { coins: 160, xp: 80 },
      expert: { coins: 320, xp: 160 }
    }
  },
  {
    id: 'math',
    name: 'Math Quiz',
    description: 'Solve math problems quickly and accurately',
    icon: Calculator,
    color: 'from-indigo-500 to-purple-500',
    difficulty: 'medium',
    estimatedTime: '5-8 min',
    rewards: {
      easy: { coins: 65, xp: 33 },
      medium: { coins: 130, xp: 65 },
      hard: { coins: 260, xp: 130 },
      expert: { coins: 520, xp: 260 }
    }
  },
  {
    id: 'chess',
    name: 'Chess Puzzles',
    description: 'Solve strategic chess scenarios',
    icon: Dices,
    color: 'from-slate-500 to-gray-600',
    difficulty: 'hard',
    estimatedTime: '10-20 min',
    rewards: {
      easy: { coins: 100, xp: 50 },
      medium: { coins: 200, xp: 100 },
      hard: { coins: 400, xp: 200 },
      expert: { coins: 800, xp: 400 }
    }
  }
];

export default function GamesPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [scores, setScores] = useState<any[]>([]);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchScores();
    }
  }, [session]);

  const fetchScores = async () => {
    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch('/api/games/scores?limit=10', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setScores(data);
      }
    } catch (error) {
      console.error('Failed to fetch scores:', error);
    }
  };

  const handlePlayGame = (game: Game) => {
    toast.info(`${game.name} coming soon! This is a demo.`, {
      description: `You would earn ${game.rewards[selectedDifficulty].coins} coins and ${game.rewards[selectedDifficulty].xp} XP on ${selectedDifficulty} difficulty.`
    });
    
    // Demo: Simulate game completion
    simulateGameCompletion(game);
  };

  const simulateGameCompletion = async (game: Game) => {
    try {
      const token = localStorage.getItem('bearer_token');
      const score = Math.floor(Math.random() * 1000) + 500; // Random score 500-1500
      
      const response = await fetch('/api/games/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          gameType: game.id,
          score,
          difficulty: selectedDifficulty
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Game completed!', {
          description: `+${data.rewards.coinsEarned} coins, +${data.rewards.xpEarned} XP`
        });
        fetchScores();
      }
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'hard': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'expert': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Brain className="h-10 w-10 text-primary" />
            Mind-Boosting Games
          </h1>
          <p className="text-muted-foreground text-lg">
            Train your brain and earn coins & XP!
          </p>
        </div>

        {/* Difficulty Selector */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">Select Difficulty</h3>
          <div className="flex flex-wrap gap-3">
            {(['easy', 'medium', 'hard', 'expert'] as const).map((diff) => (
              <Button
                key={diff}
                variant={selectedDifficulty === diff ? 'default' : 'outline'}
                onClick={() => setSelectedDifficulty(diff)}
                className="capitalize"
              >
                {diff}
              </Button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Games Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-xl transition-all bg-gradient-to-br from-card to-muted/20 border-2 hover:border-primary/50 h-full flex flex-col">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4`}>
                      <game.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{game.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className={getDifficultyColor(game.difficulty)}>
                        {game.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{game.estimatedTime}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-semibold">{game.rewards[selectedDifficulty].coins}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">{game.rewards[selectedDifficulty].xp} XP</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => handlePlayGame(game)}
                    >
                      Play Now
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Scores */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Recent Scores
              </h3>
              
              {scores.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No games played yet</p>
                  <p className="text-xs mt-2">Play a game to see your scores!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scores.map((score, index) => (
                    <motion.div
                      key={score._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm capitalize">{score.gameType}</span>
                        <Badge variant="outline" className={getDifficultyColor(score.difficulty)}>
                          {score.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Score: {score.score}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-600">+{score.coinsEarned}</span>
                          <span className="text-primary">+{score.xpEarned} XP</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(score.playedAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
