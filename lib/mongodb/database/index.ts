import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.connect;

  if(!MONGODB_URI) throw new Error ("MONGDODB_URI is missing");

  cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: 'eventure',
    bufferCommands: false,
  })


  cached.conn = cached.promise;

  return cached.conn
}; 
