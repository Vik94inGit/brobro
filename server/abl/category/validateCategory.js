const Joi = require("joi");

const categorySchema = Joi.object({
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
});

function validateCategory(data) {
  const { error, value } = categorySchema.validate(data, {
    abortEarly: false,
  });

  if (error) {
    throw new Error(error.details.map((detail) => detail.message).join(", "));
  }

  return value;
}

module.exports = validateCategory;
