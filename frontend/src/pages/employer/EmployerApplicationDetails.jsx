import apiClient from '@/services/apiClient';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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

  if (isLoading) return <div>Loading...</div>;
  if (!applicationDetails) return <div>No application found.</div>;

  const { job, applicant, status, coverLetter } = applicationDetails;

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
            <strong>Experience:</strong> {job.experience}
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
          <strong>Name:</strong> {applicant.fullName}
        </p>
        <p className='text-gray-700'>
          <strong>Email:</strong> {applicant.email}
        </p>
        <p className='text-gray-700'>
          <strong>Bio:</strong> {applicant.bio}
        </p>
        <div className='flex space-x-4 mb-4'>
          <a href={applicant?.links?.linkedin} className='text-blue-500'>
            LinkedIn
          </a>
          <a href={applicant?.links?.github} className='text-blue-500'>
            GitHub
          </a>
          <a href={applicant?.links?.twitter} className='text-blue-500'>
            Twitter
          </a>
        </div>

        <div className='mb-4'>
          <h3 className='text-lg font-semibold py-2 border-b mb-2'>Skills:</h3>
          <ul className='flex flex-wrap items-center gap-2 my-2 '>
            {applicant.profile.skills.map((skill, index) => (
              <li
                key={index}
                className='text-gray-700 bg-gray-100 p-2 px-4 rounded-full text-xs'
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <div className='mb-4'>
          <h3 className='text-lg font-semibold py-2 border-b mb-2'>
            Projects:
          </h3>
          {applicant.profile.projects.map((project, index) => (
            <div key={index} className='mb-2 shadow-sm p-4 rounded-md border'>
              <p className='text-gray-700'>
                <strong>Title:</strong> {project.title}
              </p>
              <p className='text-gray-700'>
                <strong>Description:</strong> {project.description}
              </p>
              <div className='flex items-center gap-4'>
                <a href={project.url} className='text-blue-500'>
                  Project URL
                </a>
                <br />
                <a href={project.github} className='text-blue-500'>
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className='mb-4'>
          <h3 className='text-lg font-semibold py-2 border-b mb-2'>
            Experience:
          </h3>
          {applicant.profile.experience.map((exp, index) => (
            <div key={index} className='mb-2 shadow-sm p-4 rounded-md border'>
              <p className='text-gray-700'>
                <strong>Company:</strong> {exp.company}
              </p>
              <p className='text-gray-700'>
                <strong>Role:</strong> {exp.role}
              </p>
              <p className='text-gray-700'>
                <strong>Start Date:</strong>{' '}
                {new Date(exp.startDate).toLocaleDateString()}
              </p>
              <p className='text-gray-700'>
                <strong>End Date:</strong>{' '}
                {new Date(exp.endDate).toLocaleDateString()}
              </p>
              <p className='text-gray-700'>
                <strong>Description:</strong> {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>Application Status</h2>
        <p className='text-gray-700'>
          <strong>Status:</strong>{' '}
          <span className='bg-gray-200 ml-2 p-1 text-xs rounded-md'>
            {status}
          </span>
        </p>
        {status !== 'Accepted' && (
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
      </div>

      <div className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>Cover Letter</h2>
        <p className='text-gray-700'>{coverLetter}</p>
      </div>
    </div>
  );
};

export default EmployerApplicationDetails;
