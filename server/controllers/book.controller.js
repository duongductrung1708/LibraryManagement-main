const Book = require('../models/book.model')
const mongoose = require("mongoose");

const getBook = async (req, res) => {
  const bookId = req.params.id;

  Book.findById(bookId, (err, book) => {
    if (err) {
      if (err.kind === 'ObjectId') {
        // Cannot find book with in invalid bookID
        return res.status(400).json({
          success: false,
          message: "Invalid book ID"
        });
      }
      // Other errors
      return res.status(500).json({
        success: false,
        message: "An error occurred while retrieving the book",
        error: err.message
      });
    }

    if (!book) {
      // Cannot find book with valid bookID
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // Successfully found the book
    return res.status(200).json({
      success: true,
      book
    });
  });
};

const getAllBooks = async (req, res) => {
  Book.aggregate([
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
  ]).exec((err, books) => {
    if (err) {
      if (err.name === 'MongoNetworkError') {
        // False to connect database server
        return res.status(503).json({
          success: false,
          message: "Service unavailable. Please try again later.",
          error: err.message
        });
      }
      if (err.name === 'MongoError') {
        // Mongo error
        return res.status(500).json({
          success: false,
          message: "An error occurred with the database.",
          error: err.message
        });
      }
      //  Other errors
      return res.status(400).json({
        success: false,
        message: "An error occurred while retrieving the books.",
        error: err.message
      });
    }

    if (!books.length) {
      // No books found
      return res.status(404).json({
        success: false,
        message: "No books found"
      });
    }

    // Successfully
    return res.status(200).json({
      success: true,
      booksList: books
    });
  });
};


const addBook = async (req, res) => {
  const newBook = {
    ...req.body,
    genreId: mongoose.Types.ObjectId(req.body.genreId),
    authorId: mongoose.Types.ObjectId(req.body.authorId)
  };

  console.log(newBook);

  Book.create(newBook, (err, book) => {
    if (err) {
      if (err.name === 'ValidationError') {
        // Database cannot validated
        return res.status(400).json({
          success: false,
          message: "Validation error",
          error: err.message
        });
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        // Dup key
        return res.status(409).json({
          success: false,
          message: "Duplicate key error",
          error: err.message
        });
      }
      // Other errors
      return res.status(500).json({
        success: false,
        message: "An error occurred while adding the book",
        error: err.message
      });
    }

    // Add book successfully
    return res.status(201).json({
      success: true,
      newBook: book
    });
  });
};


const updateBook = async (req, res) => {
  const bookId = req.params.id;
  const updatedBook = req.body;

  Book.findByIdAndUpdate(bookId, updatedBook, { new: true, runValidators: true }, (err, book) => {
    if (err) {
      if (err.kind === 'ObjectId') {
        // 
        return res.status(400).json({
          success: false,
          message: "Invalid book ID",
          error: err.message
        });
      }
      if (err.name === 'ValidationError') {
        // Lỗi xác thực dữ liệu
        return res.status(400).json({
          success: false,
          message: "Validation error",
          error: err.message
        });
      }
      // Các lỗi khác
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the book",
        error: err.message
      });
    }

    if (!book) {
      // Trường hợp không tìm thấy sách với ID hợp lệ
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // Trường hợp cập nhật sách thành công
    return res.status(200).json({
      success: true,
      updatedBook: book
    });
  });
};


const deleteBook = async (req, res) => {
  const bookId = req.params.id;

  Book.findByIdAndDelete(bookId, (err, book) => {
    if (err) {
      if (err.kind === 'ObjectId') {
        // Cannot find book with in invalid bookID
        return res.status(400).json({
          success: false,
          message: "Invalid book ID",
          error: err.message
        });
      }
      // Other errors
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the book",
        error: err.message
      });
    }

    if (!book) {
      // Cannot find book with valid bookID
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // Delete book successfully
    return res.status(200).json({
      success: true,
      deletedBook: book
    });
  });
};


module.exports = {
  getBook,
  getAllBooks,
  addBook,
  updateBook,
  deleteBook
}
