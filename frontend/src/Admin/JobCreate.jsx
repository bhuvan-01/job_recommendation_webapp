import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const getCoordinates = async (address) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
      {
        params: {
          access_token: "pk.eyJ1IjoiYmh1dmFuMDEiLCJhIjoiY2x6aWEyZjNwMGFzZDJ2c2l2dG05N2RzayJ9.EfI-v2ifsPPbXrQW9p7gkQ",
          limit: 1,
        },
      }
    );

    if (response.data.features.length > 0) {
      const location = response.data.features[0].center;
      return {
        longitude: location[0],
        latitude: location[1],
      };
    } else {
      throw new Error("No location found for the provided address");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    throw error; // Proper error propagation
  }
};

const JobCreatePopup = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: [],
    experience: "Internship",
    jobType: "Full-Time",
    locationType: "On-Site",
    industry: "IT",
    externalLink: "",
    location: "",
    salary: "",
    latitude: "",
    longitude: "",
    company: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRequirementsChange = (e) => {
    setFormData({ ...formData, requirements: e.target.value.split(",") });
  };

  const handleFetchCoordinates = async () => {
    try {
      const coordinates = await getCoordinates(formData.location);
      setFormData({
        ...formData,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
      toast.success("Coordinates fetched successfully!");
    } catch (error) {
      toast.error("Failed to fetch coordinates. Please check the address.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg h-auto max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Requirements (comma separated)</label>
            <input
              type="text"
              name="requirements"
              value={formData.requirements.join(",")}
              onChange={handleRequirementsChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Experience Level</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Internship">Internship</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Associate">Associate</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Job Type</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Part-Time">Part-Time</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Temporary">Temporary</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Location Type</label>
            <select
              name="locationType"
              value={formData.locationType}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Remote">Remote</option>
              <option value="On-Site">On-Site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Industry</label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="IT">IT</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Retail">Retail</option>
            </select>
          </div>
         <div className="mb-4">
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="button"
              onClick={handleFetchCoordinates}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Fetch Coordinates
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Latitude</label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              readOnly
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Longitude</label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              readOnly
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobCreatePopup;
