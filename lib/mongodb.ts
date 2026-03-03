import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.DATABASE_URL
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
  // We don't throw at the top level to avoid breaking the build. 
  // Instead, we return a rejected promise that will only throw when awaited at runtime.
  clientPromise = Promise.reject(new Error('DATABASE_URL is missing in environment variables. Please add it to Vercel/Local .env'))
} else {

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}
}

export default clientPromise
