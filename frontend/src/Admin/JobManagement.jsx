import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient'; // Ensure this is the correct path to your API client

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        const response = await apiClient.get('/admin/jobs');
        setJobs(response.data.jobs);
    };

    const handleDelete = async (jobId) => {
        try {
            await apiClient.delete(`/admin/jobs/${jobId}`);
            setJobs(jobs.filter(job => job._id !== jobId)); // Optimistic update
        } catch (error) {
            console.error("Failed to delete job:", error);
        }
    };

    const handleApprove = async (jobId) => {
        // Implement job approval logic
    };

    const handleReject = async (jobId) => {
        // Implement job rejection logic
    };

    const handleView = async (jobId) => {
        // Implement job view logic
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            {filteredJobs.map((job) => (
                <div key={job._id} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-xl mb-2">{job.title}</h3>
                        <p>Type: {job.jobType} | Location: {job.location} | Company: {job.company.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleView(job._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            View
                        </button>
                        <button onClick={() => handleApprove(job._id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Approve
                        </button>
                        <button onClick={() => handleReject(job._id)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Reject
                        </button>
                        <button onClick={() => handleDelete(job._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default JobList;
