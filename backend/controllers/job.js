const { parse } = require('dotenv');
const Job = require('../models/Job');
const User = require('../models/User');
const axios = require('axios');
const Application = require('../models/Application');

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

const constructMongoQuery = (query) => {
  const mongoQuery = {};
  console.log('query: ', query);

  // Title field
  if (query.title && query.title.length > 0) {
    let keywords = query.title.map(kw => `"${kw}"`).join(' ');
    mongoQuery.$text = { $search: keywords, };
  }

  // Experience field
  if (query.experience && query.experience.length > 0) {
    mongoQuery.experience = query.experience;
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
  let mongoQuery = {};
  if (req.query.s) {
    const response = await axios.post(process.env.FLASK_API + '/parse-query', { query: req.query.s });
    const query = response.data;
    mongoQuery = constructMongoQuery(query);

  }
  else {
    mongoQuery = {}
  }
  const perPage = req.query.perPage || 10
  const page = req.query.page || 1
  const skip = (page - 1) * perPage
  try {
    const jobs = await Job.find(mongoQuery).populate('company').skip(skip).limit(perPage);
    // total pages
    const count = await Job.countDocuments(mongoQuery);
    const totalPages = Math.ceil(count / perPage);
    return res.status(200).json({ jobs, totalPages, count, currentPage: page });
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


exports.getTotalJobsPostedByEmployer = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    const jobCount = await Job.countDocuments({ company: user.company });
    res.status(200).json({ totalJobsPosted: jobCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTotalApplicationsByEmployer = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    const jobs = await Job.find({ company: user.company });
    const totalApplications = jobs.reduce((sum, job) => sum + (job.applications ? job.applications.length : 0), 0);

    res.status(200).json({ totalApplications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTotalJobsSavedByEmployer = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    const jobs = await Job.find({ company: user.company });
    const totalJobsSaved = jobs.reduce((sum, job) => sum + (job.savedBy ? job.savedBy.length : 0), 0);

    res.status(200).json({ totalJobsSaved });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getTotalPeopleHiredByEmployer = async (req, res) => {
  try {
    const employerId = req.user._id; 
    
    
    const jobs = await Job.find({ company: employerId });
    const jobIds = jobs.map(job => job._id);

    const hiredApplications = await Application.find({
      job: { $in: jobIds },
      status: 'hired' 
    });

    const uniqueHires = new Set(hiredApplications.map(app => app.applicant.toString()));
    const totalHired = uniqueHires.size;

    res.status(200).json({ totalHired });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};







