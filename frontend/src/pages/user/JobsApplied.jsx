import { Button } from '@/components/ui/button';
import apiClient from '@/services/apiClient';
import { Banknote, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

const JobsApplied = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getStatusClassName = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-200 text-gray-700 p-1 text-xs rounded-md font-medium';
      case 'Accepted':
        return 'bg-green-200 text-green-700 p-1 text-xs rounded-md font-medium';
      case 'Rejected':
        return 'bg-red-200 text-red-700 p-1 text-xs rounded-md font-medium';
      case 'Hired':  // Added "Hired" case
        return 'bg-blue-200 text-blue-700 p-1 text-xs rounded-md font-medium';
      default:
        return 'bg-gray-200 text-gray-700 p-1 text-xs rounded-md font-medium';
    }
  };

  useEffect(() => {
    const getAppliedJobs = async () => {
      try {
        const res = await apiClient.get('/applications');
        console.log(res);
        setAppliedJobs(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getAppliedJobs();
  }, []);

  return (
    <div className='container px-0 max-w-[1400px] mx-auto w-[95%] my-4'>
      <div className='flex gap-4'>
        <div className='basis-8/12'>
          <h1 className='text-2xl font-medium'>Applied Jobs</h1>

          <div className='my-2'>
            {isLoading ? (
              <p>Loading...</p>
            ) : appliedJobs.length > 0 ? (
              <div className='grid'>
                {appliedJobs.map((application) => (
                  <div
                    className='p-4 my-2 rounded-md shadow-md border flex items-center justify-between'
                    key={application._id}
                  >
                    <div>
                      <div className='flex gap-2 items-center'>
                        <h1 className='text-xl'>{application.job ? application.job.title : 'No title'}</h1>
                        <p className={getStatusClassName(application.status)}>
                          {application.status}
                        </p>
                      </div>
                      <div className='flex gap-2 items-center flex-wrap mt-2'>
                        <p className='flex gap-1 items-center text-sm'>
                          <MapPin size={14} /> {application.job ? application.job.location : 'No location'}
                        </p>
                        {'•'}
                        <p className='flex gap-1 items-center text-sm'>
                          <Banknote size={18} />${application.job ? application.job.salary : '0'}
                        </p>
                        {'•'}
                        <p className='text-sm'>{application.job ? application.job.jobType : 'No job type'}
                        </p>
                        {'•'}
                        <p className='text-sm'>{application.job ? application.job.experience : 'No experience'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Button variant='ghost'>View application</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No jobs applied</p>
            )}
          </div>
        </div>
        <div className='basis-4/12'>
          <h1 className='text-2xl font-medium'>Recommended Jobs</h1>
          <p className='my-2'>No jobs found</p>
        </div>
      </div>
    </div>
  );
};

export default JobsApplied;
