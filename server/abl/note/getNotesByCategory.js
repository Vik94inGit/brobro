const noteService = require("../../daoMethods/noteService");
const categoryService = require("../../daoMethods/categoryService");

async function getNotesByCategory(categoryId) {
  if (!categoryId) {
    throw new Error("Category ID is required");
  }

  // Verify category exists
  const category = await categoryService.getCategoryById(categoryId);
  if (!category) {
    throw new Error("Category not found");
  }

  // Get and filter notes
  const notes = await noteService.getNotes();
  const categoryNotes = notes.filter((note) => note.category_id === categoryId);

  // Sort notes by creation date, newest first
  categoryNotes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return categoryNotes;
}

module.exports = getNotesByCategory;
