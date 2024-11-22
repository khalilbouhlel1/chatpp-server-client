import express from "express";
import { getUserProfile,updateUserProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";
import { upload } from "../lib/multer.js";
import { validateProfile } from "../middleware/validate.js";

const router = express.Router();

router.get("/my-profile", protectRoute, getUserProfile);
router.put("/update-profile", protectRoute, upload.single("profilepic"), validateProfile, updateUserProfile)

export default router;