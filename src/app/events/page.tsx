"use client";

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Globe, Trophy, Users, Zap, Swords, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

interface WorldEvent {
  id: string;
  name: string;
  description: string;
  type: 'boss' | 'challenge' | 'competition';
  startDate: string;
  endDate: string;
  progress: number;
  goal: number;
  participants: number;
  rewards: string[];
  status: 'active' | 'upcoming' | 'ended';
  icon: string;
}

export default function EventsPage() {
  const [events] = useState<WorldEvent[]>([
    {
      id: 'e1',
      name: 'Mega Boss Sunday',
      description: 'All players unite to defeat the Procrastination Titan! Contribute focus time to deal damage.',
      type: 'boss',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 67234,
      goal: 100000,
      participants: 1523,
      rewards: ['500 XP', '250 Coins', 'Legendary Item', 'Boss Badge'],
      status: 'active',
      icon: '👹',
    },
    {
      id: 'e2',
      name: 'Global Study Sprint',
      description: 'Compete with players worldwide for the most study hours this week. Top 100 get exclusive rewards!',
      type: 'competition',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 2341,
      goal: 5000,
      participants: 892,
      rewards: ['300 XP', '150 Coins', 'Study Master Badge'],
      status: 'active',
      icon: '📚',
    },
    {
      id: 'e3',
      name: 'Wellness Week',
      description: 'Track health activities for 7 days straight. Complete daily health quests for massive rewards.',
      type: 'challenge',
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 4321,
      goal: 10000,
      participants: 2145,
      rewards: ['400 XP', '200 Coins', 'Health Buff', 'Wellness Badge'],
      status: 'active',
      icon: '💪',
    },
    {
      id: 'e4',
      name: 'Financial Mastery Challenge',
      description: 'Coming next week! Save collectively as a community and unlock clan bonuses.',
      type: 'challenge',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 0,
      goal: 50000,
      participants: 0,
      rewards: ['600 XP', '300 Coins', 'Money Multiplier', 'Finance Badge'],
      status: 'upcoming',
      icon: '💰',
    },
  ]);

  const activeEvents = events.filter(e => e.status === 'active');
  const upcomingEvents = events.filter(e => e.status === 'upcoming');

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const typeColors = {
    boss: 'from-red-500/20 to-orange-500/20 border-red-500/30',
    challenge: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    competition: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  };

  const typeBadgeColors = {
    boss: 'bg-red-500/10 text-red-500 border-red-500/20',
    challenge: 'bg-green-500/10 text-green-500 border-green-500/20',
    competition: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  const EventCard = ({ event }: { event: WorldEvent }) => (
    <Card className={`p-6 bg-gradient-to-br ${typeColors[event.type]}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="text-6xl">{event.icon}</div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-2xl font-bold">{event.name}</h3>
            <Badge variant="outline" className={`capitalize ${typeBadgeColors[event.type]}`}>
              {event.type}
            </Badge>
          </div>
          <p className="text-muted-foreground mb-3">{event.description}</p>
          
          {event.status === 'active' && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">{event.participants.toLocaleString()} players</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="font-semibold">{getTimeRemaining(event.endDate)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {event.status === 'active' && (
        <>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Global Progress</span>
              <span className="font-semibold">
                {event.progress.toLocaleString()} / {event.goal.toLocaleString()}
              </span>
            </div>
            <Progress value={(event.progress / event.goal) * 100} className="h-3" />
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Rewards:</p>
            <div className="flex flex-wrap gap-2">
              {event.rewards.map((reward, i) => (
                <Badge key={i} variant="outline" className="gap-1">
                  <Trophy className="h-3 w-3 text-yellow-500" />
                  {reward}
                </Badge>
              ))}
            </div>
          </div>

          <Button className="w-full" size="lg">
            <Swords className="h-4 w-4 mr-2" />
            Join Event
          </Button>
        </>
      )}

      {event.status === 'upcoming' && (
        <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Starts: {new Date(event.startDate).toLocaleDateString()}
            </p>
          </div>
          <Button variant="outline" className="w-full" size="lg">
            <Calendar className="h-4 w-4 mr-2" />
            Set Reminder
          </Button>
        </>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Globe className="h-10 w-10 text-blue-500" />
            World Events
          </h1>
          <p className="text-muted-foreground text-lg">
            Join global challenges and compete with players worldwide
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Events</p>
                <p className="text-3xl font-bold">{activeEvents.length}</p>
              </div>
              <Swords className="h-8 w-8 text-red-500" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Players</p>
                <p className="text-3xl font-bold">
                  {activeEvents.reduce((sum, e) => sum + e.participants, 0).toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Rank</p>
                <p className="text-3xl font-bold">#234</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Events Joined</p>
                <p className="text-3xl font-bold">2</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Active Events */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">🔥 Active Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">📅 Coming Soon</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Teaser */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
          <div className="flex items-center gap-4">
            <Trophy className="h-12 w-12 text-yellow-500" />
            <div>
              <h3 className="text-xl font-bold mb-2">Global Leaderboards</h3>
              <p className="text-muted-foreground mb-3">
                Compete for the top spot in study time, quests completed, and total XP earned!
              </p>
              <Button>View Full Leaderboards</Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
