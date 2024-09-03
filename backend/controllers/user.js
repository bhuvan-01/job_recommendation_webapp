const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createUploadDirectories = () => {
  const directories = ["uploads", "uploads/photos", "uploads/resumes"];
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirectories();

// Setup Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "photo") {
      cb(null, "uploads/photos/");
    } else if (file.fieldname === "resume") {
      cb(null, "uploads/resumes/");
    } else {
      cb(null, "uploads/");
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // Limit file size to 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  const photoTypes = /jpeg|jpg|png|webp/;
  const resumeTypes = /pdf|doc|docx/;

  const extname =
    photoTypes.test(path.extname(file.originalname).toLowerCase()) ||
    resumeTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    photoTypes.test(file.mimetype) || resumeTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error("Error: Images and PDF/DOC files only!"));
  }
}

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      message: "Users fetched successfully!",
      users,
    });
  } catch (error) {
    console.log("error while fetching users: ", error);
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("company");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User fetched successfully!",
      user,
    });
  } catch (error) {
    console.log("error while fetching user: ", error);
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    // console.log(`patch: `, req.body.profile.achievements);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    )
      .select("-password")
      .populate("company");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully!",
      user,
    });
  } catch (error) {
    console.log("error while updating user: ", error);
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.log("error while deleting user: ", error);
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

// Upload user photo
exports.uploadUserPhoto = [
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { photo: req.file.path },
        { new: true, runValidators: true }
      ).select("-password");

      console.log(user);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        message: "Photo uploaded successfully!",
        user,
      });
    } catch (error) {
      console.error("Error while uploading photo: ", error);
      return res.status(500).json({
        message: "Internal server error",
        error,
      });
    }
  },
];

// Upload user resume
exports.uploadUserResume = [
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { "profile.resume": req.file.path },
        { new: true, runValidators: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        message: "Resume uploaded successfully!",
        user,
      });
    } catch (error) {
      console.error("Error while uploading resume: ", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
];
