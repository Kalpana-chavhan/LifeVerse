// Core Types for LifeVerse

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  createdAt: string;
  unlockedWorlds?: string[];
  activeWorld?: string;
}

export interface Stats {
  health: number;
  mind: number;
  finance: number;
  learning: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'challenge';
  type: 'habit' | 'study' | 'fitness' | 'finance' | 'social' | 'mental';
  xpReward: number;
  coinReward: number;
  completed: boolean;
  streak: number;
  dueDate?: string;
  progress?: number;
  maxProgress?: number;
}

export interface Creature {
  id: string;
  name: string;
  type: 'fitness' | 'finance' | 'study' | 'mental' | 'social';
  level: number;
  happiness: number;
  evolution: number; // 0-100, determines evolution stage
  lastFed: string;
  image: string;
}

export interface Building {
  id: string;
  name: string;
  type: 'academy' | 'gym' | 'bank' | 'garden' | 'temple' | 'hall';
  level: number;
  unlocked: boolean;
  position: { x: number; y: number; z: number };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

export interface HealthLog {
  id: string;
  date: string;
  water: number; // glasses
  sleep: number; // hours
  steps: number;
  mood: 'great' | 'good' | 'okay' | 'bad';
  exercise: boolean;
}

export interface Clan {
  id: string;
  name: string;
  members: number;
  level: number;
  xp: number;
  leaderboard: number;
}
