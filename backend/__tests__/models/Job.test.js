const mongoose = require('mongoose');
const Job = require('../../models/Job');

describe('Job Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('create & save a job successfully', async () => {
    const jobData = {
      title: 'Software Developer',
      description: 'Develop software solutions',
      experience: 'Mid Level',
      jobType: 'Full-Time',
      locationType: 'Remote',
      industry: 'IT',
      location: 'New York',
      salary: '$80,000',
      company: new mongoose.Types.ObjectId(),
      latitude: 40.7128,
      longitude: -74.0060,
    };
    const validJob = new Job(jobData);
    const savedJob = await validJob.save();
    expect(savedJob._id).toBeDefined();
    expect(savedJob.title).toBe(jobData.title);
    expect(savedJob.salary).toBe(jobData.salary);
  });

  it('should fail when saving a job without required fields', async () => {
    const jobWithoutRequiredField = new Job({});
    let err;
    try {
      await jobWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.title).toBeDefined();
  });
});
