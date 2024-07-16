import { setUser } from '@/app/auth/authSlice';
import apiClient from '@/services/apiClient';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const useUser = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const updateUser = async (values) => {
    try {
      const res = await apiClient.put('/users/' + user._id, values);

      // console.log('res: ', res);

      if (res.status === 200) {
        toast.success('Profile updated');
        dispatch(setUser({ user: res.data.user }));
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update');
    }
  };

  return { user, updateUser };
};

export default useUser;
