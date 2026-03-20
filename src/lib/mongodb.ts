import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || ''

// Use a different name for the global cache to avoid conflict with mongoose import
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: {
    conn: mongoose.Connection | null
    promise: Promise<mongoose.Connection> | null
  }
}

if (!global._mongooseCache) {
  global._mongooseCache = { conn: null, promise: null }
}

const cache = global._mongooseCache

export async function connectDB(): Promise<mongoose.Connection> {
  if (!MONGODB_URI) {
    throw new Error(
      '⚠️  MONGODB_URI is not set. Please add it to your .env file.\n' +
      'See .env.example for instructions.'
    )
  }

  if (cache.conn) return cache.conn

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        dbName: 'lifeverse',
      })
      .then((m) => m.connection)
  }

  try {
    cache.conn = await cache.promise
  } catch (e) {
    cache.promise = null
    throw e
  }

  return cache.conn
}

export default connectDB
