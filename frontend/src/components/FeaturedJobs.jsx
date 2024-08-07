import React from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import mapImage from './../assets/images/ukmap.jpeg';

const FeaturedJobs = () => {
  const jobs = useSelector((state) => state.jobs.jobs);
  const featuredJobs = jobs.filter((job) => job.isFeatured);

  return (
    <div className='container px-0 max-w-[1400px] mx-auto w-[95%] my-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Featured Jobs</h2>
        <div className='space-y-4'>
          {featuredJobs.slice(0, 5).map((job, index) => (
            <div key={index} className='border rounded-md p-4 flex gap-4'>
              <div className='w-16 h-16 rounded-md bg-gray-100 flex justify-center items-center'>
                <Building2 size={24} />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold'>{job.title}</h3>
                <p className='text-gray-600'>
                  {job.company ? `${job.company.name} • ${job.location}` : job.location}
                </p>
                <p className='text-gray-600 text-sm'>
                  {job?.description.length > 100
                    ? job?.description.slice(0, 100) + '...'
                    : job?.description}
                </p>
                <Link
                  to={`/jobs/${job._id}`}
                  className='text-blue-600 hover:underline'
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
        <Link to='/jobs'>
          <Button className='w-full bg-blue-500 mt-4'>Show All Job Vacancies</Button>
        </Link>
      </div>
      <div className='hidden md:block'>
        <img src={mapImage} alt='Map' className='w-full h-full object-cover rounded-md' />
      </div>
    </div>
  );
};

export default FeaturedJobs;
