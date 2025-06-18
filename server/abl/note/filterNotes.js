const dataService = require("../../daoMethods/dataService");
const fs = require("fs").promises;
const path = require("path");
const categoryService = require("../../daoMethods/categoryService");

async function getNotes() {
  return await dataService.readData("notes");
}

async function getNotesByDateRange(year, month, day, categoryId) {
  if (!categoryId) {
    throw new Error("Category ID is required");
  }

  const notes = await dataService.readData("notes");

  // Filter by category
  const categoryNotes = notes.filter(
    (note) => String(note.category_id) === String(categoryId)
  );

  // If no date filters, return all category notes
  if (!year) {
    return categoryNotes;
  }

  // Filter by date
  return categoryNotes.filter((note) => {
    const noteDate = new Date(note.created_at);
    const noteYear = noteDate.getFullYear();
    const noteMonth = noteDate.getMonth() + 1;
    const noteDay = noteDate.getDate();

    // Year must match
    if (noteYear !== parseInt(year)) {
      return false;
    }

    // If month provided, check month
    if (month && noteMonth !== parseInt(month)) {
      return false;
    }

    // If day provided, check day
    if (day && noteDay !== parseInt(day)) {
      return false;
    }

    return true;
  });
}

async function getNoteById(id) {
  return await dataService.readItemById("notes", id);
}

async function saveNote(note) {
  await dataService.writeData("notes", note);
}

async function updateNote(id, updates) {
  const note = await dataService.readItemById("notes", id);
  if (!note) {
    return null;
  }

  if (!updates || typeof updates !== "object") {
    throw new Error("Updates must be a valid object");
  }
  if (
    "content" in updates &&
    (!updates.content ||
      typeof updates.content !== "string" ||
      updates.content.trim().length === 0)
  ) {
    throw new Error("Content must be a non-empty string");
  }
  if (
    "categoryId" in updates &&
    (!updates.categoryId || typeof updates.categoryId !== "string")
  ) {
    throw new Error("Category ID must be a non-empty string");
  }

  if ("content" in updates) {
    note.content = updates.content.trim();
  }
  if ("categoryId" in updates) {
    note.category_id = updates.categoryId;
  }

  await saveNote(note);
  return note;
}

async function deleteNote(id) {
  const deleted = await dataService.deleteData("notes", id);
  return deleted;
}

module.exports = {
  getNotes,
  getNotesByDateRange,
  getNoteById,
  saveNote,
  updateNote,
  deleteNote,
};
