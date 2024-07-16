const User = require('../models/User');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadResume = upload.single('resume');

exports.handleResumeUpload = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumePath = req.file.path;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { 'profile.resume': resumePath } },
      { new: true }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
