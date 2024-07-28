import { deleteJob, storeJobs } from '@/app/jobs/jobSlice';
import apiClient from '@/services/apiClient';
import { Building2, Pencil, Trash } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';

const EmployerDashboardContent = () => {
  const navigate = useNavigate();
  const jobs = useSelector((state) => state.jobs.jobs);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch jobs created by the employer
    const fetchJobs = async () => {
      try {
        const res = await apiClient.get(`/jobs/employer/${user._id}`);
        console.log(res);

        if (res.status === 200) {
          dispatch(storeJobs(res.data.jobs));
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    user && fetchJobs();
  }, [user]);

  // handle job delete functionality

  const handleJobDelete = async (id) => {
    try {
      const res = await apiClient.delete(`/jobs/${id}`);

      if (res.status === 200) {
        dispatch(deleteJob(id));
        toast.success('Job deleted');
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div>
      <div className='container max-w-[1400px] mx-auto w-[95%] flex flex-col gap-4 my-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl mb-4'>Jobs Created</h1>
          <Link
            to='/dashboard/employer/jobs/add'
            className='bg-blue-600 p-2 px-4 rounded-md text-white'
          >
            Create job
          </Link>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array.isArray(jobs) && jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job?._id} className='border p-4 rounded-md'>
                <div className='flex mb-4 gap-4 items-center'>
                  <div className='w-16 h-16 rounded-md bg-gray-200 flex justify-center items-center'>
                    <Building2 size={24} />
                  </div>
                  <div className=''>
                    <h2 className='font-medium text-lg'>{job?.title}</h2>
                    <div className='flex gap-2 text-sm items-center'>
                      <p>{job?.company?.name}</p> {'•'}
                      <p className='text-gray-600'>{job?.location}</p>
                    </div>
                  </div>
                  <div className='flex ml-auto gap-2 items-center'>
                    <Button
                      onClick={() =>
                        navigate('/dashboard/employer/jobs/edit/' + job._id)
                      }
                      title='Edit'
                      variant='ghost'
                      className='p-3'
                    >
                      <Pencil size={16} />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button title='Delete' variant='ghost' className='p-3'>
                          <Trash size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm delete?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the job.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleJobDelete(job._id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <p className='text-gray-600 mb-2'>
                  {job?.description?.length > 100
                    ? job?.description.slice(0, 100) + '...'
                    : job?.description}
                </p>
                <ul className=''>
                  <div className='my-4 flex flex-wrap gap-2'>
                    {job?.requirements &&
                      job.requirements
                        .toString()
                        .split(',')
                        .map((requirement, idx) => (
                          <span
                            key={idx}
                            className='px-3 py-1 font-medium bg-gray-200 rounded-md text-blue-600 text-xs'
                          >
                            {requirement}
                          </span>
                        ))}
                  </div>
                </ul>
                <p className='text-gray-600'>
                  <strong>Salary:</strong> ${job?.salary}
                </p>
                 {/* {job?.company && (

                  <div className='mt-4'>

                    <p className='text-gray-600'>

                      <strong>Name:</strong>

                    </p>

                    <p className='text-gray-600'>

                      <strong>Industry:</strong> {job?.company?.industry}

                    </p>



                    <p className='text-gray-600'>

                      <strong>Website:</strong>

                      <a

                        href={job?.company?.website}

                        target='_blank'

                        className='text-blue-600 hover:underline'

                      >

                        {job?.company?.website}

                      </a>

                    </p>

                  </div>

                )} */}
              </div>
            ))
          ) : (
            <p>No jobs found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboardContent;
