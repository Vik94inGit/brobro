const Joi = require("joi");

const categoryInputSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  image: Joi.string()
    .uri()
    .pattern(/\.(jpeg|jpg|gif|png|webp)$/i)
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "Image URL must point to a valid image file (jpeg, jpg, gif, png, webp)",
      "string.uri": "Image must be a valid URL",
    }),
}).strict();

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
