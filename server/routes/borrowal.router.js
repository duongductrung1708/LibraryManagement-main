const express = require('express');
const bodyParser = require('body-parser');
const { borrowalController } = require('../controllers')

const borrowalRouter = express.Router();

borrowalRouter.get('/getAll', borrowalController.getAllBorrowals)

borrowalRouter.get('/get/:id', borrowalController.getBorrowal)

borrowalRouter.post('/add' , borrowalController.addBorrowal)

borrowalRouter.put('/update/:id', borrowalController.updateBorrowal)

borrowalRouter.delete('/delete/:id', borrowalController.deleteBorrowal)




module.exports = borrowalRouter;
