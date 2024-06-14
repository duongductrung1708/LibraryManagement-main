const mongoose = require("mongoose");
const Author = require("./author.model");
const Book = require("./book.model");
const Borrowal = require("./borrowal.model");
const Genre = require("./genre.model");
const Review = require("./review.model");
const User = require("./user.model");

const db = {
  mongoose,
  author: Author,
  book: Book,
  borrowal: Borrowal,
  genre: Genre,
  review: Review,
  user: User,
};

module.exports = db;
