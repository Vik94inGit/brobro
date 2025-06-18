const {
  verifyNoteExists,
  validateNoteId,
} = require("../../abl/note/validateNote");
const noteService = require("../../daoMethods/noteService");

// Mock the note service
jest.mock("../../daoMethods/noteService");

describe("Note Existence Verification Tests", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("should verify existing note", async () => {
    // Mock an existing note
    const mockNote = {
      id: 123,
      content: "Test note",
      category_id: "cat_123",
    };
    noteService.getNoteById.mockResolvedValue(mockNote);

    const result = await verifyNoteExists("123");
    expect(result).toEqual(mockNote);
  });

  test("should throw error for non-existent note", async () => {
    // Mock non-existent note
    noteService.getNoteById.mockResolvedValue(null);

    await expect(verifyNoteExists("123")).rejects.toThrow("Note not found");
  });

  test("should throw error for invalid ID format", async () => {
    await expect(verifyNoteExists("invalid")).rejects.toThrow(
      "Invalid note ID format"
    );
  });

  test("should throw error for missing ID", async () => {
    await expect(verifyNoteExists()).rejects.toThrow("Note ID is required");
  });

  test("should throw error for null ID", async () => {
    await expect(verifyNoteExists(null)).rejects.toThrow("Note ID is required");
  });

  test("should throw error for undefined ID", async () => {
    await expect(verifyNoteExists(undefined)).rejects.toThrow(
      "Note ID is required"
    );
  });
});
