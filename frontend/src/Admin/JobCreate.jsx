import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const JobCreatePopup = ({ onClose, onCreate }) => {
  const [skills, setSkills] = useState([]);

  const initialValues = {
    title: "",
    description: "",
    experience: "Entry Level",
    jobType: "Full-Time",
    locationType: "On-Site",
    industry: "IT",
    location: "",
    salary: "",
    externalLink: "",
    skill: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    experience: Yup.string().required("Experience level is required"),
    jobType: Yup.string().required("Job type is required"),
    locationType: Yup.string().required("Location type is required"),
    industry: Yup.string().required("Industry is required"),
    location: Yup.string().required("Location is required"),
    salary: Yup.string().required("Salary is required"),
    externalLink: Yup.string().url("Invalid URL").nullable(),
    skill: Yup.string().min(2, "Skill must be at least 2 characters"),
  });

  const handleAddSkill = (values, setFieldValue) => {
    if (values.skill.trim() !== "") {
      setSkills([...skills, values.skill.trim()]);
      setFieldValue("skill", "");
    }
  };

  const handleSubmit = async (values) => {
    const newJobData = {
      ...values,
      requirements: skills,
    };

    console.log("Submitting new job data:", newJobData); // Log the payload being submitted

    try {
      const response = await onCreate(newJobData);
      console.log("Job creation response:", response); // Log the response from the server

      // Show success toast notification
      toast.success("Job created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        onClose(); // Close the popup after showing the toast
      }, 3000);
    } catch (error) {
      console.error("Failed to create job:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data); // Log detailed error response
      }
      toast.error("Failed to create job.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="absolute inset-0 z-40 bg-black bg-opacity-50"></div>
      <div className="relative z-50 bg-white rounded-lg overflow-hidden w-full max-w-3xl mx-4 md:mx-0 md:w-3/4 lg:w-1/2">
        <div className="overflow-y-auto max-h-[80vh] p-6">
          <h2 className="text-2xl font-bold mb-4">Create Job</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Title
                  </label>
                  <Field
                    type="text"
                    name="title"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Add Skill
                  </label>
                  <div className="flex">
                    <Field
                      type="text"
                      name="skill"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkill(values, setFieldValue)}
                      className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Add
                    </button>
                  </div>
                  <ErrorMessage
                    name="skill"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Skills
                  </label>
                  <ul className="list-disc pl-5">
                    {skills.map((skill, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() =>
                            setSkills(skills.filter((_, i) => i !== index))
                          }
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Experience Level
                  </label>
                  <Field
                    as="select"
                    name="experience"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Associate">Associate</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                  </Field>
                  <ErrorMessage
                    name="experience"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Job Type
                  </label>
                  <Field
                    as="select"
                    name="jobType"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="Part-Time">Part-Time</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                  </Field>
                  <ErrorMessage
                    name="jobType"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Location Type
                  </label>
                  <Field
                    as="select"
                    name="locationType"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-Site">On-Site</option>
                    <option value="Hybrid">Hybrid</option>
                  </Field>
                  <ErrorMessage
                    name="locationType"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Industry
                  </label>
                  <Field
                    as="select"
                    name="industry"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="IT">IT</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                  </Field>
                  <ErrorMessage
                    name="industry"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Location
                  </label>
                  <Field
                    type="text"
                    name="location"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Salary
                  </label>
                  <Field
                    type="text"
                    name="salary"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <ErrorMessage
                    name="salary"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    External Link
                  </label>
                  <Field
                    type="text"
                    name="externalLink"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <ErrorMessage
                    name="externalLink"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Create Job
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default JobCreatePopup;
