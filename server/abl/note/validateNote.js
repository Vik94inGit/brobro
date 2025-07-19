const Joi = require("joi");
const noteService = require("../../daoMethods/noteService"); // Assumed path to your data access layer

// Log the Joi and noteService imports (conceptual, usually not done in production)
console.log("[ValidationModule] Joi library loaded.");
console.log("[ValidationModule] noteService module loaded.");

// Schema for validating note creation and updates
// This defines the rules for a "new" note or a complete update
const noteSchema = Joi.object({
  content: Joi.string().trim().min(1).required(), // 'content' must be a string, whitespace trimmed, at least 1 character long, and *required*.
  category_id: Joi.string().required(), // 'category_id' must be a string. It is *not* required by default here.
});

console.log("[ValidationModule] 'noteSchema' defined.");

// Schema for validating partial note updates
// This is used when you might only want to update some fields, not all.
const updateNoteSchema = Joi.object({
  content: Joi.string().trim().min(1), // 'content' is a string, trimmed, min 1 char. *Not required* for update.
}); // Crucial: At least one of the defined fields (content or category_id) must be present in the data.

console.log("[ValidationModule] 'updateNoteSchema' defined.");

/**
 * Validates data against the noteSchema (for creation/full update).
 * @param {object} data - The data object to validate.
 * @returns {object} The validated data.
 * @throws {Error} If validation fails.
 */
function validateNote(data) {
  console.log("[validateNote] Starting validation against 'noteSchema'.");
  console.log("[validateNote] Input data:", JSON.stringify(data));

  // The 'validate' method of the Joi schema performs the actual validation.
  // 'data': The object to validate.
  // '{ abortEarly: false }': This is an options object.
  //   - 'abortEarly: false': Means Joi will collect *all* validation errors found in the data,
  //     rather than stopping at the first error it encounters.
  //     If 'true' (which is the default), it would stop at the first error.
  //     False is usually preferred for user input, so they get all feedback at once.
  //   - 'error': If validation fails, this object contains details about the errors.
  //   - 'value': If validation succeeds, this is the validated data object. Joi can coerce types
  //     or apply defaults, so 'value' might be slightly different from 'data'.
  const { error, value } = noteSchema.validate(data, { abortEarly: false });

  if (error) {
    console.warn(
      "[validateNote] Validation failed:",
      error.details.map((d) => d.message).join(", ")
    );
    // Throwing an error with a concatenated message of all validation issues.
    throw new Error(error.details.map((detail) => detail.message).join(", "));
  }

  console.log(
    "[validateNote] Validation successful. Validated value:",
    JSON.stringify(value)
  );
  return value; // Return the validated data
}

/**
 * Validates data against the updateNoteSchema (for partial updates).
 * @param {object} data - The data object to validate.
 * @returns {object} The validated data.
 * @throws {Error} If validation fails.
 */

function validateNoteUpdate(data) {
  console.log(
    "[validateNoteUpdate] Starting validation against 'updateNoteSchema'."
  );
  console.log("[validateNoteUpdate] Input data:", JSON.stringify(data));

  // Same logic as validateNote, but against the 'updateNoteSchema'.
  // This schema allows 'content' and 'category_id' to be optional individually,
  // but the '.min(1)' constraint on the schema ensures at least one of them
  // must be provided for a valid update operation.
  const { error, value } = updateNoteSchema.validate(data, {
    abortEarly: false,
  });

  if (error) {
    console.warn(
      "[validateNoteUpdate] Validation failed:",
      error.details.map((d) => d.message).join(", ")
    );
    throw new Error(error.details.map((detail) => detail.message).join(", "));
  }

  console.log(
    "[validateNoteUpdate] Validation successful. Validated value:",
    JSON.stringify(value)
  );
  return value;
}

/**
 * Validates if a note with the given ID exists in the database.
 * @param {string | number} id - The ID of the note to validate.
 * @returns {object} An object containing the found note and its numeric ID.
 * @throws {Error} If the ID is missing, invalid, or the note is not found.
 */
async function validateNoteExistWithId(id) {
  console.log(
    `[validateNoteExistWithId] Attempting to validate note with ID: ${id}`
  );

  // 1. Check for missing ID
  if (!id) {
    console.error("[validateNoteExistWithId] Error: Note ID is required.");
    throw new Error("Note ID is required");
  }

  // 2. Validate ID format (must be a number)
  const noteId = Number(id); // Convert to number
  if (isNaN(noteId)) {
    // Check if the conversion resulted in 'Not a Number'
    console.error(
      `[validateNoteExistWithId] Error: Invalid note ID format '${id}'. Must be a number.`
    );
    throw new Error("Invalid note ID format");
  }
  console.log(`[validateNoteExistWithId] Converted ID to number: ${noteId}`);

  // 3. Check if note exists in the database
  let note;
  try {
    note = await noteService.getNoteById(noteId); // Call to your data access layer
    console.log(
      `[validateNoteExistWithId] noteService.getNoteById(${noteId}) called.`
    );
  } catch (dbError) {
    console.error(
      `[validateNoteExistWithId] Database error while fetching note ID ${noteId}:`,
      dbError.message
    );
    throw new Error(`Database error: ${dbError.message}`); // Re-throw or wrap database errors
  }

  if (!note) {
    console.error(
      `[validateNoteExistWithId] Error: Note with ID ${noteId} not found.`
    );
    throw new Error("Note not found");
  }

  console.log(
    `[validateNoteExistWithId] Note with ID ${noteId} successfully found:`,
    JSON.stringify(note)
  );
  return { note, noteId }; // Return both the found note object and its numeric ID
}

// Exporting all validation functions for use in other modules
module.exports = {
  validateNote,
  validateNoteUpdate,
  validateNoteExistWithId,
};

console.log("[ValidationModule] All validation functions exported.");
