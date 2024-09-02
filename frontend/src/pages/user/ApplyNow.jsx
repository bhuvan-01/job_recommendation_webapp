import React, { useCallback, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import apiClient from "@/services/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jobApplied } from "@/app/jobs/jobSlice";
import Header from "@/components/Header";

const ApplyNowPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitError, setSubmitError] = useState("");
  const [skill, setSkill] = useState("");
  const [skillsList, setSkillsList] = useState([]);

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
      coverLetter: "",
      skills: [],
      qualification: {
        degreeName: "",
        majorSubject: "",
        startDate: "",
        endDate: "",
      },
      terms: false,
    },
    validationSchema: Yup.object({
      resume: Yup.mixed().required("A resume is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phoneNumber: Yup.string().required("Phone number is required"),
      experience: Yup.number().min(0, "Experience must be a positive number").required("Experience is required"),
      visaStatus: Yup.string().required("Please select an option"),
      relocation: Yup.string().required("Please select an option"),
      coverLetter: Yup.string().required("A cover letter is required"),
      skills: Yup.array().of(Yup.string()).min(1, "At least one skill is required"),
      qualification: Yup.object({
        degreeName: Yup.string().required("Degree name is required"),
        majorSubject: Yup.string().required("Major subject is required"),
        startDate: Yup.date().required("Start date is required"),
        endDate: Yup.date().nullable(),
      }).required("Qualification details are required"),
      terms: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("jobId", jobId); // Ensure jobId is correctly appended
      Object.keys(values).forEach(key => {
        if (key === 'skills' || key === 'qualification') {
          formData.append(key, JSON.stringify(values[key])); // Handle nested objects appropriately
        } else if (key === 'resume' && values.resume) {
          formData.append("resume", values.resume, values.resume.name);
        } else {
          formData.append(key, values[key]);
        }
      });

      try {
        const response = await apiClient.post(`/applications/apply`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 201) {
          dispatch(jobApplied({
            application: response.data.application._id,
            user: response.data.application.applicant,
            jobId,
          }));
          navigate("/applications/success");
        } else {
          setSubmitError(response.data.message || "An error occurred.");
        }
      } catch (error) {
        console.error("API Error:", error);
        setSubmitError(error.message || "An error occurred.");
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("skills", skillsList);
  }, [skillsList]);

  const handleAddSkill = () => {
    if (skill.trim() && !skillsList.includes(skill.trim())) {
      setSkillsList([...skillsList, skill.trim()]);
      setSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  return (
    <div>
      <Header/>
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg border border-gray-300 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Apply Now</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Resume:</label>
            <div {...getRootProps()} className={`mt-1 p-6 border-2 border-dashed rounded-lg cursor-pointer ${isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"}`}>
              <input {...getInputProps()} />
              {formik.values.resume ? (
                <p>{formik.values.resume.name}</p>
              ) : (
                <p>Drag & drop your resume here, or click to select one</p>
              )}
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Or upload your resume:</label>
              <input
                type="file"
                name="resume"
                onChange={(event) => formik.setFieldValue("resume", event.currentTarget.files[0])}
                className="mt-1 block w-full text-sm text-gray-500"
              />
            </div>
            {formik.touched.resume && formik.errors.resume ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.resume}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="mt-1 block w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
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
              <div className="text-red-500 text-sm mt-1">{formik.errors.phoneNumber}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">How many years of work experience do you have?</label>
            <input
              type="number"
              name="experience"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.experience}
              className="mt-1 block w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            {formik.touched.experience && formik.errors.experience ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.experience}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Will you now or in the future require sponsorship for employment visa status?</label>
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
              <div className="text-red-500 text-sm mt-1">{formik.errors.visaStatus}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Are you willing to relocate?</label>
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
              <div className="text-red-500 text-sm mt-1">{formik.errors.relocation}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Cover Letter:</label>
            <textarea
              name="coverLetter"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.coverLetter}
              className="mt-1 block w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows="4"
            ></textarea>
            {formik.touched.coverLetter && formik.errors.coverLetter ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.coverLetter}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Skills:</label>
            <div className="flex items-center">
              <input
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="mt-1 block w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="ml-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            <ul className="mt-2">
              {skillsList.map((s, index) => (
                <li key={index} className="flex items-center justify-between border-b py-2">
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            {formik.touched.skills && formik.errors.skills ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.skills}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold">Qualification Details:</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Degree Name:</label>
              <input
                type="text"
                name="qualification.degreeName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.qualification.degreeName}
                className="mt-1 block w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {formik.touched.qualification?.degreeName && formik.errors.qualification?.degreeName ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.qualification.degreeName}</div>
              ) : null}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Major Subject:</label>
              <input
                type="text"
                name="qualification.majorSubject"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.qualification.majorSubject}
                className="mt-1 block w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {formik.touched.qualification?.majorSubject && formik.errors.qualification?.majorSubject ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.qualification.majorSubject}</div>
              ) : null}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Start Date:</label>
              <input
                type="date"
                name="qualification.startDate"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.qualification.startDate}
                className="mt-1 block w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {formik.touched.qualification?.startDate && formik.errors.qualification?.startDate ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.qualification.startDate}</div>
              ) : null}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">End Date:</label>
              <input
                type="date"
                name="qualification.endDate"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.qualification.endDate}
                className="mt-1 block w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {formik.touched.qualification?.endDate && formik.errors.qualification?.endDate ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.qualification.endDate}</div>
              ) : null}
            </div>
          </div>

          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              name="terms"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.terms}
              className="form-checkbox text-indigo-600"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">I agree to the <a href="/terms" className="text-indigo-600 underline">terms and conditions</a></label>
              {formik.touched.terms && formik.errors.terms ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.terms}</div>
              ) : null}
          </div>

          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Apply
            </button>
          </div>

          {submitError && (
            <div className="text-red-500 text-sm mt-4">
              {submitError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ApplyNowPage;
