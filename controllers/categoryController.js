import Category from "../models/Category.js";

// 📝 Add New Category
export const addCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        
        const newCategory = await Category.create({ categoryName });
        
        res.status(201).json({ 
            message: "Category Added Successfully", 
            category: newCategory 
        });
        
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                error: "Category name already exists." 
            });
        }
        res.status(500).json({ error: error.message });
    }
};

// 📝 Get All Categories
export const getCategories = async (req, res) => {
    try {
        // Sort by creation date (newest first)
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📝 Update Category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;
        
        const updatedCategory = await Category.findByIdAndUpdate(
            id, 
            { categoryName }, 
            { new: true, runValidators: true }
        );
        
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        res.json({ 
            message: "Category Updated Successfully", 
            category: updatedCategory 
        });
        
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                error: "Category name already exists." 
            });
        }
        res.status(500).json({ error: error.message });
    }
};

// 📝 Delete Category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        const category = await Category.findByIdAndDelete(id);
        
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        // ⚠️ NOTE: You may want to check and prevent deletion if clients are linked to this category
        
        res.json({ message: "Category Deleted Successfully" });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};