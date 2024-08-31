import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  keywordQueryChanged,
  locationQueryChanged,
  resetSearchState,
  searchResultsReceived,
  searchResultsRequested,
  searchResultsRequestFailed,
  selectedExperienceLevelsChanged,
  selectedIndustriesChanged,
  selectedJobTypesChanged,
  selectedLocationTypesChanged,
} from "@/app/appSlice";
import {
  jobSaved,
  removeJobSaved,
  storeJobs,
  incrementJobViewCount,
} from "@/app/jobs/jobSlice";
import MapboxMap from "@/components/Mapbox";
import useUser from "@/hooks/useUser";
import apiClient from "@/services/apiClient";
import { IMG_URL } from "@/utils/constants";
import {
  Bookmark,
  Building2,
  ChevronDown,
  ChevronUp,
  Filter,
  MapPin,
  Search,
  SquareArrowOutUpRight,
} from "lucide-react";
import ContactImage from "../assets/images/contactIcon.png";
import Pagination from "../components/Pagination";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";


const experienceLevels = [
  { id: "Internship", label: "Internship" },
  { id: "Entry Level", label: "Entry Level" },
  { id: "Associate", label: "Associate" },
  { id: "Mid Level", label: "Mid Level" },
  { id: "Senior Level", label: "Senior Level" },
];

const jobTypes = [
  { id: "Full-Time", label: "Full-Time" },
  { id: "Part-Time", label: "Part-Time" },
  { id: "Contract", label: "Contract" },
  { id: "Temporary", label: "Temporary" },
  { id: "Internship", label: "Internship" },
];

const locations = [
  { id: "Remote", label: "Remote" },
  { id: "On-Site", label: "On-Site" },
  { id: "Hybrid", label: "Hybrid" },
];

const industries = [
  { id: "Technology", label: "Technology" },
  { id: "Healthcare", label: "Healthcare" },
  { id: "Finance", label: "Finance" },
  { id: "Education", label: "Education" },
  { id: "Retail", label: "Retail" },
];

const FilterAccordion = ({ title, options, index, selectedOptions, onChange }) => {
  const [isActive, setIsActive] = useState(() => index === 0);

  const handleCheckboxChange = (id) => {
    const newSelectedOptions = selectedOptions.includes(id)
      ? selectedOptions.filter((option) => option !== id)
      : [...selectedOptions, id];
    onChange(newSelectedOptions);
  };

  return (
    <div>
      <h2
        onClick={() => setIsActive(!isActive)}
        className={`text-lg hover:bg-gray-100 rounded-md p-2 px-4 font-medium my-2 flex justify-between items-center ${
          isActive ? "bg-gray-100" : "bg-white"
        }`}
      >
        {title} {!isActive ? <ChevronDown /> : <ChevronUp />}
      </h2>
      {isActive && (
        <ul className="px-4">
          {options.map(({ id, label }) => (
            <li className="flex items-center space-x-2 my-4" key={id}>
              <input
                type="checkbox"
                id={id}
                name={title}
                checked={selectedOptions.includes(id)}
                onChange={() => handleCheckboxChange(id)}
              />
              <Label
                htmlFor={id}
                className="text-sm text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </Label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Filters = () => {
  const dispatch = useDispatch();
  const {
    selectedExperienceLevels,
    selectedJobTypes,
    selectedLocationTypes,
    selectedIndustries,
  } = useSelector((state) => state.app);

  return (
    <div className="border rounded-md p-4 md:p-8 mb-4 md:m-0">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-semibold flex items-center gap-2">
          <Filter size={14} />
          Filters
        </h1>
        <Button variant="ghost" onClick={() => dispatch(resetSearchState())}>
          Clear
        </Button>
      </div>
      <div className="space-y-4">
        <FilterAccordion
          title="Experience Level"
          index={0}
          options={experienceLevels}
          selectedOptions={selectedExperienceLevels}
          onChange={(newSelectedOptions) =>
            dispatch(selectedExperienceLevelsChanged(newSelectedOptions))
          }
        />
        <FilterAccordion
          title="Job Type"
          index={1}
          options={jobTypes}
          selectedOptions={selectedJobTypes}
          onChange={(newSelectedOptions) =>
            dispatch(selectedJobTypesChanged(newSelectedOptions))
          }
        />
        <FilterAccordion
          title="Location Type"
          index={2}
          options={locations}
          selectedOptions={selectedLocationTypes}
          onChange={(newSelectedOptions) =>
            dispatch(selectedLocationTypesChanged(newSelectedOptions))
          }
        />
        <FilterAccordion
          title="Industry"
          index={3}
          options={industries}
          selectedOptions={selectedIndustries}
          onChange={(newSelectedOptions) =>
            dispatch(selectedIndustriesChanged(newSelectedOptions))
          }
        />
      </div>
    </div>
  );
};

const JobList = () => {
  const jobs = useSelector((state) => state.jobs.jobs);
  const totalCount = useSelector((state) => state.jobs.totalCount);
  const [page, setPage] = useState(1);
  const [showEmployerPopup, setShowEmployerPopup] = useState(false);

  const {
    keywordQuery,
    locationQuery,
    selectedExperienceLevels,
    selectedJobTypes,
    selectedLocationTypes,
    selectedIndustries,
  } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const { user } = useUser();
  const navigate = useNavigate();

  const [locationSuggestions, setLocationSuggestions] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      dispatch(searchResultsRequested());
      try {
        const res = await apiClient.get("/jobs", {
          params: {
            page,
            keyword: keywordQuery,
            location: locationQuery,
            experience: selectedExperienceLevels,
            jobType: selectedJobTypes,
            locationType: selectedLocationTypes,
            industry: selectedIndustries,
          },
        });

        if (res.status === 200) {
          dispatch(searchResultsReceived(res.data.jobs));
          dispatch(storeJobs(res.data));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        dispatch(searchResultsRequestFailed());
      }
    };

    fetchJobs();
  }, [
    dispatch,
    page,
    keywordQuery,
    locationQuery,
    selectedExperienceLevels,
    selectedJobTypes,
    selectedLocationTypes,
    selectedIndustries,
  ]);

  const handleKeywordChange = (e) => {
    dispatch(keywordQueryChanged(e.target.value));
  };

  const handleLocationChange = async (e) => {
    const query = e.target.value;

    dispatch(locationQueryChanged(query));

    if (query.length > 2) {
      try {
        const response = await axios.get(
          "http://api.positionstack.com/v1/forward",
          {
            params: {
              access_key: "ed488739b1580aa82d782b7fa032981c",
              query: query,
              limit: 5,
              output: "json",
            },
          }
        );

        if (response.data && response.data.data) {
          setLocationSuggestions(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        setLocationSuggestions([]);
      }
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleLocationSelect = (location) => {
    dispatch(locationQueryChanged(location.label));
    setLocationSuggestions([]);
  };

  const handleJobSave = async (jobId) => {
    try {
      const res = await apiClient.post(`/jobs/save/${jobId}`);

      if (res.status === 200) {
        dispatch(jobSaved({ userId: user._id, jobId }));
        toast.success("Job saved");
      }
    } catch (error) {
      toast.error("Failed to save");
      console.log(error.response);
    }
  };

  const handleJobUnsave = async (jobId) => {
    try {
      const res = await apiClient.delete(`/jobs/save/${jobId}`);

      if (res.status === 200) {
        dispatch(removeJobSaved({ userId: user._id, jobId }));
        toast.success("Job removed from saved");
      }
    } catch (error) {
      toast.error("Failed to unsave");
      console.log(error.response);
    }
  };

  const incrementViewCount = async (jobId) => {
    try {
      await apiClient.patch(`/jobs/${jobId}/increment-view`);
      dispatch(incrementJobViewCount({ jobId }));
    } catch (error) {
      console.error("Failed to increment view count", error);
    }
  };

  const handleJobDetails = (jobId) => {
    incrementViewCount(jobId);
    navigate(`/jobs/view/${jobId}`);
  };

  return (
    <div className="container bg-gray-100 px-0 max-w-[1400px] mx-auto w-[95%] md:flex gap-4 my-4">
      <div className="hidden md:block basis-3/12 md:space-y-4">
        

        <Filters />
        <MapboxMap />
      </div>
      <div className="basis-9/12">
        <section className="p-2">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
            <div className="flex pr-2 w-full md:max-w-[360px] items-center gap-2 border rounded-md">
              <Input
                type="text"
                placeholder="Skill, title"
                name="query"
                id="query"
                value={keywordQuery}
                onChange={handleKeywordChange}
                className="border-none focus-visible:ring-0 shadow-none"
              />
              <Search size={16} />
            </div>

            <div className="w-full md:w-fit flex pr-2 items-center gap-2 border  rounded-md relative">
              <Input
                type="text"
                placeholder="City, State,or Post code"
                name="location"
                id="location"
                value={locationQuery}
                onChange={handleLocationChange}
                className="border-none focus-visible:ring-0 shadow-none"
              />
              <MapPin size={16} />
              {locationSuggestions.length > 0 && (
                <ul className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-md z-10">
                  {locationSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleLocationSelect(suggestion)}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      {suggestion.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="flex mt-4 justify-between items-center">
            <h1 className="text-xl">Search results ({totalCount})</h1>
            <select
              className="p-2 border rounded-md font-medium"
              name="sort"
              id="sort"
            >
              <option value="date" className="font-medium">
                Date Posted
              </option>
              <option value="relevance" className="font-medium">
                Relevance
              </option>
            </select>
          </div>

          <div id="job-list">
            <div className="w-full flex flex-col gap-4 my-4">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="w-full border rounded-md p-4 flex flex-col md:flex-row items-center gap-4"
                  onClick={() => handleJobDetails(job._id)}
                >
                  <div className="w-16 h-16 rounded-md bg-gray-200 flex justify-center items-center">
                    <Building2 size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold leading-normal">
                      {job.title}
                    </h2>
                    <p className="text-gray-600 text-sm font-medium">
                      {job.company ? job.company.name : "Unknown Company"}{" "}
                      {"•"} {job.location}
                    </p>
                    <div className="my-4 flex flex-wrap gap-2">
                      {job.requirements
                        .toString()
                        .split(",")
                        .map((requirement, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-800"
                          >
                            {requirement}
                          </span>
                        ))}
                    </div>
                    <p className="text-gray-600 text-sm font-medium">
                      {job?.description.length > 100
                        ? job?.description.slice(0, 100)
                        : job?.description}
                    </p>
                    <span className="bg-gray-50 text-xs p-1 px-2 rounded-md border my-3 inline-block">
                      {job?.experience}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleJobDetails(job._id)}
                      className="p-2"
                      variant="outline"
                    >
                      View details
                    </Button>
                   
                  
                  </div>
                </div>
              ))}
            </div>
            {jobs.length !== 0 && <Pagination page={page} setPage={setPage} />}
          </div>
        </section>
      </div>

      {showEmployerPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-md shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Attention</h2>
            <p>You are registered as an employer and cannot apply for jobs.</p>
            <Button
              className="mt-4"
              onClick={() => setShowEmployerPopup(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
