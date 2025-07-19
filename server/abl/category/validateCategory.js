const categorySchema = require("./schema").categoryInputSchema;
//import validation schema

function validateCategory(data) {
  const { error, value } = categorySchema.validate(data, {
    //here is validation but I dont remember where in code used this function
    abortEarly: false, //all errors will be collected
  });

  if (error) {
    throw new Error(error.details.map((detail) => detail.message).join(", "));
    //WRITING INFO FOR EVERY ERROR
  }

  return value;
}

module.exports = validateCategory;
