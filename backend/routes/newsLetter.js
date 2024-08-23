const express = require('express');
const router = express.Router();
const {subscribe} = require('../controllers/newsLetter');

router.post('/subscribe', subscribe);

module.exports = router;
