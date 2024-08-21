import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiClient from '@/services/apiClient';

const DashboardLineChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching data from the API
        const response = await apiClient.get('/jobs/employer-stats');
        const { totalJobsPosted, totalApplications, totalJobsSaved, totalPeopleHired } = response.data;

        // Preparing data for the chart
        const chartData = [
          { category: 'Total Jobs Posted', count: totalJobsPosted },
          { category: 'Total Applications', count: totalApplications },
          { category: 'Total Jobs Saved', count: totalJobsSaved },
          { category: 'Total People Hired', count: totalPeopleHired }
        ];

        setData(chartData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* Single line for all counts, since the reference suggests a single plot */}
        <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DashboardLineChart;
