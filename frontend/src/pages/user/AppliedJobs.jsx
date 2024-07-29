// src/components/AppliedJobs.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Adjust the path as needed

const AppliedJobs = () => {
  const appliedJobs = useSelector((state) => state.jobs.appliedJobs);

  if (!appliedJobs || appliedJobs.length === 0) {
    return <div>No applied jobs available.</div>;
  }

  return (
    <div className='container px-0 max-w-[1400px] mx-auto w-[95%] flex gap-4 my-4'>
      <div className='basis-9/12'>
        <section>
          <h1 className='font-semibold text-2xl'>Applied Jobs</h1>
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 my-4'>
            {appliedJobs.map((job, index) => (
              <div
                key={index}
                className='aspect-square w-full border rounded-md p-4 flex flex-col'
              >
                <div className='w-full items-center flex gap-4'>
                  <div className='w-16 h-16 aspect-square rounded-md bg-gray-200 flex justify-center items-center'>
                    <Building2 size={24} />
                  </div>
                  <div className='basis-8/12'>
                    <h2 className='text-lg font-semibold leading-normal'>
                      {job.title}
                    </h2>
                    <p className='text-gray-600 text-sm font-medium'>
                      {job.company.name} {'•'} {job.location}
                    </p>
                  </div>
                </div>

                <div className='my-4 flex flex-wrap gap-2'>
                  {job.requirements
                    .toString()
                    .split(',')
                    .map((requirement, idx) => (
                      <span
                        key={idx}
                        className='px-3 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-800'
                      >
                        {requirement}
                      </span>
                    ))}
                </div>

                <p className='text-gray-600 text-sm font-medium'>
                  {job?.description.length > 100
                    ? job?.description.slice(0, 100)
                    : job?.description}
                </p>

                <div className='flex'>
                  <span className='bg-gray-50 text-xs p-1 px-2 rounded-md border my-3'>
                    {job?.experience}
                  </span>
                </div>

                <div className='mt-auto flex gap-2 items-center'>
                  <Button
                    as={Link}
                    to={`/jobs/${job.id}/details`}
                    className='w-full p-2'
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AppliedJobs;
