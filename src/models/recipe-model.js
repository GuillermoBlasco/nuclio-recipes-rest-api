const low = require("lowdb")
const fs = require("fs")
const { nanoid } = require("nanoid")
const FileSync = require("lowdb/adapters/FileSync")

if (!fs.existsSync("./data")) fs.mkdirSync("./data")
const adapter = new FileSync("./data/recipes.json")
const database = low(adapter)

database.defaults({ recipes: [] }).write()

function findAllRecipes(filter = {}) {
  return database.get("recipes").filter(filter).value()
}

function findOneRecipe(filter) {
  return database.get("recipes").find(filter).value()
}

function saveRecipe(recipe) {
  const newRecipe = {
    id: nanoid(),
    ...recipe,
  }
  database.get("recipes").push(newRecipe).write()
  return newRecipe
}

function updateRecipe(id, fields) {
  const recipe = database.get("recipes").find({ id }).value()
  const newRecipe = {
    ...recipe,
    ...fields,
  }
  database.get("recipes").find({ id }).assign(newRecipe).write()
  return newRecipe
}

function removeRecipe(id) {
  database.get("recipes").remove({ id }).write()
}

module.exports = {
  findAllRecipes,
  findOneRecipe,
  saveRecipe,
  updateRecipe,
  removeRecipe,
}
