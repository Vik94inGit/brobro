const categoryService = require("../../daoMethods/categoryService");
const { validateCategoryOutput } = require("./validateCategoryOutput");
//import method for getting categories from service

async function getCategoryById(id) {
  //asynchronni funkce, která vrací kategorii podle ID
  const category = await categoryService.getCategoryById(id);

  console.log("getCategoryById", category);
  //evoke categoryService.getCategoryById
  if (!category) {
    //JESTLI CATEGORIE NEEXISTUJE HODIT CHYBU S HLAŠKOU Category not found
    throw new Error("Category not found");
  }
  const validatedCategory = validateCategoryOutput(category); // Validate the category output using the schema defined in validateOutputCategory.js
  // Validate the category object against the schema defined in 'validateOutputCategory.js' to ensure
  return validatedCategory;
  //NAVRAT CATEGORII
}

module.exports = getCategoryById;
