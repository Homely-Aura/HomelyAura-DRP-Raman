// TODO: MongoDB connection
import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Connect to MongoDB using the MONGODB_URI from .env.
 * Exits the process if the connection fails.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('✅ MongoDB connected');
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
