import mongoose, { Schema, Document } from 'mongoose'

export interface IHealthLog extends Document {
  userId: string
  date: Date
  waterIntake: number
  waterGoal: number
  sleepHours: number
  sleepQuality: number
  steps: number
  mood: 1 | 2 | 3 | 4 | 5
  moodNote: string
  xpEarned: number
  createdAt: Date
}

const HealthLogSchema = new Schema<IHealthLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  waterIntake: { type: Number, default: 0 },
  waterGoal: { type: Number, default: 8 },
  sleepHours: { type: Number, default: 0 },
  sleepQuality: { type: Number, default: 0, min: 0, max: 5 },
  steps: { type: Number, default: 0 },
  mood: { type: Number, enum: [1, 2, 3, 4, 5], default: 3 },
  moodNote: { type: String, default: '' },
  xpEarned: { type: Number, default: 0 },
}, { timestamps: true })

HealthLogSchema.index({ userId: 1, date: -1 })

export default mongoose.models.HealthLog || mongoose.model<IHealthLog>('HealthLog', HealthLogSchema)
