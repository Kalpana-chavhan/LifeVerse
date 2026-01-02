"use client";

import { PublicNavbar } from '@/components/PublicNavbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Sword, 
  Target, 
  Trophy, 
  Zap, 
  Users, 
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Coins,
  Heart,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Create Your Hero",
    description: "Sign up and customize your character. Choose your avatar, set your goals, and define your quest categories.",
    icon: Sword,
    color: "text-orange-400"
  },
  {
    number: "02", 
    title: "Set Your Quests",
    description: "Transform your daily tasks, habits, and goals into epic quests. Each quest has XP and coin rewards.",
    icon: Target,
    color: "text-blue-400"
  },
  {
    number: "03",
    title: "Complete & Earn",
    description: "Finish your quests to earn XP, coins, and special items. Build streaks for bonus multipliers.",
    icon: Trophy,
    color: "text-yellow-400"
  },
  {
    number: "04",
    title: "Level Up",
    description: "Gain enough XP to level up your hero. Unlock new features, creatures, and building slots.",
    icon: Zap,
    color: "text-purple-400"
  },
  {
    number: "05",
    title: "Build Your World",
    description: "Use your coins to construct buildings, evolve creatures, and expand your virtual city.",
    icon: Building2,
    color: "text-green-400"
  },
  {
    number: "06",
    title: "Join the Community",
    description: "Team up with friends, join clans, compete on leaderboards, and tackle boss battles together.",
    icon: Users,
    color: "text-pink-400"
  }
];

const features = [
  { icon: CheckCircle2, text: "Track habits with gamified rewards" },
  { icon: Coins, text: "Earn virtual currency for real achievements" },
  { icon: Heart, text: "Raise creatures that evolve with your progress" },
  { icon: TrendingUp, text: "Watch your stats grow over time" }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card/50 to-background">
      <PublicNavbar />
      
      <main className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Simple & Powerful</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            How <span className="font-minecraft bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">LifeVerse</span> Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your daily life into an epic adventure in just a few simple steps
          </p>
        </motion.div>

        <div className="grid gap-8 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-card to-muted flex items-center justify-center border-2 border-primary/30`}>
                      <step.icon className={`h-10 w-10 ${step.color}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className={`text-4xl font-bold ${step.color} opacity-50`}>{step.number}</span>
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-lg text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden md:block h-8 w-8 text-primary/30" />
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-12 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 border-primary/30 text-center">
            <h2 className="text-3xl font-bold mb-6">What You'll Get</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 justify-center md:justify-start">
                  <feature.icon className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{feature.text}</span>
                </div>
              ))}
            </div>
            <Link href="/register">
              <Button size="lg" className="pixel-button text-lg px-10 py-6">
                <Sword className="mr-2 h-5 w-5" />
                <span className="font-minecraft text-sm">Start Your Journey</span>
              </Button>
            </Link>
          </Card>
        </motion.div>
      </main>

      <footer className="border-t border-primary/20 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p className="font-minecraft text-primary">LifeVerse</p>
          <p className="text-sm mt-2">Created by Kalpana</p>
        </div>
      </footer>
    </div>
  );
}
