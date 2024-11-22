import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { authLimiter } from '../middleware/rateLimiter.js';
import { protectRoute } from "../middleware/auth.js";
import { checkAuth } from "../controllers/authController.js";
const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", logoutUser);
router.get("/check", protectRoute,checkAuth);
export default router;