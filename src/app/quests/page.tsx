"use client";

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameStore } from '@/lib/store';
import { CheckCircle2, Circle, Flame, Plus, Zap, Trophy, Star, Calendar, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function QuestsPage() {
  const { quests, completeQuest, addQuest, completedQuestsToday } = useGameStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    category: 'daily' as 'daily' | 'weekly' | 'challenge',
    type: 'habit' as 'habit' | 'study' | 'fitness' | 'finance' | 'social' | 'mental',
    xpReward: 50,
    coinReward: 10,
  });

  const dailyQuests = quests.filter((q) => q.category === 'daily');
  const weeklyQuests = quests.filter((q) => q.category === 'weekly');
  const challenges = quests.filter((q) => q.category === 'challenge');

  const totalQuests = quests.length;
  const completedQuests = quests.filter((q) => q.completed).length;
  const completionRate = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  const handleAddQuest = () => {
    const quest = {
      id: `q${Date.now()}`,
      ...newQuest,
      completed: false,
      streak: 0,
    };
    addQuest(quest);
    setIsAddDialogOpen(false);
    setNewQuest({
      title: '',
      description: '',
      category: 'daily',
      type: 'habit',
      xpReward: 50,
      coinReward: 10,
    });
  };

  const QuestCard = ({ quest }: { quest: any }) => {
    const [isCompleting, setIsCompleting] = useState(false);

    const handleComplete = () => {
      if (!quest.completed) {
        setIsCompleting(true);
        setTimeout(() => {
          completeQuest(quest.id);
          setIsCompleting(false);
        }, 500);
      }
    };

    const typeColors: Record<string, string> = {
      habit: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      study: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      fitness: 'bg-red-500/10 text-red-500 border-red-500/20',
      finance: 'bg-green-500/10 text-green-500 border-green-500/20',
      social: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      mental: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    };

    return (
      <Card
        className={`p-5 transition-all duration-500 ${
          quest.completed
            ? 'bg-green-500/10 border-green-500/30 shadow-green-500/20 shadow-lg'
            : 'hover:border-primary/50 hover:shadow-md'
        } ${isCompleting ? 'scale-105 shadow-xl' : ''}`}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={handleComplete}
            disabled={quest.completed}
            className={`mt-1 transition-transform ${isCompleting ? 'animate-bounce' : ''}`}
          >
            {quest.completed ? (
              <CheckCircle2 className="h-7 w-7 text-green-500" />
            ) : (
              <Circle className="h-7 w-7 text-muted-foreground hover:text-primary hover:scale-110 transition-all" />
            )}
          </button>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className={`font-bold text-lg mb-1 ${quest.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {quest.title}
                </h3>
                <p className="text-sm text-muted-foreground">{quest.description}</p>
              </div>
              {quest.streak > 0 && (
                <div className="flex items-center gap-1 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-bold text-orange-500">{quest.streak}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`capitalize ${typeColors[quest.type]}`}>
                {quest.type}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {quest.category}
              </Badge>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>{quest.xpReward} XP</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <span className="text-lg">🪙</span>
                <span>{quest.coinReward}</span>
              </div>
            </div>

            {quest.progress !== undefined && quest.maxProgress && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">
                    {quest.progress} / {quest.maxProgress}
                  </span>
                </div>
                <Progress value={(quest.progress / quest.maxProgress) * 100} className="h-2" />
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Flame className="h-10 w-10 text-orange-500" />
                LifeQuests
              </h1>
              <p className="text-muted-foreground text-lg">
                Complete quests to earn XP and level up your life
              </p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Add Quest
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Quest</DialogTitle>
                  <DialogDescription>Add a new quest to your adventure</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="title">Quest Title</Label>
                    <Input
                      id="title"
                      value={newQuest.title}
                      onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
                      placeholder="Morning Workout"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newQuest.description}
                      onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
                      placeholder="Complete 30 minutes of cardio"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newQuest.category}
                        onValueChange={(value: any) => setNewQuest({ ...newQuest, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="challenge">Challenge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={newQuest.type}
                        onValueChange={(value: any) => setNewQuest({ ...newQuest, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="habit">Habit</SelectItem>
                          <SelectItem value="study">Study</SelectItem>
                          <SelectItem value="fitness">Fitness</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="mental">Mental</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="xp">XP Reward</Label>
                      <Input
                        id="xp"
                        type="number"
                        value={newQuest.xpReward}
                        onChange={(e) => setNewQuest({ ...newQuest, xpReward: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="coins">Coin Reward</Label>
                      <Input
                        id="coins"
                        type="number"
                        value={newQuest.coinReward}
                        onChange={(e) => setNewQuest({ ...newQuest, coinReward: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={handleAddQuest} className="w-full" disabled={!newQuest.title}>
                  Create Quest
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Today</p>
                  <p className="text-3xl font-bold">{completedQuestsToday}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Completed</p>
                  <p className="text-3xl font-bold">{completedQuests}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total</p>
                  <p className="text-3xl font-bold">{totalQuests}</p>
                </div>
                <Trophy className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rate</p>
                  <p className="text-3xl font-bold">{completionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
          </div>
        </div>

        {/* Quest Tabs */}
        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 h-auto">
            <TabsTrigger value="daily" className="gap-2">
              <Calendar className="h-4 w-4" />
              Daily ({dailyQuests.length})
            </TabsTrigger>
            <TabsTrigger value="weekly" className="gap-2">
              <Star className="h-4 w-4" />
              Weekly ({weeklyQuests.length})
            </TabsTrigger>
            <TabsTrigger value="challenges" className="gap-2">
              <Trophy className="h-4 w-4" />
              Challenges ({challenges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            {dailyQuests.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No daily quests yet. Create one to get started!</p>
              </Card>
            ) : (
              dailyQuests.map((quest) => <QuestCard key={quest.id} quest={quest} />)
            )}
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            {weeklyQuests.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No weekly quests yet. Create one to get started!</p>
              </Card>
            ) : (
              weeklyQuests.map((quest) => <QuestCard key={quest.id} quest={quest} />)
            )}
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            {challenges.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No challenges yet. Create one to get started!</p>
              </Card>
            ) : (
              challenges.map((quest) => <QuestCard key={quest.id} quest={quest} />)
            )}
          </TabsContent>
        </Tabs>

        {/* Achievement Teaser */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <div className="flex items-center gap-4">
            <Trophy className="h-12 w-12 text-yellow-500" />
            <div>
              <h3 className="text-xl font-bold mb-1">Unlock Achievements</h3>
              <p className="text-muted-foreground">
                Complete quests to unlock special achievements and rare rewards!
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
