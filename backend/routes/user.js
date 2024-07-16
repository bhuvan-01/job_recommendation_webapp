const express = require('express');
const isLoggedin = require('../middlewares/isLoggedin');
const {
  getUserById,
  getAllUsers,
  updateUser,
  uploadUserPhoto,
  uploadUserResume,
} = require('../controllers/user');
const router = express.Router();

// get specific user
router.get('/:id', isLoggedin, getUserById);

// get all users
router.get('/', isLoggedin, getAllUsers);

// update user
router.put('/:id', isLoggedin, updateUser);

// upload photo
router.post('/photo', isLoggedin, uploadUserPhoto);

// upload resume
router.post('/resume', isLoggedin, uploadUserResume);

module.exports = router;
