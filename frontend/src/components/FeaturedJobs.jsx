import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import mapImage from './../assets/images/ukmap.jpeg';
import { Button } from './ui/button';
import apiClient from './../services/apiClient';

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  // Static jobs to display when user is not logged in
  const staticJobs = [
    {
      title: 'Network Engineer',
      company: 'Data Solutions',
      location: 'Berlin',
    },
    {
      title: 'UX Designer',
      company: 'EduWorld',
      location: 'Chicago',
    },
    {
      title: 'Product Manager',
      company: 'Finance Forward',
      location: 'Toronto',
    },
    {
      title: 'Project Manager',
      company: 'Data Solutions',
      location: 'Sydney',
    },
    {
      title: 'Business Analyst',
      company: 'Tech Innovators',
      location: 'Chicago',
    },
  ];

  useEffect(() => {
    if (isLoggedIn) {
     
      apiClient.get('/api/jobs')
        .then(response => {
          setJobs(response.data);
          console.log(setJobs)
        })
        .catch(error => {
          console.error('Error fetching jobs:', error);
        });
    } else {
      setJobs(staticJobs);
    }
  }, [isLoggedIn]);

  const handleJobClick = (jobId) => {
    if (isLoggedIn) {
      navigate(`/jobs/${jobId}`);
    } else {
      alert('You need to log in to view job details. Redirecting to login page.');
      navigate('/login');
    }
  };

  const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      alert('You need to log in to access the dashboard. Redirecting to login page.');
      navigate('/login');
    }
  };

  return (
    <div className='container px-0 max-w-[1200px] mx-auto w-[90%] my-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
      {/* Left Column: Job Listings */}
      <div className='space-y-2'>
        <h2 className='text-xl font-semibold'>Featured Jobs</h2>
        {jobs.map((job, index) => (
          <div
            key={index}
            onClick={() => handleJobClick(job._id)}
            className='border rounded-md p-3 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer'
          >
            <div>
              <h3 className='text-md font-semibold'>{job.title}</h3>
              <p className='text-gray-600 text-sm'>{job.company} • {job.location}</p>
            </div>
            <div className='mt-2'>
              <button className='text-blue-600 hover:underline text-sm'>
                View Details
              </button>
            </div>
          </div>
        ))}
        <Button onClick={handleButtonClick} className='w-full bg-blue-500 mt-3 text-sm'>
          Show All Job Vacancies
        </Button>
      </div>
      
      {/* Right Column: Map */}
      <div className='hidden md:block'>
        <img src={mapImage} alt='Map' className='w-full h-full object-cover rounded-md' />
      </div>
    </div>
  );
};

export default FeaturedJobs;
