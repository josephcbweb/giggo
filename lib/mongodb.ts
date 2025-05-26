import mongoose from "mongoose";
import { initGridFS } from "./gridfs";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

export const connectMongoDB = async () => {
  if (global.mongoose.conn) {
    console.log("Using existing MongoDB connection");
    initGridFS();
    return global.mongoose.conn;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    console.log("Establishing new MongoDB connection...");
    
    if (!global.mongoose.promise) {
      global.mongoose.promise = mongoose.connect(mongoUri).then((mongoose) => {
        console.log("Successfully connected to MongoDB");
        // Initialize GridFS after connection is established
        initGridFS();
        return mongoose;
      });
    }

    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    global.mongoose.promise = null;
    throw error;
  }
};

// Initialize connection when module loads (except in test environment)
if (process.env.NODE_ENV !== "test") {
  connectMongoDB().catch(err => 
    console.error("Initial connection attempt failed:", err)
  );
}