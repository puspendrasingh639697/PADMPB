import express from "express";
import { auth } from "../middleware/auth.js";
import upload from "../middleware/upload.js"; // Existing Multer middleware

import { 
    addClient, 
    getAllClients, 
    updateClientDetails, 
    deleteClient,
    addClientDocument,
    getClientDocuments,    // 💡 Document Management (New Logic Needed)
    deleteClientDocument,  // 💡 Document Management (New Logic Needed)
} from "../controllers/clientController.js"; // Make sure to add getClientDocuments and deleteClientDocument in your controller

import { 
    sendSelectionEmail, 
    sendConfirmationEmail 
} from "../controllers/emailController.js"; // New Email Controller Imports

const router = express.Router();

// 🔒 Roles authorized to manage clients
const managementRoles = ["superadmin", "admin"];

// --- Client Management (CRUD) ---

// 1. Add Client (Upload Profile Image)
router.post(
    "/", 
    auth(managementRoles), 
    upload.single("profileImage"), 
    addClient
);

// 2. Get All Clients
router.get("/", auth(managementRoles), getAllClients);

// 3. Update Client Details (PUT /api/clients/:id)
router.put("/:id", auth(managementRoles), updateClientDetails);

// 4. Delete Client
router.delete("/:id", auth(managementRoles), deleteClient);

// --- Document Management ---

// 5. Add Document for a Client (Upload Document File)
router.post(
    "/:id/documents", 
    auth(managementRoles), 
    upload.single("documentFile"), 
    addClientDocument
);

// 6. Get Client Documents (GET /api/clients/:id/documents)
router.get(
    "/:id/documents",
    auth(managementRoles),
    getClientDocuments // **Requires logic in clientController**
);

// 7. Delete Specific Document (DELETE /api/clients/:id/documents/:docId)
router.delete(
    "/:id/documents/:docId",
    auth(managementRoles),
    deleteClientDocument // **Requires logic in clientController**
);

// --- Email Actions ---

// 8. Send Selection Email
router.post(
    "/:id/send-selection-email", 
    auth(managementRoles), 
    sendSelectionEmail
);

// 9. Send Confirmation Email
router.post(
    "/:id/send-confirmation-email", 
    auth(managementRoles), 
    sendConfirmationEmail
);


// ... [existing code for addClient, getAllClients, updateClientDetails, deleteClient, addClientDocument]





export default router;