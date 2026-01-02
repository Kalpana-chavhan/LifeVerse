"use client";

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/lib/store';
import { Backpack, Zap, Clock, Heart, Sparkles, Shield } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  name: string;
  type: 'xp_boost' | 'time_boost' | 'mood_boost' | 'coin_multiplier' | 'shield';
  description: string;
  icon: string;
  quantity: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function InventoryPage() {
  const { user, addXP, addCoins } = useGameStore();
  
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 'item1',
      name: 'XP Potion',
      type: 'xp_boost',
      description: 'Instantly gain 100 XP',
      icon: '⚡',
      quantity: 3,
      rarity: 'common',
    },
    {
      id: 'item2',
      name: 'Time Turner',
      type: 'time_boost',
      description: 'Double quest rewards for 1 hour',
      icon: '⏰',
      quantity: 1,
      rarity: 'rare',
    },
    {
      id: 'item3',
      name: 'Happiness Elixir',
      type: 'mood_boost',
      description: 'Boost all creature happiness by 20%',
      icon: '💖',
      quantity: 2,
      rarity: 'epic',
    },
    {
      id: 'item4',
      name: 'Golden Coin',
      type: 'coin_multiplier',
      description: 'Earn 2x coins for 30 minutes',
      icon: '🪙',
      quantity: 1,
      rarity: 'legendary',
    },
    {
      id: 'item5',
      name: 'Protection Shield',
      type: 'shield',
      description: 'Prevent quest streak loss once',
      icon: '🛡️',
      quantity: 2,
      rarity: 'rare',
    },
  ]);

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

  const handleUseItem = (item: InventoryItem) => {
    if (item.quantity <= 0) return;

    switch (item.type) {
      case 'xp_boost':
        addXP(100);
        toast.success(`Used ${item.name}! +100 XP`);
        break;
      case 'time_boost':
        toast.success(`Used ${item.name}! Quest rewards doubled for 1 hour`);
        break;
      case 'mood_boost':
        toast.success(`Used ${item.name}! All creatures are happier!`);
        break;
      case 'coin_multiplier':
        toast.success(`Used ${item.name}! Coin earnings doubled for 30 minutes`);
        break;
      case 'shield':
        toast.success(`Used ${item.name}! Streak protection active`);
        break;
    }

    setInventory(inventory.map(i => 
      i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
    ));
  };

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Backpack className="h-10 w-10 text-orange-500" />
            Inventory
          </h1>
          <p className="text-muted-foreground text-lg">
            Use items to boost your progress and gain advantages
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Items</p>
                <p className="text-3xl font-bold">{totalItems}</p>
              </div>
              <Backpack className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Common</p>
                <p className="text-3xl font-bold">
                  {inventory.filter(i => i.rarity === 'common').reduce((sum, i) => sum + i.quantity, 0)}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rare+</p>
                <p className="text-3xl font-bold">
                  {inventory.filter(i => i.rarity !== 'common').reduce((sum, i) => sum + i.quantity, 0)}
                </p>
              </div>
              <Sparkles className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Legendary</p>
                <p className="text-3xl font-bold">
                  {inventory.filter(i => i.rarity === 'legendary').reduce((sum, i) => sum + i.quantity, 0)}
                </p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {inventory.map((item) => (
            <Card 
              key={item.id} 
              className={`p-6 hover:shadow-xl transition-all bg-gradient-to-br ${rarityColors[item.rarity]}`}
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <Badge variant="outline" className={`capitalize ${rarityBadgeColors[item.rarity]}`}>
                  {item.rarity}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground text-center mb-4">
                {item.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Quantity:</span>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {item.quantity}
                </Badge>
              </div>

              <Button
                onClick={() => handleUseItem(item)}
                disabled={item.quantity <= 0}
                className="w-full"
                size="lg"
              >
                {item.quantity > 0 ? 'Use Item' : 'Out of Stock'}
              </Button>
            </Card>
          ))}
        </div>

        {inventory.length === 0 && (
          <Card className="p-12 text-center">
            <Backpack className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-bold mb-2">Your Inventory is Empty</h3>
            <p className="text-muted-foreground mb-6">
              Complete quests and open chests to collect items
            </p>
          </Card>
        )}

        {/* How to Get Items */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
          <div className="flex items-start gap-4">
            <Sparkles className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-3">How to Get Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🎁</span>
                  <div>
                    <p className="font-semibold mb-1">Quest Rewards</p>
                    <p className="text-muted-foreground">Complete daily and weekly quests</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">🏆</span>
                  <div>
                    <p className="font-semibold mb-1">Achievements</p>
                    <p className="text-muted-foreground">Unlock special milestones</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">🛒</span>
                  <div>
                    <p className="font-semibold mb-1">Marketplace</p>
                    <p className="text-muted-foreground">Buy with coins</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">👾</span>
                  <div>
                    <p className="font-semibold mb-1">Boss Battles</p>
                    <p className="text-muted-foreground">Defeat bosses for rare drops</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
