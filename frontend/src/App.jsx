import { useEffect, useLayoutEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import apiClient from './services/apiClient';
import { setUser, startLoader, stopLoader } from './app/auth/authSlice';

function App() {
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        dispatch(startLoader());
        const res = await apiClient.get('/auth/user');

        // console.log(res);

        if (res.status === 200) {
          dispatch(setUser({ user: res.data.user }));
        }
      } catch (error) {
        console.log(error.response);
      } finally {
        dispatch(stopLoader());
      }
    };
    if (token) {
      getUser();
    }
  }, [token]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <Toaster position='bottom-center' />
      <Outlet />
    </>
  );
}

export default App;
