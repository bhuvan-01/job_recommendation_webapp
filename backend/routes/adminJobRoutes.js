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

router.post('/', isLoggedin, isAdmin, createJob);       
router.put('/:id', isLoggedin, isAdmin, updateJob);     
router.delete('/:id', isLoggedin, isAdmin, deleteJob); 
router.get('/', isLoggedin, isAdmin, getJobs);         
router.get('/:id', isLoggedin, isAdmin, getJob);       

module.exports = router;
