import React from 'react';
import application from '../assets/images/hiring.png'

const ApplicationProcess = () => {
  return (
    <div className="bg-blue-500 p-6 rounded-lg text-white">
      <h2 className="text-2xl font-bold  text-center">Application Process</h2>
      <div className="flex justify-center">
        <img 
          src={application} 
          alt="Application Process" 
          className="w-1/3 lg:w-1/2 "
        />
      </div>
    </div>
  );
}

export default ApplicationProcess;
