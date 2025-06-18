const Joi = require("joi");

const categoryOutputSchema = Joi.object({
  id: Joi.string().uuid().required(),
  name: Joi.string()
    .min(1)
    .pattern(/^\S.*\S$/)
    .required(),
  image: Joi.string()
    .pattern(/^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)$/)
    .required(),
  pinned: Joi.boolean().required(),
  last_used: Joi.string().isoDate().required(),
  created_at: Joi.string().isoDate().required(),
}).strict(); // additionalProperties: false

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
