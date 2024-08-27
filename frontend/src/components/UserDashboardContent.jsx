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
  jobApplied,
  jobSaved,
  removeJobSaved,
  storeJobs,
  incrementJobViewCount
} from "@/app/jobs/jobSlice";
import MapboxMap from "@/components/Mapbox";
import useUser from "@/hooks/useUser";
import apiClient from "@/services/apiClient";
import { IMG_URL } from "@/utils/constants";
import axios from "axios";
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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ContactImage from "../assets/images/contactIcon.png";
import Pagination from "./Pagination";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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

const FilterAccordion = ({
  title,
  options,
  index,
  selectedOptions,
  onChange,
}) => {
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

const UserDashboardContent = () => {
  const jobs = useSelector((state) => state.jobs.jobs);
  const totalCount = useSelector((state) => state.jobs.totalCount);
  const [page, setPage] = useState(1);

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

        console.log(res);

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

  // const handleJobApply = async (id) => {
  //   try {
  //     const res = await apiClient.post(`/applications/apply`, {
  //       jobId: id,
  //       coverLetter: 'Hire me! 🥺👍',
  //     });

  //     console.log(res);

  //     if (res.status === 201) {
  //       toast.success('Applied successfully');

  //       dispatch(
  //         jobApplied({
  //           application: res.data.application._id,
  //           user: user._id,
  //           jobId: id,
  //         })
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error);

  //     toast.error(error.response.data.message);
  //   }
  // };

  const handleJobApply = (jobId) => {
    navigate(`/apply/${jobId}`);
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
      toast.error("Failed to save");

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
    navigate(`/jobs/${jobId}`);
  };




  return (
    <div className="container bg-gray-100 px-0 max-w-[1400px] mx-auto w-[95%] md:flex gap-4 my-4">
      <div className="hidden md:block basis-3/12 md:space-y-4">
        <div className="hidden md:block border p-4 rounded-md text-center">
          <img
            src={user?.photo ? IMG_URL + "/" + user.photo : ContactImage}
            className="w-24 h-24 mx-auto rounded-full"
            alt="User Avatar"
          />
          <h1 className="font-semibold my-2 capitalize text-xl">
            {user?.fullName}
          </h1>
          <p className="pb-3 border-b">{user?.bio}</p>
          <div className="flex flex-wrap justify-between items-center px-4">
            <Link
              to="/jobs/applied"
              className="flex font-medium gap-2 justify-center items-center pt-3"
            >
              <span>Applied jobs</span> <SquareArrowOutUpRight size={16} />
            </Link>
            <Link
              to="/jobs/saved"
              className="flex font-medium gap-2 justify-center items-center pt=3"
            >
              <span>Saved jobs</span> <SquareArrowOutUpRight size={16} />
            </Link>
          </div>
        </div>

        <Filters />
        <MapboxMap />
      </div>
      <div className="basis-9/12">
        <section className="p-2">
          {user && user.role === "user" ? (
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
          ) : null}
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
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="aspect-square w-full border rounded-md p-4 flex flex-col"
                  onClick={() => handleJobDetails(job._id)}
                >
                  <div className="w-full items-center flex gap-4">
                    <div className="w-16 h-16 aspect-square rounded-md bg-gray-200 flex justify-center items-center">
                      <Building2 size={24} />
                    </div>
                    <div className="basis-8/12">
                      <h2 className="text-lg font-semibold leading-normal">
                        {job.title}
                      </h2>
                      <p className="text-gray-600 text-sm font-medium">
                        {job.company ? job.company.name : "Unknown Company"}{" "}
                        {"•"} {job.location}
                      </p>
                    </div>
                  </div>

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

                  <div className="flex">
                    <span className="bg-gray-50 text-xs p-1 px-2 rounded-md border my-3">
                      {job?.experience}
                    </span>
                  </div>

                  <div className="mt-auto flex gap-2 items-center">
                    <Button
                      onClick={() => handleJobApply(job._id)}
                      className="w-full p-2"
                      disabled={job.applications.some(
                        (app) => app.user === user?._id
                      )}
                    >
                      {job.applications.some((app) => app.user === user?._id)
                        ? "Applied"
                        : "Apply"}
                    </Button>
                    <Button
                     onClick={() => handleJobDetails(job._id)}
                      className="w-full p-2"
                      variant="outline"
                    >
                      View details
                    </Button>
                    {job?.savedBy?.includes(user?._id) ? (
                      <Button
                        onClick={() => handleJobUnsave(job._id)}
                        variant="primary"
                        className="p-2"
                      >
                        <Bookmark size={24} fill="currentColor" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleJobSave(job._id)}
                        variant="primary"
                        className="p-2"
                      >
                        <Bookmark size={24} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={page} setPage={setPage} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboardContent;
