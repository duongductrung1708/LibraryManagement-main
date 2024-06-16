// Import required modules
const express = require("express")
const router = express.Router()

const {loginUser} = require("../controllers/auth.controller")
// Import functions from controller
const {
    getReviewById,
    getAllReviews,
    addReview,
    updateReview,
    deleteReview,
    getReviewByBookId
} = require('../controllers/review.controller')

router.get("/getAll",getAllReviews)   

router.get("/get/:id",getReviewById)

router.get("/getByBookId/:bid",getReviewByBookId)

router.post("/add/:id",loginUser,addReview)

router.put("/update/:id",updateReview)

router.delete("/delete/:id",deleteReview)

module.exports = router;
