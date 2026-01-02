"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Target, Building2, Heart, Brain, Wallet, Shield, Gamepad2, MessageSquare, 
  Activity, Package, ShoppingCart, BookOpen, Globe, Trophy, Sparkles, Zap,
  Clock, TrendingUp, Star, Users, Coins, Sword, Crown, ArrowRight, Check
} from 'lucide-react';
import { PublicNavbar } from '@/components/PublicNavbar';
import { Navbar } from '@/components/Navbar';
import { useSession } from '@/lib/auth-client';

const features = [
  {
    id: 'lifequest',
    name: 'LifeQuest',
    tagline: 'Turn Tasks Into Epic Adventures',
    description: 'Transform your daily habits and tasks into exciting quests with rewards, streaks, and achievements.',
    icon: Target,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    benefits: [
      'Daily & weekly quest system',
      'Streak tracking with bonuses',
      'XP and coin rewards',
      'Custom quest creation',
      'Achievement unlocks',
      'Category-based organization'
    ],
    stats: {
      quests: '1000+',
      completed: '5000+',
      rewards: '10,000+'
    }
  },
  {
    id: 'focuscity',
    name: 'FocusCity',
    tagline: 'Build Your 3D Universe',
    description: 'Watch your progress come to life as a 3D city that grows with every quest completed.',
    icon: Building2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    benefits: [
      'Interactive 3D city builder',
      'Unlock buildings with progress',
      'City upgrades & expansions',
      'Visual progress tracking',
      'Customizable layouts',
      '15+ unique buildings'
    ],
    stats: {
      buildings: '15+',
      cities: '200+',
      upgrades: '50+'
    }
  },
  {
    id: 'habitmon',
    name: 'HabitMon',
    tagline: 'Evolve Creatures With Habits',
    description: 'Raise adorable creatures that evolve based on your real-life habits and consistency.',
    icon: Heart,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    benefits: [
      '5 unique creatures',
      '3 evolution stages each',
      'Happiness & hunger system',
      'Creature interactions',
      'Growth tracking',
      'Special abilities unlock'
    ],
    stats: {
      creatures: '5',
      evolutions: '15',
      interactions: '20+'
    }
  },
  {
    id: 'study-arena',
    name: 'Study Arena',
    tagline: 'Focus Is Your Superpower',
    description: 'Turn study sessions into boss battles with Pomodoro timers, XP multipliers, and epic rewards.',
    icon: Brain,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-400/10',
    benefits: [
      'Pomodoro focus timer',
      'Boss battle themes',
      'Session streak tracking',
      'XP multipliers',
      'Deep focus mode',
      'Study analytics'
    ],
    stats: {
      sessions: '3000+',
      hours: '10,000+',
      bosses: '100+'
    }
  },
  {
    id: 'budgetquest',
    name: 'BudgetQuest',
    tagline: 'Finance Made Fun',
    description: 'Gamify your finances with expense tracking, savings goals, and financial missions.',
    icon: Wallet,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    benefits: [
      'Expense tracking',
      'Savings goal system',
      'Budget missions',
      'Financial insights',
      'Category management',
      'Monthly reports'
    ],
    stats: {
      tracked: '$100K+',
      goals: '500+',
      savings: '$50K+'
    }
  },
  {
    id: 'lifeclans',
    name: 'LifeClans',
    tagline: 'Heroes Unite Together',
    description: 'Join forces with friends, complete clan quests, and climb leaderboards as a team.',
    icon: Shield,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    benefits: [
      'Create & join clans',
      'Team challenges',
      'Shared clan buildings',
      'Leaderboards',
      'Mega boss battles',
      'Clan chat & events'
    ],
    stats: {
      clans: '50+',
      members: '1000+',
      quests: '200+'
    }
  },
  {
    id: 'mini-games',
    name: 'Mini Games Arena',
    tagline: 'Train Your Brain, Earn Rewards',
    description: '8 brain-boosting mini-games including memory match, math rush, word scramble, and more!',
    icon: Gamepad2,
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10',
    benefits: [
      '8 unique mini-games',
      'Memory & logic training',
      'Multiplayer mode',
      'Daily challenges',
      'High score tracking',
      'Coin rewards'
    ],
    stats: {
      games: '8',
      played: '20,000+',
      winners: '500+'
    }
  },
  {
    id: 'friend-chat',
    name: 'Friend Chat',
    tagline: 'Stay Connected, Stay Motivated',
    description: 'Real-time chat with friends, share achievements, challenge each other, and stay motivated.',
    icon: MessageSquare,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    benefits: [
      'Real-time messaging',
      'Friend requests',
      'Share achievements',
      'Challenge friends',
      'Status updates',
      'Emoji reactions'
    ],
    stats: {
      messages: '50,000+',
      friends: '2000+',
      challenges: '1000+'
    }
  },
  {
    id: 'healthhero',
    name: 'HealthHero',
    tagline: 'Track Health, Gain Power',
    description: 'Monitor water intake, sleep, steps, and mood - all gamified for better health habits.',
    icon: Activity,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    benefits: [
      'Water intake tracking',
      'Sleep monitoring',
      'Step counter',
      'Mood journal',
      'Health streaks',
      'Weekly reports'
    ],
    stats: {
      logs: '10,000+',
      streaks: '500+',
      improved: '80%'
    }
  },
  {
    id: 'inventory',
    name: 'Inventory System',
    tagline: 'Collect & Manage Items',
    description: 'Earn, collect, and manage items, potions, power-ups, and special rewards.',
    icon: Package,
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    benefits: [
      'Item collection',
      'Power-ups & boosts',
      'Rare items',
      'Equipment system',
      'Item crafting',
      'Storage management'
    ],
    stats: {
      items: '100+',
      rarity: '5 levels',
      crafts: '50+'
    }
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    tagline: 'Trade & Earn Coins',
    description: 'Buy, sell, and trade items with other players in the global marketplace.',
    icon: ShoppingCart,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    benefits: [
      'Buy & sell items',
      'Player trading',
      'Auction system',
      'Price tracking',
      'Special offers',
      'Limited editions'
    ],
    stats: {
      trades: '5000+',
      volume: '100K coins',
      items: '200+'
    }
  },
  {
    id: 'mind-palace',
    name: 'Mind Palace',
    tagline: 'Master Your Memory',
    description: 'Learn and practice memory techniques with interactive lessons and exercises.',
    icon: BookOpen,
    color: 'text-violet-400',
    bgColor: 'bg-violet-400/10',
    benefits: [
      'Memory techniques',
      'Interactive lessons',
      'Practice exercises',
      'Progress tracking',
      'Brain training',
      'Skill mastery'
    ],
    stats: {
      techniques: '10+',
      lessons: '50+',
      mastered: '200+'
    }
  },
  {
    id: 'world-events',
    name: 'World Events',
    tagline: 'Global Challenges Unite All',
    description: 'Participate in time-limited global events and challenges with exclusive rewards.',
    icon: Globe,
    color: 'text-sky-400',
    bgColor: 'bg-sky-400/10',
    benefits: [
      'Limited-time events',
      'Global challenges',
      'Exclusive rewards',
      'Leaderboards',
      'Seasonal content',
      'Special bosses'
    ],
    stats: {
      events: '20+',
      participants: '5000+',
      rewards: '1000+'
    }
  }
];

export default function FeaturesPage() {
  const { data: session, isPending } = useSession();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <>
      {!isPending && (session?.user ? <Navbar /> : <PublicNavbar />)}
      <div className="min-h-screen game-gradient particle-bg">
        <section className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 game-card px-6 py-3 rounded-full mb-6">
              <Sparkles className="h-5 w-5 text-secondary" />
              <span className="text-sm font-bold text-primary">13 Powerful Features</span>
              <Zap className="h-5 w-5 text-accent" />
            </div>

            <h1 className="text-5xl md:text-7xl mb-6 leading-tight">
              <span className="font-main text-foreground">Everything You Need to</span>
              <br />
              <span className="font-minecraft bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
                Level Up Your Life
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 font-main">
              From quests to creatures, cities to clans - discover all the features that make LifeVerse the ultimate life gamification platform.
            </p>

            {!isPending && !session?.user && (
              <Link href="/register">
                <Button size="lg" className="pixel-button">
                  <Sword className="mr-2 h-5 w-5" />
                  <span className="font-minecraft text-sm">Start Free Journey</span>
                </Button>
              </Link>
            )}
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className={index % 2 === 0 ? '' : 'md:ml-auto md:mr-0'}
              >
                <Card className={`game-card p-8 max-w-4xl ${index % 2 === 1 ? 'ml-auto' : ''}`}>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className={`inline-flex p-4 rounded-2xl ${feature.bgColor}`}>
                        <feature.icon className={`h-12 w-12 ${feature.color}`} />
                      </div>
                      
                      <div>
                        <h2 className={`text-3xl font-minecraft mb-2 ${feature.color}`}>
                          {feature.name}
                        </h2>
                        <p className="text-lg text-primary font-bold mb-3">{feature.tagline}</p>
                        <p className="text-muted-foreground font-main">{feature.description}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4">
                        {Object.entries(feature.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className={`text-2xl font-bold ${feature.color}`}>{value}</div>
                            <div className="text-xs text-muted-foreground capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        Key Benefits
                      </h3>
                      {feature.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-3 game-card p-3 rounded-lg">
                          <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${feature.color}`} />
                          <span className="text-sm font-main">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-20"
          >
            <Card className="game-card p-12 text-center max-w-3xl mx-auto">
              <Trophy className="h-16 w-16 mx-auto mb-6 text-yellow-400" />
              <h2 className="text-4xl font-bold mb-4 font-main">
                Ready to Transform Your Life?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 font-main">
                Join thousands of heroes who are leveling up their real lives through gamification.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Badge variant="outline" className="px-4 py-2 game-card">
                  <Coins className="h-4 w-4 mr-2 text-yellow-400" />
                  Earn Rewards
                </Badge>
                <Badge variant="outline" className="px-4 py-2 game-card">
                  <Zap className="h-4 w-4 mr-2 text-accent" />
                  Level Up
                </Badge>
                <Badge variant="outline" className="px-4 py-2 game-card">
                  <Users className="h-4 w-4 mr-2 text-secondary" />
                  Join Community
                </Badge>
                <Badge variant="outline" className="px-4 py-2 game-card">
                  <Crown className="h-4 w-4 mr-2 text-primary" />
                  Become Legend
                </Badge>
              </div>

              {!isPending && session?.user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="pixel-button text-lg px-10 py-6">
                    <Sparkles className="mr-2 h-5 w-5" />
                    <span className="font-minecraft text-sm">Go to Dashboard</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button size="lg" className="pixel-button text-lg px-10 py-6">
                    <Sword className="mr-2 h-5 w-5" />
                    <span className="font-minecraft text-sm">Start Your Journey</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </Card>
          </motion.div>
        </section>
      </div>
    </>
  );
}
