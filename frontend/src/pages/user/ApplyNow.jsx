import React, { useCallback, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { jobApplied } from "@/app/jobs/jobSlice";
import apiClient from "@/services/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

const ApplyNowPage = () => {
  const { jobId } = useParams();
  console.log("Job ID:", jobId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitError, setSubmitError] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    formik.setFieldValue("resume", acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const formik = useFormik({
    initialValues: {
      resume: null,
      email: "",
      phoneNumber: "",
      experience: "",
      visaStatus: "",
      relocation: "",
      mastersDegree: "",
      coverLetter: "",
      terms: false,
    },
    validationSchema: Yup.object({
      resume: Yup.mixed().required("A resume is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phoneNumber: Yup.string().required("Phone number is required"),
      experience: Yup.number()
        .min(0, "Experience must be a positive number")
        .required("Experience is required"),
      visaStatus: Yup.string().required("Please select an option"),
      relocation: Yup.string().required("Please select an option"),
      mastersDegree: Yup.string().required("Please select an option"),
      coverLetter: Yup.string().required("A cover letter is required"),
      terms: Yup.boolean().oneOf(
        [true],
        "You must accept the terms and conditions"
      ),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("resume", values.resume);
        formData.append("email", values.email);
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("experience", values.experience);
        formData.append("visaStatus", values.visaStatus);
        formData.append("relocation", values.relocation);
        formData.append("mastersDegree", values.mastersDegree);
        formData.append("coverLetter", values.coverLetter);
        formData.append("terms", values.terms);
        formData.append("jobId", jobId);

        console.log(...formData.entries());

        const response = await apiClient.post(`/applications/apply`, formData);

        if (response.status === 201) {
          const resData = response.data;

          dispatch(
            jobApplied({
              application: resData.application._id,
              user: resData.application.applicant,
              jobId: jobId,
            })
          );

          navigate("/applications/success");
        } else {
          setSubmitError(response.data.message || "An error occurred.");
        }
      } catch (error) {
        setSubmitError(error.message || "An error occurred.");
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg border border-gray-300 shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8">Apply Now</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Resume:
          </label>
          <div
            {...getRootProps()}
            className={`mt-1 p-6 border-2 border-dashed rounded-lg cursor-pointer ${
              isDragActive
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {formik.values.resume ? (
              <p>{formik.values.resume.name}</p>
            ) : (
              <p>Drag & drop your resume here, or click to select one</p>
            )}
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              Or upload your resume:
            </label>
            <input
              type="file"
              name="resume"
              onChange={(event) =>
                formik.setFieldValue("resume", event.currentTarget.files[0])
              }
              className="mt-1 block w-full text-sm text-gray-500"
            />
          </div>
          {formik.touched.resume && formik.errors.resume ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.resume}
            </div>
          ) : null}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="mt-1 block w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.email}
            </div>
          ) : null}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number:
          </label>
          <PhoneInput
            country={"us"}
            value={formik.values.phoneNumber}
            onChange={(phone) => formik.setFieldValue("phoneNumber", phone)}
            inputProps={{
              name: "phoneNumber",
              required: true,
              autoFocus: false,
            }}
            containerClass="mt-1"
            inputClass="w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.phoneNumber}
            </div>
          ) : null}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            How many years of work experience do you have?
          </label>
          <input
            type="number"
            name="experience"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.experience}
            className="mt-1 block w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formik.touched.experience && formik.errors.experience ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.experience}
            </div>
          ) : null}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Will you now or in the future require sponsorship for employment
            visa status?
          </label>
          <select
            name="visaStatus"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.visaStatus}
            className="mt-1 block w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select an option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {formik.touched.visaStatus && formik.errors.visaStatus ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.visaStatus}
            </div>
          ) : null}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Are you willing to relocate?
          </label>
          <select
            name="relocation"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.relocation}
            className="mt-1 block w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select an option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {formik.touched.relocation && formik.errors.relocation ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.relocation}
            </div>
          ) : null}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Have you completed the following level of education: Master's
            Degree?
          </label>
          <div className="flex items-center mt-2">
            <input
              type="radio"
              name="mastersDegree"
              value="Yes"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.mastersDegree === "Yes"}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <label className="ml-3 block text-sm font-medium text-gray-700">
              Yes
            </label>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="radio"
              name="mastersDegree"
              value="No"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.mastersDegree === "No"}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <label className="ml-3 block text-sm font-medium text-gray-700">
              No
            </label>
          </div>
          {formik.touched.mastersDegree && formik.errors.mastersDegree ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.mastersDegree}
            </div>
          ) : null}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Cover Letter
          </label>
          <textarea
            name="coverLetter"
            rows="4"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.coverLetter}
            className="mt-1 block w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formik.touched.coverLetter && formik.errors.coverLetter ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.coverLetter}
            </div>
          ) : null}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Terms and Conditions
          </label>
          <div className="flex items-start">
            <input
              type="checkbox"
              name="terms"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.terms}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <div className="ml-3 text-sm">
              <label className="font-medium text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  terms and conditions
                </a>
                .
              </label>
            </div>
          </div>
          {formik.touched.terms && formik.errors.terms ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.terms}
            </div>
          ) : null}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
        {submitError && (
          <div className="text-red-500 text-sm mt-4">{submitError}</div>
        )}
      </form>
    </div>
  );
};

export default ApplyNowPage;
