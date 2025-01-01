import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import apiClient from "@/services/apiClient";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const Newsletter = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const NewsletterSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-lg w-full p-8 bg-white shadow-xl rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Stay updated with our latest news and offers. Enter your email below:
        </p>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={NewsletterSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            apiClient
              .post("/subscribe", { email: values.email })
              .then((response) => {
                if (response.data) {
                  setModalIsOpen(true);
                  resetForm();
                }
              })
              .catch((error) => {
                console.error("Subscription error:", error);
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col space-y-3">
              <Field
                type="email"
                name="email"
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="Enter your email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-150"
                disabled={isSubmitting}
              >
                Subscribe
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Subscription Successful"
        className="absolute top-1/2 left-1/2 max-w-md w-full transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-lg font-semibold">Success!</h2>
        <p>You have successfully subscribed to our newsletter.</p>
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-150"
          onClick={() => {
            setModalIsOpen(false);
            navigate("/");
          }}
        >
          OK
        </button>
      </Modal>
    </div>
  );
};

export default Newsletter;
