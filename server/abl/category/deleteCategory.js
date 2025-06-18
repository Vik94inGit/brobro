const categoryService = require("../../daoMethods/categoryService");

async function deleteCategory(id) {
  const categories = await categoryService.getCategories();
  if (!categories.some((cat) => cat.id === id)) {
    throw new Error("Category not found");
  }

  await categoryService.deleteCategory(id);
  return true;
}

module.exports = deleteCategory;
