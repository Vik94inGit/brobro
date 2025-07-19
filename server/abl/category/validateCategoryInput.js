const { categoryInputSchema } = require("./schema");

function validateCategoryInput(data) {
  const { error, value } = categoryInputSchema.validate(data, {
    abortEarly: false,
  });

  if (error) {
    throw new Error(error.details.map((detail) => detail.message).join(", "));
  }

  return value;
}

module.exports = validateCategoryInput;
