"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, Trophy, Coins, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/lib/store";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface GameLayoutProps {
  children: ReactNode;
}

export const GameLayout = ({ children }: GameLayoutProps) => {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const { profile, setProfile } = useGameStore();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return;

      try {
        const token = localStorage.getItem("bearer_token");
        const response = await fetch(`/api/profile?userId=${session.user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          // Create profile if it doesn't exist
          const createResponse = await fetch("/api/profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: session.user.id }),
          });

          if (createResponse.ok) {
            const newProfile = await createResponse.json();
            setProfile(newProfile);
          }
        } else if (response.ok) {
          const profileData = await response.json();
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [session?.user?.id, setProfile]);

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const xpForNextLevel = (profile?.level || 1) * 1000;
  const xpProgress = profile ? (profile.xp / xpForNextLevel) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                LifeVerse
              </span>
            </Link>

            {/* User Stats */}
            <div className="flex items-center gap-4">
              {/* Level */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Lv {profile?.level || 1}</span>
              </div>

              {/* Coins */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                <Coins className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-semibold">{profile?.coins || 0}</span>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium hidden md:block">{session.user.name}</span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>XP: {profile?.xp || 0} / {xpForNextLevel}</span>
              <span>Next Level: {(profile?.level || 1) + 1}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
