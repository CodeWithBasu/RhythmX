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
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Please add your Mongo URI to .env')
  } else {
    // In dev, we can provide a dummy promise to avoid crashing the whole dev server setup immediately
    clientPromise = Promise.reject(new Error('DATABASE_URL is missing in .env'))
  }
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
