const Joi = require("joi")
const PhotoService = require("../services/photo-service")
const createCrudService = require("../services/crud-service")

const keywordsSchema = Joi.array().items(Joi.string().lowercase()).min(1).max(8)

const schema = Joi.object({
  title: Joi.string().min(1).max(50).trim(),
  keywords: keywordsSchema,
  photo: Joi.string().uri().optional(),
})

const beforeSave = async document => {
  const url = await PhotoService.generatePhotoUrlFromKeywords({ keywords: document.keywords, title: document.title })
  document.photo = url;
}

const RecipeService = createCrudService({Collection: 'Recipe', schema, beforeSave});

module.exports = RecipeService;
