const express = require("express")
const router = express.Router();
const { bookController } = require("../controllers");

router.get("/getAll", bookController.getAllBooks)   

router.get("/get/:id", bookController.getBook)

router.post("/add", bookController.addBook)

router.put("/update/:id", bookController.updateBook)

router.delete("/delete/:id", bookController.deleteBook)

router.get('/genre/get/:genreId', bookController.getBooksByGenre);

router.get('/author/get/:authorId', bookController.getBooksByAuthor);

module.exports = router;
