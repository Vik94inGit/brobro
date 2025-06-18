const categoryService = require("../../daoMethods/categoryService");

async function togglePinCategory(id) {
  const category = await categoryService.getCategoryById(id);
  if (!category) {
    throw new Error("Category not found");
  }

  // Create update object with only the pinned status
  const updateData = {
    pinned: !category.pinned,
  };

  // Update the category with only the pinned status
  const updatedCategory = await categoryService.updateCategory(id, updateData);
  return updatedCategory;
}

module.exports = togglePinCategory;
