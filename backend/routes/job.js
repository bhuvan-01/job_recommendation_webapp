const express = require('express');
const {
  createJob,
  updateJob,
  deleteJob,
  getJobs,
  getEmployerJobs,
  getJob,
  applyToJob,
  saveJob,
  removeSavedJob,
  getUserAppliedJobs,
  getUserSavedJobs,
} = require('../controllers/job');
const isLoggedin = require('../middlewares/isLoggedin');
const isEmployer = require('../middlewares/isEmployer');
const isAdmin = require('../middlewares/isAdmin');
const router = express.Router();


router.post('/', isLoggedin, isEmployer, createJob);
router.put('/:id', isLoggedin, isEmployer, updateJob);
router.delete('/:id', isLoggedin, isEmployer, deleteJob);
router.get('/', isLoggedin, getJobs);
router.get('/saved-jobs', isLoggedin, getUserSavedJobs);
router.get('/:id', isLoggedin, getJob);
router.get('/employer/:id', isLoggedin, isEmployer, getEmployerJobs);
router.post('/apply/:id', isLoggedin, applyToJob);
router.post('/save/:id', isLoggedin, saveJob);
router.delete('/save/:id', isLoggedin, removeSavedJob);
router.get('/applied-jobs', isLoggedin, getUserAppliedJobs);


module.exports = router;
