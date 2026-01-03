"use client";

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  User, 
  Edit, 
  Trophy, 
  Target, 
  Heart, 
  Brain, 
  DollarSign, 
  BookOpen,
  Users,
  UserPlus,
  Check,
  X,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface ProfileData {
  id: number;
  userId: string;
  level: number;
  xp: number;
  coins: number;
  healthSkill: number;
  mindSkill: number;
  financeSkill: number;
  learningSkill: number;
  bio: string | null;
  status: string | null;
  avatarUrl: string | null;
  username: string | null;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
}

interface Friend {
  id: number;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  friendName: string;
  friendEmail: string;
  friendImage: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    username: '',
    status: '',
    bio: '',
    avatarUrl: ''
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (searchParams.get('edit') === 'true' && profile) {
      setIsEditOpen(true);
    }
  }, [searchParams, profile]);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
      fetchFriends();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const res = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditForm({
          username: data.username || '',
          status: data.status || '',
          bio: data.bio || '',
          avatarUrl: data.avatarUrl || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const res = await fetch('/api/friends', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (res.ok) {
        toast.success('Profile updated successfully! ✨');
        setIsEditOpen(false);
        fetchProfile();
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleFriendAction = async (friendshipId: number, action: 'accept' | 'reject' | 'remove') => {
    try {
      const token = localStorage.getItem("bearer_token");
      
      if (action === 'remove') {
        const res = await fetch(`/api/friends/${friendshipId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          toast.success('Friend removed');
          fetchFriends();
        }
      } else {
        const res = await fetch(`/api/friends/${friendshipId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            status: action === 'accept' ? 'accepted' : 'blocked' 
          })
        });
        
        if (res.ok) {
          toast.success(action === 'accept' ? 'Friend request accepted! 🎉' : 'Friend request rejected');
          fetchFriends();
        }
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  if (isLoading || isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !session?.user) return null;

  const xpToNextLevel = profile.level * 1000;
  const xpProgress = (profile.xp / xpToNextLevel) * 100;
  
  const acceptedFriends = friends.filter(f => f.status === 'accepted');
  const pendingRequests = friends.filter(f => f.status === 'pending' && f.friendId === session.user.id);
  const sentRequests = friends.filter(f => f.status === 'pending' && f.userId === session.user.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <Card className="p-8 mb-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-32 w-32 border-4 border-primary">
                <AvatarImage src={profile.avatarUrl || profile.userImage || ''} alt={profile.username || profile.userName} />
                <AvatarFallback className="text-4xl">{(profile.username || profile.userName)[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{profile.username || profile.userName}</h1>
                  <Badge variant="outline" className="gap-1 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                    <Trophy className="h-3 w-3" />
                    Level {profile.level}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  {profile.status || 'Ready for adventure!'}
                </p>

                {profile.bio && (
                  <p className="text-sm mb-4 max-w-2xl">{profile.bio}</p>
                )}

                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🪙</span>
                    <span className="font-bold text-yellow-600">{profile.coins}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">{acceptedFriends.length} Friends</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">XP Progress</span>
                    <span className="font-semibold">{profile.xp} / {xpToNextLevel} XP</span>
                  </div>
                  <Progress value={xpProgress} className="h-3" />
                </div>

                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Username</label>
                        <Input 
                          placeholder="Your display name"
                          value={editForm.username}
                          onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Status</label>
                        <Input 
                          placeholder="Your status tagline"
                          value={editForm.status}
                          onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Bio</label>
                        <Textarea 
                          placeholder="Tell us about yourself..."
                          value={editForm.bio}
                          onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Avatar URL</label>
                        <Input 
                          placeholder="https://example.com/avatar.jpg"
                          value={editForm.avatarUrl}
                          onChange={(e) => setEditForm({...editForm, avatarUrl: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleUpdateProfile} className="w-full">
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Skills Progress */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold mb-4">📊 Skill Progress</h2>
              
              <Card className="p-6 bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="h-6 w-6 text-red-500" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Health</span>
                      <span className="text-sm">{profile.healthSkill} points</span>
                    </div>
                    <Progress value={(profile.healthSkill / 100) * 100} className="h-2" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="h-6 w-6 text-blue-500" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Mind</span>
                      <span className="text-sm">{profile.mindSkill} points</span>
                    </div>
                    <Progress value={(profile.mindSkill / 100) * 100} className="h-2" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="h-6 w-6 text-green-500" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Finance</span>
                      <span className="text-sm">{profile.financeSkill} points</span>
                    </div>
                    <Progress value={(profile.financeSkill / 100) * 100} className="h-2" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="h-6 w-6 text-purple-500" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Learning</span>
                      <span className="text-sm">{profile.learningSkill} points</span>
                    </div>
                    <Progress value={(profile.learningSkill / 100) * 100} className="h-2" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Friends List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">👥 Friends</h2>

              {/* Pending Requests */}
              {pendingRequests.length > 0 && (
                <Card className="p-4 bg-yellow-500/5 border-yellow-500/20">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Friend Requests ({pendingRequests.length})
                  </h3>
                  <div className="space-y-2">
                    {pendingRequests.map(friend => (
                      <div key={friend.id} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={friend.friendImage || ''} alt={friend.friendName} />
                          <AvatarFallback className="text-xs">{friend.friendName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm flex-1">{friend.friendName}</span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 w-7 p-0"
                          onClick={() => handleFriendAction(friend.id, 'accept')}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 w-7 p-0"
                          onClick={() => handleFriendAction(friend.id, 'reject')}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Friends List */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">
                  Friends ({acceptedFriends.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {acceptedFriends.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No friends yet. Start adding friends to join your adventure!
                    </p>
                  ) : (
                    acceptedFriends.map(friend => (
                      <div key={friend.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={friend.friendImage || ''} alt={friend.friendName} />
                          <AvatarFallback>{friend.friendName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{friend.friendName}</p>
                          <p className="text-xs text-muted-foreground">{friend.friendEmail}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 w-7 p-0"
                          onClick={() => handleFriendAction(friend.id, 'remove')}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Sent Requests */}
              {sentRequests.length > 0 && (
                <Card className="p-4 bg-blue-500/5 border-blue-500/20">
                  <h3 className="font-semibold mb-3 text-sm">
                    Sent Requests ({sentRequests.length})
                  </h3>
                  <div className="space-y-2">
                    {sentRequests.map(friend => (
                      <div key={friend.id} className="flex items-center gap-2 text-sm">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={friend.friendImage || ''} alt={friend.friendName} />
                          <AvatarFallback className="text-xs">{friend.friendName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="flex-1 text-xs">{friend.friendName}</span>
                        <span className="text-xs text-muted-foreground">Pending</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
