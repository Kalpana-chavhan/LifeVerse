"use client";

import { PublicNavbar } from '@/components/PublicNavbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Gamepad2, 
  Heart, 
  Sparkles, 
  Target, 
  Users, 
  Zap,
  Brain,
  Trophy,
  Rocket,
  Code2,
  Palette,
  Coffee
} from 'lucide-react';
import { motion } from 'framer-motion';

const values = [
  {
    icon: Gamepad2,
    title: "Gamification First",
    description: "We believe that making life feel like a game makes everything more engaging and achievable."
  },
  {
    icon: Heart,
    title: "Built with Passion",
    description: "Every feature is crafted with care to help you become the best version of yourself."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Your feedback shapes our roadmap. We build what our community truly needs."
  },
  {
    icon: Brain,
    title: "Science-Backed",
    description: "Our systems are based on behavioral psychology and habit formation research."
  }
];

const stats = [
  { value: "10+", label: "Core Features" },
  { value: "5", label: "Unique Creatures" },
  { value: "∞", label: "Possibilities" },
  { value: "1", label: "Amazing You" }
];

const techStack = [
  { icon: Code2, name: "Next.js" },
  { icon: Palette, name: "Tailwind CSS" },
  { icon: Zap, name: "React" },
  { icon: Coffee, name: "MongoDB" }
];

export default function AboutPage() {
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
            <span className="text-sm font-semibold text-primary">Our Story</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About <span className="font-minecraft bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">LifeVerse</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            LifeVerse was born from a simple idea: what if your daily life could feel as exciting as your favorite video game?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                  <Gamepad2 className="h-16 w-16 text-white" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4">The Vision</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  We're building more than just a productivity app. LifeVerse is a complete life management system that transforms mundane tasks into epic adventures, boring habits into exciting quests, and everyday goals into legendary achievements.
                </p>
                <p className="text-lg text-muted-foreground">
                  Whether you want to build better habits, track your finances, study more effectively, or simply make life more fun – LifeVerse is your companion on this journey.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="p-6 h-full bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <Card className="p-8 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-primary/20">
            <h2 className="text-3xl font-bold text-center mb-10">By The Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold font-minecraft bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-10">Built With</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <Card key={index} className="px-6 py-3 bg-card/50 border-primary/20 flex items-center gap-3">
                <tech.icon className="h-5 w-5 text-primary" />
                <span className="font-semibold">{tech.name}</span>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-12 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 border-primary/30 text-center">
            <Rocket className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join LifeVerse today and start transforming your everyday life into an epic adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="pixel-button text-lg px-10 py-6">
                  <Trophy className="mr-2 h-5 w-5" />
                  <span className="font-minecraft text-sm">Start Free</span>
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-primary/50">
                  <Target className="mr-2 h-5 w-5" />
                  <span className="font-minecraft text-sm">See Features</span>
                </Button>
              </Link>
            </div>
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
