import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  sendPasswordResetEmail,
  verifyOtp,
  resetPassword,
} from "@/app/actions/AuthAction";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    dispatch(sendPasswordResetEmail(email)).then(() => {
      setStep(2);
    });
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const isValidOtp = await dispatch(verifyOtp({ email, otp }));
    if (isValidOtp) {
      setStep(3);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ email, password }))
      .then(() => {navigate("/login");})
      .catch((error) => {
        console.error("Error during password reset:", error);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Forgot Password
              </h2>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send Reset Link
                </button>
              </form>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Verify OTP
              </h2>
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Verify OTP
                </button>
              </form>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Reset Password
              </h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={password}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Reset Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
