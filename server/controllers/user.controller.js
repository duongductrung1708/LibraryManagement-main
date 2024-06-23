const db = require('../models');
const crypto = require('crypto');
const User = db.user;


const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ success: true, usersList: users });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const members = await User.find({ isAdmin: false });
    return res.status(200).json({ success: true, membersList: members });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    Object.assign(user, updatedData);
    if (updatedData.password) {
      user.setPassword(updatedData.password);
    }
    await user.save();

    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, deletedUser: user });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString('hex');
};


const addUser = async (req, res, next) => {
  const newUser = req.body;

  try {
    const existingUser = await User.findOne({ email: newUser.email });
    if (existingUser) {
      return res.status(403).json({ success: false, message: 'User already exists' });
    }

    const user = new User(newUser);

    const password = newUser.password || generateRandomPassword();
    user.setPassword(password);
    await user.save();

     req.emailDetails = { user, password };


    next();

  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};


const importUsers = async (req, res, next) => {
  const { users } = req.body;

  try {
    const results = [];

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        results.push({
          email: userData.email,
          success: false,
          message: 'User already exists',
        });
        continue;
      }

      const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password || generateRandomPassword(),
        dob: userData.dob || null,
        phone: userData.phone || 'N/A',
        photoUrl: userData.photoUrl || 'default-photo-url.png',
        isAdmin: userData.isAdmin || false,
        isLibrarian: userData.isLibrarian || false,
      });

      await newUser.save();

      req.emailDetails = { user: newUser, password: newUser.password };
      await sendEmail(req, res, next);

      results.push({ email: userData.email, success: true });
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error('Error importing users:', error);
    res.status(400).json({ success: false, error: 'Error importing users' });
  }
};

const userController = {
  getUser,
  getAllUsers,
  getAllMembers,
  addUser,
  updateUser,
  deleteUser,
  importUsers
};

module.exports = userController;
