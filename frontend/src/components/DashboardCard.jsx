import React, { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient'; // Ensure this is correctly pointing to your API setup

const DashboardCards = () => {
  const [stats, setStats] = useState([
    { title: 'Job Posts', value: 0, iconPath: 'M4.75 15.75L9 12m0 0l4.25 3.75M9 12l4.25-3.75M4.75 15.75l4.25-3.75m0 0L9 8.25m0 0l4.25 3.75M9 12l4.25 3.75M19.25 15.75L15 12m0 0L10.75 8.25m4.25 3.75L15 8.25m0 0l4.25 3.75m0 0L15 15.75m0-7.5v10.5', color: 'bg-blue-500' },
    { title: 'Hired', value: 0, iconPath: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m-3 0A2.25 2.25 0 003 11.25v7.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75v-7.5A2.25 2.25 0 0018.75 9h-3z', color: 'bg-blue-500' },
    { title: 'Total Applications', value: 0, iconPath: 'M3 3v1.5h18V3M3 19.5V21h18v-1.5M5.25 21V3M18.75 21V3M8.25 7.5h7.5m-7.5 6h7.5M11.25 12v1.5m0-6V7.5', color: 'bg-blue-500' }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching data from the new API endpoint
        const response = await apiClient.get('/jobs/employer-stats');
        const { totalJobsPosted, totalApplications, totalPeopleHired } = response.data;

        // Update the stats with the fetched data
        setStats([
          { ...stats[0], value: totalJobsPosted },
          { ...stats[1], value: totalPeopleHired },
          { ...stats[2], value: totalApplications }
        ]);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`flex items-center p-6 rounded-lg shadow-lg ${stat.color} text-white`}
          >
            <div className="p-4 bg-white rounded-full text-indigo-500 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={stat.iconPath}
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
              <p className="text-lg">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;
