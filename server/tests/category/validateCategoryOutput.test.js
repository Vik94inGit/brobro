const {
  validateCategoryOutput,
  validateCategoriesOutput,
} = require("../../abl/category/validateCategoryOutput");

describe("Category Output Validation Tests", () => {
  const validCategory = {
    id: "198a2211-2a55-4e16-82d8-55f0cbba4d7b",
    name: "Work",
    image: "https://example.com/image.jpg",
    pinned: false,
    last_used: "2024-03-15T14:30:00.000Z",
    created_at: "2024-03-15T14:30:00.000Z",
  };

  test("should validate correct category", () => {
    const result = validateCategoryOutput(validCategory);
    expect(result).toEqual(validCategory);
  });

  test("should throw error for invalid UUID", () => {
    const invalidCategory = { ...validCategory, id: "invalid-uuid" };
    expect(() => validateCategoryOutput(invalidCategory)).toThrow(/id.*uuid/);
  });

  test("should throw error for empty name", () => {
    const invalidCategory = { ...validCategory, name: "" };
    expect(() => validateCategoryOutput(invalidCategory)).toThrow(
      /name.*empty/
    );
  });

  test("should throw error for name with leading/trailing spaces", () => {
    const invalidCategory = { ...validCategory, name: " Work " };
    expect(() => validateCategoryOutput(invalidCategory)).toThrow(
      /name.*pattern/
    );
  });

  test("should throw error for invalid image URL", () => {
    const invalidCategory = { ...validCategory, image: "invalid-url" };
    expect(() => validateCategoryOutput(invalidCategory)).toThrow(
      /image.*pattern/
    );
  });

  test("should throw error for missing required fields", () => {
    const { id, ...invalidCategory } = validCategory;
    expect(() => validateCategoryOutput(invalidCategory)).toThrow(
      /id.*required/
    );
  });

  test("should throw error for additional properties", () => {
    const invalidCategory = { ...validCategory, extra: "field" };
    expect(() => validateCategoryOutput(invalidCategory)).toThrow(
      /not allowed/
    );
  });

  test("should validate array of categories", () => {
    const categories = [
      validCategory,
      { ...validCategory, id: "298b3322-3b66-5f27-93e9-66g1ddcb5e8c" },
    ];
    const result = validateCategoriesOutput(categories);
    expect(result).toEqual(categories);
  });

  test("should throw error for non-array input", () => {
    expect(() => validateCategoriesOutput(validCategory)).toThrow(
      "Categories must be an array"
    );
  });

  test("should throw error for invalid date format", () => {
    const invalidCategory = { ...validCategory, last_used: "invalid-date" };
    expect(() => validateCategoryOutput(invalidCategory)).toThrow(
      /last_used.*isoDate/
    );
  });

  test("should throw error for invalid pinned type", () => {
    const invalidCategory = { ...validCategory, pinned: "true" };
    expect(() => validateCategoryOutput(invalidCategory)).toThrow(
      /pinned.*boolean/
    );
  });
});
