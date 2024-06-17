// Import required modules
const express = require("express")
const router = express.Router();
const { bookController } = require("../controllers");

// Import functions from controller
const {
    getBook,
    getAllBooks,
    addBook,
    updateBook,
    deleteBook
} = require('../controllers/book.controller')

router.get("/getAll", bookController.getAllBooks)   

router.get("/get/:id", bookController.getBook)

router.post("/add", bookController.addBook)

router.put("/update/:id", bookController.updateBook)

router.delete("/delete/:id", bookController.deleteBook)

module.exports = router;
