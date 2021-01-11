const { Router } = require("express")
const RecipeService = require("../services/recipe-service")
const validate = require("../middlewares/validate")

const router = Router()

const isInt = text => !isNaN(parseInt(text));

// todo migrate to mongodb
router.get("/", (req, res) => {
  const page = parseInt(req.query.page || 0);
  const pageSize = parseInt(req.query.pageSize || 10);
  let keywords = req.query.keywords;
  const serviceData = {
    title: req.query.title,
  };
  if (!isInt(page) || page < 0) {
    res.status(400).json({"message": "page should be a non negative number"})
    return
  }
  serviceData.page = page;
  if (!isInt(pageSize) || pageSize < 0) {
    res.status(400).json({"message": "page size should be a non negative number"})
    return
  }
  serviceData.pageSize = pageSize;
  if (keywords) {
    keywords = keywords.split(',');
    const { error, value } = RecipeService.validateKeywords(keywords)
    if (error) {
      res.status(400).json({ error: error.message })
      return
    }
    serviceData.keywords = keywords;
  }
  const recipes = RecipeService.getAllRecipesByKeywords(serviceData)
  res.status(200).json(recipes)
})

router.post("/", validate(RecipeService.validateRecipe), async (req, res) => {
  const recipe = await RecipeService.createRecipe(req.body)
  res.status(201).json(recipe)
})

router.get("/:id", async (req, res) => {
  const recipe = await RecipeService.getById(req.params.id)
  res.status(200).json(recipe)
})

// todo migrate to mongodb
router.put("/:id", (req, res) => {
  const recipe = RecipeService.updateRecipe(req.params.id, req.body)
  res.status(201).json(recipe)
})

// todo migrate to mongodb
router.delete("/:id", (req, res) => {
  const removed = RecipeService.removeRecipe(req.params.id)
  if (removed) {
    res.status(204).end()
  } else {
    res.status(304).end()
  }
})

module.exports = router


const database = {};
