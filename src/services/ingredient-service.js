const Joi = require("joi")
const createCrudService = require("../services/crud-service")

const schema = Joi.object({
  name: Joi.string().min(1).max(50).trim(),
  colour: Joi.string().min(1).max(50).trim(),
})

const IngredientService = createCrudService({Collection:'Ingredient', schema});

module.exports = IngredientService;
