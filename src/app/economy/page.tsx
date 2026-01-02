"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Hammer, Users, Coins, Sparkles, Zap, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function EconomyPage() {
  const [marketplaceItems, setMarketplaceItems] = useState<any[]>([]);
  const [craftingRecipes, setCraftingRecipes] = useState<any>({});
  const [inventory, setInventory] = useState<any[]>([]);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMarketplace();
    fetchRecipes();
    fetchInventory();
  }, []);

  const fetchMarketplace = async () => {
    try {
      const response = await fetch('/api/economy/marketplace');
      const data = await response.json();
      setMarketplaceItems(data.items || []);
    } catch (error) {
      console.error('Error fetching marketplace:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/economy/craft');
      const data = await response.json();
      setCraftingRecipes(data.recipes || {});
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/inventory');
      const data = await response.json();
      setInventory(data.inventory || []);
      setCoins(data.coins || 0);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const purchaseItem = async (itemId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/economy/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Purchased ${data.item.name}!`);
        setCoins(data.remainingCoins);
        fetchInventory();
      } else {
        toast.error(data.error || 'Purchase failed');
      }
    } catch (error) {
      toast.error('Error purchasing item');
    } finally {
      setLoading(false);
    }
  };

  const craftItem = async (recipeId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/economy/craft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Crafted ${data.item.name}!`);
        setCoins(data.remainingCoins);
        fetchInventory();
      } else {
        toast.error(data.error || 'Crafting failed');
      }
    } catch (error) {
      toast.error('Error crafting item');
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      rare: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      epic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      legendary: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[rarity] || colors.common;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Coins className="h-10 w-10 text-yellow-500" />
            In-App Economy
          </h1>
          <p className="text-muted-foreground text-lg">
            Trade, craft, and purchase items with your earned coins
          </p>
        </div>

        <Card className="p-6 mb-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coins className="h-12 w-12 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <p className="text-4xl font-bold">{coins} 🪙</p>
              </div>
            </div>
            <Badge className="text-lg px-4 py-2 bg-yellow-500/20 text-yellow-400">
              <Package className="h-5 w-5 mr-2" />
              {inventory.length} Items
            </Badge>
          </div>
        </Card>

        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="marketplace">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="crafting">
              <Hammer className="h-4 w-4 mr-2" />
              Crafting
            </TabsTrigger>
            <TabsTrigger value="trading">
              <Users className="h-4 w-4 mr-2" />
              Trading
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketplaceItems.map((item) => (
                <Card key={item.id} className="p-6 bg-gradient-to-br from-card to-muted/30">
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-3">{item.image}</div>
                    <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                    <Badge className={getRarityColor(item.rarity)}>
                      {item.rarity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    {item.description}
                  </p>
                  <Button
                    onClick={() => purchaseItem(item.id)}
                    disabled={loading || coins < item.price}
                    className="w-full"
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    Buy for {item.price} 🪙
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="crafting">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(craftingRecipes).map(([id, recipe]: [string, any]) => (
                <Card key={id} className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                  <div className="mb-4">
                    <Hammer className="h-12 w-12 text-purple-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-center mb-2">{recipe.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    {recipe.description}
                  </p>
                  <div className="mb-4 p-3 bg-black/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Required:</p>
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold">{recipe.ingredients.coins} coins</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => craftItem(id)}
                    disabled={loading || coins < recipe.ingredients.coins}
                    className="w-full"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Craft
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trading">
            <Card className="p-8 text-center bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <Users className="h-20 w-20 mx-auto mb-4 text-blue-500" />
              <h2 className="text-2xl font-bold mb-3">Clan Trading Coming Soon!</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Join a clan to unlock trading features. Trade rare items, boosts, 
                and cosmetics with your clan members!
              </p>
              <Badge variant="outline" className="text-sm px-4 py-2">
                Feature Available in Clans
              </Badge>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.length === 0 ? (
                <Card className="p-12 col-span-full text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-bold mb-2">Empty Inventory</h3>
                  <p className="text-muted-foreground">
                    Purchase items from the marketplace or craft them!
                  </p>
                </Card>
              ) : (
                inventory.map((item, index) => (
                  <Card key={index} className="p-6 bg-gradient-to-br from-card to-muted/30">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">
                        {item.type === 'boost' ? <Zap className="h-12 w-12 mx-auto text-yellow-500" /> : 
                         item.type === 'cosmetic' ? <Sparkles className="h-12 w-12 mx-auto text-purple-500" /> : 
                         <Package className="h-12 w-12 mx-auto text-blue-500" />}
                      </div>
                      <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                      <Badge className={getRarityColor(item.rarity || 'common')}>
                        {(item.rarity || 'common').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mb-3">
                      {item.description}
                    </p>
                    {item.power && (
                      <div className="text-xs text-center text-green-400">
                        Power: {item.power}x
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
