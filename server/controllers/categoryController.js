const createCategory = require("../abl/category/createCategory");
const getCategoryById = require("../abl/category/getCategoryById");
const getAllCategories = require("../abl/category/getAllCategories");
const updateCategory = require("../abl/category/updateCategory");
const deleteCategory = require("../abl/category/deleteCategory");
const togglePinCategory = require("../abl/category/togglePinCategory");
const categoryService = require("../daoMethods/categoryService");

exports.getCategories = async (req, res) => {
  try {
    console.log("Getting categories...");
    if (req.params.id) {
      console.log("Getting category by ID:", req.params.id);
      const category = await getCategoryById(req.params.id);
      res.json(category);
    } else {
      console.log("Getting all categories");
      const categories = await getAllCategories();
      console.log("Found categories:", categories);
      res.json(categories);
    }
  } catch (error) {
    console.error("Error in getCategories:", error);
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else {
      console.error("Error in getCategories:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    await createCategory(name, image);

    // Get updated list of all categories
    const categories = await getAllCategories();
    res.status(201).json(categories);
  } catch (error) {
    if (
      error.message.includes("required") ||
      error.message.includes("unique")
    ) {
      res.status(400).json({ error: error.message });
    } else {
      console.error("Error in createCategory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const category = await updateCategory(req.params.id, name, image);
    res.json(category);
  } catch (error) {
    if (
      error.message.includes("required") ||
      error.message.includes("unique")
    ) {
      res.status(400).json({ error: error.message });
    } else if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else {
      console.error("Error in updateCategory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await deleteCategory(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes("Cannot delete category")) {
      res.status(400).json({ error: error.message });
    } else {
      console.error("Error in deleteCategory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.togglePin = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await togglePinCategory(id);
    res.json(category);
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else {
      console.error("Error in togglePin:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
