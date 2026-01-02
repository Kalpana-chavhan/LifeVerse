"use client";

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Friend {
  id: string;
  friendId: string;
  friendName: string;
  friendEmail: string;
  friendImage: string | null;
  status: string;
}

interface Message {
  _id: string;
  senderId: string;
  recipientId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function ChatPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchFriends();
    }
  }, [session]);

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages(selectedFriend.friendId);
      markAsRead(selectedFriend.friendId);
    }
  }, [selectedFriend]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch('/api/friends?status=accepted', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (friendId: string) => {
    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch(`/api/chat?friendId=${friendId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const markAsRead = async (friendId: string) => {
    try {
      const token = localStorage.getItem('bearer_token');
      await fetch('/api/chat', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ friendId })
      });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;

    setSending(true);
    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: selectedFriend.friendId,
          message: newMessage.trim()
        })
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages([...messages, sentMessage]);
        setNewMessage('');
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <MessageCircle className="h-10 w-10 text-primary" />
            Chat
          </h1>
          <p className="text-muted-foreground text-lg">
            Message your friends in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Friends List */}
          <Card className="lg:col-span-1 p-4">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Friends ({friends.length})
            </h3>

            {friends.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No friends yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => router.push('/profile')}
                >
                  Add Friends
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {friends.map((friend) => (
                  <motion.div
                    key={friend.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={selectedFriend?.id === friend.id ? 'default' : 'ghost'}
                      className="w-full justify-start gap-3 h-auto py-3"
                      onClick={() => setSelectedFriend(friend)}
                    >
                      <Avatar className="h-10 w-10">
                        <img
                          src={friend.friendImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.friendName}`}
                          alt={friend.friendName}
                        />
                      </Avatar>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-sm">{friend.friendName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {friend.friendEmail}
                        </p>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-3 flex flex-col h-[600px]">
            {selectedFriend ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <img
                      src={selectedFriend.friendImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedFriend.friendName}`}
                      alt={selectedFriend.friendName}
                    />
                  </Avatar>
                  <div>
                    <h3 className="font-bold">{selectedFriend.friendName}</h3>
                    <p className="text-sm text-muted-foreground">{selectedFriend.friendEmail}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => {
                      const isMe = message.senderId === session?.user?.id;
                      return (
                        <motion.div
                          key={message._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              isMe
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    disabled={sending}
                  />
                  <Button onClick={sendMessage} disabled={sending || !newMessage.trim()}>
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold mb-2">No conversation selected</p>
                  <p className="text-sm">Choose a friend to start chatting</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
