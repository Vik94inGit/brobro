const { categoryOutputSchema } = require("./schema");

function validateCategoryOutput(category) {
  const { error, value } = categoryOutputSchema.validate(category, {
    abortEarly: false,
    stripUnknown: true, // Remove any properties not in schema
  });

  if (error) {
    throw new Error(error.details.map((detail) => detail.message).join(", "));
  }

  return value;
}

function validateCategoriesOutput(categories) {
  if (!Array.isArray(categories)) {
    throw new Error("Categories must be an array");
  }

  return categories.map((category) => validateCategoryOutput(category));
}

module.exports = {
  validateCategoryOutput,
  validateCategoriesOutput,
};
