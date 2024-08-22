const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const {
  applyToJob,
  getUserApplications,
  getJobApplications,
  updateApplicationStatus,
  getApplicationById,
  getApplicationsForEmployer
} = require("../controllers/application");
const isEmployer = require("../middlewares/isEmployer");

router.get("/", isLoggedin, getUserApplications);
router.get("/:id", isLoggedin, getApplicationById);
router.get("/job/:jobId", isLoggedin, getJobApplications);
router.post("/apply", isLoggedin, applyToJob);
router.put("/:id/status", isLoggedin, isEmployer, updateApplicationStatus);
router.get('/employer/applicationsemp', isLoggedin, isEmployer, getApplicationsForEmployer);


module.exports = router;
