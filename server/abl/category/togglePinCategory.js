const categoryService = require("../../daoMethods/categoryService");
// import methods

async function togglePinCategory(id) {
  //retrieve id, declare function
  const category = await categoryService.getCategoryById(id);
  //evoke categoryService.getCategoryById
  if (!category) {
    //if category isn`t found put error
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
