"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGameStore } from '@/lib/store';
import { 
  Home, 
  Target, 
  Building2, 
  Dumbbell, 
  DollarSign, 
  Brain, 
  Users, 
  Trophy,
  Backpack,
  Store,
  Globe,
  BookOpen,
  MessageCircle,
  Gamepad2
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  // Kalpana: Using Zustand store for global user state
  const { user } = useGameStore();

  // Kalpana: All the main navigation items in one place
  // TODO: Maybe add a notification badge system later
    const navItems = [
      { href: '/dashboard', label: 'Dashboard', icon: Home },
      { href: '/quests', label: 'Quests', icon: Target },
      { href: '/creatures', label: 'Creatures', icon: Dumbbell },
      { href: '/city', label: 'City', icon: Building2 },
      { href: '/study', label: 'Study', icon: Brain },
      { href: '/finance', label: 'Finance', icon: DollarSign },
      { href: '/mind-palace', label: 'Mind Palace', icon: BookOpen },
      { href: '/clan', label: 'Clan', icon: Users },
      { href: '/games', label: 'Games', icon: Gamepad2 },
      { href: '/chat', label: 'Chat', icon: MessageCircle },
      { href: '/inventory', label: 'Inventory', icon: Backpack },
      { href: '/marketplace', label: 'Shop', icon: Store },
      { href: '/economy', label: 'Economy', icon: Store },
      { href: '/portals', label: 'Portals', icon: Globe },
      { href: '/quest-generator', label: 'AI Quests', icon: Trophy },
      { href: '/events', label: 'Events', icon: Globe },
    ];

  return (
    <nav className="border-b border-primary/30 bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2 transition-transform hover:scale-105">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-minecraft bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
              LifeVerse
            </span>
          </Link>

          {/* Kalpana: Navigation links - hidden on mobile to save space */}
          <div className="hidden md:flex items-center space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={`flex items-center gap-1 transition-all ${
                      isActive ? 'pixel-button' : 'hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden xl:inline text-xs">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User info and profile */}
          <div className="flex items-center gap-4">
            {/* Coin display - my favorite part! */}
            <div className="hidden sm:flex items-center gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/30 shadow-md shadow-yellow-500/20">
              <Trophy className="h-4 w-4 text-yellow-400 coin-glow" />
              <span className="font-bold text-yellow-400">
                {user.coins}
              </span>
            </div>
            <Link href="/profile" className="transition-transform hover:scale-105">
              <Avatar className="h-10 w-10 border-2 border-primary cursor-pointer shadow-lg shadow-primary/30">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">{user.name[0]}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}