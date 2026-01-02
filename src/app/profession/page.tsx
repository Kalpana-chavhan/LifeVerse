"use client";

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Zap, Star, TrendingUp, Shield } from 'lucide-react';
import { toast } from 'sonner';

// Kalpana: Choose your life class - RPG style!

interface ClassData {
  name: string;
  icon: string;
  description: string;
  specialPower: string;
  primaryStat: string;
  xpMultiplier: number;
  bonusCategories: string[];
}

interface ProfessionData {
  hasProfession: boolean;
  profession?: any;
  availableClasses?: Record<string, ClassData>;
}

export default function ProfessionPage() {
  const [professionInfo, setProfessionData] = useState<ProfessionData | null>(null);
  const [loadingData, setLoading] = useState(true);
  const [selectingClass, setSelecting] = useState(false);

  useEffect(() => {
    fetchProfessionInfo();
  }, []);

  const fetchProfessionInfo = async () => {
    try {
      const response = await fetch('/api/profession');
      const data = await response.json();
      setProfessionData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profession:', error);
      toast.error('Failed to load professions');
      setLoading(false);
    }
  };

  const handleSelectClass = async (className: string) => {
    setSelecting(true);
    try {
      const response = await fetch('/api/profession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ className }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        await fetchProfessionInfo();
      } else {
        toast.error(data.error || 'Failed to select profession');
      }
    } catch (error) {
      console.error('Error selecting profession:', error);
      toast.error('Failed to select profession');
    } finally {
      setSelecting(false);
    }
  };

  if (loadingData) {
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
              <Sparkles className="h-12 w-12 text-primary" />
            </motion.div>
            <p className="text-lg text-muted-foreground">Loading professions...</p>
          </div>
        </div>
      </>
    );
  }

  // User has already selected a profession
  if (professionInfo?.hasProfession) {
    const { profession } = professionInfo;
    const details = profession.details;

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
              <div className="text-center mb-8">
                <h1 className="text-4xl font-minecraft mb-4">
                  <Crown className="inline h-10 w-10 text-yellow-400 mr-2" />
                  Your Life Class
                </h1>
                <p className="text-muted-foreground">Master your chosen path</p>
              </div>

              <Card className="game-card max-w-2xl mx-auto p-8">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{details.icon}</div>
                  <h2 className="text-3xl font-bold mb-2">{details.name}</h2>
                  <Badge className="text-sm px-4 py-1">
                    Level {profession.level} {details.name}
                  </Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="game-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-accent" />
                      <span className="font-bold">Special Power</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{details.specialPower}</p>
                  </div>

                  <div className="game-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                      <span className="font-bold">XP Multiplier</span>
                    </div>
                    <p className="text-2xl font-bold text-accent">{details.xpMultiplier}x</p>
                  </div>

                  <div className="game-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="font-bold">Bonus Categories</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {details.bonusCategories.map((cat: string) => (
                        <Badge key={cat} variant="secondary" className="capitalize">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <p className="text-sm text-center">
                    <Shield className="inline h-4 w-4 mr-1" />
                    Profession XP: <span className="font-bold text-accent">{profession.xp}</span>
                  </p>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Complete quests to level up your profession and unlock new abilities!
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  // Class selection screen
  const classes = Object.entries(professionInfo?.availableClasses || {});

  return (
    <>
      <Navbar />
      <div className="min-h-screen game-gradient particle-bg">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <Crown className="h-16 w-16 text-yellow-400" />
              </motion.div>
              <h1 className="text-5xl font-minecraft mb-4">Choose Your Life Class</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Select a profession that matches your goals. Each class has unique bonuses and abilities!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {classes.map(([key, classData], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <Card className="game-card p-6 h-full relative overflow-hidden hover:shadow-2xl transition-all">
                    <div className="relative z-10">
                      <div className="text-center mb-4">
                        <div className="text-5xl mb-3">{classData.icon}</div>
                        <h3 className="text-2xl font-minecraft mb-2">{classData.name}</h3>
                        <Badge className="text-xs px-3 py-1">
                          {classData.xpMultiplier}x XP Multiplier
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 text-center">
                        {classData.description}
                      </p>

                      <div className="game-card p-3 mb-4">
                        <div className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <p className="text-xs font-bold">{classData.specialPower}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4 justify-center">
                        {classData.bonusCategories.map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs capitalize">
                            {cat}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleSelectClass(key)}
                        disabled={selectingClass}
                        className="w-full pixel-button"
                      >
                        {selectingClass ? 'Selecting...' : `Choose ${classData.name}`}
                      </Button>
                    </div>

                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                      <div className="text-9xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        {classData.icon}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                <Star className="inline h-4 w-4 text-yellow-400" />
                {' '}Choose wisely! You'll earn 100 bonus coins for selecting your class{' '}
                <Star className="inline h-4 w-4 text-yellow-400" />
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
