//import express
const express = require("express")
const router = express.Router();

// Import functions from controller
const {
    getAuthor,// done
    getAllAuthors,// done
    addAuthor,//done
    updateAuthor,//done
    deleteAuthor//done
} = require('../controllers/author.controller')

router.get("/getAll",getAllAuthors)

router.get("/get/:id", getAuthor)

router.post("/add",addAuthor)

router.put("/update/:id",updateAuthor)

router.delete("/delete/:id",deleteAuthor)

module.exports = router;
