import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  _id: string
  username: string
  email: string
  password: string
  avatar: string
  bio: string
  level: number
  xp: number
  coins: number
  gems: number
  streak: number
  lastActiveDate: Date
  title: string
  badges: string[]
  settings: {
    theme: string
    notifications: boolean
    soundEffects: boolean
  }
  stats: {
    questsCompleted: number
    totalXpEarned: number
    highestStreak: number
    gamesPlayed: number
    studyHours: number
    waterDrank: number
    moneySaved: number
  }
  clanId?: string
  friends: string[]
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  avatar: { type: String, default: '⛏️' },
  bio: { type: String, default: '', maxlength: 200 },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  coins: { type: Number, default: 100 },
  gems: { type: Number, default: 10 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  title: { type: String, default: 'Dirt Digger' },
  badges: [{ type: String }],
  settings: {
    theme: { type: String, default: 'dark' },
    notifications: { type: Boolean, default: true },
    soundEffects: { type: Boolean, default: true },
  },
  stats: {
    questsCompleted: { type: Number, default: 0 },
    totalXpEarned: { type: Number, default: 0 },
    highestStreak: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    studyHours: { type: Number, default: 0 },
    waterDrank: { type: Number, default: 0 },
    moneySaved: { type: Number, default: 0 },
  },
  clanId: { type: Schema.Types.ObjectId, ref: 'Clan' },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
