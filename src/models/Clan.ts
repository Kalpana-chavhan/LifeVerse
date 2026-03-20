import mongoose, { Schema, Document } from 'mongoose'

export interface IClan extends Document {
  name: string
  description: string
  emoji: string
  color: string
  leaderId: string
  members: Array<{
    userId: string
    role: 'leader' | 'officer' | 'member'
    joinedAt: Date
    contribution: number
  }>
  level: number
  xp: number
  totalXp: number
  isPublic: boolean
  maxMembers: number
  quests: Array<{
    title: string
    description: string
    xpReward: number
    completedBy: string[]
    deadline: Date
    status: 'active' | 'completed'
  }>
  createdAt: Date
}

const ClanSchema = new Schema<IClan>({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  emoji: { type: String, default: '🪓' },
  color: { type: String, default: '#b44fff' },
  leaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['leader', 'officer', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
    contribution: { type: Number, default: 0 },
  }],
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  totalXp: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true },
  maxMembers: { type: Number, default: 20 },
  quests: [{
    title: String,
    description: String,
    xpReward: Number,
    completedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    deadline: Date,
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
  }],
}, { timestamps: true })

export default mongoose.models.Clan || mongoose.model<IClan>('Clan', ClanSchema)
