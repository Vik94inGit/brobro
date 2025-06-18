const noteService = require("../../daoMethods/noteService");

async function getNoteById(id) {
  if (!id) {
    throw new Error("Note ID is required");
  }

  const note = await noteService.getNoteById(id);
  if (!note) {
    throw new Error("Note not found");
  }

  return note;
}

module.exports = getNoteById;
