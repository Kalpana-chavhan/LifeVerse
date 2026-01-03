"use client";

import { useParams } from 'next/navigation';
import { PublicNavbar } from '@/components/PublicNavbar';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { motion } from 'framer-motion';
import { 
  Target, Building2, Heart, Brain, Wallet, Shield, Gamepad2, MessageSquare, 
  Activity, Package, ShoppingCart, BookOpen, Globe, Trophy, Sparkles, Zap,
  Clock, TrendingUp, Star, Users, Coins, Sword, Crown, ArrowRight, Check,
  ArrowLeft, Play, ChevronRight
} from 'lucide-react';

const featureData: Record<string, {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  benefits: string[];
  howItWorks: { step: number; title: string; description: string }[];
  stats: Record<string, string>;
  screenshots?: string[];
}> = {
  'lifequest': {
    id: 'lifequest',
    name: 'LifeQuest',
    tagline: 'Turn Tasks Into Epic Adventures',
    description: 'Transform your daily habits and tasks into exciting quests with rewards, streaks, and achievements.',
    longDescription: 'LifeQuest is the heart of LifeVerse - a powerful habit and task management system that transforms mundane daily activities into exciting quests. Every task you complete earns you XP and coins, helping you level up your character while building real-life habits. Set daily, weekly, or custom quests, track your streaks, and watch as your consistency unlocks achievements and special rewards. Whether you want to exercise more, read daily, or finish work projects, LifeQuest makes it feel like an adventure.',
    icon: Target,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    benefits: [
      'Create custom quests for any habit or task',
      'Daily & weekly quest templates',
      'Streak tracking with multiplier bonuses',
      'XP and coin rewards for completions',
      'Achievement system with 50+ badges',
      'Category-based quest organization',
      'Difficulty levels (Easy, Medium, Hard, Epic)',
      'Recurring quest scheduling'
    ],
    howItWorks: [
      { step: 1, title: 'Create Your Quest', description: 'Define your task or habit, set the difficulty, and choose rewards.' },
      { step: 2, title: 'Complete Daily', description: 'Check off your quests as you complete them throughout the day.' },
      { step: 3, title: 'Build Streaks', description: 'Maintain consistency to build streaks and earn bonus multipliers.' },
      { step: 4, title: 'Earn Rewards', description: 'Collect XP, coins, and unlock achievements as you progress.' }
    ],
    stats: { 'Quest Types': '4', 'Achievements': '50+', 'Max Streak Bonus': '5x' }
  },
  'focuscity': {
    id: 'focuscity',
    name: 'FocusCity',
    tagline: 'Build Your 3D Universe',
    description: 'Watch your progress come to life as a 3D city that grows with every quest completed.',
    longDescription: 'FocusCity transforms your productivity into a visual masterpiece. As you complete quests and maintain habits, your virtual city grows and evolves. Start with a small plot and gradually unlock new buildings - from cozy houses to grand castles, from simple shops to towering skyscrapers. Each building type represents different achievements and milestones. Customize your city layout, upgrade structures, and create a unique world that reflects your real-life progress.',
    icon: Building2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    benefits: [
      'Interactive 3D city visualization',
      '15+ unique building types',
      'Buildings unlock with progress',
      'Upgrade system for each structure',
      'Customizable city layouts',
      'Day/night cycle effects',
      'Weather effects based on mood',
      'City achievements and milestones'
    ],
    howItWorks: [
      { step: 1, title: 'Start Your City', description: 'Begin with a small plot and your first building unlocked.' },
      { step: 2, title: 'Complete Quests', description: 'Every quest completion contributes to your city growth points.' },
      { step: 3, title: 'Unlock Buildings', description: 'Reach milestones to unlock new building types and upgrades.' },
      { step: 4, title: 'Customize & Expand', description: 'Arrange buildings, upgrade them, and watch your city flourish.' }
    ],
    stats: { 'Buildings': '15+', 'Upgrade Levels': '5', 'City Sizes': '3' }
  },
  'habitmon': {
    id: 'habitmon',
    name: 'HabitMon',
    tagline: 'Evolve Creatures With Habits',
    description: 'Raise adorable creatures that evolve based on your real-life habits and consistency.',
    longDescription: 'HabitMon brings the joy of virtual pet raising to habit building. Choose from 5 unique creatures, each with their own personality and evolution path. Your creature\'s growth is directly tied to your habits - complete quests to feed them, maintain streaks to keep them happy, and watch them evolve through 3 stages as you progress. Each creature develops a unique personality based on your habits and can even talk to you with AI-powered conversations!',
    icon: Heart,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    benefits: [
      '5 unique creature types to choose from',
      '3 evolution stages per creature',
      'Happiness & hunger mechanics',
      'AI-powered creature personalities',
      'Interactive dialogue system',
      'Creature mood affects gameplay',
      'Special abilities unlock with evolution',
      'Creature customization options'
    ],
    howItWorks: [
      { step: 1, title: 'Choose Your Creature', description: 'Pick from 5 unique creatures, each with different traits.' },
      { step: 2, title: 'Care For Them', description: 'Complete quests to feed and maintain their happiness.' },
      { step: 3, title: 'Build Your Bond', description: 'Interact daily to develop their personality and relationship.' },
      { step: 4, title: 'Watch Them Evolve', description: 'Consistent habits lead to creature evolution and new abilities.' }
    ],
    stats: { 'Creatures': '5', 'Evolutions': '15', 'Personalities': 'Unique' }
  },
  'study-arena': {
    id: 'study-arena',
    name: 'Study Arena',
    tagline: 'Focus Is Your Superpower',
    description: 'Turn study sessions into boss battles with Pomodoro timers, XP multipliers, and epic rewards.',
    longDescription: 'Study Arena transforms boring study sessions into epic boss battles. Use the Pomodoro technique with a gaming twist - each focus session is an attack on a boss monster. The longer you focus without distractions, the more damage you deal. Defeat bosses to earn massive XP and coins, unlock special study achievements, and climb the focus leaderboard. Perfect for students, professionals, or anyone who wants to boost their concentration.',
    icon: Brain,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-400/10',
    benefits: [
      'Pomodoro timer with boss battles',
      'Focus = damage dealt to bosses',
      'XP multipliers for long sessions',
      'Break reminders and tracking',
      'Deep focus mode (distraction blocking)',
      'Study session analytics',
      'Subject/topic categorization',
      'Study streak bonuses'
    ],
    howItWorks: [
      { step: 1, title: 'Start a Session', description: 'Choose your study topic and set your Pomodoro duration.' },
      { step: 2, title: 'Face the Boss', description: 'A boss appears - your focus time deals damage to defeat it.' },
      { step: 3, title: 'Stay Focused', description: 'Avoid distractions to maximize damage and earn bonus XP.' },
      { step: 4, title: 'Claim Victory', description: 'Defeat bosses to earn rewards and level up your focus skills.' }
    ],
    stats: { 'Boss Types': '10+', 'Max Multiplier': '3x', 'Pomodoro Modes': '4' }
  },
  'budgetquest': {
    id: 'budgetquest',
    name: 'BudgetQuest',
    tagline: 'Finance Made Fun',
    description: 'Gamify your finances with expense tracking, savings goals, and financial missions.',
    longDescription: 'BudgetQuest makes managing money actually enjoyable. Track your expenses with a game-like interface, set savings goals that feel like quests, and complete financial missions to earn rewards. Visualize your spending habits, set budgets for different categories, and watch your savings grow. The more you save and stick to your budget, the more XP and achievements you unlock.',
    icon: Wallet,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    benefits: [
      'Easy expense tracking',
      'Savings goal quests',
      'Budget missions and challenges',
      'Spending category insights',
      'Monthly financial reports',
      'Savings streak bonuses',
      'Financial achievement badges',
      'Budget vs actual tracking'
    ],
    howItWorks: [
      { step: 1, title: 'Set Your Budget', description: 'Define monthly budgets for different spending categories.' },
      { step: 2, title: 'Track Expenses', description: 'Log expenses quickly and easily with category auto-detection.' },
      { step: 3, title: 'Complete Missions', description: 'Take on savings challenges and budget missions for rewards.' },
      { step: 4, title: 'Grow Your Wealth', description: 'Watch your savings grow and earn achievements along the way.' }
    ],
    stats: { 'Categories': '10+', 'Missions': '20+', 'Reports': 'Weekly/Monthly' }
  },
  'lifeclans': {
    id: 'lifeclans',
    name: 'LifeClans',
    tagline: 'Heroes Unite Together',
    description: 'Join forces with friends, complete clan quests, and climb leaderboards as a team.',
    longDescription: 'LifeClans brings the social aspect to personal development. Create or join a clan with friends, family, or like-minded people. Work together on clan quests, contribute to shared goals, and compete against other clans on leaderboards. Unlock clan buildings together, participate in mega boss battles that require teamwork, and motivate each other to stay consistent.',
    icon: Shield,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    benefits: [
      'Create or join clans',
      'Clan quests and challenges',
      'Shared clan buildings',
      'Clan vs clan leaderboards',
      'Mega boss battles (team required)',
      'Clan chat and events',
      'Role-based permissions',
      'Clan achievements and rewards'
    ],
    howItWorks: [
      { step: 1, title: 'Join or Create', description: 'Find a clan that matches your goals or create your own.' },
      { step: 2, title: 'Contribute Daily', description: 'Your quest completions contribute to clan progress.' },
      { step: 3, title: 'Team Up', description: 'Join forces for mega boss battles and clan challenges.' },
      { step: 4, title: 'Climb Together', description: 'Rise on leaderboards and unlock clan rewards as a team.' }
    ],
    stats: { 'Max Members': '50', 'Clan Buildings': '10+', 'Boss Battles': 'Weekly' }
  },
  'mini-games': {
    id: 'mini-games',
    name: 'Mini Games Arena',
    tagline: 'Train Your Brain, Earn Rewards',
    description: '8 brain-boosting mini-games including memory match, math rush, word scramble, and more!',
    longDescription: 'Mini Games Arena offers 8 unique brain-training games that are both fun and rewarding. Play Memory Match to sharpen your memory, Math Rush to improve calculation speed, Word Scramble for vocabulary, and more. Each game earns you coins and XP based on your performance. Compete against friends in multiplayer mode, climb daily leaderboards, and unlock special achievements.',
    icon: Gamepad2,
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10',
    benefits: [
      '8 unique mini-games',
      'Memory, math, and word games',
      'Multiplayer competitions',
      'Daily challenges with bonus rewards',
      'High score tracking',
      'Coin and XP rewards',
      'Difficulty progression',
      'Game-specific achievements'
    ],
    howItWorks: [
      { step: 1, title: 'Choose a Game', description: 'Pick from 8 different brain-training mini-games.' },
      { step: 2, title: 'Play & Score', description: 'Complete challenges and earn points based on performance.' },
      { step: 3, title: 'Earn Rewards', description: 'Convert your scores into coins and XP.' },
      { step: 4, title: 'Compete', description: 'Challenge friends and climb the leaderboards.' }
    ],
    stats: { 'Games': '8', 'Difficulty Levels': '3', 'Daily Challenges': 'Yes' }
  },
  'friend-chat': {
    id: 'friend-chat',
    name: 'Friend Chat',
    tagline: 'Stay Connected, Stay Motivated',
    description: 'Real-time chat with friends, share achievements, challenge each other, and stay motivated.',
    longDescription: 'Friend Chat keeps you connected with your accountability partners. Send real-time messages, share your achievements automatically, challenge friends to duels, and cheer each other on. Add friends via username or invite links, see their online status, and react to their accomplishments. Building habits is easier when you have friends doing it with you.',
    icon: MessageSquare,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    benefits: [
      'Real-time messaging',
      'Friend request system',
      'Auto-share achievements',
      'Challenge friends to duels',
      'Online status indicators',
      'Emoji reactions',
      'Achievement celebrations',
      'Motivation reminders'
    ],
    howItWorks: [
      { step: 1, title: 'Add Friends', description: 'Send friend requests or share your invite link.' },
      { step: 2, title: 'Chat & Share', description: 'Message friends and automatically share achievements.' },
      { step: 3, title: 'Challenge', description: 'Send friendly challenges and compete head-to-head.' },
      { step: 4, title: 'Motivate', description: 'Celebrate wins together and keep each other accountable.' }
    ],
    stats: { 'Max Friends': 'Unlimited', 'Chat Features': '10+', 'Challenge Types': '5' }
  },
  'healthhero': {
    id: 'healthhero',
    name: 'HealthHero',
    tagline: 'Track Health, Gain Power',
    description: 'Monitor water intake, sleep, steps, and mood - all gamified for better health habits.',
    longDescription: 'HealthHero turns health tracking into a rewarding experience. Log your water intake, sleep hours, daily steps, and mood throughout the day. Each healthy action earns you XP and contributes to your HealthHero score. Maintain streaks for bonus rewards, unlock health achievements, and get insights into your wellness patterns over time.',
    icon: Activity,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    benefits: [
      'Water intake tracking with reminders',
      'Sleep duration and quality logging',
      'Step counter integration',
      'Mood journal with patterns',
      'Health streaks and bonuses',
      'Weekly wellness reports',
      'Health achievements',
      'Goal setting for each metric'
    ],
    howItWorks: [
      { step: 1, title: 'Set Goals', description: 'Define your daily targets for water, sleep, steps, and mood.' },
      { step: 2, title: 'Log Daily', description: 'Quick-log your health metrics throughout the day.' },
      { step: 3, title: 'Build Streaks', description: 'Maintain consistency for streak bonuses and achievements.' },
      { step: 4, title: 'Track Progress', description: 'Review weekly reports and optimize your health habits.' }
    ],
    stats: { 'Metrics': '4', 'Achievements': '20+', 'Reports': 'Weekly' }
  },
  'inventory': {
    id: 'inventory',
    name: 'Inventory System',
    tagline: 'Collect & Manage Items',
    description: 'Earn, collect, and manage items, potions, power-ups, and special rewards.',
    longDescription: 'The Inventory System adds depth to your LifeVerse experience. Earn items through quest completions, achievements, and special events. Collect power-ups that boost your XP gains, potions that protect your streaks, and rare equipment that unlocks special abilities. Manage your inventory, craft new items from materials, and trade with other players.',
    icon: Package,
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    benefits: [
      '100+ unique items',
      '5 rarity levels',
      'Power-ups and boosters',
      'Streak protection potions',
      'Equipment system',
      'Item crafting',
      'Collection achievements',
      'Item trading'
    ],
    howItWorks: [
      { step: 1, title: 'Earn Items', description: 'Complete quests and achievements to earn item drops.' },
      { step: 2, title: 'Collect & Organize', description: 'Build your collection and manage your inventory space.' },
      { step: 3, title: 'Use Strategically', description: 'Deploy power-ups and items at the right moments.' },
      { step: 4, title: 'Craft & Trade', description: 'Combine materials to craft items or trade with players.' }
    ],
    stats: { 'Items': '100+', 'Rarities': '5', 'Crafting Recipes': '50+' }
  },
  'marketplace': {
    id: 'marketplace',
    name: 'Marketplace',
    tagline: 'Trade & Earn Coins',
    description: 'Buy, sell, and trade items with other players in the global marketplace.',
    longDescription: 'The Marketplace is your hub for trading with other players. List your extra items for sale, browse listings from other heroes, and find rare items you need. Use the auction system for valuable items, track price history, and snag limited-time deals. Turn your excess items into coins and find the perfect additions to your collection.',
    icon: ShoppingCart,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    benefits: [
      'Buy and sell items',
      'Player-to-player trading',
      'Auction system',
      'Price history tracking',
      'Search and filter',
      'Watchlist feature',
      'Limited edition sales',
      'Secure transactions'
    ],
    howItWorks: [
      { step: 1, title: 'List Items', description: 'Put your extra items up for sale with your asking price.' },
      { step: 2, title: 'Browse & Search', description: 'Find items you need using filters and search.' },
      { step: 3, title: 'Bid or Buy', description: 'Purchase directly or bid in auctions for rare items.' },
      { step: 4, title: 'Complete Trades', description: 'Secure transactions ensure safe item and coin exchange.' }
    ],
    stats: { 'Listing Types': '3', 'Fee': '5%', 'Trade Volume': 'Active' }
  },
  'mind-palace': {
    id: 'mind-palace',
    name: 'Mind Palace',
    tagline: 'Master Your Memory',
    description: 'Learn and practice memory techniques with interactive lessons and exercises.',
    longDescription: 'Mind Palace teaches you powerful memory techniques used by memory champions. Learn the Method of Loci, memory palace construction, mnemonic devices, and more through interactive lessons. Practice with exercises, track your improvement, and unlock advanced techniques as you progress. Perfect for students, professionals, or anyone wanting to boost their memory.',
    icon: BookOpen,
    color: 'text-violet-400',
    bgColor: 'bg-violet-400/10',
    benefits: [
      '10+ memory techniques',
      'Interactive lessons',
      'Practice exercises',
      'Progress tracking',
      'Difficulty progression',
      'Memory challenges',
      'Technique mastery badges',
      'Daily memory training'
    ],
    howItWorks: [
      { step: 1, title: 'Learn Techniques', description: 'Study memory techniques through interactive lessons.' },
      { step: 2, title: 'Practice Daily', description: 'Reinforce learning with daily practice exercises.' },
      { step: 3, title: 'Track Progress', description: 'Monitor your improvement and technique mastery.' },
      { step: 4, title: 'Master Your Mind', description: 'Unlock advanced techniques and achieve memory mastery.' }
    ],
    stats: { 'Techniques': '10+', 'Lessons': '50+', 'Exercises': '100+' }
  },
  'world-events': {
    id: 'world-events',
    name: 'World Events',
    tagline: 'Global Challenges Unite All',
    description: 'Participate in time-limited global events and challenges with exclusive rewards.',
    longDescription: 'World Events bring the entire LifeVerse community together for epic, time-limited challenges. Participate in seasonal events, global competitions, and special boss battles that require community-wide cooperation. Earn exclusive rewards, limited-edition items, and special achievements that are only available during events. Check in regularly to never miss these exciting opportunities!',
    icon: Globe,
    color: 'text-sky-400',
    bgColor: 'bg-sky-400/10',
    benefits: [
      'Limited-time events',
      'Global community challenges',
      'Exclusive event rewards',
      'Seasonal content',
      'Community boss battles',
      'Event leaderboards',
      'Limited-edition items',
      'Special achievements'
    ],
    howItWorks: [
      { step: 1, title: 'Check Events', description: 'Browse active and upcoming events in the events calendar.' },
      { step: 2, title: 'Participate', description: 'Complete event-specific tasks and challenges.' },
      { step: 3, title: 'Contribute', description: 'Your progress counts toward community goals.' },
      { step: 4, title: 'Claim Rewards', description: 'Earn exclusive rewards when events conclude.' }
    ],
    stats: { 'Events/Month': '2-4', 'Exclusive Items': 'Yes', 'Community Goals': 'Yes' }
  }
};

export default function FeatureDetailPage() {
  const params = useParams();
  const featureId = params.featureId as string;
  const { data: session, isPending } = useSession();
  
  const feature = featureData[featureId];
  
  if (!feature) {
    return (
      <>
        <PublicNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Feature Not Found</h1>
            <Link href="/features">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Features
              </Button>
            </Link>
          </Card>
        </div>
      </>
    );
  }

  const IconComponent = feature.icon;

  return (
    <>
      {!isPending && (session?.user ? <Navbar /> : <PublicNavbar />)}
      <div className="min-h-screen game-gradient particle-bg">
        <div className="container mx-auto px-4 py-12 relative z-10">
          <Link href="/features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Features</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Card className="game-card p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className={`p-6 rounded-2xl ${feature.bgColor} flex-shrink-0`}>
                  <IconComponent className={`h-16 w-16 ${feature.color}`} />
                </div>
                <div className="flex-1">
                  <Badge className={`mb-4 ${feature.bgColor} ${feature.color} border-none`}>
                    LifeVerse Feature
                  </Badge>
                  <h1 className={`text-4xl md:text-5xl font-minecraft mb-3 ${feature.color}`}>
                    {feature.name}
                  </h1>
                  <p className="text-xl text-primary font-bold mb-4">{feature.tagline}</p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.longDescription}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="game-card p-8 h-full">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  Key Benefits
                </h2>
                <div className="grid gap-3">
                  {feature.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-card/50"
                    >
                      <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${feature.color}`} />
                      <span>{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="game-card p-8 h-full">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Play className="h-6 w-6 text-green-400" />
                  How It Works
                </h2>
                <div className="space-y-6">
                  {feature.howItWorks.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className={`w-10 h-10 rounded-full ${feature.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <span className={`font-bold ${feature.color}`}>{step.step}</span>
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">{step.title}</h3>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Card className={`game-card p-8 ${feature.bgColor} border-2`} style={{ borderColor: `var(--${feature.color.replace('text-', '')})` }}>
              <h2 className="text-2xl font-bold mb-6 text-center">Quick Stats</h2>
              <div className="grid grid-cols-3 gap-8">
                {Object.entries(feature.stats).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                    className="text-center"
                  >
                    <div className={`text-3xl md:text-4xl font-bold ${feature.color} mb-2`}>
                      {value}
                    </div>
                    <div className="text-sm text-muted-foreground">{key}</div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="game-card p-12 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl font-bold mb-4">Ready to Try {feature.name}?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join LifeVerse today and start using {feature.name} along with all our other amazing features!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isPending && session?.user ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="pixel-button">
                      <Sparkles className="mr-2 h-5 w-5" />
                      <span className="font-minecraft text-sm">Go to Dashboard</span>
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <Button size="lg" className="pixel-button">
                        <Sword className="mr-2 h-5 w-5" />
                        <span className="font-minecraft text-sm">Start Free</span>
                      </Button>
                    </Link>
                    <Link href="/features">
                      <Button size="lg" variant="outline" className="border-primary/50">
                        <ChevronRight className="mr-2 h-5 w-5" />
                        <span className="font-minecraft text-sm">See All Features</span>
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
