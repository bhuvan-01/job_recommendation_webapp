const express = require('express');
const {
  updateProfile,
  uploadResume,
  handleResumeUpload,
} = require('../controllers/profile');
const isLoggedin = require('../middlewares/isLoggedin');

const router = express.Router();

router.put('/update', isLoggedin, updateProfile);
router.post('/resume', isLoggedin, uploadResume, handleResumeUpload);

module.exports = router;
