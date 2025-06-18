const Joi = require("joi");
const noteService = require("../../daoMethods/noteService");

const noteSchema = Joi.object({
  content: Joi.string().trim().min(1).required(),
  category_id: Joi.string().required(),
});

const updateNoteSchema = Joi.object({
  content: Joi.string().trim().min(1),
  category_id: Joi.string(),
}).min(1); // At least one field must be provided

function validateNote(data) {
  const { error, value } = noteSchema.validate(data, { abortEarly: false });

  if (error) {
    throw new Error(error.details.map((detail) => detail.message).join(", "));
  }

  return value;
}

function validateNoteUpdate(data) {
  const { error, value } = updateNoteSchema.validate(data, {
    abortEarly: false,
  });

  if (error) {
    throw new Error(error.details.map((detail) => detail.message).join(", "));
  }

  return value;
}

function validateNoteId(id) {
  if (!id) {
    throw new Error("Note ID is required");
  }
  const noteId = Number(id);
  if (isNaN(noteId)) {
    throw new Error("Invalid note ID format");
  }
  return noteId;
}

async function verifyNoteExists(id) {
  // First validate the ID format
  const noteId = validateNoteId(id);

  // Try to get the note
  const note = await noteService.getNoteById(noteId);

  // If note doesn't exist, throw error
  if (!note) {
    throw new Error("Note not found");
  }

  return note;
}

module.exports = {
  validateNote,
  validateNoteUpdate,
  validateNoteId,
  verifyNoteExists,
};
