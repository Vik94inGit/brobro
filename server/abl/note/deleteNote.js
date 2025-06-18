const noteService = require("../../daoMethods/noteService");
const getNoteById = require("./getNoteById");

async function deleteNote(id) {
  // First verify the note exists using getNoteById which handles ID format
  await getNoteById(id);
  await noteService.deleteNote(id);
  return true;
}

module.exports = deleteNote;
