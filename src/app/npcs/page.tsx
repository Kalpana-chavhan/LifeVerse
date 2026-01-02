"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Lock, MessageCircle, Coins, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const colorMap: any = {
  purple: 'from-purple-500 to-indigo-500',
  red: 'from-red-500 to-orange-500',
  green: 'from-green-500 to-emerald-500',
  pink: 'from-pink-500 to-rose-500',
  blue: 'from-blue-500 to-cyan-500',
};

export default function NPCsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNPC, setSelectedNPC] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchNPCs();
  }, []);

  const fetchNPCs = async () => {
    try {
      const res = await fetch('/api/npcs');
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch NPCs:', error);
      toast.error('Failed to load NPCs');
    } finally {
      setLoading(false);
    }
  };

  const unlockNPC = async (npcId: string) => {
    try {
      const res = await fetch('/api/npcs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ npcId, action: 'unlock' }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        fetchNPCs();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Failed to unlock NPC:', error);
      toast.error('Failed to unlock NPC');
    }
  };

  const sendMessage = async () => {
    if (!chatMessage.trim() || !selectedNPC) return;

    const userMessage = chatMessage;
    setChatMessage('');
    setChatLoading(true);

    setChatHistory((prev) => [...prev, { role: 'user', content: userMessage }]);

    try {
      const res = await fetch('/api/npcs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ npcId: selectedNPC.id, message: userMessage, action: 'chat' }),
      });

      const result = await res.json();

      if (res.ok) {
        setChatHistory((prev) => [...prev, { role: 'npc', content: result.response, mockData: result.mockData }]);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setChatLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-20 px-4 flex items-center justify-center game-gradient">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading NPCs...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 px-4 game-gradient">
        <div className="max-w-7xl mx-auto pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Users className="h-16 w-16 mx-auto mb-4 text-primary float-animation" />
            <h1 className="text-5xl font-minecraft mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              NPC Characters
            </h1>
            <p className="text-xl text-muted-foreground">
              Meet your AI-powered life coaches and companions!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-minecraft mb-6">Available NPCs</h2>
              <div className="space-y-4">
                {data.npcs.map((npc: any, index: number) => {
                  const isUnlocked = data.unlockedNPCs.includes(npc.id);
                  const relationship = data.relationships[npc.id];

                  return (
                    <motion.div
                      key={npc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <Card
                        className={`p-6 cursor-pointer transition-all ${
                          selectedNPC?.id === npc.id
                            ? `bg-gradient-to-br ${colorMap[npc.color]}/20 border-${npc.color}-500/50`
                            : 'game-card'
                        }`}
                        onClick={() => isUnlocked && setSelectedNPC(npc)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`text-5xl p-3 rounded-lg bg-gradient-to-br ${colorMap[npc.color]}/20`}>
                            {npc.appearance}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-minecraft">{npc.name}</h3>
                              {isUnlocked ? (
                                <MessageCircle className="h-5 w-5 text-green-400" />
                              ) : (
                                <Lock className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{npc.role}</p>
                            <p className="text-xs text-muted-foreground mb-3">{npc.specialty}</p>

                            {relationship && (
                              <div className="text-xs text-primary">
                                Relationship Level: {relationship.level}
                              </div>
                            )}

                            {!isUnlocked && (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  unlockNPC(npc.id);
                                }}
                                className="w-full mt-3 pixel-button"
                                size="sm"
                              >
                                <Coins className="mr-2 h-4 w-4 coin-glow text-yellow-400" />
                                Unlock (200 coins)
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div>
              {selectedNPC ? (
                <Card className={`game-card p-6 h-[600px] flex flex-col bg-gradient-to-br ${colorMap[selectedNPC.color]}/10`}>
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
                    <div className="text-4xl">{selectedNPC.appearance}</div>
                    <div>
                      <h2 className="text-2xl font-minecraft">{selectedNPC.name}</h2>
                      <p className="text-sm text-muted-foreground">{selectedNPC.role}</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                    {chatHistory.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Start a conversation with {selectedNPC.name}!</p>
                      </div>
                    )}

                    {chatHistory.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-primary/20 border border-primary/30'
                              : `bg-gradient-to-br ${colorMap[selectedNPC.color]}/20 border border-${selectedNPC.color}-500/30`
                          }`}
                        >
                          {msg.mockData && (
                            <div className="text-xs text-yellow-400 mb-1">
                              ⚠️ AI disabled - add OPENAI_API_KEY
                            </div>
                          )}
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}

                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorMap[selectedNPC.color]}/20`}>
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder={`Chat with ${selectedNPC.name}...`}
                      disabled={chatLoading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={chatLoading || !chatMessage.trim()}
                      className="pixel-button"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="game-card p-12 h-[600px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Select an unlocked NPC to start chatting</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
