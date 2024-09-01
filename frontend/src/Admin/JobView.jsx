import React from 'react';

const JobDetailsPopup = ({ job, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* The background overlay to prevent interaction with the rest of the page */}
            <div className="absolute inset-0 z-40 bg-black bg-opacity-50"></div>
            
            {/* The popup content */}
            <div className="relative z-50 bg-white rounded-lg overflow-hidden w-full max-w-3xl mx-4 md:mx-0 md:w-3/4 lg:w-1/2">
                {/* Scrollable content area */}
                <div className="overflow-y-auto max-h-[80vh] p-6">
                    <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
                    <p><strong>Description:</strong> {job.description}</p>
                    <p className="mt-2"><strong>Requirements:</strong> {job.requirements.join(', ')}</p>
                    <p className="mt-2"><strong>Experience:</strong> {job.experience}</p>
                    <p className="mt-2"><strong>Type:</strong> {job.jobType}</p>
                    <p className="mt-2"><strong>Location Type:</strong> {job.locationType}</p>
                    <p className="mt-2"><strong>Industry:</strong> {job.industry}</p>
                    <p className="mt-2"><strong>Location:</strong> {job.location}</p>
                    <p className="mt-2"><strong>Salary:</strong> {job.salary}</p>
                    <p className="mt-2"><strong>Company:</strong> {job.company.name}</p>
                    {job.externalLink && (
                        <p className="mt-2">
                            <strong>External Link:</strong>{' '}
                            <a 
                                href={job.externalLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-500 underline"
                            >
                                {job.externalLink}
                            </a>
                        </p>
                    )}
                </div>
                {/* Footer with Close button */}
                <div className="bg-gray-100 p-4 flex justify-end">
                    <button 
                        onClick={onClose} 
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsPopup;
