const categoryService = require("../../daoMethods/categoryService"); // Imports the 'categoryService' module, which is responsible for interacting with the underlying data storage for categories (e.g., a database). It's expected to provide a method like 'getCategories'.
const { validateCategoriesOutput } = require("./validateCategoryOutput");

/**
 * @async
 * @function getAllCategories
 * @description Retrieves all categories, sorts them based on a specific hierarchy,
 * and returns the sorted list. The sorting order is:
 * 1. Pinned categories first.
 * 2. Then by 'last_used' timestamp in descending order (most recently used first).
 * 3. Finally, by 'name' in ascending alphabetical order for categories with the same 'last_used' timestamp.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of sorted category objects.
 */
async function getAllCategories() {
  // Asynchronously fetches all categories from the data store using the 'getCategories' method
  // provided by the 'categoryService'. The 'await' keyword ensures that the function execution
  // pauses until the categories are retrieved.
  const rawCategories = await categoryService.getCategories();

  const categories = validateCategoriesOutput(rawCategories); // Validate the categories output using the schema defined in validateCategoryOutput.js

  // Sort categories:
  // This block defines the custom sorting logic for the categories array.
  // The Array.prototype.sort() method sorts the elements of an array in place and returns the sorted array.
  // The comparison function (a, b) => { ... } determines the sort order.
  categories.sort((a, b) => {
    // 1. Pinned categories first (if any)
    // If category 'a' is pinned and category 'b' is not pinned, 'a' comes before 'b' (-1).
    if (a.pinned && !b.pinned) return -1;
    // If category 'a' is not pinned and category 'b' is pinned, 'b' comes before 'a' (1).
    if (!a.pinned && b.pinned) return 1;

    // 2. Then by last_used (most recent first)
    // This block is executed if both categories are either pinned or not pinned.
    // It checks if both 'a.last_used' and 'b.last_used' exist.
    if (a.last_used && b.last_used) {
      // Calculates the difference between the 'last_used' timestamps.
      // 'new Date(b.last_used) - new Date(a.last_used)' will return:
      // - A positive number if b.last_used is more recent than a.last_used (b comes before a for descending order).
      // - A negative number if a.last_used is more recent than b.last_used (a comes before b).
      // - 0 if they are the same.
      const lastUsedCompare = new Date(b.last_used) - new Date(a.last_used);
      // If the timestamps are different, return the comparison result. This prioritizes more recent items.
      if (lastUsedCompare !== 0) return lastUsedCompare;
    }

    // 3. Then by name for categories with same last_used (or if last_used is not set)
    // If both categories have the same 'last_used' timestamp (or if 'last_used' is not available for comparison),
    // then sort them alphabetically by their 'name'.
    // 'localeCompare' is used for proper alphabetical string comparison, handling different locales.
    return a.name.localeCompare(b.name);
  });

  // Returns the array of categories, now sorted according to the defined rules.
  return categories;
}

module.exports = getAllCategories; // Exports the 'getAllCategories' function, making it available for other modules to import and use.
