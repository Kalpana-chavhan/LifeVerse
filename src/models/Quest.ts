import mongoose, { Schema, Document } from 'mongoose'

export interface IQuest extends Document {
  userId: string
  title: string
  description: string
  category: 'fitness' | 'learning' | 'finance' | 'health' | 'social' | 'creativity' | 'mindfulness' | 'custom'
  type: 'daily' | 'weekly' | 'one-time' | 'challenge'
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary'
  xpReward: number
  coinReward: number
  status: 'active' | 'completed' | 'failed' | 'expired'
  dueDate?: Date
  completedAt?: Date
  streak: number
  totalCompletions: number
  icon: string
  tags: string[]
  isRecurring: boolean
  lastCompletedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const QuestSchema = new Schema<IQuest>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, default: '', maxlength: 500 },
  category: { type: String, enum: ['fitness', 'learning', 'finance', 'health', 'social', 'creativity', 'mindfulness', 'custom'], default: 'custom' },
  type: { type: String, enum: ['daily', 'weekly', 'one-time', 'challenge'], default: 'daily' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'legendary'], default: 'easy' },
  xpReward: { type: Number, default: 50 },
  coinReward: { type: Number, default: 10 },
  status: { type: String, enum: ['active', 'completed', 'failed', 'expired'], default: 'active' },
  dueDate: { type: Date },
  completedAt: { type: Date },
  streak: { type: Number, default: 0 },
  totalCompletions: { type: Number, default: 0 },
  icon: { type: String, default: '⛏️' },
  tags: [{ type: String }],
  isRecurring: { type: Boolean, default: true },
  lastCompletedAt: { type: Date },
}, { timestamps: true })

QuestSchema.index({ userId: 1, status: 1 })
QuestSchema.index({ userId: 1, type: 1 })

export default mongoose.models.Quest || mongoose.model<IQuest>('Quest', QuestSchema)
