const express = require("express");
const {
  createUser,
  deleteUser,
  updateUser,
  getAllUsers,
  approveJob,
  getAdminStats,
  getAdminStatsByMonth,
} = require("../controllers/admin");
const isLoggedin = require("../middlewares/isLoggedin");
const isAdmin = require("../middlewares/isAdmin");
const router = express.Router();

router.post("/users", isLoggedin, isAdmin, createUser);
router.delete("/users/:id", isLoggedin, isAdmin, deleteUser);
router.put("/users/:id", isLoggedin, isAdmin, updateUser);
router.get("/users", isLoggedin, isAdmin, getAllUsers);
router.put("/jobs/:id/approve", isLoggedin, isAdmin, approveJob);


router.get("/stats", isLoggedin, isAdmin, getAdminStats);
router.get("/stats-by-month", isLoggedin, isAdmin, getAdminStatsByMonth);


module.exports = router;
