import mongoose from "mongoose";

let mongooseConnection = null;

export const connectDB = async () => {
  // Return existing connection if already connected
  if (mongooseConnection) {
    console.log("Using existing MongoDB connection");
    return mongooseConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    mongooseConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit on serverless - just throw the error
    throw error;
  }
};
