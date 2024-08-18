import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiClient from '@/services/apiClient';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/app/auth/authSlice';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import loginImage from '../assets/images/loginImage2.jpg'

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6).required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await apiClient.post('/auth/login', values);

        console.log(res);

        if (res.status === 200) {
          dispatch(login({ token: res.data.token }));
          localStorage.setItem('token', JSON.stringify(res.data.token));
        }
      } catch (error) {
        console.log(error.response);
        toast.error(error?.response?.data?.message);
      }
    },
  });

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'user':
          navigate('/dashboard/user');
          break;
        case 'employer':
          navigate('/dashboard/employer');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/dashboard/user');
      }
    }
  }, [user]);

  return (
    <section className="relative  bg-cover bg-center bg-fixed min-h-screen bg-black">
      <img
        alt=""
        loading="lazy"
        src={loginImage}
        className="absolute inset-0 h-full w-full object-cover opacity-100"
      />
      <Navbar />

      <div className="relative flex justify-end items-center min-h-screen">
        <div className="w-full max-w-[500px] bg-white/100 p-8 md:p-8  rounded-lg shadow-lg mr-60">
          <form onSubmit={formik.handleSubmit} className="w-full">
            <h1 className="text-4xl col-span-12 mt-8">Login</h1>
            <small className="mb-8 text-gray-500">Login to continue</small>

            <div className="my-4">
              <Label
                htmlFor="Email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>

              <Input
                type="email"
                id="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-xs text-red-600">{formik.errors.email}</p>
              ) : null}
            </div>

            <div className="my-4">
              <Label
                htmlFor="Password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </Label>

              <Input
                type="password"
                id="Password"
                name="password"
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-xs text-red-600">{formik.errors.password}</p>
              ) : null}
            </div>

            <button
              type="submit"
              className="inline-block mb-4 shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
            >
              Login
            </button>

            <div className="flex flex-wrap pb-5 justify-between items-center">
              <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                Don&apos;t have an account?
                <Link to="/signup" className="text-gray-700 underline ml-2">
                  Sign up
                </Link>
                .
              </p>

              <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                <Link to="/forgot-password">Forget Password</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
