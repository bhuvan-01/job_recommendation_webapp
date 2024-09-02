import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/services/apiClient";

const RecommendedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        const response = await apiClient.get("/jobs/recommended");
        setJobs(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedJobs();
  }, []);

  const handleTitleClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="grid grid-cols-1 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id.$oid}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3
              className="text-xl font-semibold mb-2 text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => handleTitleClick(job._id.$oid)}
            >
              {job.title}
            </h3>
            <p className="text-gray-700 mb-1">
              <strong>Type:</strong> {job.jobType}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Location:</strong> {job.location}
            </p>
            <p className="text-gray-700">
              <strong>Salary:</strong> ${job.salary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedJobs;
