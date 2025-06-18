const categoryService = require("../../daoMethods/categoryService");

async function getCategoryById(id) {
  const categories = await categoryService.getCategories();
  const category = categories.find((cat) => cat.id === id);
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
}

module.exports = getCategoryById;
