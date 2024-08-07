const express = require('express');
const validateData = require('../middlewares/validateData');
const { userLoginSchema, userSignupSchema } = require('../schemas/userSchemas');
const {
  login,
  signup,
  forgotPassword,
  resetPassword,
  getLoggedinUser,
} = require('../controllers/auth');
const isLoggedin = require('../middlewares/isLoggedin');
const router = express.Router();

router.post('/login', validateData(userLoginSchema), login);
router.post('/signup', validateData(userSignupSchema), signup);
router.post('/forget-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/user', isLoggedin, getLoggedinUser);

module.exports = router;
