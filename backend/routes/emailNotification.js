const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Route to update the email notification setting
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { emailNotifications } = req.body;

    // Find the user by ID and update the emailNotifications field
    const user = await User.findByIdAndUpdate(
      userId,
      { emailNotifications },
      { new: true, select: "emailNotifications" } // Return the updated field
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ emailNotifications: user.emailNotifications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
