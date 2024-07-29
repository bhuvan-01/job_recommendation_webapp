import apiClient from "@/services/apiClient";
import { toast } from "react-hot-toast";

export const sendPasswordResetEmail = (email) => async (dispatch) => {
  try {
    await apiClient.post("/auth/forget-password", { email });
    toast.success("Reset password OTP sent to your email");
  } catch (error) {
    toast.error("Error sending reset link");
  }
};

export const verifyOtp =
  ({ email, otp }) =>
  async (dispatch) => {
    try {
      const response = await apiClient.post("/auth/verify-otp", { email, otp });
      return response.data.success;
    } catch (error) {
      toast.error("Invalid OTP");
      return false;
    }
  };

export const resetPassword =
  ({ email, password }) =>
  async (dispatch) => {
    try {
      await apiClient.post("/auth/reset-password", { email, password });
      toast.success("Password has been reset successfully");
    } catch (error) {
      toast.error("Error resetting password");
      throw error;
    }
  };
