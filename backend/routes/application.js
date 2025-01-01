const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const {
  applyToJob,
  getUserApplications,
  getJobApplications,
  updateApplicationStatus,
  getApplicationById,
  getApplicationsForEmployer,
  getAllApplications,
  deleteApplication,
} = require("../controllers/application");
const isEmployer = require("../middlewares/isEmployer");
const isAdmin = require("../middlewares/isAdmin");

router.get("/all", isLoggedin, isAdmin, getAllApplications);
router.delete("/:id", isLoggedin, isAdmin, deleteApplication);

router.get("/", isLoggedin, getUserApplications);
router.get("/:id", isLoggedin, getApplicationById);
router.get("/job/:id", isLoggedin, getJobApplications);
router.post("/apply", isLoggedin, applyToJob);
router.put("/:id/status", isLoggedin, isEmployer, updateApplicationStatus);
router.get(
  "/employer/applicationsemp",
  isLoggedin,
  isEmployer,
  getApplicationsForEmployer
);

module.exports = router;
