const mongoose = require('mongoose');
const { Schema } = mongoose;

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    experience: {
      type: String,
      enum: [
        'Internship',
        'Entry Level',
        'Associate',
        'Mid Level',
        'Senior Level',
      ],
      required: true,
    },
    jobType: {
      type: String,
      enum: ['Part-Time', 'Full-Time', 'Internship', 'Contract', 'Temporary'],
      required: true,
    },
    locationType: {
      type: String,
      enum: ['Remote', 'On-Site', 'Hybrid'],
      required: true,
    },
    industry: {
      type: String,
      enum: ['IT', 'Healthcare', 'Finance', 'Education', 'Retail'],
      required: true,
    },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    applications: [
      {
        application: {
          type: Schema.Types.ObjectId,
          ref: 'Application',
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    savedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);
JobSchema.index({ title: 'text', description: 'text' });
module.exports = mongoose.model('Job', JobSchema);
