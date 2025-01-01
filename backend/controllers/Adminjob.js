const Job = require("../models/Job");
const User = require("../models/User");

exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      experience,
      jobType,
      locationType,
      industry,
      location,
      salary,
      externalLink,
      latitude,
      longitude,
      company,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !experience ||
      !jobType ||
      !locationType ||
      !industry ||
      !location ||
      !salary ||
      !latitude ||
      !longitude ||
      !company
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Create a new job document
    const job = new Job({
      title,
      description,
      requirements,
      experience,
      jobType,
      locationType,
      industry,
      location,
      salary,
      externalLink,
      latitude,
      longitude,
      company,
    });

    // Save the job to the database
    await job.save();

    res.status(201).json({ job, message: "Job posted successfully" });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update  job
exports.updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job: updatedJob });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Fetch all jobs
exports.getAllJobs = async (req, res) => {
  try {
    // Fetch all jobs from the database
    const jobs = await Job.find();

    // Check if any jobs exist
    if (jobs.length === 0) {
      return res.status(404).json({ success: false, message: "No jobs found" });
    }

    // Respond with the list of jobs
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
