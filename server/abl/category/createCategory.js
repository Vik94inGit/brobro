const { v4: uuidv4 } = require("uuid");
const categoryService = require("../../daoMethods/categoryService");

async function createCategory(name, image) {
  // Create new category with initial values
  const category = {
    id: uuidv4(), // Using UUID format
    name,
    image,
    pinned: false,
    last_used: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  await categoryService.saveCategory(category);
  return category;
}

module.exports = createCategory;
