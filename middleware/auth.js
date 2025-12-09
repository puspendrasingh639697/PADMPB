
import jwt from "jsonwebtoken";

export const auth = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // Get token from header
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ 
                    message: "No token provided or invalid format" 
                });
            }
            
            const token = authHeader.split(" ")[1];
            
            if (!token) {
                return res.status(401).json({ message: "No token found" });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Debug logging
            console.log("=== AUTH DEBUG ===");
            console.log("Token Role:", decoded.role);
            console.log("Allowed Roles:", allowedRoles);
            console.log("Role in array?", allowedRoles.includes(decoded.role));
            
            // Check if user role is allowed
            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ 
                    message: `Access denied. Required roles: ${allowedRoles.join(", ")}` 
                });
            }
            
            // Add user to request
            req.user = decoded;
            next();
            
        } catch (error) {
            console.error("Auth Middleware Error:", error.message);
            
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({ message: "Invalid token" });
            }
            
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token expired" });
            }
            
            res.status(500).json({ message: "Authentication error" });
        }
    };
};