const mongoose = require('mongoose');
const { Schema } = mongoose;

const ApplicationSchema = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
    coverLetter: { type: String },
    resume: { type: String }, // Path to the uploaded resume file
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    experience: { type: Number, required: true }, // Work experience in years
    visaStatus: { type: String, required: true }, // Visa status (e.g., Yes/No)
    relocation: { type: String, required: true }, // Willingness to relocate (e.g., Yes/No)
    mastersDegree: { type: String, required: true }, // Whether the applicant has a master's degree (Yes/No)
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Application', ApplicationSchema);
