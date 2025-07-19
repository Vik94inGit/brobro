const { readData, writeData, deleteData } = require("./dataService");
const categoryService = require("./categoryService");

async function getNotes() {
  return await readData("notes");
}

async function validateNotesCategories() {
  const notes = await getNotes();
  const categories = await categoryService.getCategories();
  const categoryIds = new Set(categories.map((cat) => cat.id));

  const invalidNotes = notes.filter(
    (note) => !categoryIds.has(note.category_id)
  );

  if (invalidNotes.length > 0) {
    console.warn(`Found ${invalidNotes.length} notes with invalid categories`);
    const defaultCategoryId = categories[0]?.id;

    if (!defaultCategoryId) {
      throw new Error("No valid categories found in the system");
    }

    for (const note of invalidNotes) {
      const updatedNote = {
        ...note,
        category_id: defaultCategoryId,
      };
      await writeData("notes", updatedNote);
    }

    return {
      fixed: invalidNotes.length,
      defaultCategoryId,
    };
  }

  return { fixed: 0 };
}

async function getNotesByCategory(categoryId) {
  const notes = await getNotes();
  return notes.filter((note) => note.category_id === categoryId);
}

async function getNotesByDateRange(year, month, day, categoryId) {
  const notes = await getNotesByCategory(categoryId);

  return notes.filter((note) => {
    const noteDate = new Date(note.created_at);
    const noteYear = noteDate.getFullYear();
    const noteMonth = noteDate.getMonth() + 1;
    const noteDay = noteDate.getDate();

    const yearMatch = !year || noteYear === parseInt(year);
    const monthMatch = !month || noteMonth === parseInt(month);
    const dayMatch = !day || noteDay === parseInt(day);

    return yearMatch && monthMatch && dayMatch;
  });
}

async function getNoteById(id) {
  const notes = await getNotes();
  const note = notes.find((n) => Number(n.id) === Number(id));

  if (!note) {
    throw new Error("Note not found");
  }

  return note;
}

async function saveNote(note) {
  await writeData("notes", note);
}

async function updateNote(id, updates) {
  const note = await getNoteById(id);
  //console.log("noteService.updateNote: Found note before update:", note); // This should show the note
  if (!note) {
    throw new Error("Note not found");
  }
  console.log("noteService.updateNote: Found note before update:", note); // This should show the note
  const updatedNote = {
    ...note,
    ...updates,
  };
  console.log("noteService.updateNote: Found note before update:", note); // This should show the note
  await writeData("notes", updatedNote);

  return updatedNote;
}

async function deleteNote(id) {
  const deleted = await deleteData("notes", id);
  if (!deleted) {
    throw new Error("Failed to delete note");
  }
  return { message: "Note deleted successfully" };
}

module.exports = {
  getNotes,
  getNotesByCategory,
  getNotesByDateRange,
  getNoteById,
  saveNote,
  updateNote,
  deleteNote,
  validateNotesCategories,
};
