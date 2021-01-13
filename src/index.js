const express = require("express")
require("express-async-errors")
const errorHandler = require("./middlewares/error-handler")
const UserService = require("./services/user-service")
const RecipeService = require("./services/recipe-service")
const IngredientService = require("./services/ingredient-service")
const createRouter = require("./controllers/crud-controller")
const fetch = require("node-fetch")
const cors = require('cors');

const app = express()
const port = process.env.PORT || 8000

app.use(cors( {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))
app.use(express.json())
app.use("/recipes", createRouter(RecipeService))
app.use("/users", createRouter(UserService))
app.use("/ingredient", createRouter(IngredientService))
app.use(errorHandler)

app.listen(port, () => console.log(`Listening on http://localhost:${port}`))

// IGNORE THIS 👇 (It's for keeping free server alive)
setInterval(() => {
  fetch("https://nuclio-recipe-rest-api.herokuapp.com/").then()
}, 20 * 60 * 1000)
