const fetch = require("node-fetch")

async function generatePhotoUrlFromKeywords({ keywords, width = 1600, height = 800 }) {
  const response = await fetch(`https://source.unsplash.com/${width}x${height}/?${keywords}`)
  return response.url
}

module.exports = {
  generatePhotoUrlFromKeywords,
}
