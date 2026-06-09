import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Missing required environment variable: MONGODB_URI');
}

mongoose.connect(MONGODB_URI).catch((err) => {
  console.error('MongoDB connection failed:', err);
  process.exit(1);
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

export default db;