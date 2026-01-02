"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Activity, Wallet, Sparkles, Heart, Lock, Check, Coins, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const treeIcons: any = {
  focus: Brain,
  fitness: Activity,
  finance: Wallet,
  creativity: Sparkles,
  wellness: Heart,
};

const treeColors: any = {
  blue: 'from-blue-500 to-cyan-500',
  red: 'from-red-500 to-orange-500',
  green: 'from-green-500 to-emerald-500',
  purple: 'from-purple-500 to-pink-500',
  pink: 'from-pink-500 to-rose-500',
};

export default function SkillsPage() {
  const [skillData, setSkillData] = useState<any>(null);
  const [selectedTree, setSelectedTree] = useState<string>('focus');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      setSkillData(data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const unlockSkill = async (skillId: string, treeId: string) => {
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId, treeId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        fetchSkills();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Failed to unlock skill:', error);
      toast.error('Failed to unlock skill');
    }
  };

  if (loading || !skillData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-20 px-4 flex items-center justify-center game-gradient">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading skill trees...</p>
          </div>
        </div>
      </>
    );
  }

  const currentTree = skillData.skillTrees[selectedTree];
  const IconComponent = treeIcons[selectedTree];

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 px-4 game-gradient">
        <div className="max-w-7xl mx-auto pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-primary float-animation" />
            <h1 className="text-5xl font-minecraft mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Skill Trees
            </h1>
            <p className="text-xl text-muted-foreground">Unlock powerful abilities to enhance your journey</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 game-card px-4 py-2 rounded-lg">
                <span className="text-sm text-muted-foreground">Level:</span>
                <span className="font-bold text-primary">{skillData.userLevel}</span>
              </div>
              <div className="flex items-center gap-2 game-card px-4 py-2 rounded-lg">
                <Coins className="h-5 w-5 coin-glow text-yellow-400" />
                <span className="font-bold">{skillData.userCoins}</span>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.entries(skillData.skillTrees).map(([key, tree]: [string, any]) => {
              const Icon = treeIcons[key];
              return (
                <Button
                  key={key}
                  onClick={() => setSelectedTree(key)}
                  variant={selectedTree === key ? 'default' : 'outline'}
                  className={`pixel-button ${selectedTree === key ? '' : 'opacity-60'}`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tree.name}
                </Button>
              );
            })}
          </div>

          <Card className={`game-card p-8 mb-8 bg-gradient-to-br ${treeColors[currentTree.color]}/10`}>
            <div className="flex items-center gap-4 mb-4">
              <IconComponent className="h-12 w-12" />
              <div>
                <h2 className="text-3xl font-minecraft">{currentTree.name}</h2>
                <p className="text-muted-foreground">{currentTree.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
              {currentTree.skills.map((skill: any, index: number) => {
                const isUnlocked = skillData.unlockedSkills.includes(skill.id);
                const canUnlock =
                  skillData.userLevel >= skill.levelReq &&
                  skillData.userCoins >= skill.cost &&
                  (!skill.requires || skill.requires.every((req: string) => skillData.unlockedSkills.includes(req)));

                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Card
                      className={`p-6 h-full relative overflow-hidden transition-all ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50'
                          : canUnlock
                          ? 'game-card hover:shadow-2xl cursor-pointer'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {isUnlocked && (
                        <div className="absolute top-2 right-2">
                          <Check className="h-6 w-6 text-green-400" />
                        </div>
                      )}
                      {!isUnlocked && !canUnlock && (
                        <div className="absolute top-2 right-2">
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}

                      <div className="text-center">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 bg-gradient-to-br ${treeColors[currentTree.color]}`}>
                          <span className="text-2xl font-bold text-white">{index + 1}</span>
                        </div>
                        <h3 className="font-minecraft text-lg mb-2">{skill.name}</h3>
                        <p className="text-xs text-muted-foreground mb-4">{skill.description}</p>

                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Level Req:</span>
                            <span className={skillData.userLevel >= skill.levelReq ? 'text-green-400' : 'text-red-400'}>
                              {skill.levelReq}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Cost:</span>
                            <span className="flex items-center gap-1">
                              <Coins className="h-3 w-3 text-yellow-400" />
                              {skill.cost}
                            </span>
                          </div>
                        </div>

                        {!isUnlocked && (
                          <Button
                            onClick={() => unlockSkill(skill.id, selectedTree)}
                            disabled={!canUnlock}
                            className="w-full mt-4 pixel-button text-xs"
                          >
                            {canUnlock ? 'Unlock' : 'Locked'}
                          </Button>
                        )}
                        {isUnlocked && (
                          <div className="mt-4 px-3 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                            <span className="text-xs text-green-400 font-bold">✓ UNLOCKED</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          <Card className="game-card p-6">
            <h3 className="text-xl font-minecraft mb-4">How Skill Trees Work</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong className="text-foreground">Unlock skills</strong> using coins and meeting level requirements</li>
              <li>• <strong className="text-foreground">Skills must be unlocked in order</strong> - each tier requires the previous one</li>
              <li>• <strong className="text-foreground">Passive bonuses</strong> apply permanently once unlocked</li>
              <li>• <strong className="text-foreground">5 unique trees</strong> - Focus, Fitness, Finance, Creativity, Wellness</li>
              <li>• <strong className="text-foreground">25+ total skills</strong> to master across all trees</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
