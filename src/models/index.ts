import mongoose, { Schema, Document, Model } from 'mongoose';


export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  image: String,
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);



export interface ISession extends Document {
  expiresAt: Date;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>({
  expiresAt: { type: Date, required: true },
  token: { type: String, required: true, unique: true },
  ipAddress: String,
  userAgent: String,
  userId: { type: String, required: true, ref: 'User' },
}, { timestamps: true });

export const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);



export interface IAccount extends Document {
  accountId: string;
  providerId: string;
  userId: string;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>({
  accountId: { type: String, required: true },
  providerId: { type: String, required: true },
  userId: { type: String, required: true, ref: 'User' },
  accessToken: String,
  refreshToken: String,
  idToken: String,
  accessTokenExpiresAt: Date,
  refreshTokenExpiresAt: Date,
  scope: String,
  password: String,
}, { timestamps: true });

export const Account: Model<IAccount> = mongoose.models.Account || mongoose.model<IAccount>('Account', accountSchema);



export interface IUserProfile extends Document {
  userId: string;
  level: number;
  xp: number;
  coins: number;
  healthSkill: number;
  mindSkill: number;
  financeSkill: number;
  learningSkill: number;
  bio?: string;
  status: string;
  avatarUrl?: string;
  username?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>({
  userId: { type: String, required: true, unique: true, ref: 'User' },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  healthSkill: { type: Number, default: 0 },
  mindSkill: { type: Number, default: 0 },
  financeSkill: { type: Number, default: 0 },
  learningSkill: { type: Number, default: 0 },
  bio: String,
  status: { type: String, default: 'Ready for adventure!' },
  avatarUrl: String,
  username: String,
}, { timestamps: true });

export const UserProfile: Model<IUserProfile> = mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', userProfileSchema);


export interface IQuest extends Document {
  userId: string;
  title: string;
  description?: string;
  type: 'daily' | 'weekly' | 'challenge';
  category: 'health' | 'mind' | 'finance' | 'learning' | 'social';
  xpReward: number;
  coinReward: number;
  status: 'active' | 'completed' | 'failed';
  streakCount: number;
  completedAt?: Date;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const questSchema = new Schema<IQuest>({
  userId: { type: String, required: true, ref: 'User' },
  title: { type: String, required: true },
  description: String,
  type: { type: String, required: true, enum: ['daily', 'weekly', 'challenge'] },
  category: { type: String, required: true, enum: ['health', 'mind', 'finance', 'learning', 'social'] },
  xpReward: { type: Number, required: true },
  coinReward: { type: Number, required: true },
  status: { type: String, default: 'active', enum: ['active', 'completed', 'failed'] },
  streakCount: { type: Number, default: 0 },
  completedAt: Date,
  dueDate: { type: Date, required: true },
}, { timestamps: true });

export const Quest: Model<IQuest> = mongoose.models.Quest || mongoose.model<IQuest>('Quest', questSchema);



export interface ICreature extends Document {
  userId: string;
  type: 'fitness' | 'finance' | 'study' | 'mental' | 'social';
  name: string;
  level: number;
  happiness: number;
  evolutionStage: number;
  lastFedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const creatureSchema = new Schema<ICreature>({
  userId: { type: String, required: true, ref: 'User' },
  type: { type: String, required: true, enum: ['fitness', 'finance', 'study', 'mental', 'social'] },
  name: { type: String, required: true },
  level: { type: Number, default: 1 },
  happiness: { type: Number, default: 50 },
  evolutionStage: { type: Number, default: 1 },
  lastFedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Creature: Model<ICreature> = mongoose.models.Creature || mongoose.model<ICreature>('Creature', creatureSchema);



export interface IExpense extends Document {
  userId: string;
  amount: number;
  category: string;
  description?: string;
  expenseDate: Date;
  xpEarned: number;
  createdAt: Date;
}

const expenseSchema = new Schema<IExpense>({
  userId: { type: String, required: true, ref: 'User' },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: String,
  expenseDate: { type: Date, required: true },
  xpEarned: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', expenseSchema);

// ==================== Savings Goal Model ====================

export interface ISavingsGoal extends Document {
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  status: 'active' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const savingsGoalSchema = new Schema<ISavingsGoal>({
  userId: { type: String, required: true, ref: 'User' },
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  status: { type: String, default: 'active', enum: ['active', 'completed', 'failed'] },
}, { timestamps: true });

export const SavingsGoal: Model<ISavingsGoal> = mongoose.models.SavingsGoal || mongoose.model<ISavingsGoal>('SavingsGoal', savingsGoalSchema);



export interface IHealthLog extends Document {
  userId: string;
  date: Date;
  waterIntake: number;
  steps: number;
  sleepHours: number;
  mood?: string;
  createdAt: Date;
  updatedAt: Date;
}

const healthLogSchema = new Schema<IHealthLog>({
  userId: { type: String, required: true, ref: 'User' },
  date: { type: Date, required: true },
  waterIntake: { type: Number, default: 0 },
  steps: { type: Number, default: 0 },
  sleepHours: { type: Number, default: 0 },
  mood: String,
}, { timestamps: true });

export const HealthLog: Model<IHealthLog> = mongoose.models.HealthLog || mongoose.model<IHealthLog>('HealthLog', healthLogSchema);



export interface IStudySession extends Document {
  userId: string;
  durationMinutes: number;
  focusScore: number;
  xpEarned: number;
  bossDefeated: boolean;
  sessionDate: Date;
  createdAt: Date;
}

const studySessionSchema = new Schema<IStudySession>({
  userId: { type: String, required: true, ref: 'User' },
  durationMinutes: { type: Number, required: true },
  focusScore: { type: Number, required: true },
  xpEarned: { type: Number, required: true },
  bossDefeated: { type: Boolean, default: false },
  sessionDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const StudySession: Model<IStudySession> = mongoose.models.StudySession || mongoose.model<IStudySession>('StudySession', studySessionSchema);



export interface IClan extends Document {
  name: string;
  description?: string;
  leaderId: string;
  totalXp: number;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const clanSchema = new Schema<IClan>({
  name: { type: String, required: true, unique: true },
  description: String,
  leaderId: { type: String, required: true, ref: 'User' },
  totalXp: { type: Number, default: 0 },
  memberCount: { type: Number, default: 1 },
}, { timestamps: true });

export const Clan: Model<IClan> = mongoose.models.Clan || mongoose.model<IClan>('Clan', clanSchema);



export interface IClanMember extends Document {
  clanId: string;
  userId: string;
  role: 'leader' | 'member';
  joinedAt: Date;
  contributionXp: number;
}

const clanMemberSchema = new Schema<IClanMember>({
  clanId: { type: String, required: true, ref: 'Clan' },
  userId: { type: String, required: true, ref: 'User' },
  role: { type: String, default: 'member', enum: ['leader', 'member'] },
  joinedAt: { type: Date, default: Date.now },
  contributionXp: { type: Number, default: 0 },
});

export const ClanMember: Model<IClanMember> = mongoose.models.ClanMember || mongoose.model<IClanMember>('ClanMember', clanMemberSchema);



export interface IAchievement extends Document {
  userId: string;
  title: string;
  description?: string;
  category: string;
  earnedAt: Date;
  xpReward: number;
  coinReward: number;
}

const achievementSchema = new Schema<IAchievement>({
  userId: { type: String, required: true, ref: 'User' },
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now },
  xpReward: { type: Number, required: true },
  coinReward: { type: Number, required: true },
});

export const Achievement: Model<IAchievement> = mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', achievementSchema);


export interface IBuilding extends Document {
  userId: string;
  type: string;
  level: number;
  category: 'learning' | 'health' | 'finance' | 'mental' | 'social';
  unlockedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const buildingSchema = new Schema<IBuilding>({
  userId: { type: String, required: true, ref: 'User' },
  type: { type: String, required: true },
  level: { type: Number, default: 1 },
  category: { type: String, required: true, enum: ['learning', 'health', 'finance', 'mental', 'social'] },
  unlockedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Building: Model<IBuilding> = mongoose.models.Building || mongoose.model<IBuilding>('Building', buildingSchema);



export interface IInventory extends Document {
  userId: string;
  itemName: string;
  itemType: 'buff' | 'xp_boost' | 'time_boost' | 'mood_boost';
  quantity: number;
  createdAt: Date;
}

const inventorySchema = new Schema<IInventory>({
  userId: { type: String, required: true, ref: 'User' },
  itemName: { type: String, required: true },
  itemType: { type: String, required: true, enum: ['buff', 'xp_boost', 'time_boost', 'mood_boost'] },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Inventory: Model<IInventory> = mongoose.models.Inventory || mongoose.model<IInventory>('Inventory', inventorySchema);



export interface IFriend extends Document {
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const friendSchema = new Schema<IFriend>({
  userId: { type: String, required: true, ref: 'User' },
  friendId: { type: String, required: true, ref: 'User' },
  status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'rejected'] },
}, { timestamps: true });

export const Friend: Model<IFriend> = mongoose.models.Friend || mongoose.model<IFriend>('Friend', friendSchema);



export interface IChatMessage extends Document {
  senderId: string;
  recipientId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>({
  senderId: { type: String, required: true, ref: 'User' },
  recipientId: { type: String, required: true, ref: 'User' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const ChatMessage: Model<IChatMessage> = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);



export interface IGameScore extends Document {
  userId: string;
  gameType: 'memory' | 'sudoku' | 'chess' | 'word' | 'pattern' | 'trivia' | 'reflex' | 'math';
  score: number;
  coinsEarned: number;
  xpEarned: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  playedAt: Date;
}

const gameScoreSchema = new Schema<IGameScore>({
  userId: { type: String, required: true, ref: 'User' },
  gameType: { type: String, required: true, enum: ['memory', 'sudoku', 'chess', 'word', 'pattern', 'trivia', 'reflex', 'math'] },
  score: { type: Number, required: true },
  coinsEarned: { type: Number, required: true },
  xpEarned: { type: Number, required: true },
  difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard', 'expert'] },
  playedAt: { type: Date, default: Date.now },
});

export const GameScore: Model<IGameScore> = mongoose.models.GameScore || mongoose.model<IGameScore>('GameScore', gameScoreSchema);



export interface IGameRoom extends Document {
  roomId: string;
  gameType: string;
  hostId: string;
  players: string[];
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  winner?: string;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}

const gameRoomSchema = new Schema<IGameRoom>({
  roomId: { type: String, required: true, unique: true },
  gameType: { type: String, required: true },
  hostId: { type: String, required: true, ref: 'User' },
  players: [{ type: String, ref: 'User' }],
  maxPlayers: { type: Number, required: true },
  status: { type: String, default: 'waiting', enum: ['waiting', 'playing', 'finished'] },
  winner: { type: String, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  startedAt: Date,
  finishedAt: Date,
});

export const GameRoom: Model<IGameRoom> = mongoose.models.GameRoom || mongoose.model<IGameRoom>('GameRoom', gameRoomSchema);


export interface IProfession extends Document {
  userId: string;
  className: 'scholar' | 'warrior' | 'merchant' | 'artist' | 'monk';
  level: number;
  xp: number;
  specialPower: string;
  xpMultiplier: number;
  selectedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const professionSchema = new Schema<IProfession>({
  userId: { type: String, required: true, unique: true, ref: 'User' },
  className: { type: String, required: true, enum: ['scholar', 'warrior', 'merchant', 'artist', 'monk'] },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  specialPower: { type: String, required: true },
  xpMultiplier: { type: Number, default: 1.0 },
  selectedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Profession: Model<IProfession> = mongoose.models.Profession || mongoose.model<IProfession>('Profession', professionSchema);


export interface ISkillTree extends Document {
  userId: string;
  category: 'focus' | 'fitness' | 'finance' | 'creativity' | 'wellness';
  skillName: string;
  level: number;
  maxLevel: number;
  isUnlocked: boolean;
  prerequisite?: string;
  bonusEffect: string;
  unlockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const skillTreeSchema = new Schema<ISkillTree>({
  userId: { type: String, required: true, ref: 'User' },
  category: { type: String, required: true, enum: ['focus', 'fitness', 'finance', 'creativity', 'wellness'] },
  skillName: { type: String, required: true },
  level: { type: Number, default: 0 },
  maxLevel: { type: Number, default: 5 },
  isUnlocked: { type: Boolean, default: false },
  prerequisite: String,
  bonusEffect: { type: String, required: true },
  unlockedAt: Date,
}, { timestamps: true });

export const SkillTree: Model<ISkillTree> = mongoose.models.SkillTree || mongoose.model<ISkillTree>('SkillTree', skillTreeSchema);


export interface ILifeBadge extends Document {
  userId: string;
  badgeName: string;
  badgeType: 'streak' | 'milestone' | 'secret' | 'event' | 'social';
  description: string;
  iconName: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isSecret: boolean;
  unlockedAt: Date;
  createdAt: Date;
}

const lifeBadgeSchema = new Schema<ILifeBadge>({
  userId: { type: String, required: true, ref: 'User' },
  badgeName: { type: String, required: true },
  badgeType: { type: String, required: true, enum: ['streak', 'milestone', 'secret', 'event', 'social'] },
  description: { type: String, required: true },
  iconName: { type: String, required: true },
  rarity: { type: String, required: true, enum: ['common', 'rare', 'epic', 'legendary'] },
  isSecret: { type: Boolean, default: false },
  unlockedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export const LifeBadge: Model<ILifeBadge> = mongoose.models.LifeBadge || mongoose.model<ILifeBadge>('LifeBadge', lifeBadgeSchema);


export interface INPC extends Document {
  name: string;
  title: string;
  category: 'focus' | 'health' | 'wealth' | 'knowledge' | 'social';
  level: number;
  personality: string;
  dialogue: string[];
  questsAvailable: number;
  location: string;
  isActive: boolean;
  createdAt: Date;
}

const npcSchema = new Schema<INPC>({
  name: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true, enum: ['focus', 'health', 'wealth', 'knowledge', 'social'] },
  level: { type: Number, default: 1 },
  personality: { type: String, required: true },
  dialogue: [{ type: String }],
  questsAvailable: { type: Number, default: 0 },
  location: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const NPC: Model<INPC> = mongoose.models.NPC || mongoose.model<INPC>('NPC', npcSchema);



export interface IUserNPC extends Document {
  userId: string;
  npcName: string;
  relationshipLevel: number;
  lastInteraction: Date;
  questsCompleted: number;
  createdAt: Date;
  updatedAt: Date;
}

const userNPCSchema = new Schema<IUserNPC>({
  userId: { type: String, required: true, ref: 'User' },
  npcName: { type: String, required: true },
  relationshipLevel: { type: Number, default: 1 },
  lastInteraction: { type: Date, default: Date.now },
  questsCompleted: { type: Number, default: 0 },
}, { timestamps: true });

export const UserNPC: Model<IUserNPC> = mongoose.models.UserNPC || mongoose.model<IUserNPC>('UserNPC', userNPCSchema);


export interface IWeatherState extends Document {
  userId: string;
  currentWeather: 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'snowy';
  temperature: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  xpBonus: number;
  activeEffect: string;
  lastUpdated: Date;
  location?: string;
}

const weatherStateSchema = new Schema<IWeatherState>({
  userId: { type: String, required: true, unique: true, ref: 'User' },
  currentWeather: { type: String, required: true, enum: ['sunny', 'rainy', 'cloudy', 'stormy', 'snowy'] },
  temperature: { type: Number, required: true },
  timeOfDay: { type: String, required: true, enum: ['morning', 'afternoon', 'evening', 'night'] },
  xpBonus: { type: Number, default: 0 },
  activeEffect: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
  location: String,
});

export const WeatherState: Model<IWeatherState> = mongoose.models.WeatherState || mongoose.model<IWeatherState>('WeatherState', weatherStateSchema);


export interface IPortalWorld extends Document {
  userId: string;
  worldName: string;
  worldType: 'discipline' | 'eternity' | 'mastery' | 'prosperity' | 'mindfulness';
  isUnlocked: boolean;
  level: number;
  questsCompleted: number;
  xpMultiplier: number;
  unlockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const portalWorldSchema = new Schema<IPortalWorld>({
  userId: { type: String, required: true, ref: 'User' },
  worldName: { type: String, required: true },
  worldType: { type: String, required: true, enum: ['discipline', 'eternity', 'mastery', 'prosperity', 'mindfulness'] },
  isUnlocked: { type: Boolean, default: false },
  level: { type: Number, default: 1 },
  questsCompleted: { type: Number, default: 0 },
  xpMultiplier: { type: Number, default: 1.0 },
  unlockedAt: Date,
}, { timestamps: true });

export const PortalWorld: Model<IPortalWorld> = mongoose.models.PortalWorld || mongoose.model<IPortalWorld>('PortalWorld', portalWorldSchema);



export interface IStreakInsurance extends Document {
  userId: string;
  shieldTokens: number;
  totalShieldsUsed: number;
  streaksSaved: number;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const streakInsuranceSchema = new Schema<IStreakInsurance>({
  userId: { type: String, required: true, unique: true, ref: 'User' },
  shieldTokens: { type: Number, default: 3 },
  totalShieldsUsed: { type: Number, default: 0 },
  streaksSaved: { type: Number, default: 0 },
  lastUsed: Date,
}, { timestamps: true });

export const StreakInsurance: Model<IStreakInsurance> = mongoose.models.StreakInsurance || mongoose.model<IStreakInsurance>('StreakInsurance', streakInsuranceSchema);


export interface IGlobalEvent extends Document {
  eventName: string;
  eventType: 'productivity' | 'savings' | 'focus' | 'wellness' | 'social';
  description: string;
  xpMultiplier: number;
  coinMultiplier: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  participantCount: number;
  createdAt: Date;
}

const globalEventSchema = new Schema<IGlobalEvent>({
  eventName: { type: String, required: true },
  eventType: { type: String, required: true, enum: ['productivity', 'savings', 'focus', 'wellness', 'social'] },
  description: { type: String, required: true },
  xpMultiplier: { type: Number, default: 1.5 },
  coinMultiplier: { type: Number, default: 1.5 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  participantCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const GlobalEvent: Model<IGlobalEvent> = mongoose.models.GlobalEvent || mongoose.model<IGlobalEvent>('GlobalEvent', globalEventSchema);


export interface IEventParticipation extends Document {
  userId: string;
  eventName: string;
  score: number;
  rank?: number;
  rewardsClaimed: boolean;
  joinedAt: Date;
}

const eventParticipationSchema = new Schema<IEventParticipation>({
  userId: { type: String, required: true, ref: 'User' },
  eventName: { type: String, required: true },
  score: { type: Number, default: 0 },
  rank: Number,
  rewardsClaimed: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
});

export const EventParticipation: Model<IEventParticipation> = mongoose.models.EventParticipation || mongoose.model<IEventParticipation>('EventParticipation', eventParticipationSchema);


export interface ICreaturePersonality extends Document {
  creatureId: string;
  userId: string;
  personality: 'cheerful' | 'sleepy' | 'adventurous' | 'lazy' | 'competitive';
  moodScore: number;
  favoriteActivity: string;
  dialogueLines: string[];
  lastInteraction: Date;
  createdAt: Date;
  updatedAt: Date;
}

const creaturePersonalitySchema = new Schema<ICreaturePersonality>({
  creatureId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, ref: 'User' },
  personality: { type: String, required: true, enum: ['cheerful', 'sleepy', 'adventurous', 'lazy', 'competitive'] },
  moodScore: { type: Number, default: 50 },
  favoriteActivity: { type: String, required: true },
  dialogueLines: [{ type: String }],
  lastInteraction: { type: Date, default: Date.now },
}, { timestamps: true });

export const CreaturePersonality: Model<ICreaturePersonality> = mongoose.models.CreaturePersonality || mongoose.model<ICreaturePersonality>('CreaturePersonality', creaturePersonalitySchema);


export interface ILifeAnalytics extends Document {
  userId: string;
  date: Date;
  totalXpEarned: number;
  totalCoinsEarned: number;
  questsCompleted: number;
  studyMinutes: number;
  moodAverage: number;
  cityEvolution: string;
  creatureEvolution: string;
  createdAt: Date;
}

const lifeAnalyticsSchema = new Schema<ILifeAnalytics>({
  userId: { type: String, required: true, ref: 'User' },
  date: { type: Date, required: true },
  totalXpEarned: { type: Number, default: 0 },
  totalCoinsEarned: { type: Number, default: 0 },
  questsCompleted: { type: Number, default: 0 },
  studyMinutes: { type: Number, default: 0 },
  moodAverage: { type: Number, default: 50 },
  cityEvolution: { type: String, default: 'starter' },
  creatureEvolution: { type: String, default: 'stage1' },
  createdAt: { type: Date, default: Date.now },
});

export const LifeAnalytics: Model<ILifeAnalytics> = mongoose.models.LifeAnalytics || mongoose.model<ILifeAnalytics>('LifeAnalytics', lifeAnalyticsSchema);
