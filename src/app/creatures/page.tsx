"use client";

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/lib/store';
import { Heart, TrendingUp, Sparkles, Star, Gift } from 'lucide-react';
import { useState } from 'react';

export default function CreaturesPage() {
  const { creatures, feedCreature, user } = useGameStore();
  const [selectedCreature, setSelectedCreature] = useState<string | null>(null);

  const getCreatureStage = (evolution: number) => {
    if (evolution < 33) return { stage: 'Baby', emoji: '🥚' };
    if (evolution < 66) return { stage: 'Teen', emoji: '🐣' };
    return { stage: 'Adult', emoji: '⭐' };
  };

  const getHappinessLevel = (happiness: number) => {
    if (happiness < 30) return { level: 'Sad', color: 'text-red-500', bg: 'bg-red-500' };
    if (happiness < 70) return { level: 'Okay', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { level: 'Happy', color: 'text-green-500', bg: 'bg-green-500' };
  };

  const creatureTypeInfo: Record<string, { emoji: string; color: string; description: string }> = {
    fitness: {
      emoji: '💪',
      color: 'from-red-500/20 to-orange-500/20 border-red-500/30',
      description: 'Grows stronger with every workout and healthy choice',
    },
    finance: {
      emoji: '💰',
      color: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
      description: 'Thrives on smart savings and budget discipline',
    },
    study: {
      emoji: '📚',
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      description: 'Evolves through knowledge and focused learning',
    },
    mental: {
      emoji: '🧘',
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      description: 'Flourishes with meditation and self-care',
    },
    social: {
      emoji: '🤝',
      color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
      description: 'Grows through connections and social activities',
    },
  };

  const handleFeed = (creatureId: string) => {
    if (user.coins >= 5) {
      feedCreature(creatureId);
      useGameStore.getState().addCoins(-5);
    }
  };

  const CreatureCard = ({ creature }: { creature: any }) => {
    const stage = getCreatureStage(creature.evolution);
    const happinessInfo = getHappinessLevel(creature.happiness);
    const typeInfo = creatureTypeInfo[creature.type];
    const isSelected = selectedCreature === creature.id;

    return (
      <Card
        className={`p-6 transition-all cursor-pointer ${
          isSelected ? 'ring-2 ring-primary scale-105 shadow-xl' : 'hover:shadow-lg'
        } bg-gradient-to-br ${typeInfo.color}`}
        onClick={() => setSelectedCreature(isSelected ? null : creature.id)}
      >
        <div className="text-center">
          {/* Creature Avatar */}
          <div className="relative mb-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-background p-4 shadow-lg relative">
              <img
                src={creature.image}
                alt={creature.name}
                className="w-full h-full object-contain"
              />
              <div className="absolute -top-2 -right-2 text-3xl">{stage.emoji}</div>
            </div>
            <div className={`text-2xl mt-2 ${happinessInfo.color} font-bold`}>
              {typeInfo.emoji}
            </div>
          </div>

          {/* Creature Info */}
          <h3 className="text-2xl font-bold mb-1">{creature.name}</h3>
          <Badge variant="outline" className="mb-2 capitalize">
            Level {creature.level} • {stage.stage}
          </Badge>
          <p className="text-sm text-muted-foreground mb-4">{typeInfo.description}</p>

          {/* Stats */}
          <div className="space-y-3 mb-4">
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <div className="flex items-center gap-1">
                  <Heart className={`h-4 w-4 ${happinessInfo.color}`} />
                  <span>Happiness</span>
                </div>
                <span className="font-bold">{creature.happiness}%</span>
              </div>
              <Progress value={creature.happiness} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span>Evolution</span>
                </div>
                <span className="font-bold">{creature.evolution}%</span>
              </div>
              <Progress value={creature.evolution} className="h-2" />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleFeed(creature.id);
              }}
              className="w-full gap-2"
              disabled={user.coins < 5}
            >
              <Gift className="h-4 w-4" />
              Feed (5 🪙)
            </Button>
            {isSelected && (
              <div className="pt-2 text-xs text-muted-foreground">
                Last fed: {new Date(creature.lastFed).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-yellow-500" />
            Your Creatures
          </h1>
          <p className="text-muted-foreground text-lg">
            Nurture your companions and watch them evolve with your habits
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-8 p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
          <div className="flex items-start gap-4">
            <Star className="h-8 w-8 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">How Creatures Work</h3>
              <p className="text-muted-foreground mb-3">
                Each creature represents a different aspect of your life. Complete related quests to increase their
                happiness and evolution. Feed them with coins to boost their mood instantly!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-xl">💪</span>
                  <span>Fitness</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xl">💰</span>
                  <span>Finance</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xl">📚</span>
                  <span>Study</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xl">🧘</span>
                  <span>Mental</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xl">🤝</span>
                  <span>Social</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Creatures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creatures.map((creature) => (
            <CreatureCard key={creature.id} creature={creature} />
          ))}
        </div>

        {/* Evolution Stages Info */}
        <Card className="mt-8 p-6">
          <h3 className="text-xl font-bold mb-4">Evolution Stages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-3xl">🥚</div>
              <div>
                <p className="font-semibold">Baby</p>
                <p className="text-sm text-muted-foreground">0-33% Evolution</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-3xl">🐣</div>
              <div>
                <p className="font-semibold">Teen</p>
                <p className="text-sm text-muted-foreground">34-66% Evolution</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-3xl">⭐</div>
              <div>
                <p className="font-semibold">Adult</p>
                <p className="text-sm text-muted-foreground">67-100% Evolution</p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
