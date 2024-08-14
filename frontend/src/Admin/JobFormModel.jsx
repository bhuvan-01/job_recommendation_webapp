import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createAdminJob, updateAdminJob } from '../app/jobFormSlice';

const JobFormModal = ({ job, closeModal, fetchJobs }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    experience: '',
    jobType: '',
    locationType: '',
    industry: '',
    location: '',
    salary: '',
  });

  useEffect(() => {
    if (job) {
      setFormData({ ...job });
    }
  }, [job]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (job) {
      dispatch(updateAdminJob({ id: job._id, jobData: formData }));
    } else {
      dispatch(createAdminJob(formData));
    }
    fetchJobs();
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative p-5 w-1/2 mx-auto bg-white rounded">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="block w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            className="block w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Requirements"
            className="block w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Experience Level"
            className="block w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            placeholder="Job Type"
            className="block w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="locationType"
            value={formData.locationType}
            onChange={handleChange}
            placeholder="Location Type"
            className="block w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="Industry"
            className="block w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="block w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Salary"
            className="block w-full p-2 border border-gray-300 rounded"
          />
          <div className="text-right">
            <button
              type="button"
              onClick={closeModal}
              className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;
