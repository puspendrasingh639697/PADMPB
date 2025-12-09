
// controllers/authController.js (Updated with Client Login)
import User from "../models/User.js";
import Client from "../models/Client.js"; // 💡 Import Client Model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --- Existing User Registration ---

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.json({ message: "User Registered", user });

    } catch (error) {
        // Handle duplicate email error
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email is already in use." });
        }
        res.status(500).json({ error: error.message });
    }
};

// --- Existing User Login (for Admin/Superadmin/General User) ---

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Wrong password" });

        // Generate Token
        const token = jwt.sign(
            { id: user._id, role: user.role, image: user.profileImage },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Remove password before sending user data
        user.password = undefined;

        res.json({ message: "Login successful", token, user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 💡 NEW: Client/Worker Login Function ---
export const clientLogin = async (req, res) => {
    try {
        const { workerId, password } = req.body;

        // 1. Find Client by workerId
        const client = await Client.findOne({ workerId });
        if (!client) return res.status(404).json({ message: "Worker ID not found" });

        // 2. Compare Password
        const match = await bcrypt.compare(password, client.password);
        if (!match) return res.status(400).json({ message: "Wrong password" });

        // 3. Generate JWT Token
        const token = jwt.sign(
            { 
                id: client._id, 
                role: "client", // 💡 Role is set to 'client' for authorization middleware
                workerId: client.workerId 
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Remove password before sending client data
        client.password = undefined; 

        res.json({ message: "Client Login successful", token, client });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};