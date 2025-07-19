const { v4: uuidv4 } = require("uuid"); // Imports the UUID library to generate unique IDs. Specifically, it imports the 'v4' function, which generates RFC4122 version 4 UUIDs.
const categoryService = require("../../daoMethods/categoryService"); // Imports the 'categoryService' module, which likely contains functions for interacting with a data access layer (DAO) for categories (e.g., saving categories to a database). The path suggests it's located two directories up and then into 'daoMethods'.
const validateCategoryInput = require("./validateCategory"); // Imports the 'validateCategoryInput' function from the 'validateCategory.js' file, which is responsible for validating the structure and content of category data before it is saved. This ensures that the category meets certain criteria (like having a valid name and image URL).
/**
 * @async
 * @function createCategory
 * @description Creates a new category object with a unique ID, provided name and image,
 * sets initial 'pinned' status to false, and records 'last_used' and
 * 'created_at' timestamps. It then saves the category using a service.
 * @param {string} name - The name of the category.
 * @param {string} image - The URL or path to the category's image.
 * @returns {Promise<object>} A promise that resolves to the newly created category object.
 */
async function createCategory(name, image) {
  // Create new category with initial values

  const validatedData = validateCategoryInput({ name, image });
  const sanitizedName = validatedData.name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .substring(0, 10); // Sanitizes the category name by trimming whitespace, converting to lowercase, replacing spaces with hyphens, removing non-alphanumeric characters (except hyphens), and limiting the length to 50 characters.
  const category = {
    id: `${sanitizedName}-${uuidv4()}`, // Generates a unique identifier (UUID v4) for the new category. This ensures each category has a distinct ID.
    name: validatedData.name, // Assigns the provided 'name' to the category object. (Shorthand for name: name)
    image: validatedData.image, // Assigns the provided 'image' to the category object. (Shorthand for image: image)
    pinned: false, // Initializes the 'pinned' status of the category to 'false'. This might be used for UI display or prioritization.
    last_used: new Date().toISOString(), // Records the current timestamp as an ISO 8601 string for 'last_used'. This could be used for tracking usage or for sorting.
    created_at: new Date().toISOString(), // Records the current timestamp as an ISO 8601 string for 'created_at'. This marks when the category was initially created.
  };

  // Asynchronously saves the newly created category object to the database (or other persistent storage)
  // using the 'saveCategory' method provided by 'categoryService'.
  await categoryService.saveCategory(category);

  // Returns the complete category object that was just created and saved.
  return category;
}

module.exports = createCategory; // Exports the 'createCategory' function, making it available for other modules to import and use.
