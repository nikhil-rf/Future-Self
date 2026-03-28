// worker/src/db.js
// MongoDB connection with reconnect logic

import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI environment variable is not set');

  try {
    await mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10_000,
    });
    isConnected = true;
    console.log('[DB] Connected to MongoDB');
  } catch (err) {
    console.error('[DB] Connection failed:', err.message);
    throw err;
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] Disconnected from MongoDB — will reconnect on next poll');
    isConnected = false;
  });

  mongoose.connection.on('error', (err) => {
    console.error('[DB] Mongoose error:', err.message);
    isConnected = false;
  });
}
