const express = require('express');
const router = express.Router();
const isLoggedin = require('../middlewares/isLoggedin');
const {
  applyToJob,
  getUserApplications,
  getJobApplications,
  updateApplicationStatus,
  getApplicationById,
} = require('../controllers/application');
const isEmployer = require('../middlewares/isEmployer');

// Get applications by user
router.get('/', isLoggedin, getUserApplications);

router.get('/:id', isLoggedin, getApplicationById);

// Get applications for a specific job
router.get('/job/:jobId', isLoggedin, getJobApplications);

// Apply to a job
router.post('/apply', isLoggedin, applyToJob);

// Update application status
router.put('/:id/status', isLoggedin, isEmployer, updateApplicationStatus);

module.exports = router;
