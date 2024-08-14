import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminJobs,
  deleteAdminJob,
} from '../app/jobFormSlice';
import JobFormModal from '../Admin/JobFormModel';

const JobsList = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobForm);
  const [currentJob, setCurrentJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAdminJobs());
  }, [dispatch]);

  const handleDelete = async (jobId) => {
    dispatch(deleteAdminJob(jobId));
  };

  const handleCreateOrUpdate = (job) => {
    setCurrentJob(job);
    setModalOpen(true);
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching jobs: {error.message || error}</div>; // Fix the error rendering here

  return (
    <div className="container mx-auto mt-5 flex flex-col">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => handleCreateOrUpdate(null)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Job
        </button>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-gray-300 p-2 rounded"
        />
      </div>
      <div className="mt-3">
        {filteredJobs.map((job) => (
          <div key={job._id} className="p-4 mb-2 shadow rounded bg-white">
            <h3 className="font-semibold">{job.title}</h3>
            <p>{job.description}</p>
            <div><b>Type:</b> {job.jobType} | <b>Location:</b> {job.location}</div>
            <button
              onClick={() => handleCreateOrUpdate(job)}
              className="text-blue-500 hover:text-blue-700 mr-2"
            >
              Update
            </button>
            <button
              onClick={() => handleDelete(job._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {modalOpen && (
        <JobFormModal
          job={currentJob}
          closeModal={() => setModalOpen(false)}
          fetchJobs={() => dispatch(fetchAdminJobs())}
        />
      )}
    </div>
  );
};

export default JobsList;
