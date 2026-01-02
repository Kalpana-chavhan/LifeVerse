import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lifeverse';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongoCache {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

declare global {
  var mongoClient: MongoCache;
}

let cached: MongoCache = global.mongoClient || { client: null, promise: null };

if (!global.mongoClient) {
  global.mongoClient = cached;
}

async function getClient(): Promise<MongoClient> {
  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      console.log('MongoDB connected successfully');
      return client;
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.client;
}

const clientPromise: Promise<MongoClient> = getClient();

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db('lifeverse');
}
