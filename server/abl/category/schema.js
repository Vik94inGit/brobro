// schema.js
const Joi = require("joi");

const categoryInputSchema = Joi.object({
  name: Joi.string().trim().min(1).required(), // how required works: https://joi.dev/api/?v=17.6.0#stringrequired
  image: Joi.string()
    .uri()
    // how uri works: https://joi.dev/api/?v=17.6.0#stringuri
    .pattern(/\.(jpeg|jpg|gif|png|webp)$/i)
    .allow(null, "")
    .messages({
      "string.pattern.base": "Image URL must point to a valid image file",
      "string.uri": "Image must be a valid URL",
    }),
}).strict();

const categoryOutputSchema = Joi.object({
  id: Joi.string(),
  name: Joi.string().min(1).required(),
  image: Joi.string()
    .pattern(/^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)$/)
    .allow(null, ""),
  pinned: Joi.boolean(),
  last_used: Joi.string().isoDate(),
  created_at: Joi.string().isoDate(),
}).strict();

module.exports = {
  categoryInputSchema,
  categoryOutputSchema,
};
