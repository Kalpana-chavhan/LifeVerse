import mongoose, { Schema, Document } from 'mongoose'

export interface IBuilding extends Document {
  type: string
  name: string
  emoji: string
  description: string
  unlockRequirement: string
  unlockLevel: number
  category: string
  color: string
}

export interface ICity extends Document {
  userId: string
  buildings: Array<{
    buildingType: string
    position: { x: number; y: number }
    unlockedAt: Date
    level: number
  }>
  cityName: string
  population: number
  lastUpdated: Date
}

const CitySchema = new Schema<ICity>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  buildings: [{
    buildingType: String,
    position: { x: Number, y: Number },
    unlockedAt: { type: Date, default: Date.now },
    level: { type: Number, default: 1 },
  }],
  cityName: { type: String, default: 'My LifeVerse City' },
  population: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.models.City || mongoose.model<ICity>('City', CitySchema)
