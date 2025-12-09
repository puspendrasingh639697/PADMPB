


// routes/authRoutes.js (Updated with Client Login)
import express from "express";
import { register, login, clientLogin } from "../controllers/authController.js"; // 💡 Import clientLogin
const router = express.Router();

// User Registration (Admin/Superadmin/User)
router.post("/register", register);

// Admin/User Login
router.post("/login", login);

// 💡 NEW: Client/Worker Login
router.post("/client-login", clientLogin);

export default router;