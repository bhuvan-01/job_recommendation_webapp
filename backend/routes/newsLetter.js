const express = require("express");
const router = express.Router();
const {
  subscribe,
  getAllSubscribers,
  deleteSubscriber,
} = require('../controllers/newsLetter');

const isLoggedin = require('../middlewares/isLoggedin');
const isAdmin = require('../middlewares/isAdmin')

router.post('/subscribe', subscribe);
router.get('/subscribers',isLoggedin, isAdmin, getAllSubscribers);
router.delete('/subscriber/:id',isLoggedin, isAdmin, deleteSubscriber);

module.exports = router;
