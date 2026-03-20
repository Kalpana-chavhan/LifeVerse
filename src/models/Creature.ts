import mongoose, { Schema, Document } from 'mongoose'

export interface ICreature extends Document {
  userId: string
  name: string
  species: string
  category: 'fitness' | 'learning' | 'finance' | 'health' | 'social'
  level: number
  xp: number
  happiness: number
  energy: number
  evolutionStage: 0 | 1 | 2 | 3
  emoji: string
  color: string
  personality: string
  skills: string[]
  lastFedAt: Date
  createdAt: Date
}

const CREATURE_SPECIES = {
  fitness: { name: 'Flexmon', emojis: ['🐔', '🐔', '🦅', '🐗'], color: '#ff6b00' },
  learning: { name: 'Brainix', emojis: ['🥚', '🐛', '🦋', '🧙'], color: '#00f5ff' },
  finance: { name: 'Coinio', emojis: ['🪨', '💎', '👑', '🏦'], color: '#ffd700' },
  health: { name: 'Vitachu', emojis: ['🌱', '🌿', '🌳', '💎'], color: '#39ff14' },
  social: { name: 'Socialis', emojis: ['🌀', '🌊', '⚡', '🌈'], color: '#b44fff' },
}

const CreatureSchema = new Schema<ICreature>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  species: { type: String, required: true },
  category: { type: String, enum: ['fitness', 'learning', 'finance', 'health', 'social'], required: true },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  happiness: { type: Number, default: 100, min: 0, max: 100 },
  energy: { type: Number, default: 100, min: 0, max: 100 },
  evolutionStage: { type: Number, enum: [0, 1, 2, 3], default: 0 },
  emoji: { type: String, default: '🥚' },
  color: { type: String, default: '#b44fff' },
  personality: { type: String, default: 'Curious' },
  skills: [{ type: String }],
  lastFedAt: { type: Date, default: Date.now },
}, { timestamps: true })

export { CREATURE_SPECIES }
export default mongoose.models.Creature || mongoose.model<ICreature>('Creature', CreatureSchema)
