const express = require("express");
const isLoggedin = require("../middlewares/isLoggedin");
const {
  getUserById,
  getAllUsers,
  updateUser,
  uploadUserPhoto,
  uploadUserResume,
  deleteUser,
} = require("../controllers/user");
const { getUserAppliedJobs } = require("../controllers/job");
const Notification = require("../models/Notification");
const router = express.Router();

// get notifications
router.get("/notifications", isLoggedin, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    });

    return res.status(200).json({
      notifications,
      message: "Notifications fetched successfully",
    });
  } catch (error) {
    console.log("Error while fetching notifications: ", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// get specific user
router.get("/:id", isLoggedin, getUserById);

// get all users
router.get("/", isLoggedin, getAllUsers);

// update user
router.put("/:id", isLoggedin, updateUser);

// upload photo
router.post("/photo", isLoggedin, uploadUserPhoto);

// upload resume
router.post("/resume", isLoggedin, uploadUserResume);

router.delete("/delete", isLoggedin, deleteUser);

module.exports = router;
