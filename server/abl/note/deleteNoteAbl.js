const noteService = require("../../daoMethods/noteService");
const { validateNoteExistWithId } = require("./validateNote");

async function deleteNoteAbl(id) {
  // First verify the note exists using getNoteById which handles ID format
  await validateNoteExistWithId(id);
  await noteService.deleteNote(id);
  return {
    success: true,

    message: "Note deleted successfully",
  };
}

module.exports = deleteNoteAbl;
