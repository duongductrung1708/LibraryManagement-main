const db = require('../models');
const Author = db.author;

//[GET] get author by id 

async function getAuthor(req, res,next) {
    try {
        const author = await Author.findById(req.params.id);
        res.status(200).json({author : author});
    } catch (error) {
        next(error);
    }
}


//[GET] get all authors
async function getAllAuthors(req, res, next) {
    try {
        const authorsList = await Author.find({});
        res.status(200).json({authorsList : authorsList});
    } catch (error) {
        next(error);
    }
}

//[POST] add a new author

async function addAuthor(req,res,next) {
    try {
        const newAuthor = await Author.create(req.body);
        res.status(200).json({newAuthor : newAuthor});
    } catch (error) {
        next(error);
    }

}


// [PUT] update author

async function updateAuthor(req, res, next) {
    try {
        const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({updatedAuthor : await Author.findById(req.params.id)});
    } catch (error) {
        next(error);
    }
}

//[DELETE] delete author
async function deleteAuthor(req, res,next) {
    try {
        const id = req.params.id
        const deletedAuthor = await Author.findByIdAndDelete(id);
        res.status(200).json({deletedAuthor : deletedAuthor});
        
    } catch (error) {
        next(error)
    }
}

const authorController={
    getAuthor,
    getAllAuthors,
    addAuthor,
    updateAuthor,
    deleteAuthor,
}

module.exports = authorController;
