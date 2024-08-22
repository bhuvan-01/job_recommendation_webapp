const { sendNotification } = require('../app');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');

// Apply to a job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const userId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: 'You have already applied to this job' });
    }

    const application = new Application({
      job: jobId,
      applicant: userId,
      coverLetter,
    });
    await application.save();

    job.applications.push({ application: application._id, user: userId });
    await job.save();

    res
      .status(201)
      .json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get applications by user
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({ applicant: userId })
      .populate('job')
      .populate('job.company');

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get applications for a specific job
exports.getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const applications = await Application.find({ job: jobId }).populate(
      'applicant'
    );

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicant')
      .populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res
      .status(200)
      .json({ application, message: 'Application fetched successfully!' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { $set: { status } },
      { new: true }
    )
      .populate('applicant')
      .populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const notificationMessage =
      status === 'Accepted'
        ? `Your application for the position of ${application.job.title} has been accepted.`
        : `Your application for the position of ${application.job.title} has been rejected.`;

    const notification = new Notification({
      recipient: application.applicant._id,
      message: notificationMessage,
      type: status === 'Accepted' ? 'info' : 'warning',
    });

    await notification.save();

    sendNotification(application.applicant._id, {
      message: `Your application status has been updated to: ${status}`,
      applicationId: application._id,
      status,
    });

    // Send email to the applicant
    if (status === 'Accepted' || status === 'Rejected') {
      const emailSubject = `Your job application for ${
        application.job.title
      } has been ${status.toLowerCase()}`;
      let emailText = `Dear ${application.applicant.firstName},\n\n`;

      if (status === 'Accepted') {
        emailText += `Congratulations! Your application for the position of ${application.job.title} has been accepted. We look forward to working with you.\n\n`;
      } else if (status === 'Rejected') {
        emailText += `We regret to inform you that your application for the position of ${application.job.title} has not been successful at this time. We appreciate your interest in our company and wish you the best in your job search.\n\n`;
      }

      emailText += `Best regards,\nThe HR Team`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: application.applicant.email,
        subject: emailSubject,
        text: emailText,
      };

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      });

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }

    res.status(200).json({
      message: 'Application status updated',
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getApplicationsForEmployer = async (req, res) => {
    try {
        const employerId = req.user._id;  
        const jobs = await Job.find({ employer: employerId });

        const jobIds = jobs.map(job => job._id);
        const applications = await Application.find({ job: { $in: jobIds } }).populate('job');

        res.json(applications);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
};

