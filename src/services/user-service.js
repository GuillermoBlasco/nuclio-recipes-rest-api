const Joi = require("joi")
const createCrudService = require("../services/crud-service")

const schema = Joi.object({
  name: Joi.string().min(1).max(50).trim(),
  email: Joi.string().min(1).max(50).trim(),
})

const UserService = createCrudService({Collection:'User', schema});

module.exports = UserService;
