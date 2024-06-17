const mongoose = require("mongoose");
const db = require('../models');
const Book = db.book;

const getBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    // Cannot find book with in invalid bookID
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      book,
    });
  } catch (err) {
    console.error(err); 

    // Other error handling
    return next(err);
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.aggregate([
      {
        $lookup: {
          from: "authors",
          localField: "authorId",
          foreignField: "_id",
          as: "author"
        },
      },
      {
        $unwind: "$author"
      },
      {
        $lookup: {
          from: "genres",
          localField: "genreId",
          foreignField: "_id",
          as: "genre"
        },
      },
      {
        $unwind: "$genre"
      }
    ]).exec();

    if (!books.length) {
      return res.status(404).json({
        success: false,
        message: "No books found"
      });
    }

    return res.status(200).json({
      success: true,
      booksList: books
    });
  } catch (err) {
    console.error(err); 

    if (err.name === 'MongoNetworkError') {
      // Cannot connect to database
      return res.status(503).json({
        success: false,
        message: "Service unavailable. Please try again later.",
        error: err.message
      });
    }
    if (err.name === 'MongoError') {
      // MongoDB error
      return res.status(500).json({
        success: false,
        message: "An error occurred with the database.",
        error: err.message
      });
    }
    // Others
    return res.status(400).json({
      success: false,
      message: "An error occurred while retrieving the books.",
      error: err.message
    });
  }
};


const addBook = async (req, res, next) => {
  try {
    const newBookData = {
      name : req.body.name,
      isbn: req.body.isbn,
      authorId: mongoose.Types.ObjectId(req.body.authorId),
      genreId: mongoose.Types.ObjectId(req.body.genreId),
      isAvailable: req.body.isAvailable,
      summary: req.body.summary,
      photoUrl: req.body.photoUrl,
    };

    console.log(newBookData);

    const newBook = new Book(newBookData);
    const savedBook = await newBook.save();

    return res.status(201).json({
      success: true,
      newBook: savedBook,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      // Database cannot validated
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: err.message,
      });
    }
    if (err.name === 'MongoError' && err.code === 11000) {
      // Duplicate key error
      return res.status(409).json({
        success: false,
        message: "Duplicate key error",
        error: err.message,
      });
    }
    // Other errors
    return next(err);
  }
};


const updateBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const updatedBook = req.body;

    // Cannot find book with in invalid bookID
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await Book.findByIdAndUpdate(bookId, updatedBook, { new: true, runValidators: true });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      updatedBook: book,
    });
  } catch (err) {
    console.error(err);

    if (err.name === 'ValidationError') {
      // Database cannot validated
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: err.message,
      });
    }
    // Others
    return next(err);
  }
};


const deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    // Cannot find book with in invalid bookID
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      deletedBook: book,
    });
  } catch (err) {
    console.error(err);

    // Các lỗi khác
    return next(err);
  }
};

const  bookController ={
  getBook,
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
}
module.exports = bookController;