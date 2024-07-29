
import apiClient from '@/services/apiClient';
import { toast } from 'react-hot-toast';

export const sendPasswordResetEmail = (email) => async (dispatch) => {
  try {
    await apiClient.post('/auth/forget-password', { email });
    toast.success('Reset link sent to your email');
  } catch (error) {
    toast.error('Error sending reset link');
  }
};
