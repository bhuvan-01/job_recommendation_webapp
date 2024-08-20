const User = require("../models/User");
const Job = require("../models/Job");
const bcrypt = require('bcrypt');

const mongoose = require('mongoose');

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
    const totalJobSeekers = await User.countDocuments({ role: 'user' });
    const totalEmployers = await User.countDocuments({ role: 'employer' });
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



exports.getAdminStatsByMonth = async (req, res) => {
  try {
    const matchByYear = { $match: { createdAt: { $exists: true } } };

    // Monthly Job Posts
    const monthlyJobs = await Job.aggregate([
      matchByYear,
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          totalJobs: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Monthly User Registrations (Job Seekers)
    const monthlyJobSeekers = await User.aggregate([
      { $match: { role: 'user', createdAt: { $exists: true } } },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          totalJobSeekers: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Monthly Employer Registrations
    const monthlyEmployers = await User.aggregate([
      { $match: { role: 'employer', createdAt: { $exists: true } } },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          totalEmployers: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Monthly Hired People
    const monthlyHired = await Job.aggregate([
      { $unwind: '$applications' },
      { $match: { 'applications.status': 'hired', 'applications.hiredAt': { $exists: true } } },
      {
        $group: {
          _id: {
            month: { $month: '$applications.hiredAt' },
            year: { $year: '$applications.hiredAt' }
          },
          totalHired: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.status(200).json({
      monthlyJobs,
      monthlyJobSeekers,
      monthlyEmployers,
      monthlyHired,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


