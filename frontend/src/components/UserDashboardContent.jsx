import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Label } from "./ui/label";
import { Button } from "./ui/button";

import apiClient from "@/services/apiClient";
import { useDispatch, useSelector } from "react-redux";
import { storeJobs, saveJob } from "@/app/jobs/jobSlice";
import useUser from "@/hooks/useUser";
import { Input } from "./ui/input";
import {
  keywordQueryChanged,
  locationQueryChanged,
  selectedExperienceLevelsChanged,
  selectedJobTypesChanged,
  selectedLocationTypesChanged,
  selectedIndustriesChanged,
  searchResultsRequested,
  searchResultsReceived,
  searchResultsRequestFailed,
} from "@/app/appSlice";

import { IMG_URL } from "@/utils/constants";
import { Checkbox } from "./ui/checkbox";

import { toast } from "react-hot-toast";

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
    <div className="border rounded-md p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-semibold flex items-center gap-2">
          <Filter size={14} />
          Filters
        </h1>
        <Button variant="ghost" onClick={() => dispatch(resetSearchState())}>
          Clear
        </Button>
      </div>
      <div className="space-y-8">
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.jobs);
  const {
    keywordQuery,
    locationQuery,
    selectedExperienceLevels,
    selectedJobTypes,
    selectedLocationTypes,
    selectedIndustries,
  } = useSelector((state) => state.app);

  const { user } = useUser();

  useEffect(() => {
    const fetchJobs = async () => {
      dispatch(searchResultsRequested());
      try {
        const res = await apiClient.get("/jobs", {
          params: {
            keyword: keywordQuery,
            location: locationQuery,
            experience: selectedExperienceLevels,
            jobType: selectedJobTypes,
            locationType: selectedLocationTypes,
            industriy: selectedIndustries,
          },
        });

        console.log(res);

        if (res.status === 200) {
          dispatch(searchResultsReceived(res.data));
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

  const handleLocationChange = (e) => {
    dispatch(locationQueryChanged(e.target.value));
  };

  const handleSaveJob = (job) => {
    dispatch(saveJob(job));
    toast.success("Job saved!", {
      position: "top-right",
      duration: 2000,
    });
  };

  const handleNavigateToApply = (jobId) => {
    navigate(`jobs/${jobId}/apply`);
  };

  return (
    <div className="container px-0 max-w-[1400px] mx-auto w-[95%] flex gap-4 my-4">
      <div className="basis-3/12 space-y-4">
        <div className="border p-4 rounded-md text-center">
          <img
            src={IMG_URL + "/" + user?.photo}
            className="w-24 h-24 mx-auto rounded-full"
            alt="User Avatar"
          />
          <h1 className="font-semibold my-2 capitalize text-xl">
            {user?.fullName}
          </h1>
          <p className="pb-3 border-b">{user?.bio}</p>
          <Link
            to="appliedjobs"
            className="flex font-medium gap-2 justify-center items-center pt-3"
          >
            <span>Applied jobs</span> <SquareArrowOutUpRight size={16} />
          </Link>
          <Link
            to="savedjobs"
            className="flex font-medium gap-2 justify-center items-center pt-3"
          >
            <span>Saved Jobs</span> <SquareArrowOutUpRight size={16} />
          </Link>
          <Link
            to="recommended"
            className="flex font-medium gap-2 justify-center items-center pt-3"
          >
            <span>Recomended Jobs</span> <SquareArrowOutUpRight size={16} />
          </Link>
        </div>

        <Filters />
      </div>
      <div className="basis-9/12">
        <section className="">
          {user && user.role === "user" ? (
            <div className="flex gap-4 items-center">
              <div className="flex pr-2 w-full max-w-[360px] items-center gap-2 border rounded-md">
                <Input
                  type="text"
                  placeholder="Search keyword..."
                  name="query"
                  id="query"
                  value={keywordQuery}
                  onChange={handleKeywordChange}
                  className="border-none focus-visible:ring-0 shadow-none"
                />
                <Search size={16} />
              </div>

              <div className="flex pr-2 items-center gap-2 border rounded-md">
                <Input
                  type="text"
                  placeholder="Location"
                  name="location"
                  id="location"
                  value={locationQuery}
                  onChange={handleLocationChange}
                  className="border-none focus-visible:ring-0 shadow-none"
                />
                <MapPin size={16} />
              </div>
            </div>
          ) : null}
          <div className="flex mt-4 justify-between items-center">
            <h1 className="text-xl">
              Showing <strong>{jobs?.length}</strong> jobs found.
            </h1>
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

          <div>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="aspect-square w-full border rounded-md p-4 flex flex-col"
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
                        {job.company.name} {"•"} {job.location}
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
                      as={Link}
                      // to={`/jobs/${job.id}/apply`}
                      className="w-full p-2"
                      onClick={() => handleNavigateToApply(job._id)}
                    >
                      Apply
                    </Button>
                    <Button
                      variant="primary"
                      className="p-2"
                      onClick={() => handleSaveJob(job)}
                    >
                      <Bookmark size={24} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboardContent;
