/**
 * @author Vivek Kumar <vivek.kumar26@live.com>
 * @license MIT
 */

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: String,
  genre: String,
  authorId: String,
});

module.exports = mongoose.model('Book', bookSchema);
