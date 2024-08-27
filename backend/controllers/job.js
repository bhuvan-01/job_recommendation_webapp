const { parse } = require("dotenv");
const mongoose = require("mongoose");
const Job = require("../models/Job");
const User = require("../models/User");
const axios = require("axios");
const Application = require("../models/Application");

// create job
exports.createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ job, message: "Job posted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// update job
exports.updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const updates = req.body;
    const job = await Job.findByIdAndUpdate(
      jobId,
      { $set: updates },
      { new: true }
    );
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// delete job
exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    await Job.findByIdAndDelete(jobId);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const constructMongoQuery = (query) => {
  const mongoQuery = {};
  console.log("query: ", query);

  // Title field
  if (query.title && query.title.length > 0) {
    let keywords = query.title.map((kw) => `"${kw}"`).join(" ");
    mongoQuery.$text = { $search: keywords };
  }

  // Experience field
  if (query.experience && query.experience.length > 0) {
    mongoQuery.experience = { $in: query.experience };
  }

  // Salary range field
  if (query.salaryRange) {
    const { min, max } = query.salaryRange;
    if (min !== null && max !== null) {
      mongoQuery.salary = { $gte: min, $lte: max };
    } else if (min !== null) {
      mongoQuery.salary = { $gte: min };
    } else if (max !== null) {
      mongoQuery.salary = { $lte: max };
    }
  }

  return mongoQuery;
};

// get jobs
exports.getJobs = async (req, res) => {
  const {
    keyword,
    location,
    industry,
    minSalary,
    jobType,
    experience,
    locationType,
  } = req.query;

  let mongoQuery = {};
  if (keyword) {
    const response = await axios.post(process.env.FLASK_API + "/parse-query", {
      query: keyword,
    });
    const query = response.data;
    mongoQuery = constructMongoQuery(query);
  } else {
    mongoQuery = {};
  }

  if (location) {
    mongoQuery.location = { $regex: location.split(",")[0], $options: "i" };
  }
  if (industry) mongoQuery.industry = { $in: industry };
  if (minSalary) mongoQuery.salary = { $gte: minSalary };
  if (jobType) mongoQuery.jobType = { $in: jobType };
  if (experience) mongoQuery.experience = { $in: experience };
  if (locationType) mongoQuery.locationType = { $in: locationType };
  const perPage = req.query.perPage || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * perPage;

  try {
    const jobs = await Job.find(mongoQuery)
      .populate("company")
      .skip(skip)
      .limit(perPage);
    // total pages
    const count = await Job.countDocuments(mongoQuery);
    const totalPages = Math.ceil(count / perPage);
    return res.status(200).json({ jobs, totalPages, count, currentPage: page });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// get user applied jobs
exports.getUserAppliedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobs = await Job.find({ applications: userId }).populate("company");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get user saved jobs
exports.getUserSavedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log('user: ', userId);
    const jobs = await Job.find({ savedBy: userId }).populate("company");
    res.status(200).json(jobs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get a job
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("company");

    if (!job) {
      return res.status(404).json({
        message: "Job not found!",
      });
    }

    return res.status(200).json({ message: "Job fetched successfully", job });
  } catch (error) {
    return res.status(500).json({
      message: "Internal error",
      error: error.message,
    });
  }
};

// get employer jobs
exports.getEmployerJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobs = await Job.find({ company: user.company }).populate("company");
    return res.status(200).json({ jobs });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// apply to a job
exports.applyToJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.applications.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User has already applied to this job" });
    }

    job.applications.push(userId);
    await job.save();

    res.status(200).json({ message: "Job application successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// save a job
exports.saveJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.savedBy.includes(userId)) {
      return res.status(400).json({
        message: "Job is already saved by the user",
      });
    }

    job.savedBy.push(userId);
    await job.save();

    res.status(200).json({ message: "Job saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// remove saved job
exports.removeSavedJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!job.savedBy.includes(userId)) {
      return res.status(400).json({ message: "Job is not saved by the user" });
    }

    job.savedBy = job.savedBy.filter((id) => !id.equals(userId));
    await job.save();

    res
      .status(200)
      .json({ message: "Job removed from saved jobs successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getEmployerDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Employer not found" });
    }

    // Fetch all jobs posted by the employer
    const jobs = await Job.find({ company: user.company });
    const jobIds = jobs.map((job) => job._id);

    // Count total jobs posted
    const totalJobsPosted = jobs.length;

    // Count total applications
    const totalApplications = jobs.reduce(
      (sum, job) => sum + (job.applications ? job.applications.length : 0),
      0
    );

    // Count total jobs saved
    const totalJobsSaved = jobs.reduce(
      (sum, job) => sum + (job.savedBy ? job.savedBy.length : 0),
      0
    );

    // Count total people hired
    const hiredApplications = await Application.find({
      job: { $in: jobIds },
      status: "Hired",
    });

    const uniqueHires = new Set(
      hiredApplications.map((app) => app.applicant.toString())
    );
    const totalPeopleHired = uniqueHires.size;

    // Return the consolidated data
    res.status(200).json({
      totalJobsPosted,
      totalApplications,
      totalJobsSaved,
      totalPeopleHired,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getEmployerStatsByMonth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const matchByCompany = {
      $match: { company: new mongoose.Types.ObjectId(user.company) },
    };

    // Monthly Job Posts
    const monthlyJobsPosted = await Job.aggregate([
      matchByCompany,
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalJobsPosted: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Monthly Applications
    const monthlyApplications = await Job.aggregate([
      matchByCompany,
      { $unwind: "$applications" },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalApplications: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Monthly Jobs Saved
    const monthlyJobsSaved = await Job.aggregate([
      matchByCompany,
      { $unwind: "$savedBy" },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalJobsSaved: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Monthly People Hired
    const monthlyPeopleHired = await Application.aggregate([
      {
        $match: {
          job: {
            $in: await Job.find({ company: user.company }).distinct("_id"),
          },
          status: "Hired",
          hiredAt: { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$hiredAt" },
            year: { $year: "$hiredAt" },
          },
          totalPeopleHired: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.status(200).json({
      monthlyJobsPosted,
      monthlyApplications,
      monthlyJobsSaved,
      monthlyPeopleHired,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getRecommended = async (req, res) => {
  const userId = req.user._id;

  try {
    const response = await fetch(
      process.env.FLASK_API + `/recommendedjob/${userId}`
    );

    return res.json(await response.json());
  } catch (error) {
    console.error("Error calling Flask API:", error);
    return res.status(500).json({ error: "Failed to fetch recommended jobs" });
  }
};

exports.incrementJobViewCount = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Increment the view count by 1
    const job = await Job.findByIdAndUpdate(
      jobId,
      { $inc: { viewCount: 1 } },
      { new: true } // return the updated job document
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error("Error incrementing view count:", error);
    res.status(500).json({ message: "Server error" });
  }
};
