require('dotenv').config()
const mongoose = require('mongoose');
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://user:${encodeURI(password)}@cluster0.pqi2h.mongodb.net/recipes?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

const Recipe = mongoose.model('Recipe', {
  title: String,
  keywords: [String],
  photo: String,
});

module.exports = {
  Recipe,
}
