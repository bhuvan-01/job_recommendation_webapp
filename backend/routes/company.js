const { createCompany, updateCompany, allCompanies } = require("../controllers/company");
const isEmployer = require("../middlewares/isEmployer");
const isLoggedin = require("../middlewares/isLoggedin");
const isAdmin = require("../middlewares/isAdmin");
const router = require("express").Router();

router.post("/", isLoggedin, isEmployer, createCompany);
router.put("/:id", isLoggedin, isEmployer, updateCompany);
router.get("/", isLoggedin, isAdmin, allCompanies);
module.exports = router;
