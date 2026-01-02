"use client";

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGameStore } from '@/lib/store';
import { Users, Trophy, Target, TrendingUp, Crown, Shield, Swords } from 'lucide-react';

export default function ClanPage() {
  const { clan, user } = useGameStore();

  // Mock clan data for demo
  const mockClans = [
    {
      id: 'c1',
      name: 'The Grinders',
      members: 24,
      level: 12,
      xp: 8500,
      leaderboard: 3,
      description: 'Dedicated to daily progress and mutual support',
    },
    {
      id: 'c2',
      name: 'Focus Warriors',
      members: 18,
      level: 10,
      xp: 6200,
      leaderboard: 7,
      description: 'Masters of productivity and deep work',
    },
    {
      id: 'c3',
      name: 'Life Champions',
      members: 32,
      level: 15,
      xp: 12000,
      leaderboard: 1,
      description: 'Elite players conquering every aspect of life',
    },
  ];

  const clanQuests = [
    {
      id: 'cq1',
      title: 'Clan Study Marathon',
      description: 'Complete 100 total study hours as a clan',
      progress: 67,
      goal: 100,
      reward: '500 XP + Clan Building',
    },
    {
      id: 'cq2',
      title: 'Wellness Week',
      description: 'Log 50,000 steps collectively',
      progress: 32000,
      goal: 50000,
      reward: '300 XP + Health Buff',
    },
    {
      id: 'cq3',
      title: 'Financial Goals',
      description: 'Save $10,000 total across all members',
      progress: 7200,
      goal: 10000,
      reward: '400 XP + Coin Multiplier',
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Chen', xp: 15420, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { rank: 2, name: 'Sarah Kim', xp: 14230, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { rank: 3, name: 'Mike Johnson', xp: 13890, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    { rank: 4, name: user.name, xp: 12500, avatar: user.avatar },
    { rank: 5, name: 'Emma Davis', xp: 11780, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Shield className="h-10 w-10 text-orange-500" />
            LifeClans
          </h1>
          <p className="text-muted-foreground text-lg">
            Join forces with other heroes and conquer challenges together
          </p>
        </div>

        {!clan ? (
          // No Clan - Show Available Clans
          <>
            <Card className="p-8 mb-8 text-center bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
              <Users className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl font-bold mb-3">You're Not in a Clan Yet</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join a clan to unlock cooperative quests, clan buildings, mega boss battles, and compete on global leaderboards!
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge variant="outline" className="gap-1 text-base px-4 py-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Team Rewards
                </Badge>
                <Badge variant="outline" className="gap-1 text-base px-4 py-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Clan Quests
                </Badge>
                <Badge variant="outline" className="gap-1 text-base px-4 py-2">
                  <Swords className="h-4 w-4 text-red-500" />
                  Boss Raids
                </Badge>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockClans.map((clanOption) => (
                <Card
                  key={clanOption.id}
                  className="p-6 hover:shadow-xl transition-all bg-gradient-to-br from-card to-muted/20 border-2 hover:border-primary/50"
                >
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                      {clanOption.name.charAt(0)}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{clanOption.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{clanOption.description}</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                      <span className="text-sm">Members</span>
                      <Badge variant="outline">{clanOption.members}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                      <span className="text-sm">Clan Level</span>
                      <Badge variant="outline">{clanOption.level}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                      <span className="text-sm">Leaderboard Rank</span>
                      <Badge variant="outline" className="gap-1">
                        #{clanOption.leaderboard}
                        {clanOption.leaderboard <= 3 && <Crown className="h-3 w-3 text-yellow-500" />}
                      </Badge>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Join Clan
                  </Button>
                </Card>
              ))}
            </div>
          </>
        ) : (
          // Has Clan - Show Clan Dashboard
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Clan Info */}
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-4xl font-bold text-white flex-shrink-0">
                    {clan.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold">{clan.name}</h2>
                      <Badge className="gap-1">
                        <Crown className="h-4 w-4" />
                        Rank #{clan.leaderboard}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="outline">{clan.members} members</Badge>
                      <Badge variant="outline">Level {clan.level}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Clan XP</span>
                        <span className="font-semibold">{clan.xp} / 10000</span>
                      </div>
                      <Progress value={(clan.xp / 10000) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Clan Quests */}
              <Card className="p-6">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Target className="h-6 w-6 text-blue-500" />
                  Clan Quests
                </h3>
                <div className="space-y-4">
                  {clanQuests.map((quest) => (
                    <Card key={quest.id} className="p-5 bg-gradient-to-br from-card to-muted/20">
                      <div className="mb-3">
                        <h4 className="font-bold text-lg mb-1">{quest.title}</h4>
                        <p className="text-sm text-muted-foreground">{quest.description}</p>
                      </div>
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">
                            {quest.progress.toLocaleString()} / {quest.goal.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={(quest.progress / quest.goal) * 100} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="gap-1">
                          <Trophy className="h-3 w-3 text-yellow-500" />
                          {quest.reward}
                        </Badge>
                        <Button size="sm">Contribute</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Leaderboard */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  Clan Leaderboard
                </h3>
                <div className="space-y-3">
                  {leaderboard.map((member) => (
                    <div
                      key={member.rank}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        member.name === user.name
                          ? 'bg-primary/10 border border-primary/20'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          member.rank === 1
                            ? 'bg-yellow-500 text-white'
                            : member.rank === 2
                            ? 'bg-gray-400 text-white'
                            : member.rank === 3
                            ? 'bg-orange-500 text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {member.rank}
                      </div>
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.xp.toLocaleString()} XP</p>
                      </div>
                      {member.rank <= 3 && <Crown className="h-4 w-4 text-yellow-500" />}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Clan Benefits */}
              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Active Buffs
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-2 rounded bg-background/50">
                    <span>XP Boost</span>
                    <Badge variant="outline" className="text-green-600">+10%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-background/50">
                    <span>Coin Multiplier</span>
                    <Badge variant="outline" className="text-green-600">+5%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-background/50">
                    <span>Quest Rewards</span>
                    <Badge variant="outline" className="text-green-600">+15%</Badge>
                  </div>
                </div>
              </Card>

              {/* Info */}
              <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                <h3 className="text-lg font-bold mb-3">💡 Clan Features</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Complete quests together</li>
                  <li>• Unlock clan-exclusive buildings</li>
                  <li>• Battle mega bosses weekly</li>
                  <li>• Climb global leaderboards</li>
                  <li>• Share strategies & motivation</li>
                </ul>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
