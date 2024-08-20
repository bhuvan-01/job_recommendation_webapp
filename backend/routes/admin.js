const express = require('express');
const {
  createUser,
  deleteUser,
  updateUser,
  getAllUsers,
  approveJob,
  getAdminStats,
  getAdminStatsByMonth
} = require('../controllers/admin');
const isLoggedin = require('../middlewares/isLoggedin');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// Create a new user
router.post('/users', isLoggedin, isAdmin, createUser);

// Delete a user
router.delete('/users/:id', isLoggedin, isAdmin, deleteUser);

// Update a user
router.put('/users/:id', isLoggedin, isAdmin, updateUser);

// Get all users
router.get('/users', isLoggedin, isAdmin, getAllUsers);

// Approve a job
router.put('/jobs/:id/approve', isLoggedin, isAdmin, approveJob);

router.get('/stats', isLoggedin, isAdmin, getAdminStats);

router.get('/stats-by-month', isLoggedin, isAdmin, getAdminStatsByMonth);


module.exports = router;
