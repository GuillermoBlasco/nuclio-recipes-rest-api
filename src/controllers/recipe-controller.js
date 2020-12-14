const { Router } = require("express")
const RecipeService = require("../services/recipe-service")
const validate = require("../middlewares/validate")

const router = Router()

router.get("/", (req, res) => {
  if (!req.query.keywords) {
    const recipes = RecipeService.getAllRecipes()
    res.status(200).json(recipes)
    return
  }
  const keywords = req.query.keywords.split(",")
  const { error, value } = RecipeService.validateKeywords(keywords)
  if (error) {
    res.status(400).json({ error: error.message })
    return
  }
  const recipes = RecipeService.getAllRecipesByKeywords(value)
  res.status(200).json(recipes)
})

router.post("/", validate(RecipeService.validateRecipe), async (req, res) => {
  const recipe = await RecipeService.createRecipe(req.body)
  res.status(201).json(recipe)
})

router.get("/:id", (req, res) => {
  const recipe = RecipeService.getById(req.params.id)
  res.status(200).json(recipe)
})

router.put("/:id", (req, res) => {
  const recipe = RecipeService.updateRecipe(req.params.id, req.body)
  res.status(201).json(recipe)
})

router.delete("/:id", (req, res) => {
  const removed = RecipeService.removeRecipe(req.params.id)
  if (removed) {
    res.status(204).end()
  } else {
    res.status(304).end()
  }
})

module.exports = router
