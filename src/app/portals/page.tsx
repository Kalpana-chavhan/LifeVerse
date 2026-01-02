"use client";

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trees, BookOpen, Flame, DollarSign, Sparkles, Lock, Star, TrendingUp, Trophy } from 'lucide-react';
import { useGameStore } from '@/lib/store';
import { toast } from 'sonner';

const WORLDS = [
  {
    id: 'forest',
    name: 'Forest of Discipline',
    emoji: '🌲',
    icon: Trees,
    description: 'Master your habits in the ancient forest',
    theme: 'green',
    unlockLevel: 1,
    unlockCost: 0,
    features: [
      'Habit-tracking quests',
      'Nature-themed creatures',
      '+10% habit XP bonus',
      'Meditation gardens'
    ],
    xpMultiplier: 1.1,
    quests: [
      { title: 'Morning Ritual', reward: '50 XP + 10 coins' },
      { title: 'Daily Meditation', reward: '40 XP + 8 coins' },
      { title: 'Forest Walk', reward: '60 XP + 12 coins' }
    ]
  },
  {
    id: 'library',
    name: 'Library of Eternity',
    emoji: '📚',
    icon: BookOpen,
    description: 'Unlock infinite knowledge and wisdom',
    theme: 'blue',
    unlockLevel: 5,
    unlockCost: 500,
    features: [
      'Study & learning quests',
      'Scholar creatures',
      '+15% study XP bonus',
      'Ancient scrolls'
    ],
    xpMultiplier: 1.15,
    quests: [
      { title: 'Read for 1 Hour', reward: '80 XP + 15 coins' },
      { title: 'Complete Assignment', reward: '100 XP + 20 coins' },
      { title: 'Research Project', reward: '120 XP + 25 coins' }
    ]
  },
  {
    id: 'arena',
    name: 'Arena of Mastery',
    emoji: '🔥',
    icon: Flame,
    description: 'Train and battle to become legendary',
    theme: 'red',
    unlockLevel: 10,
    unlockCost: 1000,
    features: [
      'Challenge quests',
      'Warrior creatures',
      '+20% challenge XP bonus',
      'Boss battles'
    ],
    xpMultiplier: 1.2,
    quests: [
      { title: 'Complete Hard Quest', reward: '150 XP + 30 coins' },
      { title: 'Win 5 Challenges', reward: '200 XP + 40 coins' },
      { title: 'Defeat Boss', reward: '300 XP + 60 coins' }
    ]
  },
  {
    id: 'valley',
    name: 'Valley of Prosperity',
    emoji: '💰',
    icon: DollarSign,
    description: 'Build wealth and master finances',
    theme: 'yellow',
    unlockLevel: 15,
    unlockCost: 1500,
    features: [
      'Finance quests',
      'Merchant creatures',
      '+25% coin bonus',
      'Trading posts'
    ],
    xpMultiplier: 1.1,
    coinMultiplier: 1.25,
    quests: [
      { title: 'Save $100', reward: '100 XP + 50 coins' },
      { title: 'Budget Planning', reward: '120 XP + 60 coins' },
      { title: 'Investment Quest', reward: '200 XP + 100 coins' }
    ]
  },
  {
    id: 'realm',
    name: 'Realm of Mindfulness',
    emoji: '🌌',
    icon: Sparkles,
    description: 'Find inner peace and enlightenment',
    theme: 'purple',
    unlockLevel: 20,
    unlockCost: 2000,
    features: [
      'Wellness quests',
      'Mystic creatures',
      '+30% all XP bonus',
      'Cosmic meditation'
    ],
    xpMultiplier: 1.3,
    quests: [
      { title: 'Yoga Session', reward: '180 XP + 35 coins' },
      { title: 'Mindfulness Practice', reward: '150 XP + 30 coins' },
      { title: 'Gratitude Journal', reward: '140 XP + 28 coins' }
    ]
  }
];

export default function PortalsPage() {
  const { user, unlockWorld, setActiveWorld } = useGameStore();
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);

  const handleUnlockWorld = (worldId: string, cost: number) => {
    if (user.coins >= cost) {
      unlockWorld(worldId, cost);
      toast.success(`Unlocked ${WORLDS.find(w => w.id === worldId)?.name}!`);
    } else {
      toast.error('Not enough coins!');
    }
  };

  const handleEnterWorld = (worldId: string) => {
    setActiveWorld(worldId);
    setSelectedWorld(worldId);
    toast.success(`Entered ${WORLDS.find(w => w.id === worldId)?.name}!`);
  };

  const isWorldUnlocked = (worldId: string) => {
    return user.unlockedWorlds?.includes(worldId) || worldId === 'forest';
  };

  const canUnlockWorld = (level: number, cost: number) => {
    return user.level >= level && user.coins >= cost;
  };

  const getThemeColors = (theme: string) => {
    const colors: Record<string, string> = {
      green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
      blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      red: 'from-red-500/20 to-orange-500/20 border-red-500/30',
      yellow: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
      purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
    };
    return colors[theme] || colors.green;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-purple-500" />
            Portal Worlds
          </h1>
          <p className="text-muted-foreground text-lg">
            Unlock and explore 5 unique worlds, each with special quests and XP multipliers
          </p>
        </div>

        <Card className="p-6 mb-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <div className="flex items-center gap-4">
            <Trophy className="h-12 w-12 text-yellow-500" />
            <div>
              <h3 className="text-xl font-bold mb-1">Your Progress</h3>
              <p className="text-muted-foreground">
                Level {user.level} • {user.unlockedWorlds?.length || 1} / {WORLDS.length} Worlds Unlocked
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORLDS.map((world) => {
            const Icon = world.icon;
            const unlocked = isWorldUnlocked(world.id);
            const canUnlock = canUnlockWorld(world.unlockLevel, world.unlockCost);
            const isActive = user.activeWorld === world.id;

            return (
              <Card
                key={world.id}
                className={`p-6 relative overflow-hidden ${
                  unlocked 
                    ? `bg-gradient-to-br ${getThemeColors(world.theme)}` 
                    : 'bg-card opacity-60'
                }`}
              >
                {isActive && (
                  <Badge className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-400">
                    Active
                  </Badge>
                )}

                <div className="text-center mb-6">
                  <div className="text-6xl mb-3">{world.emoji}</div>
                  <h3 className="text-2xl font-bold mb-2">{world.name}</h3>
                  <p className="text-sm text-muted-foreground">{world.description}</p>
                </div>

                {!unlocked && (
                  <div className="mb-4 p-3 bg-black/20 rounded-lg text-center">
                    <Lock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Requires Level {world.unlockLevel}
                    </p>
                    <p className="text-sm font-bold text-yellow-500">
                      {world.unlockCost} coins to unlock
                    </p>
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Features
                  </h4>
                  <ul className="text-xs space-y-1">
                    {world.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Bonuses
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {world.xpMultiplier && (
                      <Badge variant="outline" className="text-xs">
                        {world.xpMultiplier}x XP
                      </Badge>
                    )}
                    {world.coinMultiplier && (
                      <Badge variant="outline" className="text-xs">
                        {world.coinMultiplier}x Coins
                      </Badge>
                    )}
                  </div>
                </div>

                {unlocked && (
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-bold">Available Quests</h4>
                    {world.quests.map((quest, i) => (
                      <div key={i} className="text-xs p-2 bg-black/20 rounded">
                        <p className="font-semibold">{quest.title}</p>
                        <p className="text-muted-foreground">{quest.reward}</p>
                      </div>
                    ))}
                  </div>
                )}

                {!unlocked && (
                  <Button
                    onClick={() => handleUnlockWorld(world.id, world.unlockCost)}
                    disabled={!canUnlock}
                    className="w-full"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Unlock ({world.unlockCost} 🪙)
                  </Button>
                )}

                {unlocked && !isActive && (
                  <Button
                    onClick={() => handleEnterWorld(world.id)}
                    className="w-full"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    Enter World
                  </Button>
                )}

                {isActive && (
                  <div className="text-center text-sm font-bold text-green-500">
                    ✓ Currently Active
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 p-8 text-center bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <Sparkles className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-3">How Portals Work</h2>
          <div className="max-w-3xl mx-auto text-left space-y-2 text-sm text-muted-foreground">
            <p>• Each world has unique quests, creatures, and themes</p>
            <p>• XP multipliers apply to all quests completed in that world</p>
            <p>• Unlock worlds by reaching the required level and spending coins</p>
            <p>• Only one world can be active at a time</p>
            <p>• Switch between worlds anytime to access different quest types</p>
            <p>• Higher-level worlds offer better rewards and multipliers</p>
          </div>
        </Card>
      </main>
    </div>
  );
}
