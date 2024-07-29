const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        _id: existingUser._id,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      token,
      message: "Login successful!",
    });
  } catch (error) {
    console.log("error in login: ", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    console.log("req body: ", req.body);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        _id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      token,
      message: "Signup successful!",
    });
  } catch (error) {
    console.error("Error in signup: ", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const storedOTPs = {};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const otp = generateOTP();
    storedOTPs[email] = otp;

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: email,
      subject: "Reset password | Chatty 💬",
      text: `Your OTP to reset your password is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          message: "Failed to send email",
          error: error.message,
          success: false,
        });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({
          success: true,
          message:
            "Email has been sent successfully! Check your inbox or spam folder.",
        });
      }
    });
  } catch (error) {
    console.error("Error in forgot password: ", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (storedOTPs[email] && storedOTPs[email] === otp) {
      delete storedOTPs[email];
      return res.status(200).json({
        success: true,
        message: "Verified, proceed to change password",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  } catch (error) {
    console.log("Error in verify password: ", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// reset password
const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email);
    console.log(password);
    const user = await User.findOne({ email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
      success: true,
      redirectTo: "/login",
    });
  } catch (error) {
    console.log("Error in reset password: ", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getLoggedinUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("company");
    user.password = undefined;
    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log("error while fetching user", error);
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

module.exports = {
  login,
  signup,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getLoggedinUser,
};
