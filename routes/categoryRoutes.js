import express from "express";
import { auth } from "../middleware/auth.js";
import { 
    addCategory, 
    getCategories, 
    updateCategory, 
    deleteCategory 
} from "../controllers/categoryController.js";

const router = express.Router();

// 🔒 Only Superadmin/Admin can manage categories
const managementRoles = ["superadmin", "admin"];

router.post("/", auth(managementRoles), addCategory);
router.get("/", auth(managementRoles), getCategories);
router.put("/:id", auth(managementRoles), updateCategory);
router.delete("/:id", auth(managementRoles), deleteCategory);

export default router;