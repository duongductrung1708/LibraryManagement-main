const authController = require('./auth.controller');
const authorController = require('./author.controller');
const bookController = require('./book.controller');
const genreController = require('./genre.controller');
const memberController = require('./member.controller');
const reviewController = require('./review.controller');
const userController = require('./user.controller');
const borrowalController = require('./borrowal.controller');

module.exports = {
    authController,
    authorController,
    bookController,
    borrowalController,
    genreController,
    memberController,
    reviewController,
    userController,
}