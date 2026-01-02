"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/lib/store';
import { Droplet, Moon, Footprints, Smile, Frown, Meh, Activity, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

export function HealthHero() {
  const { todayHealth, updateHealthLog, addXP } = useGameStore();
  
  const water = todayHealth?.water || 0;
  const sleep = todayHealth?.sleep || 0;
  const steps = todayHealth?.steps || 0;
  const mood = todayHealth?.mood || 'okay';
  const exercise = todayHealth?.exercise || false;

  const handleWaterChange = (delta: number) => {
    const newWater = Math.max(0, Math.min(12, water + delta));
    updateHealthLog({ water: newWater });
    if (delta > 0) addXP(5);
  };

  const handleSleepChange = (delta: number) => {
    const newSleep = Math.max(0, Math.min(12, sleep + delta));
    updateHealthLog({ sleep: newSleep });
    if (delta > 0) addXP(10);
  };

  const handleStepsChange = (value: number) => {
    updateHealthLog({ steps: value });
    if (value >= 10000) addXP(50);
  };

  const handleMoodChange = (newMood: 'great' | 'good' | 'okay' | 'bad') => {
    updateHealthLog({ mood: newMood });
    addXP(5);
  };

  const handleExerciseToggle = () => {
    updateHealthLog({ exercise: !exercise });
    if (!exercise) addXP(75);
  };

  const moodIcons = {
    great: { icon: Smile, color: 'text-green-500', bg: 'bg-green-500/10' },
    good: { icon: Smile, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    okay: { icon: Meh, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    bad: { icon: Frown, color: 'text-red-500', bg: 'bg-red-500/10' },
  };

  const MoodIcon = moodIcons[mood].icon;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="h-6 w-6 text-blue-500" />
          <h3 className="text-2xl font-bold">HealthHero</h3>
        </div>
        <p className="text-muted-foreground">Track your daily wellness and earn XP</p>
      </Card>

      {/* Water Intake */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-500" />
            <span className="font-semibold">Water Intake</span>
          </div>
          <Badge variant="outline">{water} / 8 glasses</Badge>
        </div>
        <Progress value={(water / 8) * 100} className="h-2 mb-3" />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleWaterChange(-1)}
            disabled={water === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleWaterChange(1)}
            disabled={water >= 12}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Glass (+5 XP)
          </Button>
        </div>
      </Card>

      {/* Sleep Tracker */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-purple-500" />
            <span className="font-semibold">Sleep</span>
          </div>
          <Badge variant="outline">{sleep}h / 8h</Badge>
        </div>
        <Progress value={(sleep / 8) * 100} className="h-2 mb-3" />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSleepChange(-1)}
            disabled={sleep === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleSleepChange(1)}
            disabled={sleep >= 12}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Hour (+10 XP)
          </Button>
        </div>
      </Card>

      {/* Steps Counter */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Footprints className="h-5 w-5 text-green-500" />
            <span className="font-semibold">Steps</span>
          </div>
          <Badge variant="outline">{steps.toLocaleString()} / 10,000</Badge>
        </div>
        <Progress value={(steps / 10000) * 100} className="h-2 mb-3" />
        <div className="grid grid-cols-3 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStepsChange(steps + 1000)}
          >
            +1K
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStepsChange(steps + 5000)}
          >
            +5K
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStepsChange(10000)}
          >
            10K
          </Button>
        </div>
      </Card>

      {/* Mood Tracker */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <MoodIcon className={`h-5 w-5 ${moodIcons[mood].color}`} />
          <span className="font-semibold">How are you feeling?</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(moodIcons) as Array<keyof typeof moodIcons>).map((moodKey) => {
            const Icon = moodIcons[moodKey].icon;
            return (
              <Button
                key={moodKey}
                variant={mood === moodKey ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleMoodChange(moodKey)}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs capitalize">{moodKey}</span>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Exercise */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            <span className="font-semibold">Exercise Today?</span>
          </div>
          <Button
            variant={exercise ? 'default' : 'outline'}
            onClick={handleExerciseToggle}
            className="gap-2"
          >
            {exercise ? '✓ Completed (+75 XP)' : 'Mark Complete'}
          </Button>
        </div>
      </Card>

      {/* Health Score */}
      <Card className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
        <h4 className="font-semibold mb-3">Today's Health Score</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Water</span>
            <span className={water >= 8 ? 'text-green-500 font-semibold' : 'text-muted-foreground'}>
              {water >= 8 ? '✓' : `${water}/8`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Sleep</span>
            <span className={sleep >= 7 ? 'text-green-500 font-semibold' : 'text-muted-foreground'}>
              {sleep >= 7 ? '✓' : `${sleep}h/8h`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Steps</span>
            <span className={steps >= 10000 ? 'text-green-500 font-semibold' : 'text-muted-foreground'}>
              {steps >= 10000 ? '✓' : `${Math.round(steps / 1000)}K/10K`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Exercise</span>
            <span className={exercise ? 'text-green-500 font-semibold' : 'text-muted-foreground'}>
              {exercise ? '✓ Done' : 'Not yet'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Mood</span>
            <span className={mood === 'great' || mood === 'good' ? 'text-green-500 font-semibold' : 'text-muted-foreground'}>
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
