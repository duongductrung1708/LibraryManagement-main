const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  dob: {
    type: Date,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  isLibrarian: {
    type: Boolean,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
  hash: String,
  salt: String,
});

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
};

UserSchema.methods.isValidPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
  return this.hash === hash;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
