import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    workerId: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Client's password for their own login
    profileImage: { type: String, default: "default-client.png" },
    phoneNumber: { type: String },
    passportNumber: { type: String, unique: true, required: true },
    clientName: { type: String, required: true },
    email: { type: String, unique: true },
    
    // Links to Category
    categoryId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    categoryName: { type: String, required: true }, // Redundant but useful for quick access
    
    // Document/Status Fields (from second screenshot)
    designation: { type: String },
    remarks: { type: String },
    selectionEmailSent: { type: Boolean, default: false },
    confirmationEmailSent: { type: Boolean, default: false },
    
    // For storing uploaded document filenames/paths (Optional, but good practice)
    documents: [
        {
            documentName: { type: String, required: true },
            filePath: { type: String, required: true }
        }
    ]
    
}, { timestamps: true });

export default mongoose.model("Client", clientSchema);