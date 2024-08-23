import apiClient from '@/services/apiClient';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';

const EmployerApplicationDetails = () => {
  const { id } = useParams();
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await apiClient.get(`/applications/${id}`);
        setApplicationDetails(res.data.application);
        setIsLoading(false);
        console.log('application details: ', res.data);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleAccept = async () => {
    try {
      await apiClient.put(`/applications/${id}/status`, {
        status: 'Accepted',
      });
      setApplicationDetails((prev) => ({ ...prev, status: 'Accepted' }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async () => {
    try {
      await apiClient.put(`/applications/${id}/status`, {
        status: 'Rejected',
      });
      setApplicationDetails((prev) => ({ ...prev, status: 'Rejected' }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleHire = async () => {
    try {
      await apiClient.put(`/applications/${id}/status`, {
        status: 'Hired',
      });
      setApplicationDetails((prev) => ({ ...prev, status: 'Hired' }));
    } catch (error) {
      console.log(error);
    }
  };

  const downloadResume = () => {
    const resumeUrl = applicationDetails.resume;
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'resume.pdf'; // You can change the name here
    link.click();
  };

  const downloadApplicationPDF = () => {
    const doc = new jsPDF();
    const { job, applicant, status, coverLetter } = applicationDetails;

    doc.text(20, 10, `Job Title: ${job.title}`);
    doc.text(20, 20, `Location: ${job.location}`);
    doc.text(20, 30, `Salary: $${job.salary}`);
    doc.text(20, 40, `Experience Required: ${job.experience} years`);
    doc.text(20, 50, `Industry: ${job.industry}`);
    doc.text(20, 60, `Job Type: ${job.jobType}`);
    doc.text(20, 70, `Location Type: ${job.locationType}`);

    doc.text(20, 90, `Applicant Name: ${applicant.fullName}`);
    doc.text(20, 100, `Email: ${applicant.email}`);
    doc.text(20, 110, `Phone Number: ${applicationDetails.phoneNumber}`);
    doc.text(20, 120, `Experience: ${applicationDetails.experience} years`);
    doc.text(20, 130, `Visa Sponsorship: ${applicationDetails.visaStatus}`);
    doc.text(20, 140, `Willing to Relocate: ${applicationDetails.relocation}`);
    doc.text(20, 150, `Master's Degree: ${applicationDetails.mastersDegree}`);
    doc.text(20, 160, `Status: ${status}`);

    doc.text(20, 180, 'Cover Letter:');
    doc.text(20, 190, coverLetter);

    doc.save('application-details.pdf'); 
  };

  if (isLoading) return <div>Loading...</div>;
  if (!applicationDetails) return <div>No application found.</div>;

  const {
    job,
    applicant,
    status,
    coverLetter,
    email,
    phoneNumber,
    experience,
    visaStatus,
    relocation,
    mastersDegree,
    resume,
  } = applicationDetails;

  return (
    <div className='container mx-auto my-4 md:my-8 max-w-[1400px] w-[95%] bg-white p-6 rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold mb-4'>Application Details</h1>

      <div className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>{job.title}</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <p className='text-gray-700'>
            <strong>Location:</strong> {job.location}
          </p>
          <p className='text-gray-700'>
            <strong>Salary:</strong> ${job.salary}
          </p>
          <p className='text-gray-700'>
            <strong>Experience Required:</strong> {job.experience} years
          </p>
          <p className='text-gray-700'>
            <strong>Industry:</strong> {job.industry}
          </p>
          <p className='text-gray-700'>
            <strong>Job Type:</strong> {job.jobType}
          </p>
          <p className='text-gray-700'>
            <strong>Location Type:</strong> {job.locationType}
          </p>
        </div>
      </div>

      <div className='mb-6'>
        <h2 className='text-xl font-semibold mb-2 py-2 border-b'>
          Applicant Information
        </h2>
        <p className='text-gray-700'>
          <strong>Full Name:</strong> {applicant.fullName}
        </p>
        <p className='text-gray-700'>
          <strong>Email:</strong> {email}
        </p>
        <p className='text-gray-700'>
          <strong>Phone Number:</strong> {phoneNumber}
        </p>
        <p className='text-gray-700'>
          <strong>Years of Experience:</strong> {experience} years
        </p>
        <p className='text-gray-700'>
          <strong>Visa Sponsorship Required:</strong> {visaStatus}
        </p>
        <p className='text-gray-700'>
          <strong>Willing to Relocate:</strong> {relocation}
        </p>
        <p className='text-gray-700'>
          <strong>Completed Master&apos;s Degree:</strong> {mastersDegree}
        </p>
        <div className='mt-4'>
          <button
            onClick={downloadResume}
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
          >
            Download Resume
          </button>
        </div>
      </div>

      <div className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>Application Status</h2>
        <p className='text-gray-700'>
          <strong>Status:</strong>{' '}
          <span className={`ml-2 p-1 text-xs rounded-md ${status === 'Hired' ? 'bg-green-200' : 'bg-gray-200'}`}>
            {status}
          </span>
        </p>
        {status === 'Pending' && (
          <div className='flex space-x-4 my-2'>
            <button
              className='bg-green-500 text-white px-4 py-2 rounded-md  hover:bg-green-600'
              onClick={handleAccept}
            >
              Accept
            </button>
            <button
              className='bg-red-500 text-white px-4 py-2 rounded-md  hover:bg-red-600'
              onClick={handleReject}
            >
              Reject
            </button>
          </div>
        )}
        {status === 'Accepted' && (
          <div className='flex space-x-4 my-2'>
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded-md  hover:bg-blue-600'
              onClick={handleHire}
            >
              Hire
            </button>
          </div>
        )}
      </div>

      <div className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>Cover Letter</h2>
        <p className='text-gray-700'>{coverLetter}</p>
      </div>

      <div className='mt-8'>
        <button
          onClick={downloadApplicationPDF}
          className='bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600'
        >
          Download Application as PDF
        </button>
      </div>
    </div>
  );
};

export default EmployerApplicationDetails;
