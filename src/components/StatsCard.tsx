"use client";

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGameStore } from '@/lib/store';
import { Heart, Brain, DollarSign, BookOpen, TrendingUp } from 'lucide-react';

export function StatsCard() {
  const { user, stats } = useGameStore();

  const statIcons = {
    health: Heart,
    mind: Brain,
    finance: DollarSign,
    learning: BookOpen,
  };

  const statColors = {
    health: 'text-red-500',
    mind: 'text-purple-500',
    finance: 'text-green-500',
    learning: 'text-blue-500',
  };

  const xpPercentage = (user.xp / user.xpToNextLevel) * 100;

  return (
    <div className="space-y-4">
      {/* Level and XP */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm text-muted-foreground">Level</p>
            <p className="text-4xl font-bold">{user.level}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">XP</p>
            <p className="text-lg font-semibold">
              {user.xp} / {user.xpToNextLevel}
            </p>
          </div>
        </div>
        <Progress value={xpPercentage} className="h-3" />
        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>{Math.round(xpPercentage)}% to next level</span>
        </div>
      </Card>

      {/* Core Stats */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Core Stats</h3>
        <div className="space-y-4">
          {(Object.keys(stats) as Array<keyof typeof stats>).map((stat) => {
            const Icon = statIcons[stat];
            const color = statColors[stat];
            const value = stats[stat];
            const maxValue = 100;
            const percentage = (value / maxValue) * 100;

            return (
              <div key={stat}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${color}`} />
                    <span className="capitalize font-medium">{stat}</span>
                  </div>
                  <span className="text-sm font-semibold">{value}</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
