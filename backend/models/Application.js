const mongoose = require("mongoose");
const { Schema } = mongoose;

const ApplicationSchema = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Hired"],
      default: "Pending",
    },
    hiredAt: {
      type: Date,
      default: null,
    },
    coverLetter: { type: String },
    resume: { type: String }, // Path to the uploaded resume file
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    experience: { type: Number, required: true },
    visaStatus: { type: String, required: true },
    relocation: { type: String, required: true },

    skills: {
      type: [String],
      default: [],
    },
    qualification: {
      degreeName: { type: String, required: true },
      majorSubject: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", ApplicationSchema);
