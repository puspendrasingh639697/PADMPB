// userController.js (Debug Version)
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
    try {
        console.log("=== DEBUG UPDATE PROFILE ===");
        console.log("Request Body:", req.body);
        console.log("Request File:", req.file);
        console.log("User from Token:", req.user);
        console.log("Headers:", req.headers);
        
        const { name } = req.body;
        console.log("Name from body:", name);
        
        let updateData = { name };
        
        if (req.file) {
            console.log("File uploaded:", req.file);
            updateData.profileImage = req.file.filename;
            console.log("Profile Image will be:", req.file.filename);
        } else {
            console.log("No file uploaded");
        }
        
        console.log("Update Data:", updateData);
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");
        
        console.log("Updated User:", user);
        
        if (!user) {
            console.log("User not found with ID:", req.user.id);
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ 
            message: "Profile Updated Successfully", 
            user 
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ 
            error: "Server Error", 
            details: error.message 
        });
    }
};