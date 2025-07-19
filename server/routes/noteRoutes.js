const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const {
  validateNote,
  validateNoteUpdate,
} = require("../abl/note/validateNote");

// Category-based routes
router.get("/category/:categoryId", noteController.getNotesByCategory);
router.get("/filter", noteController.filterNotes); // Requires categoryId query param

// Validation route
router.get("/validate-categories", noteController.validateNotesCategories);

const validateNoteMiddleware = (req, res, next) => {
  try {
    req.body = validateNote(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const validateNoteUpdateMiddleware = (req, res, next) => {
  //console.log(req.body);
  try {
    req.body = validateNoteUpdate(req.body);
    console.log("req.body: " + req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Note management routes
router.post("/bulk", validateNoteMiddleware, noteController.createBulkNotes);
router.get("/:id", noteController.getNoteById);
router.post("/", validateNoteMiddleware, noteController.createNote);
router.put("/:id", validateNoteUpdateMiddleware, noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

module.exports = router;
