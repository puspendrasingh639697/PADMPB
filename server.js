
// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js"; 
// import jwt from "jsonwebtoken";
// import User from "./models/User.js"; 

// // 💡 1. Import all route handlers
// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import categoryRoutes from "./routes/categoryRoutes.js"; 
// import clientRoutes from "./routes/clientRoutes.js";   

// // 💡 Load Environment Variables
// dotenv.config();

// const app = express();

// // --- Middleware Setup ---
// // 💡 Parse incoming JSON requests
// app.use(express.json());

// // 💡 FINAL STEP: Serve static files from the 'uploads' directory
// // Files in the 'uploads' folder can now be accessed directly, e.g., http://localhost:5000/image.jpg
// app.use(express.static('uploads')); 

// // 💡 Connect to Database 
// connectDB();

// // --- Route Definitions ---

// // Authentication Routes (Register/Login)
// app.use("/api/auth", authRoutes); 

// // General User Routes (Profile Update)
// app.use("/api/users", userRoutes); 

// // Core Admin Routes (User Management)
// app.use("/api/admin", adminRoutes); 

// // ✅ New Routes for Category Management
// app.use("/api/categories", categoryRoutes); 

// // ✅ New Routes for Client/Worker Management
// app.use("/api/clients", clientRoutes); 

// // --- Temporary Debug Route ---
// app.get("/api/debug/auth-check", async (req, res) => {
//     try {
//         const authHeader = req.headers.authorization;
//         console.log("\n=== DEBUG AUTH CHECK ===");
//         console.log("Auth Header:", authHeader);

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.json({ 
//                 error: "No Bearer token",
//                 header: authHeader 
//             });
//         }

//         const token = authHeader.split(" ")[1];
//         console.log("Token:", token.substring(0, 20) + "...");

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("Decoded:", decoded);

//         // Check User in database
//         const userInDB = await User.findById(decoded.id);
//         console.log("User in DB:", userInDB ? {
//             id: userInDB._id,
//             name: userInDB.name,
//             email: userInDB.email,
//             role: userInDB.role,
//             roleType: typeof userInDB.role
//         } : "Not found");

//         res.json({
//             success: true,
//             tokenDecoded: decoded,
//             dbUser: userInDB ? {
//                 _id: userInDB._id,
//                 name: userInDB.name,
//                 email: userInDB.email,
//                 role: userInDB.role,
//                 roleInDB: userInDB.role,
//                 isSuperadmin: userInDB.role === "superadmin"
//             } : null,
//             comparison: {
//                 tokenRole: decoded.role,
//                 tokenRoleType: typeof decoded.role,
//                 isSuperadmin: decoded.role === "superadmin",
//                 isSuperadminString: decoded.role === "superadmin" ? "Yes" : "No"
//             }
//         });

//     } catch (error) {
//         console.error("Debug error:", error.message);
//         res.status(400).json({ 
//             error: error.message,
//             name: error.name 
//         });
//     }
// });


// // --- Server Start ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`✅ Server running on port ${PORT}`);
//     console.log(`🔗 Test: http://localhost:${PORT}/api/debug/auth-check (requires Bearer Token)`);
// });

import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import cors from "cors"; // 💡 1. CORS पैकेज इम्पोर्ट किया गया

// 💡 Import all route handlers
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";

// 💡 Load Environment Variables
dotenv.config();

const app = express();

// --- Middleware Setup ---

// ✅ 2. CORS Middleware को लागू किया गया (यह JSON पार्सिंग से पहले होना चाहिए)
// यह 'Access-Control-Allow-Origin' हेडर को जोड़कर CORS एरर को ठीक करेगा।
app.use(cors({
    origin: 'http://localhost:5173', // <--- आपके React/Vite ऐप का URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // OPTIONS प्री-फ्लाइट रिक्वेस्ट के लिए
    credentials: true
}));

// 💡 Parse incoming JSON requests
app.use(express.json());

// 💡 FINAL STEP: Serve static files from the 'uploads' directory
app.use(express.static('uploads'));

// 💡 Connect to Database 
connectDB();

// --- Route Definitions ---

// Authentication Routes (Register/Login)
app.use("/api/auth", authRoutes);

// General User Routes (Profile Update)
app.use("/api/users", userRoutes);

// Core Admin Routes (User Management)
app.use("/api/admin", adminRoutes);

// ✅ New Routes for Category Management
app.use("/api/categories", categoryRoutes);

// ✅ New Routes for Client/Worker Management
app.use("/api/clients", clientRoutes);

// --- Temporary Debug Route ---
app.get("/api/debug/auth-check", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("\n=== DEBUG AUTH CHECK ===");
        console.log("Auth Header:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({
                error: "No Bearer token",
                header: authHeader
            });
        }

        const token = authHeader.split(" ")[1];
        console.log("Token:", token.substring(0, 20) + "...");

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded:", decoded);

        // Check User in database
        const userInDB = await User.findById(decoded.id);
        console.log("User in DB:", userInDB ? {
            id: userInDB._id,
            name: userInDB.name,
            email: userInDB.email,
            role: userInDB.role,
            roleType: typeof userInDB.role
        } : "Not found");

        res.json({
            success: true,
            tokenDecoded: decoded,
            dbUser: userInDB ? {
                _id: userInDB._id,
                name: userInDB.name,
                email: userInDB.email,
                role: userInDB.role,
                roleInDB: userInDB.role,
                isSuperadmin: userInDB.role === "superadmin"
            } : null,
            comparison: {
                tokenRole: decoded.role,
                tokenRoleType: typeof decoded.role,
                isSuperadmin: decoded.role === "superadmin",
                isSuperadminString: decoded.role === "superadmin" ? "Yes" : "No"
            }
        });

    } catch (error) {
        console.error("Debug error:", error.message);
        res.status(400).json({
            error: error.message,
            name: error.name
        });
    }
});


// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔗 Test: http://localhost:${PORT}/api/debug/auth-check (requires Bearer Token)`);
});