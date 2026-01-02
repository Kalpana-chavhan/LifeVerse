import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Stats, Quest, Creature, Building, Achievement, Expense, HealthLog, Clan } from './types';

interface GameState {
  // User & Profile
  user: User;
  stats: Stats;
  
  // Quests
  quests: Quest[];
  completedQuestsToday: number;
  
  // Creatures
  creatures: Creature[];
  
  // City
  buildings: Building[];
  cityLevel: number;
  
  // Achievements
  achievements: Achievement[];
  
  // Finance
  expenses: Expense[];
  monthlyBudget: number;
  savingsGoal: number;
  
  // Health
  healthLogs: HealthLog[];
  todayHealth: HealthLog | null;
  
  // Clan
  clan: Clan | null;
  
  // Actions
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  completeQuest: (questId: string) => void;
  addQuest: (quest: Quest) => void;
  updateStats: (stat: keyof Stats, value: number) => void;
  feedCreature: (creatureId: string) => void;
  unlockBuilding: (buildingId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  addExpense: (expense: Expense) => void;
  updateHealthLog: (log: Partial<HealthLog>) => void;
  joinClan: (clan: Clan) => void;
  levelUpCity: () => void;
  unlockWorld: (worldId: string, cost: number) => void;
  setActiveWorld: (worldId: string) => void;
}

const calculateXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

const initialUser: User = {
  id: '1',
  name: 'Hero',
  email: 'hero@lifeverse.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hero',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  coins: 0,
  createdAt: new Date().toISOString(),
  unlockedWorlds: ['forest'],
  activeWorld: 'forest',
};

const initialStats: Stats = {
  health: 10,
  mind: 10,
  finance: 10,
  learning: 10,
};

const initialQuests: Quest[] = [
  {
    id: 'q1',
    title: 'Morning Meditation',
    description: 'Meditate for 10 minutes',
    category: 'daily',
    type: 'mental',
    xpReward: 50,
    coinReward: 10,
    completed: false,
    streak: 0,
  },
  {
    id: 'q2',
    title: 'Study Session',
    description: 'Complete a 25-minute study session',
    category: 'daily',
    type: 'study',
    xpReward: 75,
    coinReward: 15,
    completed: false,
    streak: 0,
  },
  {
    id: 'q3',
    title: 'Exercise Routine',
    description: 'Complete your workout routine',
    category: 'daily',
    type: 'fitness',
    xpReward: 100,
    coinReward: 20,
    completed: false,
    streak: 0,
  },
];

const initialCreatures: Creature[] = [
  {
    id: 'c1',
    name: 'FitBeast',
    type: 'fitness',
    level: 1,
    happiness: 75,
    evolution: 20,
    lastFed: new Date().toISOString(),
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=fitness',
  },
  {
    id: 'c2',
    name: 'WealthDragon',
    type: 'finance',
    level: 1,
    happiness: 60,
    evolution: 15,
    lastFed: new Date().toISOString(),
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=finance',
  },
  {
    id: 'c3',
    name: 'MindOwl',
    type: 'study',
    level: 1,
    happiness: 80,
    evolution: 25,
    lastFed: new Date().toISOString(),
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=study',
  },
  {
    id: 'c4',
    name: 'ZenSpirit',
    type: 'mental',
    level: 1,
    happiness: 70,
    evolution: 18,
    lastFed: new Date().toISOString(),
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=mental',
  },
  {
    id: 'c5',
    name: 'SocialButterfly',
    type: 'social',
    level: 1,
    happiness: 65,
    evolution: 12,
    lastFed: new Date().toISOString(),
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=social',
  },
];

const initialBuildings: Building[] = [
  { id: 'b1', name: 'Academy', type: 'academy', level: 0, unlocked: false, position: { x: 0, y: 0, z: 0 } },
  { id: 'b2', name: 'Gym', type: 'gym', level: 0, unlocked: false, position: { x: 5, y: 0, z: 0 } },
  { id: 'b3', name: 'Bank', type: 'bank', level: 0, unlocked: false, position: { x: -5, y: 0, z: 0 } },
  { id: 'b4', name: 'Zen Garden', type: 'garden', level: 0, unlocked: false, position: { x: 0, y: 0, z: 5 } },
  { id: 'b5', name: 'Temple', type: 'temple', level: 0, unlocked: false, position: { x: 0, y: 0, z: -5 } },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      user: initialUser,
      stats: initialStats,
      quests: initialQuests,
      completedQuestsToday: 0,
      creatures: initialCreatures,
      buildings: initialBuildings,
      cityLevel: 1,
      achievements: [],
      expenses: [],
      monthlyBudget: 2000,
      savingsGoal: 10000,
      healthLogs: [],
      todayHealth: null,
      clan: null,

      addXP: (amount) => set((state) => {
        const newXP = state.user.xp + amount;
        let newLevel = state.user.level;
        let xpToNextLevel = state.user.xpToNextLevel;
        let remainingXP = newXP;

        while (remainingXP >= xpToNextLevel) {
          remainingXP -= xpToNextLevel;
          newLevel += 1;
          xpToNextLevel = calculateXPForLevel(newLevel);
        }

        return {
          user: {
            ...state.user,
            xp: remainingXP,
            level: newLevel,
            xpToNextLevel,
          },
        };
      }),

      addCoins: (amount) => set((state) => ({
        user: { ...state.user, coins: state.user.coins + amount },
      })),

      completeQuest: (questId) => set((state) => {
        const quest = state.quests.find((q) => q.id === questId);
        if (!quest || quest.completed) return state;

        const updatedQuests = state.quests.map((q) =>
          q.id === questId ? { ...q, completed: true, streak: q.streak + 1 } : q
        );

        // Add XP and coins
        get().addXP(quest.xpReward);
        get().addCoins(quest.coinReward);

        // Update creature based on quest type
        const creatureType = quest.type === 'habit' ? 'mental' : quest.type;
        const creatures = state.creatures.map((c) =>
          c.type === creatureType
            ? { ...c, happiness: Math.min(100, c.happiness + 5), evolution: Math.min(100, c.evolution + 2) }
            : c
        );

        return {
          quests: updatedQuests,
          completedQuestsToday: state.completedQuestsToday + 1,
          creatures,
        };
      }),

      addQuest: (quest) => set((state) => ({
        quests: [...state.quests, quest],
      })),

      updateStats: (stat, value) => set((state) => ({
        stats: { ...state.stats, [stat]: Math.max(0, state.stats[stat] + value) },
      })),

      feedCreature: (creatureId) => set((state) => ({
        creatures: state.creatures.map((c) =>
          c.id === creatureId
            ? { ...c, happiness: Math.min(100, c.happiness + 10), lastFed: new Date().toISOString() }
            : c
        ),
      })),

      unlockBuilding: (buildingId) => set((state) => ({
        buildings: state.buildings.map((b) =>
          b.id === buildingId ? { ...b, unlocked: true, level: 1 } : b
        ),
      })),

      unlockAchievement: (achievementId) => set((state) => ({
        achievements: state.achievements.map((a) =>
          a.id === achievementId ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
        ),
      })),

      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, expense],
      })),

      updateHealthLog: (log) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const existingLog = state.healthLogs.find((l) => l.date === today);

        if (existingLog) {
          return {
            healthLogs: state.healthLogs.map((l) =>
              l.date === today ? { ...l, ...log } : l
            ),
            todayHealth: { ...existingLog, ...log },
          };
        } else {
          const newLog: HealthLog = {
            id: Date.now().toString(),
            date: today,
            water: 0,
            sleep: 0,
            steps: 0,
            mood: 'okay',
            exercise: false,
            ...log,
          };
          return {
            healthLogs: [...state.healthLogs, newLog],
            todayHealth: newLog,
          };
        }
      }),

      joinClan: (clan) => set({ clan }),

      levelUpCity: () => set((state) => ({
        cityLevel: state.cityLevel + 1,
      })),

      unlockWorld: (worldId, cost) => set((state) => ({
        user: {
          ...state.user,
          coins: state.user.coins - cost,
          unlockedWorlds: [...(state.user.unlockedWorlds || []), worldId],
        },
      })),

      setActiveWorld: (worldId) => set((state) => ({
        user: {
          ...state.user,
          activeWorld: worldId,
        },
      })),
    }),
    {
      name: 'lifeverse-storage',
    }
  )
);
