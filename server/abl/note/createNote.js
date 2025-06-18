const noteService = require("../../daoMethods/noteService");
const categoryService = require("../../daoMethods/categoryService");

async function createNote(content, category_id) {
  // Error handling for content validation
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new Error("Note content is required and must be a non-empty string");
  }

  // Error handling for category validation
  if (!category_id) {
    throw new Error("Category ID is required");
  }

  const categories = await categoryService.getCategories();
  if (!categories.some((cat) => cat.id === category_id)) {
    throw new Error("Category not found");
  }

  const timestamp = Date.now();
  const note = {
    id: timestamp,
    content: content.trim(),
    created_at: new Date(timestamp).toISOString(),
    category_id,
  };

  await noteService.saveNote(note);
  return note;
}

module.exports = createNote;
