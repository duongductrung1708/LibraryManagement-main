const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Book",
        required: true
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    review: {
        type: String,
        required: true
    },
    reviewedAt: {
        type: Date
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required:false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
   
},
{
    timestamps: true
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review;