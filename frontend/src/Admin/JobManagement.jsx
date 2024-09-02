import React, { useState, useEffect } from "react";
import apiClient from "../services/apiClient";
import JobDetailsPopup from "./JobView";
import JobUpdatePopup from "./JobUpdate";
import JobCreatePopup from "./JobCreate";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "./Pagination"; 

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); 
  const [pageSize, setPageSize] = useState(5); 

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/admin/jobs");
      setJobs(response.data.jobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Failed to fetch jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    setLoading(true);
    try {
      await apiClient.delete(`/admin/jobs/${jobId}`);
      setJobs(jobs.filter((job) => job._id !== jobId));
      toast.success("Job deleted successfully!");
    } catch (error) {
      console.error("Failed to delete job:", error);
      toast.error("Failed to delete job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJobDetails = (jobId) => {
    const job = jobs.find((j) => j._id === jobId);
    setSelectedJob(job);
    setShowDetailsPopup(true);
  };

  const handleUpdateJob = async (jobId, updatedData) => {
    setLoading(true);
    try {
      await apiClient.put(`/admin/jobs/${jobId}`, updatedData);
      fetchJobs(); // Refresh the job list
      toast.success("Job updated successfully!");
      setShowUpdatePopup(false);
    } catch (error) {
      console.error("Failed to update job:", error);
      toast.error("Failed to update job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (newJobData) => {
    setLoading(true);
    try {
      await apiClient.post("/admin/jobs", newJobData);
      fetchJobs();
      toast.success("Job created successfully!");
      setShowCreatePopup(false);
    } catch (error) {
      console.error("Failed to create job:", error);
      toast.error(
        "Failed to create job. Please ensure all fields are correct."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const pageCount = Math.ceil(filteredJobs.length / pageSize);
  const currentJobs = filteredJobs.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="container mx-auto min-h-screen flex flex-col">
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          onClick={() => setShowCreatePopup(true)}
          className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Job
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        currentJobs.map((job) => (
          <div
            key={job._id}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-xl mb-2">{job.title}</h3>
              <p>
                Type: {job.jobType} | Location: {job.location} | Company:{" "}
                {job.company.name}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleJobDetails(job._id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                View
              </button>
              <button
                onClick={() => {
                  setSelectedJob(job);
                  setShowUpdatePopup(true);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(job._id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      <div className="mt-auto">
        <Pagination
          canPreviousPage={currentPage > 0}
          canNextPage={currentPage < pageCount - 1}
          pageOptions={Array.from({ length: pageCount }, (_, i) => i + 1)}
          pageCount={pageCount}
          gotoPage={setCurrentPage}
          nextPage={() => setCurrentPage(currentPage + 1)}
          previousPage={() => setCurrentPage(currentPage - 1)}
          pageIndex={currentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </div>

      {showDetailsPopup && selectedJob && (
        <JobDetailsPopup
          job={selectedJob}
          onClose={() => setShowDetailsPopup(false)}
        />
      )}

      {showUpdatePopup && selectedJob && (
        <JobUpdatePopup
          job={selectedJob}
          onClose={() => setShowUpdatePopup(false)}
          onUpdate={handleUpdateJob}
        />
      )}

      {showCreatePopup && (
        <JobCreatePopup
          onClose={() => setShowCreatePopup(false)}
          onCreate={handleCreateJob}
        />
      )}
    </div>
  );
};

export default JobManagement;
