const express = require('express');
const {
  createJob,
  updateJob,
  deleteJob,
  getJobs,
  getJob,
} = require('../controllers/job');
const isLoggedin = require('../middlewares/isLoggedin');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// Admin Routes for managing jobs
router.post('/', isLoggedin, isAdmin, createJob);       // Create a new job
router.put('/:id', isLoggedin, isAdmin, updateJob);     // Update an existing job
router.delete('/:id', isLoggedin, isAdmin, deleteJob);  // Delete a job
router.get('/', isLoggedin, isAdmin, getJobs);          // Get all jobs
router.get('/:id', isLoggedin, isAdmin, getJob);        // Get a specific job

module.exports = router;
