import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// reuse the connection across hot reloads / serverless invocations
const globalForMongo = globalThis;
const client = globalForMongo._mongoClient ?? new MongoClient(process.env.MONGODB_URI);
globalForMongo._mongoClient = client;
const db = client.db(process.env.MONGODB_DB || "booknook");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true, autoSignIn: false }, // register -> go to login page
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [jwt()], // exposes /api/auth/token and /api/auth/jwks for the Express server
});
