const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const validateCategory = require("../abl/category/validateCategory");

// Get all categories (must be before /:id route)
router.get("/", categoryController.getCategories);

// Create new category
router.post(
  "/",
  (req, res, next) => {
    try {
      req.body = validateCategory(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  categoryController.createCategory
);

// Get category by ID
router.get("/:id", categoryController.getCategoryById);

// Toggle category pin status
router.patch("/:id/pin", categoryController.togglePin);

// Update category
router.put(
  "/:id",
  (req, res, next) => {
    try {
      req.body = validateCategory(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  categoryController.updateCategory
);

// Delete category
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
