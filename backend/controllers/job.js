const Job = require('../models/Job');
const User = require('../models/User');

// create job
exports.createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ job, message: 'Job posted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// delete job
exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    await Job.findByIdAndDelete(jobId);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// get jobs
exports.getJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      industry,
      minSalary,
      jobType,
      experience,
      locationType,
    } = req.query;
    let query = {};

    if (keyword) query.title = { $regex: keyword, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (industry) query.industry = { $in: industry };
    if (minSalary) query.salary = { $gte: minSalary };
    if (jobType) query.jobType = { $in: jobType };
    if (experience) query.experience = { $in: experience };
    if (locationType) query.locationType = { $in: locationType };

    const jobs = await Job.find(query).populate('company');
    return res.status(200).json(jobs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// get user applied jobs
exports.getUserAppliedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobs = await Job.find({ applications: userId }).populate('company');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// get user saved jobs
exports.getUserSavedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log('user: ', userId);
    const jobs = await Job.find({ savedBy: userId }).populate('company');
    res.status(200).json(jobs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// get a job
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company');

    if (!job) {
      return res.status(404).json({
        message: 'Job not found!',
      });
    }

    return res.status(200).json({ message: 'Job fetched successfully', job });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal error',
      error: error.message,
    });
  }
};

// get employer jobs
exports.getEmployerJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobs = await Job.find({ company: user.company }).populate('company');
    return res.status(200).json({ jobs });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
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
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.applications.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'User has already applied to this job' });
    }

    job.applications.push(userId);
    await job.save();

    res.status(200).json({ message: 'Job application successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// save a job
exports.saveJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.savedBy.includes(userId)) {
      return res.status(400).json({
        message: 'Job is already saved by the user',
      });
    }

    job.savedBy.push(userId);
    await job.save();

    res.status(200).json({ message: 'Job saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// remove saved job
exports.removeSavedJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (!job.savedBy.includes(userId)) {
      return res.status(400).json({ message: 'Job is not saved by the user' });
    }

    job.savedBy = job.savedBy.filter((id) => !id.equals(userId));
    await job.save();

    res
      .status(200)
      .json({ message: 'Job removed from saved jobs successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
