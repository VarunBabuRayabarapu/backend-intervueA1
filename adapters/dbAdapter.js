import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let client;
let db;

export const connectDB = async () => {
  if (db) return db; // reuse if already connected

  try {
    client = new MongoClient(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");

    db = client.db(); 
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) throw new Error("⚠️ Database not initialized. Call connectDB() first.");
  return db;
};
