import React from "react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-lg w-full text-center">
        <div className="mb-8">
          <svg
            className="w-20 h-20 text-green-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2l4-4m1 7a8 8 0 10-16 0a8 8 0 0016 0z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Job Application Submitted!
        </h2>
        <p className="text-gray-600 mb-8">
          Thank you for applying. We have received your application and will get
          back to you if you are successful. Best of luck!
        </p>
        <div className="flex flex-col md:flex-row justify-center md:space-x-4 space-y-4 md:space-y-0">
          <Link
            to="/dashboard/user"
            className="inline-block bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Return to Home
          </Link>
          <Link
            to="/dashboard/user"
            className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Explore More Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
