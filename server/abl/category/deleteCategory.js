const categoryService = require("../../daoMethods/categoryService"); // Imports the 'categoryService' module, which provides methods for interacting with category data (e.g., fetching and deleting categories from a data store). The path indicates it's located two directories up and then into 'daoMethods'.

/**
 * @async
 * @function deleteCategory
 * @description Deletes a category by its ID.
 * It first verifies if a category with the given ID exists before attempting to delete it.
 * @param {string} id - The unique identifier (ID) of the category to be deleted.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the category was successfully deleted.
 * @throws {Error} Throws an error with the message "Category not found" if no category
 * with the provided ID exists.
 */
async function deleteCategory(id) {
  // Asynchronously retrieves all categories from the data store using the 'getCategories' method
  // from the 'categoryService'. This is done to check for the existence of the category
  // before attempting to delete it.
  const categories = await categoryService.getCategories();

  // Checks if any category in the retrieved 'categories' array has an 'id' that matches
  // the 'id' provided to the function. The 'some' method returns true if at least one
  // element in the array satisfies the provided testing function.
  if (!categories.some((cat) => cat.id === id)) {
    // If no category with the given 'id' is found, an Error is thrown.
    // This prevents attempting to delete a non-existent category, providing clearer feedback.
    throw new Error("Category not found");
  }

  // If the category is found, this line asynchronously calls the 'deleteCategory' method
  // of the 'categoryService', passing the 'id' of the category to be deleted.
  // The 'await' keyword ensures that the program waits for the deletion operation to complete
  // before moving on.
  await categoryService.deleteCategory(id);

  // If the deletion operation completes without throwing an error (meaning the category was found and deleted),
  // the function returns 'true' to indicate success.
  return true;
}

module.exports = deleteCategory; // Exports the 'deleteCategory' function, making it available for other modules to import and use.
