require('dotenv').config()
const mongoose = require('mongoose');
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://user:${encodeURI(password)}@cluster0.pqi2h.mongodb.net/recipes?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

const Recipe = mongoose.model('Recipe', {
  title: String,
  keywords: [String],
  photo: String,
});

const Ingredient = mongoose.model('Ingredient', {
  name: String,
  colour: String,
});
const User = mongoose.model('User', {
  name: String,
  email: String,
});

module.exports = {
  Recipe,
  Ingredient,
  User,
}
