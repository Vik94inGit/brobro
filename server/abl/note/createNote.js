const noteService = require("../../daoMethods/noteService");
const categoryService = require("../../daoMethods/categoryService");
const { validateNote } = require("./validateNote");

async function createNote(content, category_id) {
  // Error handling for content validation
  const validated = validateNote({ content, category_id });

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
    content: validated.content.trim(),
    created_at: new Date(timestamp).toISOString(),
    category_id: validated.category_id,
  };

  await noteService.saveNote(note);
  return note;
}

module.exports = createNote;
