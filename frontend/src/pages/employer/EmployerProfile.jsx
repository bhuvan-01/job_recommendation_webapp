import { setUser } from '@/app/auth/authSlice';
import Header from '@/components/Header';
import apiClient from '@/services/apiClient';
import { Building2, Linkedin, Plus, User, Edit3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const EmployerProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [jobsCreated, setJobsCreated] = useState([]);
  const [isAddingDetails, setIsAddingDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    overview: '',
  });

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        const res = await apiClient.get(`/jobs/employer/${user._id}`);
        console.log('rezz: ', res);

        if (res.status === 200) {
          setJobsCreated(res.data.jobs);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user) fetchEmployerJobs();

    if (user?.company) {
      setCompanyDetails(user.company); // Pre-fill the form with the existing company details
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails({ ...companyDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user?.company && isEditing) {
        // Update existing company details
        const companyRes = await apiClient.put(`/company/${user.company._id}`, companyDetails);

        if (companyRes.status === 200) {
          toast.success('Company details updated');
          dispatch(setUser({ ...user, company: companyRes.data.company }));
          setIsEditing(false);
        }
      } else {
        // Create new company
        const companyRes = await apiClient.post('/company', companyDetails);

        if (companyRes.status === 201) {
          const userUpdateRes = await apiClient.put('/users/' + user._id, {
            company: companyRes.data.company._id,
          });

          if (userUpdateRes.status === 200) {
            toast.success('Added company details');
            dispatch(setUser(userUpdateRes.data.user));
            setIsAddingDetails(false);
          }
        }
      }
    } catch (error) {
      console.log(error.response);
      toast.error('Failed to save company details');
    }
  };

  return (
    <div>
      <Header />
      <div className='container mx-auto my-4 md:my-8 max-w-[1400px] w-[95%]'>
        <div className='flex gap-4'>
          <div className='basis-9/12'>
            <section className='border p-8 rounded-md'>
              <div className='flex gap-8 items-center'>
                <div className='bg-gray-100 rounded-full w-24 h-24 flex justify-center items-center'>
                  <User />
                </div>
                <div className='py-2'>
                  <h1 className='text-3xl font-semibold mb-2'>
                    {user?.fullName}
                  </h1>
                  <p className='text-gray-600 my-2'>{user?.bio || 'No bio'}</p>
                  <div className='flex gap-6 mt-4'>
                    <a
                      href='https://www.linkedin.com'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Linkedin
                        size={24}
                        className='text-gray-600 hover:text-blue-600'
                      />
                    </a>
                  </div>
                </div>
                <div className='ml-auto'>
                  <Link
                    to='/dashboard/employer/jobs/add'
                    className='p-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-800 flex justify-center items-center gap-2'
                  >
                    Post a job <Plus />
                  </Link>
                </div>
              </div>
            </section>

            {user?.company ? (
              <section className='my-4 border p-8 rounded-md'>
                <h1 className='text-2xl font-semibold mb-4'>Company Details</h1>
                <div className='flex gap-4 items-center'>
                  <div className='bg-gray-100 w-24 h-24 flex justify-center items-center'>
                    <Building2 />
                  </div>
                  <div>
                    <h2 className='text-xl font-semibold'>
                      {user.company.name}
                    </h2>
                    <p className='text-gray-600 my-2'>
                      Industry: {user.company.industry}
                    </p>
                    <p className='text-gray-600 my-2'>
                      Location: {user.company.location}
                    </p>
                    <p className='text-gray-600 my-2'>
                      Website:{' '}
                      <a
                        href={user.company.website}
                        target='_blank'
                        className='text-blue-600 hover:underline'
                      >
                        {user.company.website}
                      </a>
                    </p>
                  </div>
                </div>
                <div className='mt-4'>
                  <h2 className='text-lg font-semibold mb-2'>
                    Company Overview
                  </h2>
                  <p className='text-gray-700'>{user.company.overview}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className='border border-gray-300 bg-blue-700 p-2 px-4 rounded-md text-xs font-semibold text-white hover:bg-blue-800 mt-4 flex items-center gap-2'
                  >
                    Edit Details <Edit3 size={16} />
                  </button>
                </div>

                {isEditing && (
                  <form onSubmit={handleSubmit} className='mt-4'>
                    <div className='mb-4'>
                      <label className='block text-gray-700'>Company Name</label>
                      <input
                        type='text'
                        name='name'
                        value={companyDetails.name}
                        onChange={handleChange}
                        className='w-full border px-4 py-2 rounded-md'
                        required
                      />
                    </div>
                    <div className='mb-4'>
                      <label className='block text-gray-700'>Industry</label>
                      <input
                        type='text'
                        name='industry'
                        value={companyDetails.industry}
                        onChange={handleChange}
                        className='w-full border px-4 py-2 rounded-md'
                      />
                    </div>
                    <div className='mb-4'>
                      <label className='block text-gray-700'>Location</label>
                      <input
                        type='text'
                        name='location'
                        value={companyDetails.location}
                        onChange={handleChange}
                        className='w-full border px-4 py-2 rounded-md'
                      />
                    </div>
                    <div className='mb-4'>
                      <label className='block text-gray-700'>Website</label>
                      <input
                        type='url'
                        name='website'
                        value={companyDetails.website}
                        onChange={handleChange}
                        className='w-full border px-4 py-2 rounded-md'
                      />
                    </div>
                    <div className='mb-4'>
                      <label className='block text-gray-700'>
                        Company Overview
                      </label>
                      <textarea
                        name='overview'
                        value={companyDetails.overview}
                        onChange={handleChange}
                        className='w-full border px-4 py-2 rounded-md'
                        rows='3'
                      />
                    </div>
                    <button
                      type='submit'
                      className='border border-blue-600 bg-blue-600 text-white p-2 px-4 rounded-md text-xs font-semibold'
                    >
                      Save Details
                    </button>
                  </form>
                )}
              </section>
            ) : (
              <section className='my-4 border p-8 rounded-md'>
                <div className='flex items-center justify-between'>
                  <h1 className='text-2xl font-semibold mb-2'>
                    Company details
                  </h1>
                  <button
                    onClick={() => setIsAddingDetails(true)}
                    className='border border-blue-600 bg-white p-2 px-4 rounded-md text-xs font-semibold text-blue-600'
                  >
                    Add details
                  </button>
                </div>
                {isAddingDetails ? (
                  <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                      <label className='block text-gray-700'>
                        Company Name
                      </label>
                      <input
                        type='text'
                        name='name'
                        value={companyDetails.name}
                        onChange={handleChange}
                        className='w-full border px-4 py-2 rounded-md'
                        required
                      />
                    </div>
                    <div className='mb-4'>
                      <label className='block text-gray-700'>Industry</label>
                      <input
                        type='text'
                        name='industry'
                        value={companyDetails.industry}
                        onChange={handleChange}
                        className='w-full border px-4 py-2 rounded-md'
                      />
                    </div>
                    <div className='mb-4'>
                      <label className='block text-gray-700'>Location</label>
                      <input
                        type='text'
                        name='location'
                        value={companyDetails.location}
                        onChange={handleChange}
                        className='w-full border px-4 py-2 rounded-md'
                      />
                    </div>
                    <div className='mb-4'>
                      <label className='block text-gray-700'>Website</label>
                      <input
                        type='url'
                        name='website'
                        value={companyDetails.website}
                        onChange={handleChange}
                        className='w-full border px-4 py-2 rounded-md'
                      />
                    </div>
                    <div className='mb-4'>
                      <label className='block text-gray-700'>
                        Company Overview
                      </label>
                      <textarea
                        name='overview'
                        value={companyDetails.overview}
                        onChange={handleChange}
                        className='w-full border px-4 py-2 rounded-md'
                        rows='3'
                      />
                    </div>
                    <button
                      type='submit'
                      className='border border-blue-600 bg-blue-600 text-white p-2 px-4 rounded-md text-xs font-semibold'
                    >
                      Save details
                    </button>
                  </form>
                ) : (
                  <p>No details found</p>
                )}
              </section>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
