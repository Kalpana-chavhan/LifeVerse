import mongoose, { Schema, Document } from 'mongoose'

export interface ITransaction extends Document {
  userId: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: Date
  coinReward: number
  recurring: boolean
  recurringPeriod?: 'daily' | 'weekly' | 'monthly'
  createdAt: Date
}

export interface ISavingsGoal extends Document {
  userId: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline?: Date
  icon: string
  color: string
  status: 'active' | 'completed' | 'paused'
  createdAt: Date
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  coinReward: { type: Number, default: 5 },
  recurring: { type: Boolean, default: false },
  recurringPeriod: { type: String, enum: ['daily', 'weekly', 'monthly'] },
}, { timestamps: true })

const SavingsGoalSchema = new Schema<ISavingsGoal>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: Date },
  icon: { type: String, default: '🪙' },
  color: { type: String, default: '#ffd700' },
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
}, { timestamps: true })

export const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema)
export const SavingsGoal = mongoose.models.SavingsGoal || mongoose.model<ISavingsGoal>('SavingsGoal', SavingsGoalSchema)
