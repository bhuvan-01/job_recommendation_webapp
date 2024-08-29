const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const nodemailer = require("nodemailer");
const fs = require("fs");
const upload = require("../middlewares/upload");

exports.applyToJob = async (req, res) => {
  upload.single("resume")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const {
        jobId,
        coverLetter,
        email,
        phoneNumber,
        experience,
        visaStatus,
        relocation,
        skills,
        qualification,
      } = req.body;
      const userId = req.user._id;

      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      const existingApplication = await Application.findOne({
        job: jobId,
        applicant: userId,
      });

      if (existingApplication) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(400)
          .json({ message: "You have already applied to this job" });
      }

      const application = new Application({
        job: jobId,
        applicant: userId,
        coverLetter,
        resume: req.file ? req.file.path : null,
        email,
        phoneNumber,
        experience,
        visaStatus,
        relocation,
        skills: skills || [],
        qualification: {
          degreeName: qualification.degreeName,
          majorSubject: qualification.majorSubject,
          startDate: qualification.startDate,
          endDate: qualification.endDate || null,
        },
      });

      await application.save();

      job.applications.push({ application: application._id, user: userId });
      await job.save();

      res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// Get applications by user
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({ applicant: userId })
      .populate("job")
      .populate("job.company");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get applications for a specific job
exports.getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.id;

    const applications = await Application.find({ job: jobId }).populate(
      "applicant"
    );

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("applicant")
      .populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res
      .status(200)
      .json({ application, message: "Application fetched successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    // Ensure the status is one of the allowed values
    const allowedStatuses = ["Pending", "Accepted", "Rejected", "Hired"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updateObject = {
      status: status,
      hiredAt: status == "Hired" ? new Date() : null,
    };

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { $set: updateObject },
      { new: true }
    )
      .populate("applicant")
      .populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Prepare the notification message based on the status
    let notificationMessage;
    if (status === "Accepted") {
      notificationMessage = `Your application for the position of ${application.job.title} has been accepted.`;
    } else if (status === "Rejected") {
      notificationMessage = `Your application for the position of ${application.job.title} has been rejected.`;
    } else if (status === "Hired") {
      notificationMessage = `Congratulations! You have been hired for the position of ${application.job.title}.`;
    }

    const notification = new Notification({
      recipient: application.applicant._id,
      message: notificationMessage,
      type: status === "Accepted" || status === "Hired" ? "info" : "warning",
    });

    await notification.save();

    sendNotification(application.applicant._id, {
      message: `Your application status has been updated to: ${status}`,
      applicationId: application._id,
      status,
    });

    if (status === "Hired") {
      const emailSubject = `You have been hired for ${application.job.title}`;
      const emailText = `Dear ${application.applicant.firstName},\n\nCongratulations! You have been hired for the position of ${application.job.title}. We are excited to welcome you to the team.\n\nBest regards,\nThe HR Team`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: application.applicant.email,
        subject: emailSubject,
        text: emailText,
      };

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      });

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }

    res.status(200).json({
      message: "Application status updated",
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getApplicationsForEmployer = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    console.log("Company ID:", companyId);

    const jobs = await Job.find({ "company.$oid": companyId });

    console.log("Jobs found for company:", jobs);

    if (!jobs || jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No jobs found for this company." });
    }

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("job")
      .populate("applicant");

    if (!applications || applications.length === 0) {
      return res
        .status(404)
        .json({ message: "No applications found for the company's jobs." });
    }

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching applications for company:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Send notification function
const sendNotification = async (userId, { message, applicationId, status }) => {
  try {
    const notification = new Notification({
      recipient: userId,
      message,
      type: status === "Accepted" ? "info" : "warning",
      application: applicationId,
    });
    await notification.save();
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({})
      .populate("job")
      .populate("applicant");

    if (applications.length === 0) {
      return res.status(404).json({ message: "No applications found" });
    }

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const result = await Application.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).send({ message: "Application not found" });
    }
    res.send({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete operation failed:", error);
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

exports.getHiredApplications = async (req, res) => {
  try {
    const applications = await Application.find({ status: "Hired" })
      .populate("job")
      .populate("applicant");

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "No hired applications found" });
    }

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching hired applications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
