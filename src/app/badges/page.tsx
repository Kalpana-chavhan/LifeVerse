"use client";

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Lock, Sparkles, Crown, Target, Zap, Shield, Heart, Brain, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  secret: boolean;
  coinReward: number;
}

interface UserBadges {
  totalUnlocked: number;
  totalAchievements: number;
  achievements: Achievement[];
}

const RARITY_COLORS = {
  common: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  rare: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  epic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  legendary: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
};

const CATEGORY_ICONS: Record<string, any> = {
  quests: Target,
  creatures: Heart,
  study: Brain,
  finance: TrendingUp,
  social: Shield,
  general: Star
};

export default function BadgesPage() {
  const [badgesData, setBadgesData] = useState<UserBadges | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/achievements');
      const data = await response.json();
      setBadgesData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching badges:', error);
      toast.error('Failed to load achievements');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen game-gradient flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Trophy className="h-12 w-12 text-yellow-400" />
            </motion.div>
            <p className="text-lg text-muted-foreground">Loading achievements...</p>
          </div>
        </div>
      </>
    );
  }

  const categories = ['all', ...new Set(badgesData?.achievements.map(a => a.category) || [])];
  const rarities = ['all', 'common', 'rare', 'epic', 'legendary'];

  const filteredAchievements = badgesData?.achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const rarityMatch = selectedRarity === 'all' || achievement.rarity === selectedRarity;
    return categoryMatch && rarityMatch;
  }) || [];

  const unlockedCount = filteredAchievements.filter(a => a.unlocked).length;
  const completionPercentage = Math.round((badgesData?.totalUnlocked || 0) / (badgesData?.totalAchievements || 1) * 100);

  return (
    <>
      <Navbar />
      <div className="min-h-screen game-gradient">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <Trophy className="h-16 w-16 text-yellow-400" />
              </motion.div>
              <h1 className="text-5xl font-minecraft mb-4">Life Badges</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                Unlock achievements by completing quests, leveling up, and mastering your life!
              </p>
              
              {/* Progress Stats */}
              <Card className="game-card max-w-xl mx-auto p-6">
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-accent">{badgesData?.totalUnlocked}</p>
                    <p className="text-sm text-muted-foreground">Unlocked</p>
                  </div>
                  <div className="text-center">
                    <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-3xl font-bold text-accent">{badgesData?.totalAchievements}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center">
                    <Sparkles className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="text-3xl font-bold text-accent">{completionPercentage}%</p>
                    <p className="text-sm text-muted-foreground">Complete</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-accent via-secondary to-primary"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              <div className="flex gap-2">
                {categories.map(cat => {
                  const Icon = CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS] || Star;
                  return (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className="capitalize"
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {cat}
                    </Button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                {rarities.map(rarity => (
                  <Button
                    key={rarity}
                    variant={selectedRarity === rarity ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedRarity(rarity)}
                    className="capitalize"
                  >
                    {rarity}
                  </Button>
                ))}
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredAchievements.map((achievement, index) => {
                  const CategoryIcon = CATEGORY_ICONS[achievement.category as keyof typeof CATEGORY_ICONS] || Star;
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Card className={`game-card p-6 h-full relative overflow-hidden ${
                        achievement.unlocked 
                          ? 'border-2 border-yellow-400/50 bg-yellow-400/5' 
                          : 'opacity-60'
                      }`}>
                        {/* Secret Badge */}
                        {achievement.secret && !achievement.unlocked && (
                          <div className="absolute top-2 right-2">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}

                        {/* Unlocked Badge */}
                        {achievement.unlocked && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="absolute top-2 right-2"
                          >
                            <Sparkles className="h-5 w-5 text-yellow-400" />
                          </motion.div>
                        )}

                        <div className="text-center mb-4">
                          <div className="text-5xl mb-3">{achievement.icon}</div>
                          <h3 className="font-bold mb-1">
                            {achievement.secret && !achievement.unlocked ? '???' : achievement.name}
                          </h3>
                          <Badge className={`text-xs ${RARITY_COLORS[achievement.rarity]}`}>
                            {achievement.rarity.toUpperCase()}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground text-center mb-4">
                          {achievement.secret && !achievement.unlocked 
                            ? 'Secret achievement - unlock to reveal!' 
                            : achievement.description}
                        </p>

                        {/* Progress Bar (if not unlocked and has progress) */}
                        {!achievement.unlocked && achievement.maxProgress && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                                style={{ width: `${(achievement.progress || 0) / (achievement.maxProgress || 1) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Reward */}
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <CategoryIcon className="h-4 w-4 text-accent" />
                          <span className="font-bold text-accent capitalize">{achievement.category}</span>
                          {achievement.coinReward > 0 && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-lg">🪙</span>
                              <span className="font-bold">{achievement.coinReward}</span>
                            </>
                          )}
                        </div>

                        {/* Unlocked Date */}
                        {achievement.unlocked && achievement.unlockedAt && (
                          <p className="text-xs text-center text-muted-foreground mt-3">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* No Results */}
            {filteredAchievements.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl text-muted-foreground">No achievements found</p>
              </div>
            )}

            {/* Rarity Legend */}
            <Card className="game-card mt-12 p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-bold mb-4 text-center flex items-center justify-center gap-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                Rarity Guide
                <Crown className="h-5 w-5 text-yellow-400" />
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Badge className={RARITY_COLORS.common}>COMMON</Badge>
                  <p className="text-xs text-muted-foreground mt-2">Easy to unlock</p>
                </div>
                <div className="text-center">
                  <Badge className={RARITY_COLORS.rare}>RARE</Badge>
                  <p className="text-xs text-muted-foreground mt-2">Requires dedication</p>
                </div>
                <div className="text-center">
                  <Badge className={RARITY_COLORS.epic}>EPIC</Badge>
                  <p className="text-xs text-muted-foreground mt-2">Challenging feat</p>
                </div>
                <div className="text-center">
                  <Badge className={RARITY_COLORS.legendary}>LEGENDARY</Badge>
                  <p className="text-xs text-muted-foreground mt-2">Ultimate achievement</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
