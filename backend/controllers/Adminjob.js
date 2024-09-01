const Job = require('../models/Job');
const mongoose = require("mongoose");


// Create a new job
exports.createJob = async (req, res) => {
    try {
        // Optionally, validate the incoming data here if not done elsewhere
        // Example: Check required fields manually (consider using a library like Joi or express-validator)

        const newJob = new Job(req.body);
        const savedJob = await newJob.save();

        // Respond with the created job and a success message
        res.status(201).json({ success: true, job: savedJob });
    } catch (error) {
        // Check if the error is a Mongoose validation error
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors, // Sends detailed validation errors
            });
        }

        // For any other errors, send a generic message
        res.status(400).json({ success: false, message: error.message });
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
