import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import mapImage from "./../assets/images/ukmap.jpeg";
import { Button } from "../components/ui/button";
import apiClient from "../services/apiClient";

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.user?.role);

  useEffect(() => {
    apiClient
      .get("/jobs")
      .then((response) => {
        console.log("API Response:", response);

        const jobList = response.data.jobs || [];

        setJobs(jobList.slice(0, 5));
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleButtonClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (userRole === "user") {
      navigate("/dashboard/user");
    } else {
      navigate("/jobs");
    }
  };

  return (
    <div className="container px-0 max-w-[1200px] mx-auto w-[90%] my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Featured Jobs</h2>
        {jobs.map((job) => (
          <div
            key={job._id}
            onClick={() => handleJobClick(job._id)}
            className="border rounded-md p-3 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div>
              <h3 className="text-md font-semibold">{job.title}</h3>
              <p className="text-gray-600 text-sm">
                {job.company.name} • {job.location}
              </p>
            </div>
            <div className="mt-2">
              <button className="text-blue-600 hover:underline text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
        <Button
          onClick={handleButtonClick}
          className="w-full bg-blue-500 mt-3 text-sm"
        >
          Show All Job Vacancies
        </Button>
      </div>

      <div className="hidden md:block">
        <img
          src={mapImage}
          alt="Map"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
    </div>
  );
};

export default FeaturedJobs;
