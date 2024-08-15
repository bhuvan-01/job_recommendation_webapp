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
import Navbar from '@/components/Navbar'
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
    <section className='bg-white '>
      <Navbar/>
      <div className='flex min-h-screen'>
        <div className='relative w-0 basis-0 md:basis-1/2'>
          <img
            alt=''
            loading='lazy'
            src='https://images.pexels.com/photos/927451/pexels-photo-927451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            className='absolute inset-0 h-full w-full object-cover opacity-80'
          />
          <div className='bg-black/50 w-0 md:w-full md:absolute top-0 bottom-0 left-0 right-0'></div>
          <div className='hidden md:block absolute bottom-0 p-12'>
            <h2 className='mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl'>
              Welcome to JOB Wipe
            </h2>

            <p className='mt-4 leading-relaxed text-white/90'>
            Unlock your potential. Log in to explore opportunities that inspire progress and foster success in your career.
            </p>
          </div>
        </div>

        <div className='basis-full md:basis-1/2 flex justify-center items-center'>
          <form
            onSubmit={formik.handleSubmit}
            className='w-full max-w-[480px] p-4'
          >
            <h1 className='text-4xl col-span-12 mt-8'>Login</h1>
            <small className='mb-8 text-gray-500'>Login to continue</small>

            <div className='my-4'>
              <Label
                htmlFor='Email'
                className='block text-sm font-medium text-gray-700'
              >
                Email
              </Label>

              <Input
                type='email'
                id='Email'
                name='email'
                value={formik.values.email}
                onChange={formik.handleChange}
                className='mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm'
              />
              {formik.touched.email && formik.errors.email ? (
                <p className='text-xs text-red-600'>{formik.errors.email}</p>
              ) : null}
            </div>

            <div className='my-4'>
              <Label
                htmlFor='Password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </Label>

              <Input
                type='password'
                id='Password'
                name='password'
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className='mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm'
              />
              {formik.touched.password && formik.errors.password ? (
                <p className='text-xs text-red-600'>{formik.errors.password}</p>
              ) : null}
            </div>

            <button
              type='submit'
              className='inline-block mb-4 shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500'
            >
              Login
            </button>

            <div className='flex flex-wrap justify-between items-center'>
              <p className='mt-4 text-sm text-gray-500 sm:mt-0'>
                Don&apos;t have an account?
                <Link to='/signup' className='text-gray-700 underline ml-2'>
                  Sign up
                </Link>
                .
              </p>

              <p className='mt-4 text-sm text-gray-500 sm:mt-0'>
                <Link to='/forgot-password'>Forget Password</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
