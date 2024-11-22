import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import cloudinary from "cloudinary";
import { errorHandler } from "./middleware/errorHandler.js";
import { validateEnv } from '../configs/validateEnv.js';
import { securityMiddleware } from './middleware/security.js';
import {app,server} from "./lib/socket.js"
import connectDB from "./config/db.js";
import path from "path";

dotenv.config();

const startServer = async () => {
  try {
    // Validate environment variables first
    validateEnv();
    
    const PORT = process.env.PORT || 5003;
    const corsOptions = {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
      exposedHeaders: ['set-cookie'],
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    };
    // Connect to MongoDB
    await connectDB();
    
    // Configure middleware
    app.use(cors(corsOptions));
    app.use(cookieParser());
    app.use(securityMiddleware);
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Routes
    app.get("/health", (req, res) => {
      res.send({ message: "health OK!" });
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/profile", userRoutes);
    app.use("/api/messages", messageRoutes);
    app.use(errorHandler);

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../../client/dist')));
      
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
      });
    }

    // Start server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer();
