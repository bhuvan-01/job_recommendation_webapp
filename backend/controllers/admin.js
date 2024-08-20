const User = require("../models/User");
const Job = require("../models/Job");
const bcrypt = require('bcrypt');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10),
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Approve a job
exports.approveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findByIdAndUpdate(
      jobId,
      { status: "approved" },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job approved successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


exports.getAdminStats = async (req, res) => {
  try {
    // Total Job Seekers
    const totalJobSeekers = await User.countDocuments({ role: 'user' });

    // Total Employers
    const totalEmployers = await User.countDocuments({ role: 'employer' });

    // Total Jobs
    const totalJobs = await Job.countDocuments();

    const totalHired = await Job.aggregate([
      { $unwind: '$applications' },
      { $match: { 'applications.status': 'hired' } }, 
      { $count: 'totalHired' }
    ]);

    res.status(200).json({
      totalJobSeekers,
      totalEmployers,
      totalJobs,
      totalHired: totalHired[0]?.totalHired || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

