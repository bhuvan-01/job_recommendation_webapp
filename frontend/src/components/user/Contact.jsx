import { Mail, Pencil, Phone, Check, X } from "lucide-react";
import { Button } from "../ui/button";
import useUser from "@/hooks/useUser";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Contact = () => {
  const { user, updateUser } = useUser();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const { email: initialEmail = "", phone: initialPhone = "" } = user || {};
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      phone: initialPhone,
    },
    validationSchema: Yup.object().shape({
      phone: Yup.string().required("Phone number is required"),
    }),
    onSubmit: (values) => {
      updateUser({
        ...user,
        phone: values.phone,
      });
      formik.resetForm();
      setIsEditing(false);
    },
    enableReinitialize: true,
  });

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="border p-4 md:p-8 rounded-md">
      <div className="flex mb-2 justify-between items-center">
        <h1 className="text-2xl">Contact</h1>
        {isEditing ? null : (
          <Button variant="ghost" size="icon" onClick={handleEditClick}>
            <Pencil size={16} />
          </Button>
        )}
      </div>
      {isEditing ? (
        <form
          id="contactForm"
          className="flex flex-col"
          onSubmit={formik.handleSubmit}
        >
          <div className="mb-4">
            <Label htmlFor="phone" className="mb-2 font-semibold">
              Phone
            </Label>
            <Input
              name="phone"
              type="text"
              value={formik.values.phone}
              onChange={formik.handleChange}
              placeholder="Enter phone number"
              className="p-2 border rounded"
            />
            {formik.touched.phone && formik.errors.phone ? (
              <div className="text-red-500 text-xs">{formik.errors.phone}</div>
            ) : null}
          </div>
          <Button type="submit" className="w-fit mt-4 ml-auto">
            Save <Check size={16} />
          </Button>
        </form>
      ) : (
        <div>
          <div className="flex gap-2 items-center mb-2">
            <Mail size={20} className="text-gray-600" />
            <a href={`mailto:${initialEmail}`} className="text-blue-600">
              {initialEmail || "No email provided"}
            </a>
          </div>
          <div className="flex gap-2 items-center">
            <Phone size={20} className="text-gray-600" />
            <span>{initialPhone || "No phone number provided"}</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
