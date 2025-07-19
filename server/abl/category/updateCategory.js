const categoryService = require("../../daoMethods/categoryService");
const getCategoryById = require("./getCategoryById");
const validateCategoryInput = require("./validateCategoryInput");
//import from dao and categorzservice to work and update in database info about categorz

async function updateCategory(id, name, image) {
  //accept parameters for name, id category and image
  const categories = await categoryService.getCategories();
  //I dont remember why I need all categories here and how it is realiyed if I import only getById
  const category = await getCategoryById(id);

  const otherCategories = categories.filter((cat) => cat.id !== id);
  //ensure that id is unieq
  if (
    otherCategories.some((cat) => cat.name.toLowerCase() === name.toLowerCase())
    //check if name is unique, if not throw error
    //if name is not unique, throw error
  ) {
    throw new Error("Category name must be unique");
  }

  const { error, value } = validateCategoryInput({ name, image });
  if (error) {
    throw new Error(error.details.map((d) => d.message).join(", "));
  }

  const updatedCategory = {
    name: value.name,
    image: value.image ? image : category.image,
    last_used: new Date().toISOString(),
  };
  //create new object with uniq name

  await categoryService.updateCategory(id, updatedCategory);
  //save on backend changes with id and updatedCategory
  return { id, ...updatedCategory };
}

module.exports = updateCategory;
