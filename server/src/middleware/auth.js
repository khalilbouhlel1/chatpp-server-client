import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Add timeout settings for the database query
const DB_TIMEOUT = 5000; // 5 seconds timeout

export const protectRoute = async (req, res, next) => {
    try {
      let token = req.cookies.token;
      
      // Check Authorization header if no cookie token
      if (!token && req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
  
      if (!token) {
        return res.status(401).json({ message: "No authentication token" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add timeout to the database query
      const user = await User.findById(decoded.userId)
        .select("-password")
        .maxTimeMS(DB_TIMEOUT);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
  
      req.user = user;
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      
      // More specific error handling
      if (error.name === "MongooseError" || error.name === "MongooseServerSelectionError") {
        return res.status(503).json({ 
          message: "Database connection error. Please try again later." 
        });
      }
      
      return res.status(401).json({ message: "Invalid token" });
    }
  };