import express from "express";
import { createMessage, getMessages, getUserforChat } from "../controllers/messageController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.get("/users", protectRoute, getUserforChat);  // This should come before the /:Id route
router.get("/:Id", protectRoute, getMessages);
router.post("/send/:Id", protectRoute, createMessage);

export default router;