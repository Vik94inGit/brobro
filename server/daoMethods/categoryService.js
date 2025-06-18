const dataService = require("./dataService");

async function getCategories() {
  return await dataService.readData("categories");
}

async function getCategoryById(id) {
  const category = await dataService.readItemById("categories", id);
  if (!category) {
    return null; // ABL layer handle the "not found" error
  }
  // Update last_used when category is accessed
  await updateLastUsed(id);
  return category;
}

async function updateLastUsed(id) {
  const category = await dataService.readItemById("categories", id);
  if (category) {
    category.last_used = new Date().toISOString();
    await dataService.writeData("categories", category);
  }
}

async function saveCategory(category) {
  // Add last_used when creating new category
  category.last_used = new Date().toISOString();
  await dataService.writeData("categories", category);
}

async function updateCategory(id, updatedCategory) {
  const category = await dataService.readItemById("categories", id);
  if (!category) {
    throw new Error("Category not found");
  }

  // Create new category object with existing data
  const newCategory = {
    ...category,
    last_used: new Date().toISOString(), // Always update last_used
  };

  // Update only the fields that are provided
  if (updatedCategory.name !== undefined) {
    newCategory.name = updatedCategory.name;
  }
  if (updatedCategory.image !== undefined) {
    newCategory.image = updatedCategory.image;
  }
  if (updatedCategory.pinned !== undefined) {
    newCategory.pinned = updatedCategory.pinned;
  }

  await dataService.writeData("categories", newCategory);
  return newCategory;
}

async function deleteCategory(id) {
  // Fetch all notes
  const notes = await dataService.readData("notes");

  // Find notes associated with this category
  const associatedNotes = notes.filter((note) => note.category_id === id);

  // Delete all associated notes
  for (const note of associatedNotes) {
    await dataService.deleteData("notes", note.id);
  }

  // Delete the category
  const deleted = await dataService.deleteData("categories", id);
  if (!deleted) {
    throw new Error("Failed to delete category");
  }
  return true;
}

module.exports = {
  getCategories,
  getCategoryById,
  saveCategory,
  updateCategory,
  deleteCategory,
  updateLastUsed,
};
