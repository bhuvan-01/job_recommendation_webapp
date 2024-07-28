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

    console.log(req.query);

    let query = {};

    if (keyword) query.title = { $regex: keyword, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (industry) query.industry = { $in: industry };
    if (minSalary) query.salary = { $gte: minSalary };
    if (jobType) query.jobType = { $in: jobType };
    if (experience) query.experience = { $in: experience };
    if (locationType) query.locationType = { $in: locationType };

    const jobs = await Job.find(query).populate('company');

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    return res.status(200).json({
      message: 'Job fetched successfully',
      job,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal error',
      error: error.message,
    });
  }
};

exports.getEmployerJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // console.log('userrrr', user);
    const jobs = await Job.find({
      company: user.company,
    }).populate('company');

    return res.status(200).json({
      jobs,
    });
  } catch (error) {
    console.log("Error while fetching employer's jobs", error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};


exports.getRecommended = async (req, res) => {
    // Access userId from the token
    const userId = req.user._id;
    
    try {
        // Call the Flask API with the userId
        const response = await fetch(process.env.FLASK_API + `/recommededjob/${userId}`);

        // Send the Flask API response back to the client
        return res.json(await response.json());
    } catch (error) {
        console.error('Error calling Flask API:', error);
        return res.status(500).json({ error: 'Failed to fetch recommended jobs' });
    }
}