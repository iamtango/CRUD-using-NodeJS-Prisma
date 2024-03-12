const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Route to get all categories
router.get("/categories", categoryController.getCategories);

// Route to create a new category
router.post("/categories", categoryController.createCategory);

// Route to get a category by ID
router.get("/categories/:id", categoryController.getCategoryById);

// Route to update a category by ID
router.put("/categories/:id", categoryController.updateCategory);

// Route to delete a category by ID
router.delete("/categories/:id", categoryController.deleteCategory);

module.exports = router;
