import express from "express";
import { updateProfile } from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Upload + Update
router.put("/update-profile",
    auth(["user", "admin", "superadmin"]),
    upload.single("profileImage"),
    updateProfile
);

export default router;
