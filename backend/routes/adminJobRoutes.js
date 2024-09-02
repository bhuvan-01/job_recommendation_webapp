const express = require("express");
const { deleteJob, getJobs} = require("../controllers/job");
const { createJob, updateJob, getAllJobs} = require("../controllers/Adminjob");

const isLoggedin = require("../middlewares/isLoggedin");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.post("/create", isLoggedin, isAdmin, createJob);
router.put("/:id", isLoggedin, isAdmin, updateJob);
router.delete("/:id", isLoggedin, isAdmin, deleteJob);
router.get("/", isLoggedin, isAdmin, getAllJobs);
router.get("/:id", isLoggedin, isAdmin, getAllJobs);

module.exports = router;
