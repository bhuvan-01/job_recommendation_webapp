import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiClient from '@/services/apiClient'; // Ensure this is correctly pointing to your API setup

const DashboardLineChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsPostedPromise = apiClient.get('/jobs/employer-stats/jobs-posted');
        const applicationsPromise = apiClient.get('/jobs/employer-stats/applications');
        const jobsSavedPromise = apiClient.get('/jobs/employer-stats/jobs-saved');

        const [jobsPostedResponse, applicationsResponse, jobsSavedResponse] = await Promise.all([
          jobsPostedPromise,
          applicationsPromise,
          jobsSavedPromise
        ]);

        const chartData = [
          { name: 'Current', JobsPosted: jobsPostedResponse.data.totalJobsPosted, Applications: applicationsResponse.data.totalApplications, JobsSaved: jobsSavedResponse.data.totalJobsSaved }
        ];
        setData(chartData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  // Style adjustments
  const customDot = (props) => {
    const { cx, cy, stroke, payload, value } = props;
    if (value > 5) {
      return (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="green" viewBox="0 0 1024 1024">
          <circle cx="10" cy="10" r="10" fill={stroke} />
        </svg>
      );
    } else {
      return (
        <svg x={cx - 5} y={cy - 5} width={10} height={10} fill="blue" viewBox="0 0 1024 1024">
          <circle cx="5" cy="5" r="5" fill={stroke} />
        </svg>
      );
    }
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="JobsPosted" stroke="#8884d8" dot={<customDot />} />
        <Line type="monotone" dataKey="Applications" stroke="#82ca9d" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="JobsSaved" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DashboardLineChart;
