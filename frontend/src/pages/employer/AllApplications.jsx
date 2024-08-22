import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobApplications = () => {
    const [applications, setApplications] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobsAndApplications = async () => {
            try {
                // Fetch the jobs posted by the employer
                const jobsResponse = await axios.get('/jobs', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                console.log('Jobs response:', jobsResponse.data);

                // Assuming the jobs data is wrapped in a 'data' field
                const jobData = jobsResponse.data.data || [];

                if (Array.isArray(jobData)) {
                    const applicationsPromises = jobData.map(job =>
                        axios.get(`/applications/job/${job._id}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        })
                    );

                    const results = await Promise.all(applicationsPromises);
                    const applicationsByJob = results.reduce((acc, result, index) => {
                        acc[jobData[index]._id] = result.data;
                        return acc;
                    }, {});

                    setApplications(applicationsByJob);
                } else {
                    throw new Error("Expected an array of jobs, received something else.");
                }

                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to fetch job applications');
                setLoading(false);
                console.error(err);
            }
        };

        fetchJobsAndApplications();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Job Applications</h1>
            {Object.keys(applications).length > 0 ? (
                Object.entries(applications).map(([jobId, apps]) => (
                    <div key={jobId}>
                        <h2>Job ID: {jobId}</h2>
                        <ul>
                            {apps.map(app => (
                                <li key={app._id}>
                                    Applicant: {app.applicantName} - Status: {app.status}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>No applications found.</p>
            )}
        </div>
    );
};

export default JobApplications;
