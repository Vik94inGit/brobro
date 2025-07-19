const dataService = require("../../daoMethods/dataService");

async function getNotesByDateRange(year, month, day, categoryId) {
  //where is destructurization?
  if (!categoryId) {
    throw new Error("Category ID is required");
  }

  const notes = await dataService.readData("notes"); // Get all notes

  // Filter by category
  const categoryNotes = notes.filter(
    (note) => String(note.category_id) === String(categoryId) //why String?
    // Ensure both IDs are strings for comparison
    // do I check if categoryId from frontend is equal to categoryId from backend?
  );

  // If no date filters, return all category notes
  if (!year) {
    return categoryNotes;
  }

  // Filter by date
  return categoryNotes.filter((note) => {
    // Filter notes by date
    // Ensure created_at is a valid date string
    const noteDate = new Date(note.created_at); // Convert created_at to Date object
    const noteYear = noteDate.getFullYear(); // Get the year from the note's created_at date. Where getFullYear declaration? getMonth and getDate the same
    const noteMonth = noteDate.getMonth() + 1;
    const noteDay = noteDate.getDate();

    // Year must match
    if (noteYear !== parseInt(year)) {
      //format and check if year is correct
      return false;
    }

    // If month provided, check month
    if (month && noteMonth !== parseInt(month)) {
      // where is month declared?
      // Check if month matches, month is 0-indexed in JavaScript, so we add 1
      return false;
    }

    // If day provided, check day
    if (day && noteDay !== parseInt(day)) {
      return false;
    }

    return true;
  });
}

module.exports = getNotesByDateRange;
