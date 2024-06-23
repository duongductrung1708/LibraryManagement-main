const express = require("express")
const router = express.Router();
const sendEmail = require('../middleware/mailer');

const {
  getUser,
  getAllUsers,
  getAllMembers,
  addUser,
  updateUser,
  deleteUser,
  importUsers
} = require('../controllers/user.controller')

router.get("/getAll", (req, res) => getAllUsers(req, res))

router.get("/getAllMembers", (req, res) => getAllMembers(req, res))

router.get("/get/:id", (req, res) => getUser(req, res))

router.post("/add",addUser,sendEmail)

router.put("/update/:id", (req, res) => updateUser(req, res))

router.delete("/delete/:id", (req, res) => deleteUser(req, res))

router.post("/import", importUsers,sendEmail)

module.exports = router;
