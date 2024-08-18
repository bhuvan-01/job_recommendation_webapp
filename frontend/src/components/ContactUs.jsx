import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import callback from '../assets/images/callback.png';
import contact from '../assets/images/contact.jpg'


const ContactUs = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string().required('Phone number is required').matches(
        /^[0-9]{10}$/,
        "Phone number must be exactly 10 digits"
      ),
      message: Yup.string().required('Message is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log('Form submitted', values);
      resetForm();
    },
  });

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="lg:col-start-1 lg:row-start-1">
            <h2 className="text-3xl font-extrabold text-gray-900">Contact Us</h2>
            <p className="mt-4 text-lg leading-6 text-gray-600">
              We would love to hear from you! Whether you have a question about our services, or anything else, our team is ready to answer all your questions.
            </p>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
              <p className="mt-2 text-gray-600">
                <strong>Address:</strong> Leicester, United Kingdom, LE27FP
              </p>
              <p className="mt-2 text-gray-600">
                <strong>Email:</strong> jobwipe@company.com
              </p>
              <p className="mt-2 text-gray-600">
                <strong>Phone:</strong> +447741528220
              </p>
            </div>
          </div>
          <div className="lg:col-start-2 lg:row-start-1 mt-10 lg:mt-0">
            <img
              className="w-full h-full object-cover rounded-lg shadow-lg"
              src={contact}
              alt="Contact"
            />
          </div>
        </div>
        <div className="mt-12 lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="lg:col-start-1 lg:row-start-1">
            <img
              className="w-full h-full object-cover rounded-lg shadow-lg"
              src={callback}
              alt="Form"
            />
          </div>
          <div className="lg:col-start-2 lg:row-start-1 mt-10 lg:mt-0">
            <h3 className="text-lg font-medium text-gray-900">Request a Callback</h3>
            <form className="space-y-6 mt-6" onSubmit={formik.handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    className={`appearance-none block w-full px-3 py-2 border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.name}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`appearance-none block w-full px-3 py-2 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                    className={`appearance-none block w-full px-3 py-2 border ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.phone}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.message}
                    className={`appearance-none block w-full px-3 py-2 border ${formik.touched.message && formik.errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {formik.touched.message && formik.errors.message ? (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.message}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
