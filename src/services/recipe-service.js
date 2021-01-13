const Joi = require("joi")
const PhotoService = require("../services/photo-service")
const mongoose = require('../models/mongoose');

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
    recipe.photo = await PhotoService.generatePhotoUrlFromKeywords({ keywords: recipe.keywords, title: recipe.title })
  }
  const newlyCreatedRecipe = new mongoose.Recipe(recipe);
  return newlyCreatedRecipe.save();
}

async function updateRecipe(id, fields) {
  const recipe = await mongoose.Recipe.findById(id).exec();
  if (fields.keywords || fields.title) {
    const photoData = {
      ...recipe,
      ...fields,
    }
    fields.photo = await PhotoService.generatePhotoUrlFromKeywords(photoData);
  }
  Object.keys(fields)
    .forEach(key => {
      recipe[key] = fields[key];
    });
  await recipe.save();
  return recipe;
}

async function removeRecipe(id) {
  const response = await mongoose.Recipe.findByIdAndDelete(id).exec();
  return response !== null;
}

function getAllRecipesByKeywords({keywords, title, page, pageSize}) {
  const query = {};
  if (title) {
    query.title = title;
  }
  if (keywords) {
    query.keywords = { $in: keywords };
  }
  return mongoose.Recipe.find(query).skip(page * pageSize).limit(pageSize);
}

function getById(id) {
  return mongoose.Recipe.findById(id).exec();
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
