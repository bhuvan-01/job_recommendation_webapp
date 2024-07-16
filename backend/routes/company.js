const { createCompany } = require('../controllers/company');
const isEmployer = require('../middlewares/isEmployer');
const isLoggedin = require('../middlewares/isLoggedin');

const router = require('express').Router();

router.post('/', isLoggedin, isEmployer, createCompany);

module.exports = router;
