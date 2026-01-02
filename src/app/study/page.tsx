"use client";

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/lib/store';
import { Brain, Play, Pause, RotateCcw, Swords, Heart, Zap, Trophy, Target } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function StudyArenaPage() {
  const { addXP, addCoins, updateStats } = useGameStore();
  
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [sessionType, setSessionType] = useState<'pomodoro' | 'short' | 'long'>('pomodoro');
  const [bossHP, setBossHP] = useState(100);
  const [playerHP, setPlayerHP] = useState(100);
  const [focusStreak, setFocusStreak] = useState(0);
  const [totalDamage, setTotalDamage] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sessionDurations = {
    pomodoro: 25 * 60,
    short: 15 * 60,
    long: 45 * 60,
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          
          // Deal damage to boss every 30 seconds
          if (prev % 30 === 0 && sessionActive) {
            const damage = Math.floor(Math.random() * 10) + 5;
            setBossHP((hp) => Math.max(0, hp - damage));
            setTotalDamage((d) => d + damage);
            setFocusStreak((s) => s + 1);
          }
          
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, sessionActive]);

  const handleSessionComplete = () => {
    setIsActive(false);
    setSessionActive(false);
    
    const baseXP = sessionType === 'long' ? 200 : sessionType === 'pomodoro' ? 100 : 50;
    const bonusXP = Math.floor(totalDamage * 2);
    const totalXPEarned = baseXP + bonusXP;
    
    const coinsEarned = Math.floor(totalXPEarned / 2);
    
    addXP(totalXPEarned);
    addCoins(coinsEarned);
    updateStats('learning', 5);
    
    if (bossHP <= 0) {
      addXP(150);
      addCoins(75);
    }
  };

  const handleStart = () => {
    if (!sessionActive) {
      setSessionActive(true);
      setBossHP(100);
      setPlayerHP(100);
      setFocusStreak(0);
      setTotalDamage(0);
    }
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSessionActive(false);
    setTimeLeft(sessionDurations[sessionType]);
    setBossHP(100);
    setPlayerHP(100);
    setFocusStreak(0);
    setTotalDamage(0);
  };

  const handleChangeSession = (type: 'pomodoro' | 'short' | 'long') => {
    setSessionType(type);
    setTimeLeft(sessionDurations[type]);
    setIsActive(false);
    setSessionActive(false);
    setBossHP(100);
    setPlayerHP(100);
    setFocusStreak(0);
    setTotalDamage(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((sessionDurations[sessionType] - timeLeft) / sessionDurations[sessionType]) * 100;

  const bossNames = [
    'Procrastination Dragon',
    'Distraction Demon',
    'Laziness Leviathan',
    'Focus Phantom',
  ];
  const currentBoss = bossNames[Math.floor(Math.random() * bossNames.length)];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Brain className="h-10 w-10 text-purple-500" />
            Study Arena
          </h1>
          <p className="text-muted-foreground text-lg">
            Battle bosses through focused study sessions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Battle Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Boss Battle Card */}
            <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <div className="text-center mb-6">
                <Badge variant="outline" className="mb-4 text-lg px-4 py-1">
                  {sessionActive ? 'BATTLE IN PROGRESS' : 'READY TO FIGHT'}
                </Badge>
                <h2 className="text-3xl font-bold mb-2">{currentBoss}</h2>
                <p className="text-muted-foreground">Defeat through focused studying!</p>
              </div>

              {/* Battle Scene */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                {/* Boss */}
                <div className="text-center">
                  <div className="text-8xl mb-4 animate-bounce">👹</div>
                  <h3 className="font-bold mb-2">Boss</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>HP</span>
                      <span className="font-bold">{bossHP}%</span>
                    </div>
                    <Progress value={bossHP} className="h-3 [&>div]:bg-red-500" />
                  </div>
                  {bossHP <= 0 && (
                    <Badge className="mt-3 bg-green-500">DEFEATED! 🎉</Badge>
                  )}
                </div>

                {/* Player */}
                <div className="text-center">
                  <div className="text-8xl mb-4">🧙‍♂️</div>
                  <h3 className="font-bold mb-2">You</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>HP</span>
                      <span className="font-bold">{playerHP}%</span>
                    </div>
                    <Progress value={playerHP} className="h-3 [&>div]:bg-green-500" />
                  </div>
                  {focusStreak > 0 && (
                    <Badge variant="outline" className="mt-3 gap-1">
                      🔥 {focusStreak} hit combo!
                    </Badge>
                  )}
                </div>
              </div>

              {/* Battle Stats */}
              {sessionActive && (
                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-background/50 border">
                  <div className="text-center">
                    <Swords className="h-5 w-5 mx-auto mb-1 text-red-500" />
                    <p className="text-xs text-muted-foreground">Total Damage</p>
                    <p className="text-lg font-bold">{totalDamage}</p>
                  </div>
                  <div className="text-center">
                    <Target className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                    <p className="text-xs text-muted-foreground">Hit Streak</p>
                    <p className="text-lg font-bold">{focusStreak}</p>
                  </div>
                  <div className="text-center">
                    <Trophy className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                    <p className="text-xs text-muted-foreground">XP Earned</p>
                    <p className="text-lg font-bold">{totalDamage * 2}</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Timer Card */}
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="text-7xl font-bold mb-4 text-primary">
                  {formatTime(timeLeft)}
                </div>
                <Progress value={progress} className="h-4 mb-4" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(sessionDurations[sessionType] - timeLeft)} elapsed</span>
                  <span>{formatTime(timeLeft)} remaining</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                {!isActive ? (
                  <Button
                    size="lg"
                    onClick={handleStart}
                    className="gap-2 px-8"
                  >
                    <Play className="h-5 w-5" />
                    {sessionActive ? 'Resume' : 'Start Battle'}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={handlePause}
                    variant="outline"
                    className="gap-2 px-8"
                  >
                    <Pause className="h-5 w-5" />
                    Pause
                  </Button>
                )}
                <Button
                  size="lg"
                  onClick={handleReset}
                  variant="outline"
                  className="gap-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  Reset
                </Button>
              </div>

              {/* Session Type Selection */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <Button
                  variant={sessionType === 'short' ? 'default' : 'outline'}
                  onClick={() => handleChangeSession('short')}
                  disabled={sessionActive}
                  className="flex flex-col h-auto py-3"
                >
                  <span className="text-lg font-bold">15</span>
                  <span className="text-xs">minutes</span>
                </Button>
                <Button
                  variant={sessionType === 'pomodoro' ? 'default' : 'outline'}
                  onClick={() => handleChangeSession('pomodoro')}
                  disabled={sessionActive}
                  className="flex flex-col h-auto py-3"
                >
                  <span className="text-lg font-bold">25</span>
                  <span className="text-xs">Pomodoro</span>
                </Button>
                <Button
                  variant={sessionType === 'long' ? 'default' : 'outline'}
                  onClick={() => handleChangeSession('long')}
                  disabled={sessionActive}
                  className="flex flex-col h-auto py-3"
                >
                  <span className="text-lg font-bold">45</span>
                  <span className="text-xs">Deep Work</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How It Works */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Swords className="h-6 w-6 text-red-500" />
                How It Works
              </h3>
              <ul className="text-sm space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-lg">⚔️</span>
                  <span>Focus = Attack! Deal damage every 30 seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">🎯</span>
                  <span>Build combo streaks for bonus damage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">💎</span>
                  <span>Earn XP & coins when session completes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">🏆</span>
                  <span>Defeat boss for massive bonus rewards!</span>
                </li>
              </ul>
            </Card>

            {/* Rewards */}
            <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Session Rewards
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-sm">15 min session</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      50 XP
                    </Badge>
                    <Badge variant="outline">🪙 25</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-sm">25 min (Pomodoro)</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      100 XP
                    </Badge>
                    <Badge variant="outline">🪙 50</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-sm">45 min (Deep Work)</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      200 XP
                    </Badge>
                    <Badge variant="outline">🪙 100</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <span className="text-sm font-semibold">Boss Defeated Bonus</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 gap-1">
                      <Zap className="h-3 w-3" />
                      +150 XP
                    </Badge>
                    <Badge className="bg-green-500">🪙 +75</Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <h3 className="text-lg font-bold mb-3">💡 Focus Tips</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Put phone away before starting</li>
                <li>• Use headphones with focus music</li>
                <li>• Close unnecessary browser tabs</li>
                <li>• Stay hydrated during sessions</li>
                <li>• Take breaks between sessions</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
