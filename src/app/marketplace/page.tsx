"use client";

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameStore } from '@/lib/store';
import { Store, Sparkles, Zap, Palette, Crown, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'items' | 'themes' | 'avatars' | 'badges';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function MarketplacePage() {
  const { user, addCoins } = useGameStore();

  const items: MarketplaceItem[] = [
    {
      id: 'i1',
      name: 'XP Potion',
      description: 'Instantly gain 100 XP',
      price: 50,
      category: 'items',
      icon: '⚡',
      rarity: 'common',
    },
    {
      id: 'i2',
      name: 'Time Turner',
      description: 'Double quest rewards for 1 hour',
      price: 150,
      category: 'items',
      icon: '⏰',
      rarity: 'rare',
    },
    {
      id: 'i3',
      name: 'Happiness Elixir',
      description: 'Boost all creature happiness by 20%',
      price: 300,
      category: 'items',
      icon: '💖',
      rarity: 'epic',
    },
    {
      id: 'i4',
      name: 'Golden Multiplier',
      description: 'Earn 2x coins for 30 minutes',
      price: 500,
      category: 'items',
      icon: '🪙',
      rarity: 'legendary',
    },
  ];

  const themes: MarketplaceItem[] = [
    {
      id: 't1',
      name: 'Ocean Breeze',
      description: 'Cool blue theme with wave animations',
      price: 200,
      category: 'themes',
      icon: '🌊',
      rarity: 'common',
    },
    {
      id: 't2',
      name: 'Forest Guardian',
      description: 'Nature-inspired green theme',
      price: 300,
      category: 'themes',
      icon: '🌲',
      rarity: 'rare',
    },
    {
      id: 't3',
      name: 'Cyberpunk Neon',
      description: 'Futuristic neon glow theme',
      price: 500,
      category: 'themes',
      icon: '🌃',
      rarity: 'epic',
    },
    {
      id: 't4',
      name: 'Galaxy Dreams',
      description: 'Cosmic purple space theme',
      price: 750,
      category: 'themes',
      icon: '🌌',
      rarity: 'legendary',
    },
  ];

  const avatars: MarketplaceItem[] = [
    {
      id: 'a1',
      name: 'Knight Avatar',
      description: 'Valiant warrior avatar',
      price: 250,
      category: 'avatars',
      icon: '⚔️',
      rarity: 'common',
    },
    {
      id: 'a2',
      name: 'Wizard Avatar',
      description: 'Mystical mage avatar',
      price: 350,
      category: 'avatars',
      icon: '🧙',
      rarity: 'rare',
    },
    {
      id: 'a3',
      name: 'Dragon Avatar',
      description: 'Legendary dragon avatar',
      price: 600,
      category: 'avatars',
      icon: '🐉',
      rarity: 'epic',
    },
    {
      id: 'a4',
      name: 'Phoenix Avatar',
      description: 'Mythical phoenix avatar',
      price: 1000,
      category: 'avatars',
      icon: '🔥',
      rarity: 'legendary',
    },
  ];

  const badges: MarketplaceItem[] = [
    {
      id: 'b1',
      name: 'Star Badge',
      description: 'Bronze achievement badge',
      price: 100,
      category: 'badges',
      icon: '⭐',
      rarity: 'common',
    },
    {
      id: 'b2',
      name: 'Crown Badge',
      description: 'Silver leadership badge',
      price: 250,
      category: 'badges',
      icon: '👑',
      rarity: 'rare',
    },
    {
      id: 'b3',
      name: 'Diamond Badge',
      description: 'Gold excellence badge',
      price: 500,
      category: 'badges',
      icon: '💎',
      rarity: 'epic',
    },
    {
      id: 'b4',
      name: 'Legend Badge',
      description: 'Platinum legend badge',
      price: 1000,
      category: 'badges',
      icon: '🏆',
      rarity: 'legendary',
    },
  ];

  const rarityColors = {
    common: 'from-gray-500/20 to-gray-600/20 border-gray-500/30',
    rare: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    epic: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    legendary: 'from-yellow-500/20 to-orange-600/20 border-yellow-500/30',
  };

  const rarityBadgeColors = {
    common: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    rare: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    epic: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    legendary: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  };

  const handlePurchase = (item: MarketplaceItem) => {
    if (user.coins >= item.price) {
      addCoins(-item.price);
      toast.success(`Purchased ${item.name}!`);
    } else {
      toast.error(`Not enough coins! Need ${item.price - user.coins} more.`);
    }
  };

  const ItemCard = ({ item }: { item: MarketplaceItem }) => (
    <Card className={`p-6 hover:shadow-xl transition-all bg-gradient-to-br ${rarityColors[item.rarity]}`}>
      <div className="text-center mb-4">
        <div className="text-5xl mb-3">{item.icon}</div>
        <h3 className="text-lg font-bold mb-2">{item.name}</h3>
        <Badge variant="outline" className={`capitalize text-xs ${rarityBadgeColors[item.rarity]}`}>
          {item.rarity}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground text-center mb-4 min-h-[40px]">
        {item.description}
      </p>

      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-2xl">🪙</span>
        <span className="text-2xl font-bold">{item.price}</span>
      </div>

      <Button
        onClick={() => handlePurchase(item)}
        disabled={user.coins < item.price}
        className="w-full"
        size="lg"
      >
        {user.coins >= item.price ? 'Purchase' : 'Not Enough Coins'}
      </Button>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Store className="h-10 w-10 text-green-500" />
            Marketplace
          </h1>
          <p className="text-muted-foreground text-lg">
            Spend your coins on items, themes, avatars, and badges
          </p>
        </div>

        {/* Balance */}
        <Card className="mb-8 p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl">🪙</span>
                <span className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{user.coins}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-2">Earn more coins by:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>• Completing quests</p>
                <p>• Study sessions</p>
                <p>• Tracking expenses</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Marketplace Tabs */}
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 h-auto">
            <TabsTrigger value="items" className="gap-2">
              <Zap className="h-4 w-4" />
              Items
            </TabsTrigger>
            <TabsTrigger value="themes" className="gap-2">
              <Palette className="h-4 w-4" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="avatars" className="gap-2">
              <Shield className="h-4 w-4" />
              Avatars
            </TabsTrigger>
            <TabsTrigger value="badges" className="gap-2">
              <Crown className="h-4 w-4" />
              Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map(item => <ItemCard key={item.id} item={item} />)}
            </div>
          </TabsContent>

          <TabsContent value="themes">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {themes.map(item => <ItemCard key={item.id} item={item} />)}
            </div>
          </TabsContent>

          <TabsContent value="avatars">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {avatars.map(item => <ItemCard key={item.id} item={item} />)}
            </div>
          </TabsContent>

          <TabsContent value="badges">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {badges.map(item => <ItemCard key={item.id} item={item} />)}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
          <div className="flex items-start gap-4">
            <Sparkles className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">About the Marketplace</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Purchase items to boost your progress and customize your experience</li>
                <li>• Rarity levels: Common, Rare, Epic, Legendary</li>
                <li>• New items are added regularly based on events and seasons</li>
                <li>• Some items are limited edition and won't be available forever</li>
                <li>• Items purchased here go directly to your inventory</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
