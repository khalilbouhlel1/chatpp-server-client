import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection errors after initial connection
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB; 