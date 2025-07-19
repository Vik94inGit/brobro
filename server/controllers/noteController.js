const createNote = require("../abl/note/createNote");

const deleteNoteAbl = require("../abl/note/deleteNoteAbl");
const getNotesByDateRange = require("../abl/note/filterNotes");
const getNotesByCategory = require("../abl/note/getNotesByCategory");
const noteService = require("../daoMethods/noteService");
const { validateNoteExistWithId } = require("../abl/note/validateNote");

exports.getNotes = async (req, res) => {
  try {
    const { categoryId } = req.query;

    if (!categoryId) {
      return res.status(400).json({ error: "Category ID is required" });
    }

    const notes = await noteService.getNotesByCategory(categoryId);
    res.json(notes);
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes("required")) {
      res.status(400).json({ error: error.message });
    } else {
      console.error("Error in getNotes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching note with ID:", id);
    const note = await validateNoteExistWithId(id);
    res.json(note);
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("required")
    ) {
      res.status(404).json({ error: error.message });
    } else {
      console.error("Error in getNoteById:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.createNote = async (req, res) => {
  try {
    const { content, category_id } = req.body;
    const note = await createNote(content, category_id);
    res.status(201).json(note);
  } catch (error) {
    if (
      error.message.includes("required") ||
      error.message.includes("not found")
    ) {
      res.status(400).json({ error: error.message });
    } else {
      console.error("Error in createNote:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Backend received ID from URL:", id); // Add this log!
    console.log("Backend received updates:", req.body); // Add this log!
    const note = await noteService.updateNote(id, req.body);
    res.json(note);
  } catch (error) {
    if (
      error.message.includes("required") ||
      error.message.includes("not found")
    ) {
      res.status(400).json({ error: error.message });
    } else {
      console.error("Error in updateNote:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteNoteAbl(id);
    res.json({ success: result });
  } catch (error) {
    if (
      error.message.includes("required") ||
      error.message.includes("not found")
    ) {
      res.status(400).json({ error: error.message });
    } else {
      console.error("Error in deleteNote:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.filterNotes = async (req, res) => {
  try {
    const { year, month, day, categoryId } = req.query;

    // Validate categoryId
    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    // Validate year if provided
    if (year && isNaN(parseInt(year))) {
      throw new Error("Invalid year format");
    }

    // Validate month if provided
    if (
      month &&
      (isNaN(parseInt(month)) || parseInt(month) < 1 || parseInt(month) > 12)
    ) {
      throw new Error("Invalid month format");
    }

    // Validate day if provided
    if (
      day &&
      (isNaN(parseInt(day)) || parseInt(day) < 1 || parseInt(day) > 31)
    ) {
      throw new Error("Invalid day format");
    }

    const notes = await getNotesByDateRange(year, month, day, categoryId);
    res.json(notes);
  } catch (error) {
    if (
      error.message.includes("Invalid") ||
      error.message.includes("date") ||
      error.message.includes("required")
    ) {
      res.status(400).json({ error: error.message });
    } else {
      console.error("Error in filterNotes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.validateNotesCategories = async (req, res) => {
  try {
    const result = await noteService.validateNotesCategories();
    res.json(result);
  } catch (error) {
    console.error("Error validating note categories:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createBulkNotes = async (req, res) => {
  try {
    const { category_id, notes } = req.body;

    if (!category_id) {
      throw new Error("Category ID is required");
    }

    if (!Array.isArray(notes) || notes.length === 0) {
      throw new Error("Notes must be a non-empty array");
    }

    // Validate that all notes have content
    const invalidNotes = notes.filter(
      (note) =>
        !note.content ||
        typeof note.content !== "string" ||
        note.content.trim().length === 0
    );
    if (invalidNotes.length > 0) {
      throw new Error(
        `Invalid notes found: ${invalidNotes.length} notes are missing content`
      );
    }

    const createdNotes = [];
    for (const noteContent of notes) {
      const note = await createNote(noteContent.content, category_id);
      createdNotes.push(note);
    }

    res.status(201).json({
      message: `Successfully created ${createdNotes.length} notes`,
      notes: createdNotes,
    });
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("required")
    ) {
      res.status(400).json({ error: error.message });
    } else {
      console.error("Error in createBulkNotes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.getNotesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const notes = await getNotesByCategory(categoryId);
    res.json(notes);
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes("required")) {
      res.status(400).json({ error: error.message });
    } else {
      console.error("Error in getNotesByCategory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
