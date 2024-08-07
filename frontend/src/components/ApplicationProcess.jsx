// src/ApplicationProcess.js
import React from 'react';

const steps = [
  { id: 1, title: "Create an Account", description: "Register on our website" },
  { id: 2, title: "Complete Your Profile", description: "Fill out your personal details" },
  { id: 3, title: "Search for Jobs", description: "Find the perfect job for you" },
  { id: 4, title: "Apply & Get Hired", description: "Submit your application and get hired" },
];

const ApplicationProcess = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-blue-500 text-white p-4 pb-20">
      <h2 className="text-3xl font-bold mb-8">Your Application Process</h2>
      <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-6 w-full max-w-4xl">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center p-4 bg-blue-700 rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105 w-full md:w-1/4 relative"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full text-2xl font-bold mb-4">
              {step.id}
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-center">{step.description}</p>
            {index < steps.length - 1 && (
              <div className="absolute inset-y-1/2 right-0 transform translate-x-full w-16 h-16 flex items-center justify-center">
                <svg className="w-8 h-8 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 space-x-4">
        <button className="bg-white text-teal-700 px-4 py-2 rounded hover:bg-gray-200 transition">
          More Info
        </button>
        <button className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-600 transition">
          Register Now
        </button>
      </div>
    </div>
  );
};

export default ApplicationProcess;
