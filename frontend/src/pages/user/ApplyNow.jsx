// src/components/ApplyNow.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { storeJobs, appliedJob } from "@/app/jobs/jobSlice";
import { Button } from "@/components/ui/button"; // Adjust the path as needed
import { toast } from "react-hot-toast";

const ApplyNow = () => {
  const { jobId } = useParams();
  const jobs = useSelector((state) => state.jobs.jobs);
  const job = jobs.find((job) => job._id === jobId);
  const dispatch = useDispatch();

  if (!job) {
    return <div>Job not found</div>;
  }

  const handleAppliedJob = (job) => {
    dispatch(appliedJob(job));
    toast.success("Job applied!", {
      position: "top-right",
      duration: 2000,
    });
  };

  return (
    <div className="container mx-auto my-4 p-4 border rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <p className="text-xl mb-2">Company: {job.company.name}</p>
      <p className="text-lg mb-2">Location: {job.location}</p>
      <p className="text-lg mb-2">Experience: {job.experience}</p>
      <div className="my-4">
        <h2 className="text-2xl font-semibold">Job Description</h2>
        <p>{job.description}</p>
      </div>
      <div className="my-4">
        <h2 className="text-2xl font-semibold">Requirements</h2>
        <ul>
          {job.requirements
            .toString()
            .split(",")
            .map((requirement, idx) => (
              <li key={idx} className="mb-1">
                {requirement}
              </li>
            ))}
        </ul>
      </div>

      <Button onClick={() => handleAppliedJob(job)} className="mt-4">
        Apply Now
      </Button>
    </div>
  );
};

export default ApplyNow;
