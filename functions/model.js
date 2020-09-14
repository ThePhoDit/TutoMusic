const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  id: String,
  dj: String,
  prefix: String
})

const model = mongoose.model('tutomusic', Schema)

module.exports = model