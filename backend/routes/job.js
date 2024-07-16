const express = require('express');
const {
  createJob,
  updateJob,
  deleteJob,
  getJobs,
  getEmployerJobs,
  getJob,
} = require('../controllers/job');
const isLoggedin = require('../middlewares/isLoggedin');
const isEmployer = require('../middlewares/isEmployer');

const router = express.Router();

router.post('/', isLoggedin, isEmployer, createJob);
router.put('/:id', isLoggedin, isEmployer, updateJob);
router.delete('/:id', isLoggedin, isEmployer, deleteJob);
router.get('/', getJobs);
router.get('/:id', getJob);
router.get('/employer/:id', isLoggedin, isEmployer, getEmployerJobs);

module.exports = router;
