"use client";

import { Navbar } from '@/components/Navbar';
import { StatsCard } from '@/components/StatsCard';
import { HealthHero } from '@/components/HealthHero';
import { WeatherWidget } from '@/components/WeatherWidget';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/lib/store';
import { CheckCircle2, Circle, Flame, Star, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { LevelUpModal } from '@/components/LevelUpModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const { user, quests, completedQuestsToday, creatures, completeQuest } = useGameStore();
  const [showSplash, setShowSplash] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(user.level);

  useEffect(() => {
    if (user.level > previousLevel) {
      setShowLevelUp(true);
      setPreviousLevel(user.level);
    }
  }, [user.level, previousLevel]);

  const dailyQuests = quests.filter((q) => q.category === 'daily');
  const activeCreatures = creatures.slice(0, 3);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <LevelUpModal show={showLevelUp} level={user.level} onClose={() => setShowLevelUp(false)} />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-b from-background to-muted/20"
      >
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="text-primary">{user.name}</span>!
            </h1>
            <p className="text-muted-foreground text-lg">
              Level {user.level} Hero • {completedQuestsToday} quests completed today
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1 space-y-6"
            >
              <StatsCard />
              <WeatherWidget />
              <HealthHero />
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 space-y-6"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Flame className="h-6 w-6 text-orange-500" />
                    <h2 className="text-2xl font-bold">Daily Quests</h2>
                  </div>
                  <Link href="/quests">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {dailyQuests.map((quest, index) => (
                    <motion.div
                      key={quest.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        quest.completed
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-card border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => !quest.completed && completeQuest(quest.id)}
                            disabled={quest.completed}
                            className="mt-1"
                          >
                            {quest.completed ? (
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : (
                              <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                            )}
                          </button>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{quest.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {quest.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize">
                                {quest.type}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <span className="font-semibold">{quest.xpReward} XP</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-lg">🪙</span>
                                <span className="font-semibold">{quest.coinReward}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-500" />
                    <h2 className="text-2xl font-bold">Your Creatures</h2>
                  </div>
                  <Link href="/creatures">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeCreatures.map((creature, index) => (
                    <motion.div
                      key={creature.id}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                      whileHover={{ scale: 1.05 }}
                      className="p-4 rounded-lg border bg-gradient-to-br from-card to-muted/20 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <img
                        src={creature.image}
                        alt={creature.name}
                        className="w-20 h-20 mx-auto mb-3 rounded-full bg-background p-2"
                      />
                      <h3 className="font-semibold text-center mb-1">{creature.name}</h3>
                      <p className="text-sm text-muted-foreground text-center capitalize mb-2">
                        Level {creature.level} {creature.type}
                      </p>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Happiness</span>
                            <span className="font-semibold">{creature.happiness}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${creature.happiness}%` }}
                              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Evolution</span>
                            <span className="font-semibold">{creature.evolution}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${creature.evolution}%` }}
                              transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <Link href="/city">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                      <div className="text-3xl mb-2">🏙️</div>
                      <h3 className="font-semibold">Your City</h3>
                      <p className="text-xs text-muted-foreground">Build & Grow</p>
                    </Card>
                  </motion.div>
                </Link>
                <Link href="/study">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                      <div className="text-3xl mb-2">⚔️</div>
                      <h3 className="font-semibold">Study Arena</h3>
                      <p className="text-xs text-muted-foreground">Battle Focus</p>
                    </Card>
                  </motion.div>
                </Link>
                <Link href="/finance">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                      <div className="text-3xl mb-2">💰</div>
                      <h3 className="font-semibold">Finance</h3>
                      <p className="text-xs text-muted-foreground">Track Budget</p>
                    </Card>
                  </motion.div>
                </Link>
                <Link href="/clan">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
                      <div className="text-3xl mb-2">🛡️</div>
                      <h3 className="font-semibold">Your Clan</h3>
                      <p className="text-xs text-muted-foreground">Team Up</p>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Card className="mt-8 p-6 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 border-primary/30">
              <div className="flex items-center gap-4">
                <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">New Features Available!</h3>
                  <p className="text-muted-foreground mb-3">
                    Explore the Mind Palace, Inventory System, Marketplace, and World Events!
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Link href="/mind-palace">
                      <Button size="sm" variant="outline">Mind Palace</Button>
                    </Link>
                    <Link href="/inventory">
                      <Button size="sm" variant="outline">Inventory</Button>
                    </Link>
                    <Link href="/marketplace">
                      <Button size="sm" variant="outline">Marketplace</Button>
                    </Link>
                    <Link href="/events">
                      <Button size="sm" variant="outline">World Events</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </main>
      </motion.div>
    </>
  );
}
