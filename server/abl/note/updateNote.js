const noteService = require("../../daoMethods/noteService");
const { validateNoteUpdate } = require("./validateNote");

async function updateNote(id, updates) {
  const validatedUpdates = validateNoteUpdate(updates);
  const note = await noteService.updateNote(id, validatedUpdates);
  return note;
}

module.exports = updateNote;
