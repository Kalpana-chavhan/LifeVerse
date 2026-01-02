"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Sword, Shield, Heart, Coins, Gamepad2, MessageCircle, Sparkles, Zap, Users, TrendingUp, Clock, Star, Building2, Brain, Wallet, Crown, MessageSquare, Activity } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '@/components/Navbar';
import { PublicNavbar } from '@/components/PublicNavbar';
import { animate, stagger } from 'animejs';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const { data: session, isPending } = useSession();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(loadingInterval);
  }, []);

  useEffect(() => {
    if (loadingProgress === 100) {
      animate('.hero-title', {
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1200,
        easing: 'easeOutElastic(1, .8)',
        delay: stagger(100)
      });

      animate('.feature-card', {
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 800,
        delay: stagger(100, { start: 500 }),
        easing: 'easeOutQuad'
      });

      gsap.from('.stat-badge', {
        scrollTrigger: {
          trigger: '.stat-badge',
          start: 'top 80%',
        },
        scale: 0,
        rotation: 360,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      });

      }
  }, [loadingProgress]);

  useEffect(() => {
    const icons = document.querySelectorAll('.icon-float');
    icons.forEach((icon) => {
      gsap.to(icon, {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: Math.random() * 2
      });
    });

    const coinElements = document.querySelectorAll('.coin-spin');
    coinElements.forEach((coin) => {
      gsap.to(coin, {
        rotateY: 360,
        duration: 3,
        repeat: -1,
        ease: 'linear'
      });
    });
  }, []);

  if (loadingProgress < 100) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background">
        <div className="text-center">
          <div className="mb-8">
            <Gamepad2 className="h-24 w-24 mx-auto text-primary animate-bounce" />
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Loading LifeVerse
          </h2>
          <div className="w-64 h-4 bg-card rounded-full overflow-hidden mx-auto">
            <div 
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="mt-4 text-muted-foreground font-main">{loadingProgress}%</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isPending && (session?.user ? <Navbar /> : <PublicNavbar />)}
        <div className="min-h-screen game-gradient particle-bg relative overflow-hidden">
          <div className="fixed inset-0 w-full h-full opacity-30 pointer-events-none z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(167,139,250,0.35),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.3),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.28),transparent_32%)] blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
          </div>

          <section ref={heroRef} className="container mx-auto px-4 py-20 relative z-10">

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 game-card px-6 py-3 rounded-full mb-6 backdrop-blur-xl">
              <Sparkles className="h-5 w-5 text-secondary icon-float" />
              <span className="text-sm font-bold text-primary neon-text">Level Up Your Reality</span>
              <Zap className="h-5 w-5 text-accent icon-float" />
            </div>
            
            <div className="mb-4">
              <Gamepad2 className="h-20 w-20 mx-auto text-primary icon-float" />
            </div>
            
            <h1 className="text-5xl md:text-7xl mb-6 leading-tight hero-title opacity-0">
              <span className="text-foreground">Welcome to</span>
              <br />
              <span className="font-minecraft bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                LifeVerse
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed hero-title opacity-0">
              Your entire life becomes an epic{' '}
              <span className="text-primary font-bold">RPG Adventure</span>. 
              Complete daily quests, evolve your creatures, build cities, and level up in real life!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 hero-title opacity-0">
              {!isPending && session?.user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="pixel-button text-lg px-8 py-6 w-full sm:w-auto">
                    <Trophy className="mr-2 h-5 w-5" />
                    <span className="font-minecraft text-sm">Dashboard</span>
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" className="pixel-button text-lg px-8 py-6 w-full sm:w-auto">
                      <Sword className="mr-2 h-5 w-5" />
                      <span className="font-minecraft text-sm">Start Journey</span>
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto border-primary/50 hover:bg-primary/10">
                      <Shield className="mr-2 h-5 w-5" />
                      <span className="font-minecraft text-sm">Log In</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 game-card px-4 py-2 rounded-lg backdrop-blur-xl stat-badge">
                <Coins className="h-5 w-5 coin-spin text-yellow-400" />
                <span className="font-bold">Earn Coins</span>
              </div>
              <div className="flex items-center gap-2 game-card px-4 py-2 rounded-lg backdrop-blur-xl stat-badge">
                <Zap className="h-5 w-5 text-accent icon-float" />
                <span className="font-bold">Gain XP</span>
              </div>
              <div className="flex items-center gap-2 game-card px-4 py-2 rounded-lg backdrop-blur-xl stat-badge">
                <Users className="h-5 w-5 text-secondary icon-float" />
                <span className="font-bold">Join Clans</span>
              </div>
              <div className="flex items-center gap-2 game-card px-4 py-2 rounded-lg backdrop-blur-xl stat-badge">
                <Gamepad2 className="h-5 w-5 text-primary icon-float" />
                <span className="font-bold">Play Games</span>
              </div>
            </div>
          </div>
        </section>

        <section ref={featuresRef} className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <Sparkles className="inline h-8 w-8 text-primary icon-float" /> Everything You Do Matters <Sparkles className="inline h-8 w-8 text-primary icon-float" />
            </h2>
            <p className="text-xl text-muted-foreground">Every real-life action contributes to your virtual universe</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="game-card p-6 h-full backdrop-blur-xl feature-card opacity-0">
              <Target className="h-12 w-12 mb-4 icon-float text-orange-400" />
              <h3 className="text-2xl font-minecraft mb-3 text-orange-400">LifeQuest</h3>
              <p className="text-muted-foreground mb-4">
                Transform habits and tasks into epic quests. Earn XP, coins, and unlock rewards with every completion.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><Clock className="inline h-4 w-4 mr-1" /> Daily & Weekly Quests</li>
                <li><TrendingUp className="inline h-4 w-4 mr-1" /> Streak Tracking</li>
                <li><Trophy className="inline h-4 w-4 mr-1" /> Achievement System</li>
                <li><Star className="inline h-4 w-4 mr-1" /> RPG Skill Trees</li>
              </ul>
            </Card>

            <Card className="game-card p-6 h-full backdrop-blur-xl feature-card opacity-0">
              <Building2 className="h-12 w-12 mb-4 icon-float text-blue-400" />
              <h3 className="text-2xl font-minecraft mb-3 text-blue-400">FocusCity</h3>
              <p className="text-muted-foreground mb-4">
                Build a 3D city that evolves with your progress. Unlock buildings, upgrade structures, and watch your world grow.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><Sparkles className="inline h-4 w-4 mr-1" /> 3D Visualization</li>
                <li><Building2 className="inline h-4 w-4 mr-1" /> Dynamic Buildings</li>
                <li><TrendingUp className="inline h-4 w-4 mr-1" /> City Progression</li>
                <li><Trophy className="inline h-4 w-4 mr-1" /> Visual Achievements</li>
              </ul>
            </Card>

            <Card className="game-card p-6 h-full backdrop-blur-xl border-2 border-accent/50 feature-card opacity-0">
              <Heart className="h-12 w-12 mb-4 icon-float text-purple-400" />
              <h3 className="text-2xl font-minecraft mb-3 text-purple-400">HabitMon</h3>
              <Badge className="mb-2 bg-accent/20 text-accent">Dynamic Personalities!</Badge>
              <p className="text-muted-foreground mb-4">
                Raise creatures that evolve based on your habits. Each develops unique personalities and talks to you!
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><Star className="inline h-4 w-4 mr-1" /> 5 Unique Creatures</li>
                <li><Zap className="inline h-4 w-4 mr-1" /> Evolution System</li>
                <li><Heart className="inline h-4 w-4 mr-1" /> AI Personalities</li>
                <li><Gamepad2 className="inline h-4 w-4 mr-1" /> Interactive Dialogue</li>
              </ul>
            </Card>

            <Card className="game-card p-6 h-full backdrop-blur-xl feature-card opacity-0">
              <Brain className="h-12 w-12 mb-4 icon-float text-indigo-400" />
              <h3 className="text-2xl font-minecraft mb-3 text-indigo-400">Study Arena</h3>
              <p className="text-muted-foreground mb-4">
                Turn study sessions into boss battles. Focus equals attack power. Beat the clock and earn massive rewards!
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><Clock className="inline h-4 w-4 mr-1" /> Focus Timer System</li>
                <li><Sword className="inline h-4 w-4 mr-1" /> Boss Battles</li>
                <li><Target className="inline h-4 w-4 mr-1" /> Pomodoro Integration</li>
                <li><Zap className="inline h-4 w-4 mr-1" /> XP Multipliers</li>
              </ul>
            </Card>

            <Card className="game-card p-6 h-full backdrop-blur-xl feature-card opacity-0">
              <Wallet className="h-12 w-12 mb-4 icon-float coin-spin text-green-400" />
              <h3 className="text-2xl font-minecraft mb-3 text-green-400">BudgetQuest</h3>
              <p className="text-muted-foreground mb-4">
                Gamify your finances. Track expenses, achieve savings goals, and complete financial missions.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><TrendingUp className="inline h-4 w-4 mr-1" /> Expense Tracking</li>
                <li><Coins className="inline h-4 w-4 mr-1" /> Savings Goals</li>
                <li><Target className="inline h-4 w-4 mr-1" /> Budget Missions</li>
                <li><Star className="inline h-4 w-4 mr-1" /> Financial XP</li>
              </ul>
            </Card>

            <Card className="game-card p-6 h-full backdrop-blur-xl feature-card opacity-0">
              <Shield className="h-12 w-12 mb-4 icon-float text-yellow-400" />
              <h3 className="text-2xl font-minecraft mb-3 text-yellow-400">LifeClans</h3>
              <p className="text-muted-foreground mb-4">
                Join forces with friends. Complete clan quests, unlock buildings together, and climb the leaderboards!
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><Users className="inline h-4 w-4 mr-1" /> Team Challenges</li>
                <li><Building2 className="inline h-4 w-4 mr-1" /> Clan Buildings</li>
                <li><Sword className="inline h-4 w-4 mr-1" /> Mega Boss Battles</li>
                <li><MessageCircle className="inline h-4 w-4 mr-1" /> Social Features</li>
              </ul>
            </Card>

            <Card className="game-card p-6 h-full backdrop-blur-xl feature-card opacity-0">
              <Gamepad2 className="h-12 w-12 mb-4 icon-float text-pink-400" />
              <h3 className="text-2xl font-minecraft mb-3 text-pink-400">Mini Games</h3>
              <p className="text-muted-foreground mb-4">
                Play brain-boosting games! Memory match, math rush, word puzzles, and more. Earn coins while having fun!
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><Brain className="inline h-4 w-4 mr-1" /> Memory Match</li>
                <li><Target className="inline h-4 w-4 mr-1" /> Math Rush</li>
                <li><Star className="inline h-4 w-4 mr-1" /> Word Scramble</li>
                <li><Crown className="inline h-4 w-4 mr-1" /> Multiplayer Mode</li>
              </ul>
            </Card>

            <Card className="game-card p-6 h-full backdrop-blur-xl feature-card opacity-0">
              <MessageSquare className="h-12 w-12 mb-4 icon-float text-cyan-400" />
              <h3 className="text-2xl font-minecraft mb-3 text-cyan-400">Friend Chat</h3>
              <p className="text-muted-foreground mb-4">
                Chat with friends in real-time! Share achievements, challenge each other, and stay motivated together.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><MessageCircle className="inline h-4 w-4 mr-1" /> Real-time Messaging</li>
                <li><Users className="inline h-4 w-4 mr-1" /> Friend Requests</li>
                <li><Trophy className="inline h-4 w-4 mr-1" /> Share Achievements</li>
                <li><Sword className="inline h-4 w-4 mr-1" /> Challenge Friends</li>
              </ul>
            </Card>

            <Card className="game-card p-6 h-full backdrop-blur-xl feature-card opacity-0">
              <Activity className="h-12 w-12 mb-4 icon-float text-red-400" />
              <h3 className="text-2xl font-minecraft mb-3 text-red-400">HealthHero</h3>
              <p className="text-muted-foreground mb-4">
                Track your health stats! Water intake, sleep, steps, and mood - all gamified for better habits.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><Activity className="inline h-4 w-4 mr-1" /> Water Tracking</li>
                <li><Clock className="inline h-4 w-4 mr-1" /> Sleep Monitoring</li>
                <li><TrendingUp className="inline h-4 w-4 mr-1" /> Step Counter</li>
                <li><Heart className="inline h-4 w-4 mr-1" /> Mood Journal</li>
              </ul>
            </Card>
          </div>


        </section>

        <section className="container mx-auto px-4 py-20 relative z-10">
          <Card className="game-card p-12 text-center backdrop-blur-xl">
            <div className="mb-6">
              <Trophy className="h-20 w-20 mx-auto text-yellow-400 icon-float" />
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Life?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of heroes who are leveling up their real lives through gamification. Your adventure awaits!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="game-card px-4 py-2 rounded-lg backdrop-blur-xl">
                <Coins className="inline h-5 w-5 coin-spin text-yellow-400" />
                <span className="ml-2 font-bold">Earn Coins</span>
              </div>
              <div className="game-card px-4 py-2 rounded-lg backdrop-blur-xl">
                <Zap className="inline h-5 w-5 text-accent icon-float" />
                <span className="ml-2 font-bold">Level Up</span>
              </div>
              <div className="game-card px-4 py-2 rounded-lg backdrop-blur-xl">
                <Gamepad2 className="inline h-5 w-5 text-primary icon-float" />
                <span className="ml-2 font-bold">Play Games</span>
              </div>
              <div className="game-card px-4 py-2 rounded-lg backdrop-blur-xl">
                <Trophy className="inline h-5 w-5 text-yellow-400 icon-float" />
                <span className="ml-2 font-bold">Win Rewards</span>
              </div>
            </div>
            
            {!isPending && session?.user ? (
              <Link href="/dashboard">
                <Button size="lg" className="pixel-button text-lg px-10 py-6">
                  <Sparkles className="mr-2 h-5 w-5" />
                  <span className="font-minecraft text-sm">Dashboard</span>
                </Button>
              </Link>
            ) : (
              <Link href="/register">
                <Button size="lg" className="pixel-button text-lg px-10 py-6">
                  <Sword className="mr-2 h-5 w-5" />
                  <span className="font-minecraft text-sm">Begin Adventure</span>
                </Button>
              </Link>
            )}
          </Card>
        </section>

        <footer className="border-t border-primary/20 mt-20 relative z-10">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-muted-foreground">
              <p className="mb-2 text-lg">
                <span className="font-minecraft text-primary">LifeVerse</span> - Gamify Your Entire Reality
              </p>
              <p className="text-sm mb-2">
                Built with Next.js, MongoDB, React & Passion
              </p>
              <p className="text-xs text-secondary font-semibold">
                Created by Kalpana
              </p>
              <p className="text-xs mt-2 text-primary">
                Complete Quests • Evolve Creatures • Build Cities • Earn Coins • Play Games
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
