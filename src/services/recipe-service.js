const Joi = require("joi")
const RecipeModel = require("../models/recipe-model")
const PhotoService = require("../services/photo-service")

const keywordsSchema = Joi.array().items(Joi.string().lowercase()).min(1).max(8)

const recipeSchema = Joi.object({
  title: Joi.string().min(1).max(50).trim(),
  keywords: keywordsSchema,
  photo: Joi.string().uri().optional(),
})

function validateRecipe(recipe) {
  const { error, value } = recipeSchema.validate(recipe)
  return { error, value }
}

function validateKeywords(keywords) {
  const { error, value } = keywordsSchema.validate(keywords)
  return { error, value }
}


async function createRecipe(recipe) {
  if (!recipe.photo) {
    recipe.photo = await PhotoService.generatePhotoUrlFromKeywords({ keywords: recipe.keywords })
  }
  return RecipeModel.saveRecipe(recipe)
}

function updateRecipe(id, fields) {
  return RecipeModel.updateRecipe(id, fields)
}

function removeRecipe(id) {
  const recipe = RecipeModel.findOneRecipe({ id })
  if (!recipe) {
    return false
  }
  RecipeModel.removeRecipe(id)
  return true
}

function getAllRecipesByKeywords({keywords, page, pageSize}) {
  let data = RecipeModel.findAllRecipes()
  if (keywords) {
    data = data.filter(recipe => recipe.keywords.some(keyword => keywords.includes(keyword)));
  }
  return paginate(data, page, pageSize);
}

function paginate(data, page, pageSize) {
  const pageData = data.slice(page * pageSize, (page + 1) * pageSize);
  return {
    contents: pageData,
    totalElements: data.length,
    page: page,
    pageSize: pageSize,
  };
}

function getById(id) {
  const recipe = RecipeModel.findOneRecipe({ id })
  if (!recipe) return null
  return recipe
}

module.exports = {
  getAllRecipesByKeywords,
  getById,
  createRecipe,
  updateRecipe,
  removeRecipe,
  validateRecipe,
  validateKeywords,
}
