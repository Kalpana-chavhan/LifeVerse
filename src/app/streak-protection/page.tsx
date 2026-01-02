"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Coins, Zap, Lock, Check, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function StreakProtectionPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/streak-protection');
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch streak protection:', error);
      toast.error('Failed to load streak protection');
    } finally {
      setLoading(false);
    }
  };

  const buyShield = async () => {
    try {
      const res = await fetch('/api/streak-protection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'buy_shield' }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        fetchData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Failed to buy shield:', error);
      toast.error('Failed to buy shield');
    }
  };

  const protectStreak = async (questId: string) => {
    try {
      const res = await fetch('/api/streak-protection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'protect_streak', questId }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        fetchData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Failed to protect streak:', error);
      toast.error('Failed to protect streak');
    }
  };

  if (loading || !data) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-20 px-4 flex items-center justify-center game-gradient">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading streak protection...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 px-4 game-gradient">
        <div className="max-w-7xl mx-auto pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Shield className="h-16 w-16 mx-auto mb-4 text-blue-400 float-animation" />
            <h1 className="text-5xl font-minecraft mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Streak Insurance
            </h1>
            <p className="text-xl text-muted-foreground">
              Protect your precious streaks with Shield Tokens!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Card className="game-card p-8 text-center bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                <Shield className="h-16 w-16 mx-auto mb-4 text-blue-400" />
                <h2 className="text-3xl font-minecraft mb-2">{data.streakShields}</h2>
                <p className="text-sm text-muted-foreground">Active Shields</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Card className="game-card p-8 text-center bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                <Check className="h-16 w-16 mx-auto mb-4 text-green-400" />
                <h2 className="text-3xl font-minecraft mb-2">{data.protectedStreaks.length}</h2>
                <p className="text-sm text-muted-foreground">Protected Streaks</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Card className="game-card p-8 text-center bg-gradient-to-br from-orange-500/10 to-red-500/10">
                <Zap className="h-16 w-16 mx-auto mb-4 text-orange-400" />
                <h2 className="text-3xl font-minecraft mb-2">{data.activeStreaks.length}</h2>
                <p className="text-sm text-muted-foreground">Active Streaks</p>
              </Card>
            </motion.div>
          </div>

          <Card className="game-card p-8 mb-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-minecraft mb-2">Buy Streak Shields</h2>
                <p className="text-sm text-muted-foreground">
                  Protect your streaks from accidental breaks. Max {data.maxShields} shields.
                </p>
              </div>
              <Button
                onClick={buyShield}
                disabled={data.streakShields >= data.maxShields}
                className="pixel-button"
              >
                <Coins className="mr-2 h-5 w-5 coin-glow text-yellow-400" />
                Buy Shield ({data.shieldCost} coins)
              </Button>
            </div>

            <div className="flex items-center gap-2 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <Shield className="h-6 w-6 text-blue-400" />
              <p className="text-sm">
                <strong className="text-blue-400">How it works:</strong> Use a shield to protect any streak. If you miss a day, the shield auto-activates and saves your streak!
              </p>
            </div>
          </Card>

          <Card className="game-card p-8">
            <h2 className="text-2xl font-minecraft mb-6">Your Active Streaks</h2>

            {data.activeStreaks.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No active streaks found. Complete quests daily to build streaks!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.activeStreaks.map((quest: any, index: number) => {
                  const isProtected = data.protectedStreaks.includes(String(quest._id));

                  return (
                    <motion.div
                      key={quest._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`p-6 ${
                          isProtected
                            ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50'
                            : 'game-card'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-minecraft text-lg mb-2">{quest.title}</h3>
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-orange-400" />
                              <span className="text-sm">
                                <strong>{quest.streak}</strong> day streak
                              </span>
                            </div>
                          </div>
                          {isProtected && (
                            <Shield className="h-8 w-8 text-green-400 flex-shrink-0" />
                          )}
                        </div>

                        {!isProtected ? (
                          <Button
                            onClick={() => protectStreak(quest._id)}
                            disabled={data.streakShields <= 0}
                            className="w-full pixel-button"
                            variant="outline"
                          >
                            {data.streakShields > 0 ? (
                              <>
                                <Shield className="mr-2 h-4 w-4" />
                                Activate Protection
                              </>
                            ) : (
                              <>
                                <Lock className="mr-2 h-4 w-4" />
                                No Shields Available
                              </>
                            )}
                          </Button>
                        ) : (
                          <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30 text-center">
                            <Check className="inline h-5 w-5 text-green-400 mr-2" />
                            <span className="text-sm text-green-400 font-bold">PROTECTED</span>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="game-card p-6 mt-8">
            <h3 className="text-xl font-minecraft mb-4">How Streak Insurance Works</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong className="text-foreground">Buy shields</strong> for {data.shieldCost} coins each (max {data.maxShields})</li>
              <li>• <strong className="text-foreground">Activate protection</strong> on any active streak</li>
              <li>• <strong className="text-foreground">Auto-protection:</strong> If you miss a day, shield activates automatically</li>
              <li>• <strong className="text-foreground">One-time use:</strong> Each shield protects once, then disappears</li>
              <li>• <strong className="text-foreground">Stack shields</strong> to protect multiple streaks simultaneously</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
