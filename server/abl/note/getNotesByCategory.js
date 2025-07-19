const noteService = require("../../daoMethods/noteService");
const categoryService = require("../../daoMethods/categoryService");
const { validateNote } = require("./validateNote");

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

  const validatedNotes = categoryNotes.map((note) => {
    try {
      // Your validateNote function should take the full note object (or relevant parts)
      // and return the validated version.
      // Example: validateNote({ content: note.content, category_id: note.category_id, ...other_fields })
      // Or if validateNote is designed to take the whole object:
      return validateNote(note); // Pass the individual note object
    } catch (error) {
      // Handle validation errors for individual notes
      console.warn(
        `Validation failed for note ID ${note.id}: ${error.message}`
      );
      // You might choose to:
      // a) throw the error (stopping the whole operation)
      // b) return null/undefined and filter them out later
      // c) return the original note with an 'isValid: false' flag
      // For now, let's just re-throw to indicate a serious data issue
      throw new Error(
        `Invalid note data found for note ID ${note.id}: ${error.message}`
      );
    }
  });

  // Sort notes by creation date, newest first
  validatedNotes.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return categoryNotes;
}

module.exports = getNotesByCategory;
