const validateCategoryInput = require("../../abl/category/validateCategoryInput");

describe("Category Input Validation Tests", () => {
  const validInput = {
    name: "Work",
    image: "https://example.com/image.jpg",
  };

  test("should validate correct input", () => {
    const result = validateCategoryInput(validInput);
    expect(result).toEqual(validInput);
  });

  test("should validate input with null image", () => {
    const input = { ...validInput, image: null };
    const result = validateCategoryInput(input);
    expect(result).toEqual(input);
  });

  test("should validate input with empty image", () => {
    const input = { ...validInput, image: "" };
    const result = validateCategoryInput(input);
    expect(result).toEqual(input);
  });

  test("should throw error for empty name", () => {
    const input = { ...validInput, name: "" };
    expect(() => validateCategoryInput(input)).toThrow(/name.*empty/);
  });

  test("should throw error for name with only whitespace", () => {
    const input = { ...validInput, name: "   " };
    expect(() => validateCategoryInput(input)).toThrow(/name.*empty/);
  });

  test("should throw error for missing name", () => {
    const { name, ...input } = validInput;
    expect(() => validateCategoryInput(input)).toThrow(/name.*required/);
  });

  test("should throw error for invalid image URL", () => {
    const input = { ...validInput, image: "invalid-url" };
    expect(() => validateCategoryInput(input)).toThrow(/image.*uri/);
  });

  test("should throw error for image without valid extension", () => {
    const input = { ...validInput, image: "https://example.com/image.txt" };
    expect(() => validateCategoryInput(input)).toThrow(/image.*pattern/);
  });

  test("should throw error for additional properties", () => {
    const input = { ...validInput, extra: "field" };
    expect(() => validateCategoryInput(input)).toThrow(/not allowed/);
  });
});
