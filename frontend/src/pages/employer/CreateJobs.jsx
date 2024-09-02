import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import apiClient from "@/services/apiClient";
import { useDispatch, useSelector } from "react-redux";
import { addJob } from "@/app/jobs/jobSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

// Validation schema with added validation for the externalLink field
const validationSchema = Yup.object({
  title: Yup.string().required("Job title is required"),
  description: Yup.string().required("Description is required"),
  location: Yup.string().required("Location is required"),
  salary: Yup.number()
    .required("Salary is required")
    .positive("Salary must be positive"),
  experience: Yup.string().required("Experience level is required"),
  jobType: Yup.string().required("Job type is required"),
  locationType: Yup.string().required("Location type is required"),
  industry: Yup.string().required("Industry is required"),
  externalLink: Yup.string().url("Must be a valid URL").nullable(),
});

const CreateJobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [livePreview, setLivePreview] = useState({
    title: "",
    description: "",
    requirements: [],
    location: "",
    salary: "",
    experience: "",
    jobType: "",
    locationType: "",
    industry: "",
    externalLink: "",
  });
  const navigate = useNavigate();
  const [requirement, setRequirement] = useState("");

  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json`,
        {
          params: {
            access_token:
              "pk.eyJ1IjoiYmh1dmFuMDEiLCJhIjoiY2x6aWEyZjNwMGFzZDJ2c2l2dG05N2RzayJ9.EfI-v2ifsPPbXrQW9p7gkQ",
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
      throw new Error("Failed to fetch coordinates");
    }
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      requirements: [],
      location: "",
      salary: "",
      experience: "",
      jobType: "",
      locationType: "",
      industry: "",
      externalLink: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const jobData = {
        title: values.title,
        description: values.description,
        requirements: values.requirements,
        location: values.location,
        salary: Number(values.salary),
        experience: values.experience,
        jobType: values.jobType,
        locationType: values.locationType,
        industry: values.industry,
        company: user.company,
        externalLink: values.externalLink || null,
      };

      try {
        const coordinates = await getCoordinates(values.location);

        jobData.latitude = coordinates.latitude;
        jobData.longitude = coordinates.longitude;

        const res = await apiClient.post("/jobs", jobData);

        console.log("Job created:", res);

        if (res.status === 201) {
          dispatch(
            addJob({
              job: res.data.job,
            })
          );
          formik.resetForm();
          setLivePreview({
            title: "",
            description: "",
            requirements: [],
            location: "",
            salary: "",
            experience: "",
            jobType: "",
            locationType: "",
            industry: "",
            externalLink: "",
          });
          toast.success("Job created");
          navigate("/dashboard/employer");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to create job");
        console.error("Error creating job:", error);
      }
    },
  });

  const showLivePreview =
    Boolean(formik.values.title) ||
    Boolean(formik.values.description) ||
    Boolean(formik.values.requirements.length > 0) ||
    Boolean(formik.values.location) ||
    Boolean(formik.values.salary) ||
    Boolean(formik.values.experience) ||
    Boolean(formik.values.jobType) ||
    Boolean(formik.values.locationType) ||
    Boolean(formik.values.industry) ||
    Boolean(formik.values.externalLink);

  const handleInputChange = (e) => {
    formik.handleChange(e);
    const { name, value } = e.target;
    setLivePreview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequirementChange = (e) => {
    setRequirement(e.target.value);
  };

  const handleAddRequirement = () => {
    if (requirement) {
      formik.setFieldValue("requirements", [
        ...formik.values.requirements,
        requirement,
      ]);
      setLivePreview((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirement],
      }));
      setRequirement("");
    }
  };

  const handleRemoveRequirement = (index) => {
    formik.setFieldValue(
      "requirements",
      formik.values.requirements.filter((_, i) => i !== index)
    );
    setLivePreview((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container max-w-[1400px] mx-auto w-[95%] gap-8 my-8">
      <h1 className="text-3xl font-semibold mb-6">Create a New Job</h1>

      <div className="md:flex gap-4 space-y-4 md:space-y-0">
        <form onSubmit={formik.handleSubmit} className="basis-8/12 space-y-4">
          <div>
            <Label className="mb-2 font-semibold">Job Title</Label>
            <Input
              name="title"
              value={formik.values.title}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
              placeholder="Job Title"
              className="p-2 border rounded"
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="text-red-500 text-xs">{formik.errors.title}</div>
            ) : null}
          </div>

          <div>
            <Label className="mb-2 font-semibold">Description</Label>
            <Textarea
              name="description"
              value={formik.values.description}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
              placeholder="Job Description"
              rows={4}
              className="p-2 border rounded"
            />
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500 text-xs">
                {formik.errors.description}
              </div>
            ) : null}
          </div>

          <div>
            <Label className="mb-2 font-semibold">Add Requirement/Skill</Label>
            <div className="flex items-center">
              <Input
                name="requirements"
                value={requirement}
                onChange={handleRequirementChange}
                placeholder="Add Requirement"
                className="p-2 border rounded mr-2"
              />
              <Button type="button" onClick={handleAddRequirement}>
                Add
              </Button>
            </div>
            {formik.touched.requirements && formik.errors.requirements ? (
              <div className="text-red-500 text-xs">
                {formik.errors.requirements}
              </div>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-2 items-center">
              {formik.values.requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 justify-between bg-gray-100 rounded-full w-fit text-sm border mt-1 p-1 px-2"
                >
                  <span>{req}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    className="p-1 hover:bg-white rounded-full w-6 h-6 flex justify-center items-center"
                    onClick={() => handleRemoveRequirement(index)}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 font-semibold">Location</Label>
            <Input
              name="location"
              value={formik.values.location}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
              placeholder="Location"
              className="p-2 border rounded"
            />
            {formik.touched.location && formik.errors.location ? (
              <div className="text-red-500 text-xs">
                {formik.errors.location}
              </div>
            ) : null}
          </div>

          <div>
            <Label className="mb-2 font-semibold">Salary</Label>
            <Input
              name="salary"
              type="number"
              value={formik.values.salary}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
              placeholder="Salary"
              className="p-2 border rounded"
            />
            {formik.touched.salary && formik.errors.salary ? (
              <div className="text-red-500 text-xs">{formik.errors.salary}</div>
            ) : null}
          </div>

          <div>
            <Label className="mb-2 font-semibold">Experience Level</Label>
            <select
              name="experience"
              value={formik.values.experience}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
              className="p-2 border rounded w-full"
            >
              <option value="" label="Select experience level" />
              <option value="Internship" label="Internship" />
              <option value="Entry Level" label="Entry Level" />
              <option value="Associate" label="Associate" />
              <option value="Mid Level" label="Mid Level" />
              <option value="Senior Level" label="Senior Level" />
            </select>
            {formik.touched.experience && formik.errors.experience ? (
              <div className="text-red-500 text-xs">
                {formik.errors.experience}
              </div>
            ) : null}
          </div>

          <div>
            <Label className="mb-2 font-semibold">Job Type</Label>
            <select
              name="jobType"
              value={formik.values.jobType}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
              className="p-2 border rounded w-full"
            >
              <option value="" label="Select job type" />
              <option value="Part-Time" label="Part-Time" />
              <option value="Full-Time" label="Full-Time" />
              <option value="Internship" label="Internship" />
              <option value="Contract" label="Contract" />
              <option value="Temporary" label="Temporary" />
            </select>
            {formik.touched.jobType && formik.errors.jobType ? (
              <div className="text-red-500 text-xs">
                {formik.errors.jobType}
              </div>
            ) : null}
          </div>

          <div>
            <Label className="mb-2 font-semibold">Location Type</Label>
            <select
              name="locationType"
              value={formik.values.locationType}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
              className="p-2 border rounded w-full"
            >
              <option value="" label="Select location type" />
              <option value="Remote" label="Remote" />
              <option value="On-Site" label="On-Site" />
              <option value="Hybrid" label="Hybrid" />
            </select>
            {formik.touched.locationType && formik.errors.locationType ? (
              <div className="text-red-500 text-xs">
                {formik.errors.locationType}
              </div>
            ) : null}
          </div>

          <div>
            <Label className="mb-2 font-semibold">Industry</Label>
            <select
              name="industry"
              value={formik.values.industry}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
              className="p-2 border rounded w-full"
            >
              <option value="" label="Select industry" />
              <option value="IT" label="IT" />
              <option value="Healthcare" label="Healthcare" />
              <option value="Finance" label="Finance" />
              <option value="Education" label="Education" />
              <option value="Retail" label="Retail" />
            </select>
            {formik.touched.industry && formik.errors.industry ? (
              <div className="text-red-500 text-xs">
                {formik.errors.industry}
              </div>
            ) : null}
          </div>

          <div>
            <Label className="mb-2 font-semibold">
              External Application Link (Optional)
            </Label>
            <Input
              name="externalLink"
              value={formik.values.externalLink}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
              placeholder="External Application Link"
              className="p-2 border rounded"
            />
            {formik.touched.externalLink && formik.errors.externalLink ? (
              <div className="text-red-500 text-xs">
                {formik.errors.externalLink}
              </div>
            ) : null}
          </div>

          <Button
            type="submit"
            className="bg-blue-500 w-full hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Create Job
          </Button>
        </form>

        <div className="basis-4/12">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
            {showLivePreview && (
              <div>
                <p className="text-lg font-semibold mb-1">
                  {livePreview.title}
                </p>
                <p className="mb-2">{livePreview.description}</p>

                {livePreview.requirements.length > 0 && (
                  <div className="mb-2">
                    <Label className="font-semibold">Requirements:</Label>
                    <ul className="list-disc pl-6">
                      {livePreview.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="mb-1">
                  <span className="font-semibold">Location:</span>{" "}
                  {livePreview.location}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Salary:</span>{" "}
                  {livePreview.salary}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Experience Level:</span>{" "}
                  {livePreview.experience}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Job Type:</span>{" "}
                  {livePreview.jobType}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Location Type:</span>{" "}
                  {livePreview.locationType}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Industry:</span>{" "}
                  {livePreview.industry}
                </p>
                {livePreview.externalLink && (
                  <p className="mb-1">
                    <span className="font-semibold">External Link:</span>{" "}
                    <a
                      href={livePreview.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {livePreview.externalLink}
                    </a>
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateJobs;
