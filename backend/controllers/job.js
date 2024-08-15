const { parse } = require('dotenv');
const Job = require('../models/Job');
const User = require('../models/User');
const axios = require('axios');

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


// exports.createJob = async (req, res) => {
//   try {
//     const { location, ...jobDetails } = req.body;

//     if (!location) {
//       throw new Error('Location is required');
//     }

//     const coordinates = await getCoordinates(location);

//     if (!coordinates.latitude || !coordinates.longitude) {
//       throw new Error('Invalid coordinates received from geocoding API');
//     }

//     const job = new Job({
//       ...jobDetails,
//       location,
//       latitude: coordinates.latitude,
//       longitude: coordinates.longitude,
//     });

//     await job.save();
//     res.status(201).json({ job, message: 'Job posted successfully' });
//   } catch (error) {
//     console.error('Error creating job:', error.message);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


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

// exports.getCoordinates = async (address) => {
//   try {
//     const response = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json', {
//       params: {
//         access_token:'pk.eyJ1IjoiYmh1dmFuMDEiLCJhIjoiY2x6aWEyZjNwMGFzZDJ2c2l2dG05N2RzayJ9.EfI-v2ifsPPbXrQW9p7gkQ', // Store your access token in an environment variable
//         limit: 1,
//       },
//     });

//     if (response.data.features.length > 0) {
//       const location = response.data.features[0].center;
//       return {
//         longitude: location[0],
//         latitude: location[1],
//       };
//     } else {
//       throw new Error('No location found for the provided address');
//     }
//   } catch (error) {
//     console.error('Error fetching coordinates:', error.message);
//     throw new Error('Failed to fetch coordinates');
//   }
// };

