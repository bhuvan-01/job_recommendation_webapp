import { Pencil, Check, X } from "lucide-react";
import { Button } from "../ui/button";
import useUser from "@/hooks/useUser";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const EducationSection = () => {
  const { user, updateUser } = useUser();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const { education: initialEducation = [] } = user.profile;
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [universitySuggestions, setUniversitySuggestions] = useState([]);

  const formik = useFormik({
    initialValues: {
      education: initialEducation,
      newEducation: {
        school: "",
        degree: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    },
    validationSchema: Yup.object().shape({
      newEducation: Yup.object().shape({
        school: Yup.string().required("School is required"),
        degree: Yup.string().required("Degree is required"),
        startDate: Yup.string().required("Start date is required"),
        endDate: Yup.string(),
        description: Yup.string(),
      }),
    }),
    onSubmit: (values) => {
      if (editingIndex !== null) {
        const updatedEducation = formik.values.education.map((edu, index) => {
          return index === editingIndex ? formik.values.newEducation : edu;
        });
        formik.setFieldValue("education", updatedEducation);

        updateUser({
          profile: {
            ...user.profile,
            education: updatedEducation,
          },
        });
      } else {
        const updatedEducation = [
          ...formik.values.education,
          values.newEducation,
        ];
        formik.setFieldValue("education", updatedEducation);
        updateUser({
          profile: {
            ...user.profile,
            education: updatedEducation,
          },
        });
      }

      formik.setFieldValue("newEducation", {
        school: "",
        degree: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setEditingIndex(null);
      setIsEditing(false);
    },
    enableReinitialize: true,
  });

  const handleAddClick = () => {
    setEditingIndex(null);
    formik.setFieldValue("newEducation", {
      school: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setIsEditing(true);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    formik.setFieldValue("newEducation", formik.values.education[index]);
    setIsEditing(true);
  };

  const handleRemoveEducation = (index) => {
    const updatedEducation = formik.values.education.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("education", updatedEducation);

    updateUser({
      profile: {
        ...user.profile,
        education: updatedEducation,
      },
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    formik.setFieldValue("newEducation", {
      school: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setIsEditing(false);
  };

  const fetchUniversitySuggestions = async (query) => {
    if (query.length > 1) {
      try {
        const response = await fetch(
          `http://universities.hipolabs.com/search?name=${query}&country=United+Kingdom`
        );
        const data = await response.json();
        setUniversitySuggestions(data);
      } catch (error) {
        console.error("Error fetching university suggestions:", error);
        setUniversitySuggestions([]);
      }
    } else {
      setUniversitySuggestions([]);
    }
  };

  const handleSchoolInputChange = (e) => {
    const { value } = e.target;
    formik.setFieldValue("newEducation.school", value);
    fetchUniversitySuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    formik.setFieldValue("newEducation.school", suggestion.name);
    setUniversitySuggestions([]);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="mt-4 border p-4 md:p-8 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Education</h1>
        {isEditing ? null : (
          <Button variant="ghost" onClick={handleAddClick}>
            Add
          </Button>
        )}
      </div>
      {isEditing ? (
        <form
          id="educationForm"
          className="flex flex-col"
          onSubmit={formik.handleSubmit}
        >
          <div className="mb-4">
            <Label htmlFor="school" className="mb-2 font-semibold">
              School
            </Label>
            <Input
              name="newEducation.school"
              value={formik.values.newEducation.school}
              onChange={handleSchoolInputChange}
              placeholder="School"
              className="p-2 border rounded"
            />
            {formik.touched.newEducation?.school &&
              formik.errors.newEducation?.school && (
                <div className="text-red-500 text-xs">
                  {formik.errors.newEducation.school}
                </div>
              )}
            {universitySuggestions.length > 0 && (
              <div className="bg-white shadow-md rounded-md p-2 mt-2">
                {universitySuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="cursor-pointer p-1 hover:bg-gray-200"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <Label htmlFor="degree" className="mb-2 font-semibold">
              Degree
            </Label>
            <Input
              name="newEducation.degree"
              value={formik.values.newEducation.degree}
              onChange={formik.handleChange}
              placeholder="Degree"
              className="p-2 border rounded"
            />
            {formik.touched.newEducation?.degree &&
              formik.errors.newEducation?.degree && (
                <div className="text-red-500 text-xs">
                  {formik.errors.newEducation.degree}
                </div>
              )}
          </div>

          <div className="mb-4">
            <Label htmlFor="startDate" className="mb-2 font-semibold">
              Start Date
            </Label>
            <Input
              type="date"
              name="newEducation.startDate"
              value={formik.values.newEducation.startDate}
              onChange={formik.handleChange}
              placeholder="Start Date"
              className="p-2 border rounded"
            />
            {formik.touched.newEducation?.startDate &&
              formik.errors.newEducation?.startDate && (
                <div className="text-red-500 text-xs">
                  {formik.errors.newEducation.startDate}
                </div>
              )}
          </div>

          <div className="mb-4">
            <Label htmlFor="endDate" className="mb-2 font-semibold">
              End Date
            </Label>
            <Input
              type="date"
              name="newEducation.endDate"
              value={formik.values.newEducation.endDate}
              onChange={formik.handleChange}
              placeholder="End Date"
              className="p-2 border rounded"
            />
            {formik.touched.newEducation?.endDate &&
              formik.errors.newEducation?.endDate && (
                <div className="text-red-500 text-xs">
                  {formik.errors.newEducation.endDate}
                </div>
              )}
          </div>

          <div className="mb-4">
            <Label htmlFor="description" className="mb-2 font-semibold">
              Description
            </Label>
            <Input
              name="newEducation.description"
              value={formik.values.newEducation.description}
              onChange={formik.handleChange}
              placeholder="Description"
              className="p-2 border rounded"
            />
            {formik.touched.newEducation?.description &&
              formik.errors.newEducation?.description && (
                <div className="text-red-500 text-xs">
                  {formik.errors.newEducation.description}
                </div>
              )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              Cancel <X size={16} />
            </Button>

            <Button type="submit" className="w-fit flex items-center gap-2">
              {editingIndex !== null ? "Update" : "Save"} <Check size={16} />
            </Button>
          </div>
        </form>
      ) : (
        <div>
          {formik.values.education.length > 0 ? (
            formik.values.education.map((edu, index) => (
              <div key={index} className="border p-4 rounded-md mb-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{edu.school}</h2>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(index)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveEducation(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 font-medium">{edu.degree}</p>
                <p className="text-gray-600">{edu.description}</p>
                <p className="text-gray-600 text-xs">
                  {new Date(edu.startDate).toLocaleDateString()} -{" "}
                  {edu.endDate
                    ? new Date(edu.endDate).toLocaleDateString()
                    : "Present"}
                </p>
              </div>
            ))
          ) : (
            <p>No education entries yet.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default EducationSection;
