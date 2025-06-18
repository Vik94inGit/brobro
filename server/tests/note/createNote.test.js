const createNote = require("../../abl/note/createNote");
const categoryService = require("../../daoMethods/categoryService");
const noteService = require("../../daoMethods/noteService");

// Mock the services
jest.mock("../../daoMethods/categoryService");
jest.mock("../../daoMethods/noteService");

describe("Create Note Algorithm Tests", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // 1. Sequence: Load and Validate
  test("should load category and verify it exists", async () => {
    // Mock category exists
    categoryService.getCategories.mockResolvedValue([
      { id: "cat_123", name: "Test Category" },
    ]);

    // Mock note service
    noteService.saveNote.mockResolvedValue(true);

    await createNote("Test content", "cat_123");

    // Verify category was checked
    expect(categoryService.getCategories).toHaveBeenCalled();
  });

  test("should throw error if category doesn't exist", async () => {
    // Mock category doesn't exist
    categoryService.getCategories.mockResolvedValue([
      { id: "cat_123", name: "Test Category" },
    ]);

    // Try to create note with non-existent category
    await expect(createNote("Test content", "non_existent")).rejects.toThrow(
      "Category not found"
    );
  });

  // 2. Error: Validate Input
  test("should throw error if content is empty", async () => {
    await expect(createNote("", "cat_123")).rejects.toThrow(
      "Note content is required and must be a non-empty string"
    );
  });

  test("should throw error if content is only whitespace", async () => {
    await expect(createNote("   ", "cat_123")).rejects.toThrow(
      "Note content is required and must be a non-empty string"
    );
  });

  test("should throw error if content is not a string", async () => {
    await expect(createNote(123, "cat_123")).rejects.toThrow(
      "Note content is required and must be a non-empty string"
    );
  });

  // 3. Sequence: Create and Save
  test("should create note with correct structure", async () => {
    // Mock category exists
    categoryService.getCategories.mockResolvedValue([
      { id: "cat_123", name: "Test Category" },
    ]);

    // Mock note service
    noteService.saveNote.mockResolvedValue(true);

    const result = await createNote("Test content", "cat_123");

    // Verify note structure
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("content", "Test content");
    expect(result).toHaveProperty("created_at");
    expect(result).toHaveProperty("category_id", "cat_123");
  });

  test("should save note with trimmed content", async () => {
    // Mock category exists
    categoryService.getCategories.mockResolvedValue([
      { id: "cat_123", name: "Test Category" },
    ]);

    // Mock note service
    noteService.saveNote.mockResolvedValue(true);

    const result = await createNote("  Test content  ", "cat_123");

    // Verify content was trimmed
    expect(result.content).toBe("Test content");
  });

  // 4. Return: DTO
  test("should return properly filled dtoOut", async () => {
    // Mock category exists
    categoryService.getCategories.mockResolvedValue([
      { id: "cat_123", name: "Test Category" },
    ]);

    // Mock note service
    noteService.saveNote.mockResolvedValue(true);

    const result = await createNote("Test content", "cat_123");

    // Verify DTO structure
    expect(result).toEqual({
      id: expect.any(Number),
      content: "Test content",
      created_at: expect.any(String),
      category_id: "cat_123",
    });

    // Verify created_at is valid ISO date
    expect(new Date(result.created_at).toISOString()).toBe(result.created_at);
  });
});
