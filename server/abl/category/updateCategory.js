const categoryService = require("../../daoMethods/categoryService");
const getCategoryById = require("./getCategoryById");

async function updateCategory(id, name, image) {
  const categories = await categoryService.getCategories();
  const category = await getCategoryById(id);

  const otherCategories = categories.filter((cat) => cat.id !== id);
  if (
    otherCategories.some((cat) => cat.name.toLowerCase() === name.toLowerCase())
  ) {
    throw new Error("Category name must be unique");
  }

  const updatedCategory = {
    name: name.trim(),
    image: image && typeof image === "string" ? image : category.image,
  };

  await categoryService.updateCategory(id, updatedCategory);
  return { id, ...updatedCategory };
}

module.exports = updateCategory;
