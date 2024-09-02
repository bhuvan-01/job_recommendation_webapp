import { removeJobSaved } from '@/app/jobs/jobSlice';
import { Button } from '@/components/ui/button';
import useUser from '@/hooks/useUser';
import apiClient from '@/services/apiClient';
import { Banknote, Bookmark, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import RecommendedJob from '@/pages/user/RecommendedJobs'

const JobsSaved = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleJobUnsave = async (jobId) => {
    try {
      const res = await apiClient.delete(`/jobs/save/${jobId}`);

      if (res.status === 200) {
        const updatedSavedJobs = savedJobs.filter((job) => job._id !== jobId);

        setSavedJobs(updatedSavedJobs);
        toast.success('Job removed from saved');
      }
    } catch (error) {
      toast.error('Failed to save');

      console.log(error.response);
    }
  };

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await apiClient.get(`/jobs/saved-jobs`);

        console.log(res);

        if (res.status === 200) {
          setIsLoading(false);
          setSavedJobs(res.data);
        }
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchSavedJobs();
  }, []);

  return (
    <div className='container px-0 max-w-[1400px] mx-auto w-[95%] my-4'>
      <div className='flex gap-4'>
        <div className='basis-8/12'>
          <h1 className='text-2xl font-medium'>Saved Jobs</h1>

          <div className='my-2'>
            {isLoading ? (
              <p>Loading...</p>
            ) : savedJobs.length > 0 ? (
              <div className='grid'>
                {savedJobs.map((job) => (
                  <div
                    className='p-4 my-2 rounded-md shadow-md border flex justify-between'
                    key={job._id}
                  >
                    <div>
                      <h1 className='text-xl'>{job.title}</h1>

                      <div className='flex gap-2 items-center flex-wrap mt-2'>
                        <p className='flex gap-1 items-center text-sm'>
                          <MapPin size={14} /> {job.location}
                        </p>
                        {'•'}
                        <p className='flex gap-1 items-center text-sm'>
                          <Banknote size={18} />${job.salary}
                        </p>
                        {'•'}
                        <p className='text-sm'>{job.jobType}</p>
                        {'•'}
                        <p className='text-sm'>{job.experience}</p>
                      </div>
                    </div>
                    <div>
                      <Button
                        className='flex gap-2 items-center'
                        variant='ghost'
                        onClick={() => handleJobUnsave(job._id)}
                      >
                        Unsave <Bookmark size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No jobs saved</p>
            )}
          </div>
        </div>
        <div className='basis-4/12'>
          <h1 className='text-2xl font-medium'>Recommended Jobs</h1>
          <RecommendedJob/>
        </div>
      </div>
    </div>
  );
};
export default JobsSaved;
