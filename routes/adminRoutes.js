
// routes/adminRoutes.js - CORRECT VERSION
import express from "express";
import { auth } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ CORRECT: lowercase "superadmin" in array
router.get("/users", auth(["superadmin"]), async (req, res) => {
    try {
        console.log("User making request:", req.user);
        
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: users.length,
            users
        });
        
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// ✅ DELETE route
router.delete("/users/:id", auth(["superadmin"]), async (req, res) => {
    try {
        const { id } = req.params;
        const requestingUser = req.user;
        
        console.log("Delete request by:", requestingUser);
        console.log("Deleting user ID:", id);
        
        // Prevent self-deletion
        if (id === requestingUser.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }
        
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        res.json({
            success: true,
            message: `User '${user.name}' deleted successfully`,
            deletedUser: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;