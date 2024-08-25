import { Button } from '@/components/ui/button';
import apiClient from '@/services/apiClient';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const EmployerAllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get('/applications/all');
        console.log('All applications response:', res.data);

        if (res.status === 200) {
          setApplications(res.data.applications || []);
        } else {
          console.error('Unexpected status code:', res.status);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDelete = async (appId) => {
    try {
      const res = await apiClient.delete(`/applications/${appId}`);
      if (res.status === 200) {
        setApplications(currentApps => currentApps.filter(app => app._id !== appId));
      } else {
        console.error('Failed to delete application', res.status);
      }
    } catch (error) {
      console.error('Error deleting application:', error.response || error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='container w-full max-w-[1400px] mx-auto my-8 p-6 bg-white '>
      <h1 className='text-2xl mb-4 font-bold'>All Applications</h1>
      {applications?.length > 0 ? (
        applications.map((app) => (
          <div
            className='bg-gray-100 p-4 pl-6 rounded-md border flex justify-between items-center mb-4'
            key={app._id}
          >
            <div>
              <h1 className='font-semibold text-lg'>
                {app?.applicant?.fullName || 'Unnamed Applicant'}
              </h1>
              <p className='text-gray-600'>Job Title: {app?.job?.title || 'Untitled Job'}</p>
            </div>
            <Link to={`jobs/applications/${app._id}`}>
                <Button className="text-right">View</Button>
              </Link>
            <Button onClick={() => handleDelete(app._id)} className='ml-4'>
              Delete
            </Button>
          </div>
        ))
      ) : (
        <p>No applications found.</p>
      )}
    </div>
  );
};

export default EmployerAllApplications;
