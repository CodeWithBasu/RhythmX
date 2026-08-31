import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.DATABASE_URL
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000,  // 45 seconds
  maxPoolSize: 10,         // Limit connections in serverless
  family: 4,               // Force IPv4 for Next.js DNS resolution bug
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
  // We don't throw at the top level to avoid breaking the build. 
  // Instead, we return a rejected promise that will only throw when awaited at runtime.
  clientPromise = Promise.reject(new Error('DATABASE_URL is missing in environment variables. Please add it to Vercel/Local .env'))
} else {
  // Bypass global caching completely in development to avoid stuck failed promises
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

